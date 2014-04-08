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
//              3(TCommentsManager)  You're here
//                  4(TCommentWindow 0)
//                  4(TCommentWindow N-1)


function TCommentsWrapper(oCommentsWindow)
{
  var serData = oCommentsWindow.GetWorldBounds();
  this.PTS = [parseInt(serData[0]),parseInt(serData[1]),parseInt(serData[2]),parseInt(serData[3])];//Bounds rect
  this.TXT = oCommentsWindow.GetText();//the text to display
  this.CAPT = oCommentsWindow.GetCaption();//the caption
}

function TCommentsJSONSerializer(client) {
  //UMA compatible serialization
  this.OT = 'UMACommentsManager';//Original "UMACommentsManager"
  this.DATA = null;

  this.WriteData = function () {

    var iCnt = bansheeComponentsCount(client);
    if (!client || iCnt == 0)
      return null;

    this.DATA = [];
    for (var i = 0; i < iCnt;i++)
      this.DATA.push(new TCommentsWrapper(client.Components[i]));
    return JSON.stringify(this);
  };

  this.ReadData = function (szJSONIn) {
    var a = JSON.parse(szJSONIn);
    if (!a)
      return;
    if ((a['OT'] === 'UMACommentsManager') && (a['DATA'] != null) && (a['DATA'].length > 0))
    {
      var arrComments = a['DATA'];
      var iCnt = arrComments.length;
      for (var i = 0; i < iCnt;i++)
      {
        var pl = arrComments[i];
        if (pl['PTS'])
        {
            var pts = pl['PTS'];
            client.EmitComment( parseInt(pts[0]),
                                parseInt(pts[1]),
                                parseInt(pts[2]),
                                parseInt(pts[3]),
                                pl['TXT'],
                                pl['CAPT']);
        }
      }
    }

  };
}



