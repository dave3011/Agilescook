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
//              3(TCommentsManager)
//                  4(TCommentWindow 0) You're here
//                  4(TCommentWindow N-1) ..or here



function TCommentsWindow(_owner,_parent,_banshee) {
    bansheeInitComponent(this, _owner, _banshee,'TCommentsWindow');
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
    this.DragMode = 0;

    var borderWidth = 4;

    var m_AnimController = null;

    var m_MinButton = null;
    var m_ContentArea = null;
    var m_DeleteVisual = null;

    var m_TextInput = null;
    var m_Caption = null;
    var m_MainWindow = this;

    var m_MinDim = [140,36];

    var minimizeIcon = '&#58939;';
    var restoreIcon = '&#58940;';

    function _BuildNCArea(root,src)
    {
      if (!src)
        return;

      /*var staticText = root.AddHTMLObject(src,'div',CSS_COMMENT_HEADER_ICON);
      staticText.innerHTML = '&#58901;';

      m_MinDim[0] = staticText.offsetWidth + staticText.offsetLeft * 5;*/
      m_MinDim[0] = 100;


      m_Caption = root.AddHTMLObject(src,'div',CSS_COMMENT_HEADER_TIMESTAMP + CSS_DEFAULT_FONT);
      m_Caption.innerHTML = '00.00.0000';//'18.11.2013';

      m_MinDim[0] += m_Caption.offsetWidth;

      m_MinButton = root.AddHTMLObject(src,'div',CSS_COMMENT_MINIMIZE_BUTTON_ICON + CSS_COMMENT_MINIMIZE_BUTTON);
      m_MinButton.innerHTML = minimizeIcon;
      m_MinDim[0] += m_MinButton.offsetWidth;
      m_MinDim[1] = m_MinButton.offsetHeight;
    }

    function _BuildClientArea(root,src)
    {
      if (!src)
        return;
      //var ContentArea = root.AddHTMLObject(src,'div');
      m_TextInput = root.AddHTMLObject(src,'textarea',CSS_COMMENT_CONTENT_TEXT + CSS_DEFAULT_FONT);
      m_TextInput.placeholder = 'Machen Sie hier Ihre Notiz.';
      //m_TextInput.addEventListener('input',_OnTextInputChanged);
    }

  /*
    this.Activate = function()
    {
      return true;
    };
  */
    function _SyncTextLayer()
    {
      if (m_TextInput)
      {
        /*
        m_TextInput.style.height = '20px';
        if (m_TextInput.clientHeight < m_TextInput.scrollHeight)
          m_TextInput.style.height = m_TextInput.scrollHeight + 'px';


        m_MainWindow.SetBounds( m_MainWindow.x,
                                m_MainWindow.y,
                                m_MainWindow.w,
                                m_ContentArea.offsetTop + m_ContentArea.offsetHeight + 10
                                );
        m_MainWindow.Owner.SetWorldPosition(m_MainWindow);
        */
      }

    }

    function _OnTextInputChanged(evt)
    {
      _SyncTextLayer();
    }

    this.InitializeComponent = function () {
      var header = this.AddHTMLObject(this.DivCtrl,'div',CSS_COMMENT_HEADER);
      _BuildNCArea(this,header);


      m_ContentArea = this.AddHTMLObject(this.DivCtrl,'div',CSS_COMMENT_CONTENT);
      _BuildClientArea(this,m_ContentArea);

      m_DeleteVisual = this.AddHTMLObject(this.DivCtrl,'div',CSS_COMMENTBORDER);
      m_DeleteVisual.style.pointerEvents = 'none';

      this.SetCSSStyle(CSS_BOX_SHADOW);
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
                                m_MinButton.offsetLeft + minSize - borderWidth,
                                m_MinButton.offsetTop  + minSize);
       return false;
    }

    function _IsInputFieldHit(x,y)
    {
      if (m_TextInput)
      {
        var pr = m_MainWindow.DivCtrl.getBoundingClientRect();
        var br = m_TextInput.getBoundingClientRect();
        var xOff = br.left - pr.left;
        var yOff = br.top - pr.top;

        return bansheePtInRect( x,
                                y,
                                xOff,
                                yOff,
                                xOff + br.width,
                                yOff + br.height);
      }
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


    this.SetCSSStyle = function(szTemplate)
    {
      if (this.CanvasCtrl)
        this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;

      this.DivCtrl.style.cssText += szTemplate;
      bansheeSyncSmartLayer(this);
    };

    this.SetEnabled = function (bEnabled) {bansheeSetEnabled(this, bEnabled); };

    this.SetVisible = function (bVis) {bansheeSetVisible(this,bVis);};

    this.SetBounds = function (x, y, w, h)
    {
      var dimMin = this.GetMinSize();
      if (!this.m_Minimized && !m_AnimController)
      {
        w = 200;
        h = 200;
      }
      w = Math.max(dimMin[0],w);
      h = Math.max(dimMin[1],h);

      //bansheeClipView(this,0,0,w,h);
      bansheeSetBounds(this, x, y, w, h);
      if (m_ContentArea)
      {
        var val = h - m_ContentArea.offsetTop - 20;
        m_ContentArea.style.height = val + 'px';
      }


      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //Custom clipcode siehe TOccluder
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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

    this.ResetInteraction = function()
    {
      m_DeleteVisual.style.borderWidth = 0;
      this.Banshee.SetMouseCapture(this,false);
      bansheeSafeCall(this.Owner,'OnChildTouchUp',this);

    };

    this.OnStageLeave = function () { this.ResetInteraction();};

    this.OnMouseExit = function () { this.ResetInteraction();};

    this.OnMouseEnter = function () {
      if(_owner.m_MouseMoveDeletes)
        m_DeleteVisual.style.borderWidth = '2px';
    };

    this.OnMouseDown = function(evt)
    {
      if (bansheeGetMouseButton(evt)===0 && m_AnimController == null)
      {
        if (this.DragMode === 11 && !this.Owner.m_MouseMoveDeletes)//Inputfield
          return false;
        this.Banshee.SetMouseCapture(this,true);
        bansheeSafeCall(this.Owner,'OnChildTouchDown',this);
      }
      return true;
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

    this.HitTest = function (x, y) {
      return bansheeUIHitTest(this,x,y);
    };

    this.Free = function () {
      this.w = 0;this.h = 0;//Important for hitdetection
      this.Banshee.SendCancelMode(this);
      this.StartAnimation(0);
      /*
      if (m_TextInput)
        m_TextInput.removeEventListener('input',_OnTextInputChanged);
        */
      m_TextInput = null;

      bansheeFree(this);
    };

    //Gesture-Event from Banshee via Hammer.js
    this.OnGesture = function (evt) {

      if (m_AnimController)
        return;
      this.SetAutoCursor();//Determine the dragmode
      if (this.DragMode === 11)//Input field
        return false;//Browser default behaviour;

      switch (evt.type)
      {

        case 'tap' :{
          if (this.DragMode === 11 && !this.Owner.m_MouseMoveDeletes)//Inputfield
            return false;
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
      if (this.Owner.m_MouseMoveDeletes)
      {
        this.DragMode = 0;
        this.Cursor = 3;//-21;//Click
        return;
      }

      var pos = bansheeMouseToClient(this);
      var x,y;
      x = pos[0];
      y = pos[1];
      var catchArea = borderWidth * 2;

      var size = this.GetMinSize();
      //var min = Math.max(size[0],size[1]) - catchArea;
      if (_IsMinimizeButtonHit(x,y,size[1]))// || this.m_Minimized)
      {
        this.DragMode = 10;
        this.Cursor = -21;
        return;
      }

      if (_IsInputFieldHit(x,y))
      {
        this.DragMode = 11;
        //this.Cursor = 0;
        return;
      }

      //Nicht gr??enver?nderbar
      this.Cursor = -5;//Drag
      this.DragMode = 0;

      /*
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
        if (y>= this.h - catchArea)
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
      */
    };
    this.SetIcon = function(state){
      if(state === 'close')
        m_MinButton.innerHTML = minimizeIcon;
      else
        m_MinButton.innerHTML = restoreIcon;
    };

  this.Show = function(bMinimized)
    {
       if (this.m_Minimized == bMinimized)
        return;
      this.m_Minimized = bMinimized;

      this.m_ptPivot[0] = this.wx + this.ww;
      this.m_ptPivot[1] = this.wy;

      this.m_Org_wx = this.wx;
      this.m_Org_wy = this.wy;
      this.m_Org_ww = this.ww;
      this.m_Org_wh = this.wh;

      if (bMinimized)
      {
        this.SetIcon('open');
        /*
        this.m_ptPivot[0] = this.wx + this.ww;
        this.m_ptPivot[1] = this.wy;

        this.m_Org_wx = this.wx;
        this.m_Org_wy = this.wy;
        this.m_Org_ww = this.ww;
        this.m_Org_wh = this.wh;
        */
        var size = this.GetMinSize();
        var min = Math.max(size[0],size[1]);
        var sc = 1 / this.Owner.Scale;

        var xPos = (this.wx + this.ww) * this.Owner.Scale - min;
        xPos /= this.Owner.Scale;
        this.StartAnimation(2,this.wx,0,this.w * sc,size[1] * sc);
        /*
        this.wx = this.wx + this.ww - min;
        this.ww = min;
        this.wh = min;
        */
      }
      else
      {
        this.SetIcon('close');
        this.StartAnimation(1,this.m_Org_wx,0,this.m_Org_ww ,this.m_Org_wh);
        /*
        this.wx = this.m_Org_wx;
        this.wy = this.m_Org_wy;
        this.ww = this.m_Org_ww;
        this.wh = this.m_Org_wh;
        */
      }
    };


    this.GetMinSize = function()
    {
      return [m_MinDim[0],m_MinDim[1]];
    };

    function comments_Animate(progress,duration,a,b)
    {
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
        //1:Show normal 2:Show minimized
        case 1 :
        case 2 :  m_AnimController = new TAnimController(this,0,{wx:a,ww:c,wh:d},comments_Animate);
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

    //get the data to serialize
    this.GetWorldBounds = function()
    {
      if (this.m_Minimized || m_AnimController != null)
        return [this.m_Org_wx,this.m_Org_wy,this.m_Org_ww,this.m_Org_wh];
      else
        return [this.wx,this.wy,this.ww,this.wh];
    };

    this.SetText = function(szText)
    {
      if (szText)
        m_TextInput.value = szText;
      else
        m_TextInput.value = '';
    };

    this.GetText = function()
    {
      return m_TextInput.value;
    };

    this.SetCaption = function(szCaption)
    {
      if (szCaption)
        m_Caption.innerHTML = szCaption;
      else
        m_Caption.innerHTML = '';
    };

    this.GetCaption = function()
    {
      return m_Caption.innerHTML;
    };
    /*
    this.OnFocusChanged = function(info)
    {
      //Info{0] == oldFocus Element
      //info[1] == newFocus Element
      if (info[1] == m_TextInput)
        this.SetText('Habe focus');
      else if (info[0] == m_TextInput)
        this.SetText('Focus verloren');
    };
    */

    //*********************
    this.Banshee.AddControl(this);
    this.InitializeComponent();

}
//TCommentsWindow********************************************************************
//***********************************************************************************
