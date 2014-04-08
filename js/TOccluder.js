// 0(BANSHEE) Banshee-JS
//    1(TBookEditorView) a.k.a. MainLayer
//          2(TBookViewer)
//              3(TDocViewer)
//                  4(TMipmapPresenter 0)
//                  4(TMipmapPresenter N-1)
//              3(TCanvasPainter)
//                --Custom List of Geometry (TPolyline)
//              3(TOccluderManager)
//                  4(TOccluder 0) You're here..
//                  4(TOccluder N-1) ..or here


function TOccluder(_owner,_parent,_banshee) {
    bansheeInitComponent(this, _owner, _banshee,'TOccluder');
    bansheeInitVisual(this,_parent);

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Weltkoordinaten     Transformationsmatrix >> wird hier nicht gebraucht, da TOccluderManager(owner) die absolute Transformation berechnet.
    this.wx = 0;
    this.wy = 0;
    this.ww = 0;
    this.wh = 0;

    //recover the posdim in minimized state
    this.m_Org_wx = 0;
    this.m_Org_wy = 0;
    this.m_Org_ww = 0;
    this.m_Org_wh = 0;


    this.m_ptPivot = [0,0];

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    this.m_Minimized = false;
    this.m_Dragged = false;

    this.DragMode = 0;

    var m_MinDim = [140,36];

    var borderWidth = 4;
    var borderRadius = 4;

    var m_FillColor = new TARGBColor(255,153,153,153);
    var m_StrokeColor = new TARGBColor(255,153,153,153);

    var m_AnimController = null;

    var m_MinButton = null;

    var minimizeIcon = '&#58939;';
    var restoreIcon = '&#58940;';
    var isMinimized = false;//TODO: beim Laden prüfen
    var isDragged = false;
    var isOver = false;
    var stripesCanvas = null;

    var m_headerHeight = 36;

  this.InitializeComponent = function () {
      var header = this.AddHTMLObject(this.DivCtrl,'div',CSS_OCCLUDER_HEADER);
      _BuildNCArea(this,header);

      this.SetCSSStyle(CSS_BOX_SHADOW);

      this.Cursor = -5;
    };

    this.SetCursor = function (iNum) {
        this.Cursor = iNum;
    };

    function _IsMinimizeButtonHit(x,y,minSize)
    {
      if (m_MinButton)
        return bansheePtInRect( x,
                                y,
                                m_MinButton.offsetLeft,
                                m_MinButton.offsetTop + borderWidth,
                                m_MinButton.offsetLeft + m_MinButton.offsetWidth - borderWidth,
                                m_MinButton.offsetTop  + m_MinButton.offsetHeight);
       return false;
    }

    this.AddHTMLObject = function(parent,szObjectType,szCSSDecl)
    {
      if (!parent)
        return null;

      var o = document.createElement(szObjectType);
      if (o)
      {
        parent.appendChild(o);
        o.style.cssText = szCSSDecl;
        return o;
      }
      else
        return null;
    };


  function _BuildNCArea(root,src)
  {
    if (!src)
      return;

    m_MinDim[0] = 0;

    m_MinButton = root.AddHTMLObject(src,'div',CSS_OCCLUDER_MINIMIZE_BUTTON);

    var canvas = document.createElement('canvas');
    canvas.style.cssText = CSS_OCCLUDER_MINIMIZEICON_BACKGROUND;
    canvas.width = 36;
    canvas.height = 36;
    var dc = canvas.getContext('2d');
    dc.beginPath();
    dc.arc(18, 18, 12, 0, 2 * Math.PI, false);
    dc.fillStyle = '#ffffff';
    dc.fill();
    m_MinButton.appendChild(canvas);

    var iconText = document.createElement('p');
    iconText.style.cssText = CSS_OCCLUDER_MINIMIZE_BUTTON_ICON + CSS_OCCLUDER_MINIMIZE_BUTTON;
    iconText.innerHTML = '&#58939;';
    m_MinButton.appendChild(iconText);

    m_MinDim[0] += m_MinButton.offsetWidth;
    m_MinDim[1] = m_MinButton.offsetHeight;
  }

    this.SetCSSStyle = function(szTemplate)
    {
      this.DivCtrl.style.cssText += szTemplate;
      bansheeSyncSmartLayer(this);
    };

    this.SetEnabled = function (bEnabled) {
      bansheeSetEnabled(this, bEnabled);
    };

    this.SetVisible = function (bVis) {
      bansheeSetVisible(this,bVis);
    };

    this.SetBounds = function (x, y, w, h) {
        bansheeSetBounds(this, x, y, w, h);
        /*
        var viewDim = this.Owner.GetViewArea();
        var borderWidth = 10;
        var xOffset = borderWidth;
        var yOffset = borderWidth;
        var wOffset = borderWidth;
        var hOffset = borderWidth;

        var rcClip = [0,0,w,h];
        //Clip Left
        if (x < 0)
        {
          rcClip[0] = -x;
          xOffset = 0;
        }
        //Clip top
        if (y < 0)
        {
          rcClip[1] = -y;
          yOffset = 0;
        }
        //Clip Width
        if (rcClip[0] + w > viewDim[2])
        {
          rcClip[2] = rcClip[0] > 0 ? viewDim[2]:viewDim[2] - x;
          wOffset = 0;
        }
        else
        if (x + w > viewDim[2])
        {
          rcClip[2] =  viewDim[2] - x;
          wOffset = 0;
        }


        //Clip Height
        if (rcClip[1] + h > viewDim[3])
        {
          rcClip[3] = rcClip[1] > 0 ? viewDim[3]:viewDim[3] - y;
          hOffset = 0;
        }
        else
        if (y + h > viewDim[3])
        {
          rcClip[3] =  viewDim[3] - y;
          hOffset = 0;
        }

      bansheeClipView(this,rcClip[0] - xOffset,rcClip[1] - yOffset,rcClip[2] + wOffset + xOffset,rcClip[3] + hOffset + yOffset);
      */
    };
  function _generateBgPattern(bgAlpha){
    stripesCanvas = document.createElement('canvas');
    stripesCanvas.width = 10;
    stripesCanvas.height = 10;
    var stripes = stripesCanvas.getContext('2d');
    stripes.fillStyle = 'rgba(255,255,255,' + bgAlpha + ')';
    stripes.fillRect(0,0,10,10);
    stripes.fill();
    stripes.strokeStyle = _owner.m_MouseMoveDeletes && isOver ? '#ffdddd':'#f1f1f1';
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

  this.Invalidate = function () {
    var dc = bansheeGetDC(this);
    dc.clearRect(0,0,this.w,this.h);

    if(!this.m_Minimized && !this.m_Dragged){
      _generateBgPattern('1');
      _generateBgPattern('1');
      var pat = dc.createPattern(stripesCanvas, 'repeat');
      dc.fillStyle = pat;
      dc.fillRect(0,0,this.w, this.h);
      dc.fill();
    }
    else if(!this.m_Minimized && this.m_Dragged){
      _generateBgPattern('0.8');
      var pat = dc.createPattern(stripesCanvas, 'repeat');
      dc.fillStyle = pat;
      dc.fillRect(0,0,this.w, this.h);
      dc.fill();
    }
    else if(this.m_Minimized){
      dc.strokeStyle = '#2d86c2';// 'rgba(45,134,194,1)';
      dc.lineWidth = 2;
      dc.strokeRect(1,1,this.w-2, this.h-2);
      dc.stroke();

      _generateBgPattern('0.8');
      var pat = dc.createPattern(stripesCanvas, 'repeat');
      dc.fillStyle = pat;
      dc.fillRect(0,0,this.w, 36);
      dc.fill();
    }

    if(_owner.m_MouseMoveDeletes && isOver){
      dc.strokeStyle = 'red';
      dc.lineWidth = 2;
      dc.strokeRect(1,1,this.w-2,this.h-2);
    }
  };

    this.ResetInteraction = function()
    {
      isOver = false;
      this.Banshee.SetMouseCapture(this,false);
      bansheeSafeCall(this.Owner,'OnChildTouchUp',this);
      this.m_Dragged = false;
      this.Invalidate();
    };

    this.OnStageLeave = function () { this.ResetInteraction();
    };

    this.OnMouseExit = function () { this.ResetInteraction();
    };

    this.OnMouseEnter = function () {
      isOver = true;
      this.Invalidate();
    };

    this.OnMouseDown = function(evt)
    {
      if (bansheeGetMouseButton(evt)===0 && m_AnimController == null)
      {
        this.Banshee.SetMouseCapture(this,true);
        bansheeSafeCall(this.Owner,'OnChildTouchDown',this);
        this.m_Dragged = true;
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
      this.ResetInteraction();
      return true;
    };

    this.OnMouseMove = function()
    {
      bansheeSafeCall(this.Owner,'OnChildTouchMove',this);
      return true;
    };




    this.OnMouseWheel = function(e)
    {
      bansheeSafeCall(this.Owner,'OnMouseWheel',e);
      return true;
    };


    function _UpdateCursor(ctrl)
    {
      if (ctrl.DivCtrl)
        ctrl.DivCtrl.style.cursor = bansheeCursorIDToCSS(ctrl.Cursor);
    }

    this.HitTest = function (x, y) {
      var bHit = bansheeUIHitTest(this,x,y);
      if (!bHit)
        return bHit;
      this.SetAutoCursor();//Test the cursor pos and select the proper dragmode
      if (this.DragMode == 666)
      {
        this.Cursor = 0;
        _UpdateCursor(this);
        return false;
      }
      return bHit;
    };

    this.Free = function () {
      this.w = 0;this.h = 0;//Important for hitdetection
      this.Banshee.SendCancelMode(this);
      this.StartAnimation(0);
      bansheeFree(this);
    };

    //Gesture-Event from Banshee via Hammer.js
    this.OnGesture = function (evt) {

      if (m_AnimController)
        return;

      this.SetAutoCursor();
      switch (evt.type)
      {

        case 'tap' :{
          bansheeSafeCall(this.Owner,'OnChildTouchDown',this);
          break;
        }
        case 'dragstart' :{
          bansheeSafeCall(this.Owner,'OnChildTouchDown',this);
          break;
        }
        case 'drag' :{
          bansheeSafeCall(this.Owner,'OnChildTouchMove',this);
          break;
        }
        case 'release' :{
          bansheeSafeCall(this.Owner,'OnChildTouchUp',this);
          break;
        }

        case 'doubletap':
        {
            bansheeSafeCall(this.Owner,'OnChildGesture',[this,'PerformGestureZoom',null]);
            break;
        }
        case 'pinchin':
        {
            bansheeSafeCall(this.Owner,'OnChildGesture',[this,'PerformGesturePinch',false]);
            break;
        }
        case 'pinchout':
        {
            bansheeSafeCall(this.Owner,'OnChildGesture',[this,'PerformGesturePinch',true]);
            break;
        }
      }
      return true;
    };

    this.SetAutoCursor = function()
    {

      /*
      if (this.Owner.m_MouseMoveDeletes)
      {
        this.Cursor = 3;
        return;
      }
      */
      var pos = bansheeMouseToClient(this);
      var x,y;
      x = pos[0];
      y = pos[1];
      var catchArea = borderWidth * 2;

      var size = this.GetMinSize();
      var min = Math.max(size[0],size[1]) - catchArea;
      if (_IsMinimizeButtonHit(x,y,min))// || this.m_Minimized)
      {
        this.DragMode = 10;
        this.Cursor = -21;
        return;
      }

      var dragMode = 0;//default Drag-move

      if (x <= catchArea)//Left side  (west)
      {
        if (y <= catchArea)
          dragMode = 8;//North - west
        else
        if (y>= this.h - catchArea)
          dragMode = 6;//South - west
        else
          dragMode = 7;//West
      }
      else
      if (x>=this.w - catchArea) //right side (east)
      {
        if (y <= catchArea)
          dragMode = 2;//North - east
        else
        if (y >= this.h - catchArea)
          dragMode = 4;//South - east
        else
          dragMode = 3;//East
      }
      else
      if (y <= catchArea)//North
        dragMode = 1;
      else
      if (y >= this.h - catchArea)//South
        dragMode = 5;

      if (dragMode == 0 && this.m_Minimized)
      {
        if (y >= m_headerHeight)
        {
          this.Cursor = this.Owner.m_MouseMoveDeletes?3:0;
          this.DragMode = 666;
          return;
        }
      }

      if (this.Owner.m_MouseMoveDeletes)
      {
        this.Cursor = 3;
        this.DragMode = 0;
        _UpdateCursor(this);
        return;
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

    this.SetIcon = function(state){
      if(state === 'close')
        //m_MinButton.innerHTML = minimizeIcon;
      m_MinButton.childNodes[1].innerHTML = minimizeIcon;
      else
       // m_MinButton.innerHTML = restoreIcon;
      m_MinButton.childNodes[1].innerHTML = restoreIcon;
    };

    this.Show = function(bMinimized)
    {
       if (this.m_Minimized == bMinimized)
        return;
      this.m_Minimized = bMinimized;
      if (bMinimized){
        this.SetIcon('open');
        this.Invalidate();

      }
      else {
        this.SetIcon('close');
        this.Invalidate();
      }

      this.SetAutoCursor();
    };

    //Get the data to serialize
    this.GetPublishedProperties = function()
    {
      //1 == Rect
      /*if (this.m_Minimized || m_AnimController != null)
        return [1,this.m_Org_wx,this.m_Org_wy,this.m_Org_ww,this.m_Org_wh];
      else*/
        return [1,this.wx,this.wy,this.ww,this.wh];
    };

    this.GetMinSize = function()
    {
      return [m_MinDim[0],m_MinDim[1]];
    };

    function occluder_Animate(progress,duration,a,b)
    {
      /*
      var t = progress / duration;
      var diff = b - a;
      var fac = Math.PI / 2;
      t = Math.sin(fac * t);

      return (diff * t * t * t * t) + a;
      */
      return Bezier_Spline(progress / duration,
                            a,
                            a,
                            b,
                            b
                          );

    }



    this.StartAnimation = function(iMode,a,b,c,d)
    {
      switch (iMode)
      {
        case 0 :  m_AnimController = null;
                  this.Banshee.RemoveAnimControl(this);
                  break;
        //Show normal
        case 1 :  m_AnimController = new TAnimController(this,0,{wx:a,ww:c,wh:d},occluder_Animate);
                  this.Banshee.AddAnimControl(this);
                  break;
        //Show minimized
        case 2 :  m_AnimController = new TAnimController(this,0,{wx:a, ww:c,wh:d},occluder_Animate);
                  this.Banshee.AddAnimControl(this);
                  break;
      }
    };

    this.OnAnimationDone = function()
    {
      if (m_AnimController)
      {
        if (!m_AnimController.Animate())
          this.StartAnimation(0);
        this.Owner.TransformChild(this);
      }
      else
        this.StartAnimation(0);
    };

    function _SetText(htmlObject,szText)
    {
      if (htmlObject)
      {
        if (szText)
          htmlObject.innerHTML = szText;
        else
          htmlObject.innerHTML = '';
      }
    }
    //*********************
    this.Banshee.AddControl(this);
    this.InitializeComponent();

}
//TOccluder*************************************************************************
//***********************************************************************************
