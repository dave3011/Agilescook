// 0(BANSHEE) Banshee-JS
//    1(TBookEditorView) a.k.a. MainLayer
//          2(TBookViewer)
//              3(TDocViewer)
//                  4(TMipmapPresenter 0)
//                  4(TMipmapPresenter N-1)
//              3(TCanvasPainter)
//                --Custom List of Geometry (TPolyline)
//              3(TOccluderManager)
//                  4(TOccluder 0)
//                  4(TOccluder N-1)
//              3(THotspotsManager)
//                  4(THotspot 0)
//                  4(THotspot N-1)
//              3(TScreenOccluder)//You're here

function TScreenOccluderWrapper(oScreenOccluder)
{
  var serData = oScreenOccluder.GetPublishedProperties();
  if (!serData) return;

  this.VISGEO =[  parseInt(serData[0]),//Type==1 RECT
    parseInt(serData[1]),//xPos
    parseInt(serData[2]),//yPos
    parseInt(serData[3]),//width
    parseInt(serData[4])//height
  ];//array of 5 Elements
}

function TScreenOccluderJSONSerializer(client) {
  this.OT = 'ScreenOccluders';
  this.DATA = null;

  this.WriteData = function () {

    if (!client)
      return null;

    this.DATA = [];
    this.DATA.push(new TScreenOccluderWrapper(client));
    if(!this.DATA[0]['VISGEO']) return null;
    return JSON.stringify(this);
  };

  this.ReadData = function (szJSONIn) {
    var a = JSON.parse(szJSONIn);
    if (!a)
      return;
    if ((a['OT'] === 'ScreenOccluders') && (a['DATA'] != null) && (a['DATA'].length > 0))
    {
      var arrScreenOccluders = a['DATA'];
      var iCnt = arrScreenOccluders.length;
      if(iCnt>1)
        return;
      for (var i = 0; i < iCnt;i++)
      {
        var pl = arrScreenOccluders[i];
        if (pl['VISGEO'] )
        {
          var occ = pl['VISGEO'];
          if (occ.length <= 5)
            client.EmitScreenOccluder(parseInt(occ[1]),parseInt(occ[2]),parseInt(occ[3]),parseInt(occ[4]));
        }
      }
    }
  };
}