function TCommentsManager(_owner,_parent,_banshee) {
    bansheeInitComponent(this, _owner, _banshee,'TCommentsManager');
    bansheeInitVisual(this,_parent);

    var m_bReadingJSON = false;

    var m_MIN_SIZE = 8;

    var m_f = this;

    this.m_MouseMoveDeletes = false;

    var m_ControlToDispose = null;


    function _SetObjectBoundsRect(child,x,y,w,h)
    {
      //child.SetBounds(x,y,Math.max(m_f.Scale,w),Math.max(m_MIN_SIZE,h));
      child.SetBounds(x,y,w,h);
    }

  function _ReformatComments(self)
  {
    var iCnt = bansheeComponentsCount(self);
    var scale = self.Scale;
    var xOff = m_Transform[0];
    var yOff = m_Transform[1];
    for(var i = 0; i < iCnt;i++)
    {
      var commWin = self.Components[i];
      if (commWin.m_Minimized)
      {
        var x = commWin.m_ptPivot[0] * scale;
        var y = commWin.m_ptPivot[1] * scale;
        _SetObjectBoundsRect( commWin,
                              xOff + x - commWin.w,
                              yOff + y,
                              commWin.w,
                              commWin.h);
      }
      else
      {
        _SetObjectBoundsRect( commWin,
                              xOff + commWin.wx * scale,
                              yOff + commWin.wy * scale,
                              commWin.ww * scale,
                              commWin.wh * scale);
                              self.SetWorldPosition(commWin);
      }
    }
  }


  this.EmitComment = function(x,y,w,h,txt,caption)
    {
      x = StrToFloatDef(x,0);
      y = StrToFloatDef(y,0);
      w = StrToFloatDef(w,200);
      h = StrToFloatDef(h,200);
      if (w * h > 0)
      {
        var cwnd = new TCommentsWindow(this,this.DivCtrl,this.Banshee);
        var size = cwnd.GetMinSize();
        m_MIN_SIZE = Math.max(size[0],size[1]);

        cwnd.wx = x;
        cwnd.wy = y;
        cwnd.ww = w;
        cwnd.wh = h;

        cwnd.SetText(txt);
        cwnd.DivCtrl.style.overflow = 'hidden';

        if (caption)
          cwnd.SetCaption(caption);
        else
        {
          var d = new Date();
          var curr_date = d.getDate();
          var curr_month = d.getMonth() + 1; //Months are zero based
          var curr_year = d.getFullYear();
          caption = curr_date + '.' + curr_month + '.' + curr_year;
          cwnd.SetCaption(caption);
        }

        if (!m_bReadingJSON)
        {
          _BringToFront(this,cwnd);
          _ReformatComments(this);
        }
      }
    };


    this.InitializeComponent = function () {
      //this.EmitComment(10,10,500,300);
    };

    this.SetCursor = function (iNum) { this.Cursor = iNum; };

    this.OnMouseWheel = function(e) { bansheeSafeCall(this.Owner,'OnMouseWheel',e); };


    this.SetCSSStyle = function(szTemplate)
    {
      this.DivCtrl.style.cssText += szTemplate;
      bansheeSyncSmartLayer(this);
    };

    this.SetEnabled = function (bEnabled) { bansheeSetEnabled(this, bEnabled);};

    this.SetVisible = function (bVis) { bansheeSetVisible(this,bVis); };

    this.SetBounds = function (x, y, w, h) {
        bansheeSetBounds(this, x, y, 0, 0);
        if (this.CanvasCtrl)
          this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;
        //bansheeClipView(this,x,y,w,h);
    };

    var m_Transform = [0,0];
    this.SetTransform = function(x,y,scale)
    {
      m_Transform[0] = x;
      m_Transform[1] = y;
      this.Scale = StrToFloatDef(scale,1.0);
      _ReformatComments(this);
    };

    this.GetViewArea = function()
    {
      return this.Owner.GetDocViewClipRect();
    };

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
        return;
      }


      var cursorInfo = this.Banshee.GetCursorInfo();
      m_dx = cursorInfo[0] - sender.x;
      m_dy = cursorInfo[1] - sender.y;
      m_bDragging = true;
    };
    
    function _ClampX(child,currX,minSize)
    {
        var res = currX;
        if (currX < 0)
          res = 0;
        else
        if (currX > child.x + child.w - minSize)
           res = child.x + child.w - minSize;
        return res; 
    }

    function _ClampY(child,currY,minSize)
    {
        var res = currY;
        if (currY < 0)
          res = 0;
        else
        if (currY > child.y + child.h - minSize)
           res = child.y + child.h - minSize;
        return res; 
    }
    
    function _ClampW(child,currX,minSize,maxExt,scale)
    {
        currX -= child.x;
        currX = currX  + (child.ww * scale);
        var res = currX;
        if (currX + child.x > maxExt)
            res = maxExt - child.x;
        else
        if (currX < minSize)
            res = minSize;
        
        return res;      
    }

    function _ClampH(child,currY,minSize,maxExt,scale)
    {
        currY -= child.y;
        currY = currY  + (child.wh * scale);
        var res = currY;
        if (currY + child.y > maxExt)
            res = maxExt - child.y;
        else
        if (currY < minSize)
            res =  minSize;
        return res;      
    }

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


    this.OnChildTouchMove = function(sender)
    {
      if (m_bDragging)
      {
        var cursorInfo = this.Banshee.GetCursorInfo();
        var nX = cursorInfo[0] - m_dx;
        var nY = cursorInfo[1] - m_dy;

        var scale = this.Scale;
        var fTA,fTB,fTC;

        var minDim = sender.GetMinSize();

        var minXSize = minDim[0];
        var minYSize = minDim[1];

        var bookViewerDim = _GetStageDim(this);


        switch (sender.DragMode)
        {
          case 0 : {
              var screenWidth = sender.ww * scale;
              var screenHeight = sender.wh * scale;
              if (nX + screenWidth > bookViewerDim[0])
                nX = bookViewerDim[0] - screenWidth;
              if (nY + screenHeight > bookViewerDim[1])
                nY = bookViewerDim[1] - screenHeight;

              //calc the world position
              nX = (nX - m_Transform[0]) / scale;
              nY = (nY - m_Transform[1]) / scale;


              if (nX < 0)
                nX = 0;

              if (nY < 0)
                nY = 0;

              sender.wx = nX;
              sender.wy = nY;

              //calc the screen position
              _SetObjectBoundsRect( sender,
                                    m_Transform[0] + sender.wx * scale,
                                    m_Transform[1] + sender.wy * scale,
                                    screenWidth,
                                    screenHeight);
            break;
          }
          case 1 : {//North
                    fTA = _ClampY(sender,nY,minYSize);
                    fTB = (sender.wy * scale) + m_Transform[1] - fTA;
                    _SetObjectBoundsRect( sender,
                                          m_Transform[0] + sender.wx * scale,
                                          fTA,
                                          sender.ww * scale,
                                          sender.wh * scale + fTB);
            break;
          }
          case 2 : {//North east
              fTA = _ClampY(sender,nY,minYSize);
              fTB = (sender.wy * scale) + m_Transform[1] - fTA;
              _SetObjectBoundsRect( sender,
                                    m_Transform[0] + sender.wx * scale,
                                    fTA,
                                    _ClampW(sender,nX,minXSize,bookViewerDim[0],scale),
                                    sender.wh * scale + fTB);
            break;
          }
          case 3 : {//Size east
                  _SetObjectBoundsRect( sender,
                                        m_Transform[0] + sender.wx * scale,
                                        m_Transform[1] + sender.wy * scale,
                                        _ClampW(sender,nX,minXSize,bookViewerDim[0],scale),
                                        sender.wh * scale);
            break;
          }
          case 4 : {//South east
            _SetObjectBoundsRect( sender,
                                  m_Transform[0] + sender.wx * scale,
                                  m_Transform[1] + sender.wy * scale,
                                  _ClampW(sender,nX,minXSize,bookViewerDim[0],scale),
                                  _ClampH(sender,nY,minYSize,bookViewerDim[1],scale));

            break;
          }
          case 5 : {//South
                _SetObjectBoundsRect( sender,
                                      m_Transform[0] + sender.wx * scale,
                                      m_Transform[1] + sender.wy * scale,
                                      sender.ww * scale,
                                      _ClampH(sender,nY,minYSize,bookViewerDim[1],scale)
                                      );
            break;
          }
          case 6 : {//South-west
            nX = _ClampX(sender,nX,minXSize);
            fTB = (sender.wx * scale) + m_Transform[0] - nX;
            _SetObjectBoundsRect( sender,
                                  nX,
                                  m_Transform[1] + sender.wy * scale,
                                  sender.ww * scale + fTB,
                                  _ClampH(sender,nY,minYSize,bookViewerDim[1],scale)
                                );

            break;
          }
          case 7 : {//West
            nX = _ClampX(sender,nX,minXSize);
            fTB = (sender.wx * scale) + m_Transform[0] - nX;
            _SetObjectBoundsRect( sender,
                                  nX,
                                  m_Transform[1] + sender.wy * scale,
                                  sender.ww * scale + fTB,
                                  sender.wh * scale);
            break;
          }
          case 8 : {//North - west
            nX = _ClampX(sender,nX,minXSize);
            nY = _ClampY(sender,nY,minYSize); 
            
            fTB = (sender.wy * scale) + m_Transform[1] - nY;
            fTC = (sender.wx * scale) + m_Transform[0] - nX;
            _SetObjectBoundsRect( sender,
                                  nX,
                                  nY,
                                  sender.ww * scale + fTC,
                                  sender.wh * scale + fTB);

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
      if (!occ.m_Minimized)
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
      return (new TCommentsJSONSerializer(this)).WriteData();
    return null;
  };

  this.SetData = function (jsonData) {

    this.Clear();
    if (jsonData)
    {
      m_bReadingJSON = true;
      try
      {
        (new TCommentsJSONSerializer(this)).ReadData(jsonData);
      }
      finally
      {
        m_bReadingJSON = false;
      }
      _ReformatComments(this);
      bansheeSafeCall(this,'Invalidate');
    }

  };


  //*********************
    this.Banshee.AddControl(this);
    this.InitializeComponent();

}
//TCommentsManager*******************************************************************
//***********************************************************************************
