// 0(BANSHEE) Banshee-JS
//    1(TBookEditorView) a.k.a. MainLayer
//          2(TBookViewer)
//              3(TDocViewer)
//                  4(TMipmapPresenter 0)
//                  4(TMipmapPresenter N-1)
//              3(TCanvasPainter)
//                --Custom List of Geometry (TPolyline)
//              3(TOccluderManager)  You're here
//                  4(TOccluder 0)
//                  4(TOccluder N-1)


function TOccluderWrapper(oOccluder)
{
  var serData = oOccluder.GetPublishedProperties();

  this.VISGEO =[  parseInt(serData[0]),//Type==1 RECT
                  parseInt(serData[1]),//xPos
                  parseInt(serData[2]),//yPos
                  parseInt(serData[3]),//width
                  parseInt(serData[4])//height
               ];//array of 5 Elements
}

function TOccluderJSONSerializer(client) {
  //UMA compatible serialization
  this.OT = 'UMAOccluders';//Original "UMAOccluders"
  this.DATA = null;

  this.WriteData = function () {

    var iCnt = bansheeComponentsCount(client);
    if (!client || iCnt == 0)
      return null;

    this.DATA = [];
    for (var i = 0; i < iCnt;i++)
      this.DATA.push(new TOccluderWrapper(client.Components[i]));
    return JSON.stringify(this);
  };

  this.ReadData = function (szJSONIn) {
    var a = JSON.parse(szJSONIn);
    if (!a)
      return;
    if ((a['OT'] === 'UMAOccluders') && (a['DATA'] != null) && (a['DATA'].length > 0))
    {
      var arrOccluders = a['DATA'];
      var iCnt = arrOccluders.length;
      for (var i = 0; i < iCnt;i++)
      {
        var pl = arrOccluders[i];
        if (pl['VISGEO'] )
        {
          var occ = pl['VISGEO'];
          if (occ.length <= 5)
            client.EmitOccluder(parseInt(occ[1]),parseInt(occ[2]),parseInt(occ[3]),parseInt(occ[4]));
        }
      }
    }
  };
}