function TScreenOccluder(_owner,_parent,_banshee) {
  bansheeInitComponent(this, _owner, _banshee,'TScreenOccluder');
  bansheeInitVisual(this,_parent);

  var m_bReadingJSON = false;

  this.DragMode = 0;

  var m_PaintedBorderWidth = 2;// paint
  var m_BorderWidth = m_PaintedBorderWidth + 10;//catch area

  var borderRadius = 0;
  var m_HeaderHeight = 36;

  var m_minXSize = m_HeaderHeight * 2;
  var m_minYSize = 72 * 2.5;

  var m_FillColor = new TARGBColor(192,255,255,255);
  var m_HeaderColor = new TARGBColor(255,192,192,192);//TARGBColor(192,255,255,255);
  var m_StrokeColor = new TARGBColor(1,134,194,45);

  var bgAlpha = 1;
  var lineColor = '#ff0000';

  var m_viewRect = null;//[100,100,400,400];

  var m_bDragging = false;
  var isOver = false;

  var m_dx = 0;
  var m_dy = 0;
  var m_dw = 0;
  var m_dh = 0;

  this.m_MouseMoveDeletes = false;

  this.m_NO_OnScreenOccluderDeleted = null;

  var stripesCanvas = null;

  this.InitializeComponent = function () {
    this.Cursor = 0;
  };

  this.SetCursor = function (iNum) {
    this.Cursor = iNum;
  };

  this.SetCSSStyle = function(szTemplate)
  {
    this.DivCtrl.style.cssText += szTemplate;
    bansheeSyncSmartLayer(this);
  };

  function _MuteControl(obj)
  {
    if (obj.DivCtrl)
      obj.DivCtrl.style.pointerEvents = 'none';
    if (obj.CanvasCtrl)
      obj.CanvasCtrl.style.pointerEvents = 'none';
  }


  this.SetEnabled = function (bEnabled)
  {
    bansheeSetEnabled(this, bEnabled);
    _MuteControl(this);
  };

  this.SetVisible = function (bVis)
  {
    bansheeSetVisible(this,bVis);
    _MuteControl(this);
  };

  this.SetBounds = function (x, y, w, h)
  {
    bansheeSetBounds(this, x, y, w, h);
    _MuteControl(this);
  };

  var m_Transform = [0,0];
  this.SetTransform = function(x,y,scale)
  {
    m_Transform[0] = x;
    m_Transform[1] = y;
    this.Scale = StrToFloatDef(scale,1.0);
    _MuteControl(this);
    this.Invalidate();
  };
  var scale = 1.0;
  function SX(val){ return m_Transform[0] + val * scale; }
  function SY(val){ return m_Transform[1] + val * scale; }
  function WH(val){ return val * scale;}

  function _GetDrawRect(sender)
  {
    scale = sender.Scale;
    var rcContent = sender.Owner.GetContentSize();

    return [SX(0),SY(0),WH(rcContent[0]),WH(rcContent[1])];
  }

  function _RenderHeader(obj,dc)
  {
    var xPos = SX(m_viewRect[0] + m_viewRect[2]/2) - 7;
    var yPos = SY(m_viewRect[1]) + m_HeaderHeight/2 - 7;

    var drawing = new Image();
    drawing.src = ''+ APP_DATA_DIR + 'Move_Headline.png';
    dc.drawImage(drawing,xPos,yPos);
  }

  function _generateBgPattern(bgAlpha, lineColor){
    stripesCanvas = document.createElement('canvas');
    stripesCanvas.width = 10;
    stripesCanvas.height = 10;
    var stripes = stripesCanvas.getContext('2d');
    stripes.fillStyle = 'rgba(255,255,255,' + bgAlpha + ')';
    stripes.fillRect(0,0,10,10);
    stripes.fill();
    stripes.strokeStyle = lineColor;
    stripes.lineWidth = 2;
    stripes.beginPath();
    stripes.moveTo(-1, 6);
    stripes.lineTo(6, -1);
    stripes.stroke();
    stripes.beginPath();
    stripes.moveTo(4, 11);
    stripes.lineTo(11, 4);
    stripes.stroke();
  }

  function _generateCircle(dc,x,y,radius,color){
    dc.beginPath();
    dc.arc(x, y, radius, 0, 2 * Math.PI, false);
    dc.fillStyle = color;
    dc.fill();
  }

  this.Invalidate = function () {
    var dc = bansheeGetDC(this);
    dc.clearRect(0, 0, this.w, this.h);

    if(!m_viewRect) return;

    var rc = _GetDrawRect(this);

    var offset = m_PaintedBorderWidth * 0.5;
    scale = this.Scale;
    var highLightBounds = [SX(offset + m_viewRect[0]), SY(offset + m_viewRect[1]), WH(m_viewRect[2] - m_PaintedBorderWidth), WH(m_viewRect[3] - m_PaintedBorderWidth)];

    bgAlpha = m_bDragging ? 0.8:1;
    lineColor = this.m_MouseMoveDeletes && isOver ? '#ffdddd':'#f1f1f1';

    _generateBgPattern(bgAlpha, lineColor);
    var pat = dc.createPattern(stripesCanvas, 'repeat');
    dc.fillStyle = pat;
    dc.fillRect(rc[0],rc[1],rc[2]+1,rc[3]+1);

    dc.clearRect(highLightBounds[0],highLightBounds[1],highLightBounds[2],WH(m_viewRect[3] - m_PaintedBorderWidth));
    dc.fillStyle = 'rgba(255,255,255,' + bgAlpha + ')';
    dc.fillStyle = '#f8f8f8';
    dc.fillRect(highLightBounds[0],highLightBounds[1],highLightBounds[2],m_HeaderHeight);

    _RenderHeader(this,dc);
    var shadowGradient = dc.createLinearGradient(0,highLightBounds[1] + m_HeaderHeight,0,highLightBounds[1] + m_HeaderHeight+10);
    shadowGradient.addColorStop(0, 'rgba(0,0,0,0.25)');
    shadowGradient.addColorStop(1, 'rgba(0,0,0,0)');

    dc.fillStyle = shadowGradient;
    dc.fillRect(highLightBounds[0],highLightBounds[1] + m_HeaderHeight,highLightBounds[2], 100);


    dc.strokeStyle = this.m_MouseMoveDeletes && isOver ? 'red':'#2d86c2';
    dc.lineWidth = 2;
    dc.strokeRect(highLightBounds[0], highLightBounds[1], highLightBounds[2], highLightBounds[3]);

    _generateCircle(dc,highLightBounds[0],highLightBounds[1], 5, '#2d86c2');
    _generateCircle(dc,highLightBounds[0]+highLightBounds[2],highLightBounds[1], 5, '#2d86c2');
    _generateCircle(dc,highLightBounds[0],highLightBounds[1]+highLightBounds[3], 5, '#2d86c2');
    _generateCircle(dc,highLightBounds[0]+highLightBounds[2],highLightBounds[1]+highLightBounds[3], 5, '#2d86c2');
  };

  this.ResetInteraction = function()
  {
    isOver = false;
    _EndDrag(this);
  };

  this.OnStageLeave = function () { this.ResetInteraction();};

  this.OnMouseExit = function () { this.ResetInteraction();};

  this.OnMouseEnter = function () {
    isOver = true;
    this.Invalidate();
  };

  this.OnMouseDown = function(evt)
  {
    if (bansheeGetMouseButton(evt)===0)
    {
      if (this.m_MouseMoveDeletes){
        this.Clear();
      }
      else{
        _BeginDrag(this);
      }
    }
    return false;
  };
  this.OnMouseClick = function(evt)
  {
    this.ResetInteraction();
    return true;
  };

  this.OnMouseUp = function(e)
  {
    return true;
  };

  this.OnMouseMove = function()
  {
    if (!m_bDragging)
      this.SetAutoCursor(m_viewRect);
    _Drag(this);
    return true;
  };

  this.OnMouseWheel = function(e)
  {
    bansheeSafeCall(this.Owner,'OnMouseWheel',e);
    return true;
  };

  function __IsViewRectHit(o,x,y)
  {
    if(!m_viewRect)
      return false;
    var ptAbs = bansheeMouseToClient(o);
    x = ptAbs[0] - m_Transform[0];
    y = ptAbs[1] - m_Transform[1];

    var l = m_viewRect[0] * scale;
    var t = m_viewRect[1] * scale;
    var r = l + m_viewRect[2] * scale;
    var b = t + m_viewRect[3] * scale;
    var bHit = !bansheePtInRect(x,y,l + m_BorderWidth * 2,t + m_HeaderHeight,r - m_BorderWidth * 2,b - m_BorderWidth * 2);
    if (bHit)
      o.DivCtrl.style.pointerEvents = 'auto';
    else
      o.DivCtrl.style.pointerEvents = 'none';

    return bHit;
  }

  this.HitTest = function (x, y) {
    if (!bansheeUIHitTest(this,x,y))
      return false;
    return __IsViewRectHit(this,x,y);
  };

  this.Free = function () {
    bansheeFree(this);
  };

  function _BeginDrag(sender)
  {
    if(!m_viewRect) return;
    m_bDragging = sender.DragMode >= 0;
    if (m_bDragging)
    {
      sender.Banshee.SetMouseCapture(sender,true);

      var cursorInfo = sender.Banshee.GetCursorInfo();
      m_dx = cursorInfo[0] / sender.Scale - m_viewRect[0];
      m_dy = cursorInfo[1] / sender.Scale - m_viewRect[1];
      m_dw = m_viewRect[0] + m_viewRect[2];
      m_dh = m_viewRect[1] + m_viewRect[3];
    }
    sender.Invalidate();
  }

  function _Drag(sender)
  {
    if(!m_viewRect) return;
    if (m_bDragging)
    {
      var cursorInfo = sender.Banshee.GetCursorInfo();
      var nX = cursorInfo[0] / sender.Scale - m_dx;
      var nY = cursorInfo[1] / sender.Scale - m_dy;


      var rcContent = sender.Owner.GetContentSize();

      var w,h;

      switch (sender.DragMode)
      {
        case 0 : {//drag
          nX = Math.max(0,nX);
          nX = Math.min(rcContent[0] - m_viewRect[2],nX );

          nY = Math.max(0,nY);
          nY = Math.min(rcContent[1] - m_viewRect[3],nY );

          m_viewRect[0] = nX;
          m_viewRect[1] = nY;
          sender.Invalidate();
          break;
        }

        case 1 : {//north
          nY = Math.max(0,nY);
          nY = Math.min(m_dh - m_minYSize,nY );

          m_viewRect[1] = nY;
          m_viewRect[3] = m_dh - nY;

          sender.Invalidate();
          break;
        }
        case 2 : {//north-east
          nY = Math.max(0,nY);
          nY = Math.min(m_dh - m_minYSize,nY );

          m_viewRect[1] = nY;
          m_viewRect[3] = m_dh - nY;
          //east
          nX -= m_viewRect[0];
          w = Math.max(m_minXSize,(m_dw - m_viewRect[0]) + nX);
          w = Math.min(w,rcContent[0] - m_viewRect[0]);
          m_viewRect[2] = w;

          sender.Invalidate();
          break;
        }
        case 3 : {//east
          nX -= m_viewRect[0];
          w = Math.max(m_minXSize,(m_dw - m_viewRect[0]) + nX);
          w = Math.min(w,rcContent[0] - m_viewRect[0]);
          m_viewRect[2] = w;

          sender.Invalidate();
          break;
        }
        case 4 :{//south-east
          nY -= m_viewRect[1];
          h = Math.max(m_minYSize,(m_dh - m_viewRect[1]) + nY);
          h = Math.min(h,rcContent[1] - m_viewRect[1]);
          m_viewRect[3] = h;


          //east
          nX -= m_viewRect[0];
          w = Math.max(m_minXSize,(m_dw - m_viewRect[0]) + nX);
          w = Math.min(w,rcContent[0] - m_viewRect[0]);
          m_viewRect[2] = w;

          sender.Invalidate();
          break;
        }
        case 5 :{//south
          nY -= m_viewRect[1];
          h = Math.max(m_minYSize,(m_dh - m_viewRect[1]) + nY);
          h = Math.min(h,rcContent[1] - m_viewRect[1]);
          m_viewRect[3] = h;

          sender.Invalidate();
          break;
        }
        case 6 :{//south-west
          nY -= m_viewRect[1];
          h = Math.max(m_minYSize,(m_dh - m_viewRect[1]) + nY);
          h = Math.min(h,rcContent[1] - m_viewRect[1]);
          m_viewRect[3] = h;

          //west
          nX = Math.max(0,nX);
          nX = Math.min(m_dw - m_minXSize,nX );

          m_viewRect[0] = nX;
          m_viewRect[2] = m_dw - nX;

          sender.Invalidate();
          break;
        }
        case 7 :{//west
          nX = Math.max(0,nX);
          nX = Math.min(m_dw - m_minXSize,nX );

          m_viewRect[0] = nX;
          m_viewRect[2] = m_dw - nX;

          sender.Invalidate();
          break;
        }
        case 8 :{//north-west
          nY = Math.max(0,nY);
          nY = Math.min(m_dh - m_minYSize,nY );

          m_viewRect[1] = nY;
          m_viewRect[3] = m_dh - nY;

          //west
          nX = Math.max(0,nX);
          nX = Math.min(m_dw - m_minXSize,nX );

          m_viewRect[0] = nX;
          m_viewRect[2] = m_dw - nX;

          sender.Invalidate();
          break;
        }
      }
    }
  }

  function _EndDrag(sender)
  {
    m_bDragging = false;
    sender.Banshee.SetMouseCapture(sender,false);
    sender.Invalidate();
  }

  //Gesture-Event from Banshee via Hammer.js
  this.OnGesture = function (evt) {

    switch (evt.type)
    {
      case 'tap':
      case 'dragstart' :{
        if (this.m_MouseMoveDeletes)
          this.Clear();
        else{
          this.SetAutoCursor(m_viewRect);
          _BeginDrag(this);
        }
        break;
      }
      case 'drag' :{
        _Drag(this);
        break;
      }
      case 'release' :{
        _EndDrag(this);
        break;
      }
    }
    return true;
  };

  this.SetAutoCursor = function(rcTest)
  {
    if (!rcTest)
    {
      this.DragMode = -1;//Do nothing
      if(this.m_MouseMoveDeletes){
        this.Cursor = 3;
      }
      else{
        this.Cursor = 0;
      }
      return;
    }
    var pos = bansheeMouseToClient(this);
    var x,y;
    pos[0] -= m_Transform[0];
    pos[1] -= m_Transform[1];
    x = pos[0] / this.Scale - m_viewRect[0];
    y = pos[1] / this.Scale - m_viewRect[1];

    //x = m_Transform[0] + pos[0] * this.Scale - rcTest[0];
    //y = m_Transform[1] + pos[1] * this.Scale - rcTest[1];

    if (x < 0 || x >= rcTest[2] || y < 0 || y >= rcTest[3])
    {
      this.DragMode = -1;//Do nothing
      if(this.m_MouseMoveDeletes){
        this.Cursor = 3;
      }
      else{
        this.Cursor = 0;
      }
      return;
    }

    var dragMode = 0;//default Drag-move

    var catchArea = m_BorderWidth / this.Scale;//borderWidth;// * 2;

    if (x <= catchArea)//Left side  (west)
    {
      if (y <= catchArea)
        dragMode = 8;//North - west
      else
      if (y>= rcTest[3] - catchArea)
        dragMode = 6;//South - west
      else
        dragMode = 7;//West
    }
    else
    if (x >= rcTest[2] - catchArea) //right side (east)
    {
      if (y <= catchArea)
        dragMode = 2;//North - east
      else
      if (y>= rcTest[3] - catchArea)
        dragMode = 4;//South - east
      else
        dragMode = 3;//East
    }
    else
    if (y <= catchArea)//North
      dragMode = 1;
    else
    if (y >= rcTest[3] - catchArea)//South
      dragMode = 5;
    else
    {
      if (y > m_HeaderHeight / this.Scale)
      {
        this.DragMode = -1;//Do nothing
        this.Cursor = 0;
        return;
      }
    }

    this.DragMode = dragMode;

    switch (dragMode)
    {
      case 0 :{  this.Cursor = -5;//Drag_move
        break;
      }
      case 1 :{  this.Cursor = -7;//Size_north
        break;
      }
      case 2 :{  this.Cursor = -6;//Size_north-east
        break;
      }
      case 3 :{  this.Cursor = -9;//Size_-east
        break;
      }
      case 4 :{  this.Cursor = -8;//Size_-south-east
        break;
      }
      case 5 :{  this.Cursor = -7;//Size_-south
        break;
      }
      case 6 :{  this.Cursor = -6;//Size_-south-west
        break;
      }
      case 7 :{  this.Cursor = -9;//Size_-west
        break;
      }
      case 8 :{  this.Cursor = -8;//Size_-north-west
        break;
      }
    }
  };

  this.EmitScreenOccluder = function(x,y,w,h)
  {
    x = StrToFloatDef(x,100);
    y = StrToFloatDef(y,100);
    w = StrToFloatDef(w,400);
    h = StrToFloatDef(h,300);
    if (w * h > 0)
    {
      m_viewRect = [x,y,w,h];
    }
    this.Invalidate();
  };

  this.Clear = function () {
    m_viewRect = null;
    _MuteControl(this);
    bansheeNotifyOwner(this,this.m_NO_OnScreenOccluderDeleted);
    bansheeSafeCall(this,'Invalidate');
  };

  //Serialization
  this.GetData = function () {
    return (new TScreenOccluderJSONSerializer(this)).WriteData();
  };

  this.SetData = function (jsonData) {
    if (jsonData)
    {
      m_bReadingJSON = true;
      try
      {
        (new TScreenOccluderJSONSerializer(this)).ReadData(jsonData);
      }
      finally
      {
        m_bReadingJSON = false;
      }
      bansheeSafeCall(this,'Invalidate');
    }
  };

  //Get the data to serialize
  this.GetPublishedProperties = function()
  {
    if (!m_viewRect) return null;
    return [1,m_viewRect[0],m_viewRect[1],m_viewRect[2],m_viewRect[3]];
  };

  //*********************
  this.Banshee.AddControl(this);
  this.InitializeComponent();

}
//TOccluder*************************************************************************
//***********************************************************************************