function TOccluderManager(_owner,_parent,_banshee) {
    bansheeInitComponent(this, _owner, _banshee,'TOccluderManager');
    bansheeInitVisual(this,_parent);

    var m_bReadingJSON = false;

    var m_MIN_X_SIZE = 140;
    var m_MIN_Y_SIZE = 72;
    var m_f = this;


    var m_ControlToDispose = null;

    function _SetObjectBoundsRect(child,x,y,w,h)
    {
      //child.SetBounds(x,y,Math.max(m_f.Scale,w),Math.max(m_MIN_Y_SIZE,h));
      child.SetBounds(x,y,w,h);
    }

    function _ReformatOccluders(self)
    {
      var iCnt = bansheeComponentsCount(self);
      var scale = self.Scale;
      var xOff = m_Transform[0];
      var yOff = m_Transform[1];
      for(var i = 0; i < iCnt;i++)
      {
        var occ = self.Components[i];
        /*
        if (occ.m_Minimized)
        {
          var x = occ.m_ptPivot[0] * scale;
          var y = occ.m_ptPivot[1] * scale;
          _SetObjectBoundsRect( occ,
                                xOff + x - occ.ww,
                                yOff + y,
                                occ.ww,
                                occ.wh);
        }
        else*/
        {
          _SetObjectBoundsRect( occ,
                                xOff + occ.wx * scale,
                                yOff + occ.wy * scale,
                                occ.ww * scale,
                                occ.wh * scale);
        self.SetWorldPosition(occ);
        }
      }
    }

    this.EmitOccluder = function(x,y,w,h)
    {
      x = StrToFloatDef(x,0);
      y = StrToFloatDef(y,0);
      w = StrToFloatDef(w,100);
      h = StrToFloatDef(h,100);      
      if (w * h > 0)
      {
        var occ = new TOccluder(this,this.DivCtrl,this.Banshee);
        //var size = occ.GetMinSize();
        //m_MIN_SIZE = Math.max(size[0],size[1]);
        occ.wx = x;
        occ.wy = y;
        occ.ww = w;
        occ.wh = h;

        if (!m_bReadingJSON)
        {
          _BringToFront(this,occ);
          _ReformatOccluders(this);
        }
      }
    };


    this.InitializeComponent = function () {
    /*
      this.EmitOccluder(100,100,200,100);
      this.EmitOccluder(400,100,200,100);
      this.EmitOccluder(300,400,200,100);
      _ReformatOccluders(this);
    */
    };

    this.SetCursor = function (iNum) {
        this.Cursor = iNum;
    };

    this.OnMouseWheel = function(e)
    {
      bansheeSafeCall(this.Owner,'OnMouseWheel',e);
    };

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
      bansheeSetBounds(this, x, y, 0, 0);
      //bansheeClipView(this,x,y,w,h);
    };

    var m_Transform = [0,0];
    this.SetTransform = function(x,y,scale)
    {
      m_Transform[0] = x;
      m_Transform[1] = y;
      this.Scale = StrToFloatDef(scale,1.0);
      _ReformatOccluders(this);
    };


  /*
  this.Invalidate = function () {
  };
  */
    /*
    this.HitTest = function (x, y) {
      return bansheeUIHitTest(this,x,y);
    };
    */
    this.Free = function () {
      bansheeFree(this);
    };

    //Gesture-Event from Banshee via Hammer.js
    this.OnGesture = function (evt) {
      if (evt.type === 'tap')
        bansheeNotifyOwner(this,this.NO_OnMouseClick);
    };


    //Input event handlers ***********************************
    //--drag--
    var m_dx = 0;
    var m_dy = 0;
    var m_bDragging = false;
    var m_wdw = 0;
    var m_wdh = 0;

    function _BringToFront(self,child)
    {
      var iIdx = self.Components.indexOf(child);
      if (iIdx >= 0)
      {
        self.Components.splice(iIdx,1);
        self.Components.push(child);
        self.Banshee.UpdateZOrder(self,self.ZOrder);
      }
    }

  //Async Component disposal
  this.OnAnimationDone = function()
  {
    if (m_ControlToDispose)
      bansheeSafeCall(m_ControlToDispose,'Free');
    m_ControlToDispose = null;
    this.Banshee.RemoveAnimControl(this);
  };
  //*******************************

  this.OnChildTouchDown = function(sender)
  {
    if (this.m_MouseMoveDeletes)
    {
      m_ControlToDispose = sender;//the control to dispose
      this.Banshee.AddAnimControl(this);//unwind the stack and delete in the control OnAnimationDone
      return;
    }
      _BringToFront(this,sender);
      sender.SetAutoCursor();
      if (sender.DragMode == 10)//Minimize button hit
      {
        sender.Show(!sender.m_Minimized);
        //_ReformatOccluders(this);
        return;
      }


      var cursorInfo = this.Banshee.GetCursorInfo();
      m_dx = cursorInfo[0] - sender.x;
      m_dy = cursorInfo[1] - sender.y;

      m_wdw = sender.ww;
      m_wdh = sender.wh;
      m_bDragging = true;
    };

    this.TransformChild = function(sender)
    {
      var scale = this.Scale;
      var screenWidth = sender.ww * scale;
      var screenHeight = sender.wh * scale;

      _SetObjectBoundsRect( sender,
                            m_Transform[0] + sender.wx * scale,
                            m_Transform[1] + sender.wy * scale,
                            screenWidth,
                            screenHeight);

    };

  function _GetStageDim(inst)
  {
    if (inst && inst.Owner)
    {
      var rcDocView = inst.Owner.GetDocViewDragArea();
      return [rcDocView[0] + rcDocView[2], rcDocView[1] + rcDocView[3]];//Drag Rect
    }
    else
      return [0,0];
  };

  this.GetViewArea = function()
  {
    return this.Owner.GetDocViewClipRect();
  };

  function ClampMinMax(newVal,minVal,maxVal)
  {
    if (newVal < minVal)
       return minVal;
    if (newVal > maxVal)
      return maxVal;
    return newVal;
  }

  this.OnChildTouchMove = function(sender)
    {
      if (m_bDragging)
      {
        var cursorInfo = this.Banshee.GetCursorInfo();
        var nX = cursorInfo[0] - m_dx;
        var nY = cursorInfo[1] - m_dy;

        var scale = this.Scale;

        var minXSize = m_MIN_X_SIZE;
        var minYSize = m_MIN_Y_SIZE;

        var bookViewerDim = _GetStageDim(this);

        var worldWidth = (bookViewerDim[0] - m_Transform[0]) / scale;
        var worldHeight = (bookViewerDim[1] - m_Transform[1]) / scale;

        //calc the world position
        nX = (nX - m_Transform[0]) / scale;
        nY = (nY - m_Transform[1]) / scale;

        switch (sender.DragMode)
        {
          case 0 : {
            sender.wx = ClampMinMax(nX,0,worldWidth - sender.ww);
            sender.wy = ClampMinMax(nY,0,worldHeight - sender.wh);

              //calc the screen position
              _SetObjectBoundsRect( sender,
                                    m_Transform[0] + sender.wx * scale,
                                    m_Transform[1] + sender.wy * scale,
                                    sender.ww * scale,
                                    sender.wh * scale);
            break;
          }
          case 1 : {//North
                    nY = ClampMinMax(nY,0,sender.wy + sender.wh - minYSize);
                    sender.wh += (sender.wy - nY);
                    sender.wy = nY;
                    _SetObjectBoundsRect( sender,
                                          m_Transform[0] + sender.wx * scale,
                                          m_Transform[1] + sender.wy * scale,
                                          sender.ww * scale,
                                          sender.wh * scale);
            break;
          }
          case 2 : {//North east
                    nY = ClampMinMax(nY,0,sender.wy + sender.wh - minYSize);
                    sender.wh += (sender.wy - nY);
                    sender.wy = nY;

                    sender.ww = ClampMinMax(m_wdw  + nX - sender.wx,minXSize,worldWidth - sender.wx);

                    _SetObjectBoundsRect( sender,
                                          m_Transform[0] + sender.wx * scale,
                                          m_Transform[1] + sender.wy * scale,
                                          sender.ww * scale,
                                          sender.wh * scale);
            break;
          }
          case 3 : {//Size east
                  sender.ww = ClampMinMax(m_wdw  + nX - sender.wx,minXSize,worldWidth - sender.wx);
                  _SetObjectBoundsRect( sender,
                                        m_Transform[0] + sender.wx * scale,
                                        m_Transform[1] + sender.wy * scale,
                                        sender.ww * scale,
                                        sender.wh * scale);
            break;
          }
          case 4 : {//South east
            sender.ww = ClampMinMax(m_wdw  + nX - sender.wx,minXSize,worldWidth - sender.wx);
            sender.wh = ClampMinMax(m_wdh  + nY - sender.wy,minYSize,worldHeight - sender.wy);
            _SetObjectBoundsRect( sender,
                                        m_Transform[0] + sender.wx * scale,
                                        m_Transform[1] + sender.wy * scale,
                                        sender.ww * scale,
                                        sender.wh * scale);

            break;
          }
          case 5 : {//South
                    sender.wh = ClampMinMax(m_wdh  + nY - sender.wy,minYSize,worldHeight - sender.wy);
                    _SetObjectBoundsRect( sender,
                                          m_Transform[0] + sender.wx * scale,
                                          m_Transform[1] + sender.wy * scale,
                                          sender.ww * scale,
                                          sender.wh * scale);
            break;
          }
          case 6 : {//South-west
            nX = ClampMinMax(nX,0,sender.wx + sender.ww - minXSize);
            sender.ww += (sender.wx - nX);
            sender.wx = nX;
            sender.wh = ClampMinMax(m_wdh  + nY - sender.wy,minYSize,worldHeight - sender.wy);

            _SetObjectBoundsRect( sender,
                                  m_Transform[0] + sender.wx * scale,
                                  m_Transform[1] + sender.wy * scale,
                                  sender.ww * scale,
                                  sender.wh * scale
                                );

            break;
          }
          case 7 : {//West
            nX = ClampMinMax(nX,0,sender.wx + sender.ww - minXSize);
            sender.ww += (sender.wx - nX);
            sender.wx = nX;

            _SetObjectBoundsRect( sender,
                                  m_Transform[0] + sender.wx * scale,
                                  m_Transform[1] + sender.wy * scale,
                                  sender.ww * scale,
                                  sender.wh * scale);
            break;
          }
          case 8 : {//North - west
                    nX = ClampMinMax(nX,0,sender.wx + sender.ww - minXSize);
                    sender.ww += (sender.wx - nX);
                    sender.wx = nX;

                    nY = ClampMinMax(nY,0,sender.wy + sender.wh - minYSize);
                    sender.wh += (sender.wy - nY);
                    sender.wy = nY;

            _SetObjectBoundsRect( sender,
                                  m_Transform[0] + sender.wx * scale,
                                  m_Transform[1] + sender.wy * scale,
                                  sender.ww * scale,
                                  sender.wh * scale);

            break;
          }
        }
      }
      else
        sender.SetAutoCursor();
    };

    this.SetWorldPosition = function(occ)
    {
      var scaleInv = 1 / this.Scale;
      occ.wx = (occ.x - m_Transform[0]) * scaleInv;
      occ.wy = (occ.y - m_Transform[1]) * scaleInv;
      //if (!occ.m_Minimized)
      {
        occ.ww = occ.w * scaleInv;
        occ.wh = occ.h * scaleInv;
      }
    };

    this.OnChildTouchUp = function(sender)
    {
      this.SetWorldPosition(sender);
      m_bDragging = false;
    };

    this.OnChildGesture = function(params)//Called from child - childInstance, szGestureFunc.optParam
    {
      if (params && params.length == 3)
        bansheeSafeCall(this.Owner,params[1],params[2]);
    };

    //Input event handlers end********************************

  this.Clear = function () {
    bansheeFreeComponents(this);
    bansheeSafeCall(this,'Invalidate');
  };

  //Serialization
  this.GetData = function () {
    if (bansheeComponentsCount(this) > 0)
      return (new TOccluderJSONSerializer(this)).WriteData();
    return null;
  };

  this.SetData = function (jsonData) {
    this.Clear();
    if (jsonData)
    {
      m_bReadingJSON = true;
      try
      {
        (new TOccluderJSONSerializer(this)).ReadData(jsonData);
      }
      finally
      {
        m_bReadingJSON = false;
      }
      _ReformatOccluders(this);
      bansheeSafeCall(this,'Invalidate');
    }
  };


  //*********************
    this.Banshee.AddControl(this);
    this.InitializeComponent();

}
//TOccluderManager*******************************************************************
//***********************************************************************************
