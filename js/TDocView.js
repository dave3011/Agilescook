// 0(BANSHEE) Banshee-JS
//    1(TBookEditorView) a.k.a. MainLayer
//          2(TBookViewer)
//              3(TDocViewer)  You're here
//                  4(TMipmapPresenter 0)
//                  4(TMipmapPresenter N-1)
//              3(TCanvasPainter)
//                --Custom List of Geometry (TPolyline)
//              3(TOccluderManger)
//                  4(TOccluder 0)
//                  4(TOccluder N-1)

//Little helper
function TSaveViewState() {
    var m_zoom = 0;
    var m_hoffset = 0;
    var m_vOffset = 0;
    this.SaveState = function (docView) {
        m_zoom = docView.m_Zoom;
        m_hoffset = docView.m_HorzOffset;
        m_vOffset = docView.m_VertOffset;
    };

    this.CompareState = function (docView) {
        return (docView.m_Zoom === m_zoom) && (m_hoffset === docView.m_HorzOffset) && (m_vOffset === docView.m_VertOffset);
    };

}


//Document Viewer
function TDocView(_owner, _parent, _banshee) {
    bansheeInitComponent(this, _owner, _banshee, 'TDocView');
    bansheeInitVisual(this, _parent, false);

    this.m_dimX = 0;
    this.m_dimY = 0;
    this.m_Zoom = 100;//effective Scale in %

    this.m_HorzOffset = 0;
    this.m_VertOffset = 0;
    this.m_bDragging = false;

    this.m_dx = 0;
    this.m_dy = 0;

    this.m_docx = 0;
    this.m_docy = 0;
    this.m_docw = 0;
    this.m_doch = 0;

    //Notify owner
    this.m_NO_OnProjectionChanged = null;
    //************************************
    this.Cursor = 0;//None


    var m_storeAbsDim = [0, 0];//need to recover absWidth & absHeight
    var m_ContentSize = [0, 0];//effective content-size (forget the book dimensions)
    var m_CurrOutputDim = [0, 0];//Ist eine Variable in Abhängigkeit vom geforderten Modus(stage,document)
    var m_fZoomStride = 1.25;//Def

    var m_SaveState = new TSaveViewState();

    var m_maxZoomFactor = 4;


    var m_MipmapsContainer = null;

    this.m_NO_FitComparator = null;


    this.InitializeComponent = function()
    {
      //m_MipmapsContainer = new TMipmapsContainer(this,this.DivCtrl,this.Banshee);
    };

    /*
    this.OnAnimationDone = function()
    {
      this.Banshee.RemoveAnimControl(this);
      this.Banshee.TraceOut(this,'FORCE UPDATE');
      //this.FormatStage(this.m_HorzOffset, this.m_VertOffset);
    };

    */
    /*
    var m_HackLastFormatStage = [0,0];
    function __FirefoxUpdateHack(inst)
    {
      //Hack:: Manche Browser (Firefox) invalidieren das Canvas-Element nicht korrekt
      //Bare-Bones attack
      inst.FormatStage(m_HackLastFormatStage[0],m_HackLastFormatStage[1]);

      //inst.SetBounds(inst.x + 1, inst.y + 1, inst.w + 1, inst.h + 1,inst);
      //inst.SetBounds(inst.x - 1, inst.y - 1, inst.w - 1, inst.h - 1,inst);
    }
    */

    function __updateMipmaps(o) {

        var _zoom = o.m_Zoom;

        if (m_MipmapsContainer)
          o = m_MipmapsContainer;

        var iCnt = bansheeComponentsCount(o);
        for (var i = 0; i < iCnt; i++)
            bansheeSafeCall(o.Components[i],'UpdateMipmap',_zoom);
    }

    function __NotifyProjectionChanged(o) {
        bansheeNotifyOwner(o, o.m_NO_OnProjectionChanged, null);
    }

    function __CalcContentSize(inst) {
        if (m_MipmapsContainer)
          inst = m_MipmapsContainer;

        var iCount = bansheeComponentsCount(inst);
        var boundsRect = [1000000, 1000000, -1000000, -1000000];

        for (var i = 0; i < iCount; i++) {
            //xMin
            var val = inst.Components[i].wx;
            if (val < boundsRect[0])
                boundsRect[0] = val;
            //yMin
            val = inst.Components[i].wy;
            if (val < boundsRect[1])
                boundsRect[1] = val;

            //xMax
            val = inst.Components[i].wx + inst.Components[i].ww;
            if (val > boundsRect[2])
                boundsRect[2] = val;

            //yMax
            val = inst.Components[i].wy + inst.Components[i].wh;
            if (val > boundsRect[3])
                boundsRect[3] = val;
        }
        m_ContentSize = [boundsRect[2] - boundsRect[0], boundsRect[3] - boundsRect[1]];

       if (m_MipmapsContainer)
         m_MipmapsContainer.SetBounds(0,0,m_ContentSize[0],m_ContentSize[1]);

    }

    this.GetContentSize = function () {
        return m_ContentSize;
    };


    this.SetBounds = function (x, y, w, h,bIgnoreNotification) {

        w = w < 0?0:w;
        h = h < 0?0:h;

        m_storeAbsDim = [w, h];
        bansheeClipView(this, -this.x, -this.y, this.Owner.w, this.Owner.h);
        if (bansheeSetBounds(this, x, y, w, h) === true)
        {

            CalcOutputRect(this, m_CurrOutputDim[0], m_CurrOutputDim[1]);
            if (!bIgnoreNotification)
              __NotifyProjectionChanged(this);
        }
    };


    this.Clear = function () {
        if (m_MipmapsContainer)
          m_MipmapsContainer.Clear();
        else
          bansheeFreeComponents(this);
    };

    this.OnLoaded = function () {
        this.m_dimX = this.w;
        this.m_dimY = this.h;
        this.w = m_storeAbsDim[0];
        this.h = m_storeAbsDim[1];
        __CalcContentSize(this);
        this.SetBounds(this.x, this.y, this.w, this.h);
        CalcOutputRect(this, this.m_dimX, this.m_dimY);
        __updateMipmaps(this);
        this.Invalidate();
    };

    this.OnClassCreate = function (rootInstance, currInst, lpXMLNode) {
        if (lpXMLNode.nodeName === 'image')
        {
            if (m_MipmapsContainer)
              return new TMipmapPresenter(m_MipmapsContainer, m_MipmapsContainer.DivCtrl, m_MipmapsContainer.Banshee);
            else
              return new TMipmapPresenter(rootInstance, rootInstance.DivCtrl, rootInstance.Banshee);
        }
        else
            return rootInstance;
    };

    this.ReadComponentClass = function (lpXMLNode) {
        if (bansheeGetClassFromXMLElement(lpXMLNode) === this.ClassName) {
            this.Clear();
            bansheeReadComponentClass(this, lpXMLNode, this.OnClassCreate);
        }
    };

    this.FormatStage = function (xOff, yOff) {

        //bansheeTraceOut(this,'Updating::'+xOff + ':'+yOff);
        var sc = this.m_Zoom / 100;
        if (m_MipmapsContainer)
        {
          m_MipmapsContainer.SetTransform(xOff,yOff,sc);
          return;
        }


        /*
        var trans = ' translate'+'(' + xOff +'px'+',' + yOff + 'px'+') ';
        var scale = ' scale'+'('+ sc + ') ';
        var s = trans + scale;
        bansheeCSSTransform(this.DivCtrl.style,s);
  
  
        var  iCnt = bansheeComponentsCount(this);
        for (var i = 0; i < iCnt; i++)
        {
          var x, y, w,h;
  
          x = this.Components[i].wx;
          y = this.Components[i].wy;
          w = this.Components[i].ww;
          h = this.Components[i].wh;
  
          this.Components[i].m_ClipOwner = this;
          this.Components[i].SetBounds(xOff + x,
                                       yOff + y,
                                       w ,
                                       h );
        }
        return;
        */


        var iCount = bansheeComponentsCount(this);

       /*
        if (iCount === 1) {//Test

          var w,h;
          if (this.w > m_ContentSize[0])
             w = this.w;
          else
            w = m_ContentSize[0];

          if (this.h > m_ContentSize[1])
            h = this.h;
          else
            h = m_ContentSize[1];

          var layer = this.Components[0];
          layer.SetBounds( 0, 0,w,h);
          layer.SetTransform(sc, xOff, yOff);
          return;
        }
        */


        var fxBias;//Hhmmm...
        var fyBias;//Hhmmm...

        if (this.m_Zoom % 25 === 0) {
            fxBias = 0;
            fyBias = 0;
        }
        else {
            fxBias = 1;
            fyBias = 1;
        }
        //bansheeTraceOut(this,'FormatStage:' + parseInt(xOff) + ':' + parseInt(yOff) + ' off ' + parseInt(this.m_HorzOffset));
        var aLayer;
        for (var i = 0; i < iCount; i++) {
            var x, y, w, h;

            aLayer = this.Components[i];
            x = aLayer.wx;
            y = aLayer.wy;
            w = aLayer.ww;
            h = aLayer.wh;

            aLayer.m_ClipOwner = this;
            aLayer.SetBounds(xOff + x * sc,
                            yOff + y * sc,
                            w * sc + fxBias,
                            h * sc + fyBias);
        }
    };
    //private
    function CalcOutputRect(inst, xDim, yDim) {
        var x, y, sc;
        sc = inst.m_Zoom / 100;

        m_CurrOutputDim[0] = xDim;
        m_CurrOutputDim[1] = yDim;

        var w = m_CurrOutputDim[0] * sc;
        var h = m_CurrOutputDim[1] * sc;
        x = (inst.w * 0.5) - (w * 0.5);
        y = (inst.h * 0.5) - (h * 0.5);
        if (x < 0)
            x = 0;
        else
            inst.m_HorzOffset = 0;

        if (y < 0)
            y = 0;
        else
            inst.m_VertOffset = 0;


        if (inst.m_HorzOffset >= 0)
            inst.m_HorzOffset = 0;
        else if (inst.m_HorzOffset + w < inst.w)
            inst.m_HorzOffset = inst.w - w;

        if (inst.m_VertOffset >= 0)
            inst.m_VertOffset = 0;
        else if (inst.m_VertOffset + h < inst.h)
            inst.m_VertOffset = inst.h - h;

        inst.m_docx = x;
        inst.m_docy = y;

        inst.m_docw = x > 0?w:(inst.m_HorzOffset + w);
        inst.m_doch = y > 0?h:(inst.m_VertOffset + h);

        //Firefox-HACK:Store the last offset positions
        //m_HackLastFormatStage[0] = x + inst.m_HorzOffset;
        //m_HackLastFormatStage[1] = y + inst.m_VertOffset;
        //************************************************
        inst.FormatStage(x + inst.m_HorzOffset, y + inst.m_VertOffset);
    }

    this.ZoomZero = function (mode) {
        var _h = this.GetZoomZero(mode);
        if (_h * 100 === this.m_Zoom)
            return;

        m_SaveState.SaveState(this);

        this.Zoom(_h * 100);

        //__FirefoxUpdateHack(this);
        //this.Banshee.AddAnimControl(this);
        if (!m_SaveState.CompareState(this))
            __NotifyProjectionChanged(this);

    };

    this.GetZoomZero = function (mode) {
        if (mode === 'content') {
            m_CurrOutputDim[0] = m_ContentSize[0];
            m_CurrOutputDim[1] = m_ContentSize[1];
        }
        else {
            m_CurrOutputDim[0] = this.m_dimX;
            m_CurrOutputDim[1] = this.m_dimY;
        }

        if ((m_CurrOutputDim[0] == 0) || (m_CurrOutputDim[1] == 0))
            return 1;
        var _w = this.w / m_CurrOutputDim[0];
        var _h = this.h / m_CurrOutputDim[1];

        if (this.m_NO_FitComparator)
        {
          if (this.m_NO_FitComparator(_h,_w))
            _h = _w;
        }
        else
        {
          if (_h < _w)//was auch immer..
            _h = _w;
        }
        return _h;
    };

    function __updateCursor(inst) {
        if ((m_ContentSize[0] * m_ContentSize[1] === 0) || (m_CurrOutputDim[0] * m_CurrOutputDim[1] === 0))
            inst.Cursor = 0;
        else {
            var _w = inst.w / m_CurrOutputDim[0];
            var _h = inst.h / m_CurrOutputDim[1];
            if (_h > _w)//Best match
                _h = _w;
            if (_h * 100 < inst.m_Zoom)// && _h !== 0)
                inst.Cursor = 4;//Move custom
            else
                inst.Cursor = 0;
        }

      //Hack:
      inst.Owner.Cursor = inst.Cursor;
      var _html = inst.Owner.DivCtrl;
      if (_html)
        _html.style.cursor = bansheeCursorIDToCSS(inst.Cursor);
    }


    this.Zoom = function (s) {

        //Clamp to min-max
        var _min = this.GetZoomZero() * 100;
        var _max = _min * m_maxZoomFactor;

        m_fZoomStride = 1 + ((_max - _min) / 1600);

        if (parseInt(s * 10000) <= parseInt(_min * 10000))
        {
          s = _min;
          //__FirefoxUpdateHack(this);
          //this.Banshee.AddAnimControl(this);
        }
        else if (s >= _max)
            s = _max;
        //******************************

        this.m_Zoom = s;
        __updateCursor(this);
        __updateMipmaps(this);
        CalcOutputRect(this, m_CurrOutputDim[0], m_CurrOutputDim[1]);
    };

    this.GetDocPos = function (point) {
        var sc = this.m_Zoom / 100;
        if (sc === 0)
            sc = 0.000001;
        var x = (point[0] - this.m_docx - this.m_HorzOffset) / sc;
        var y = (point[1] - this.m_docy - this.m_VertOffset) / sc;
        return [x, y];
    };

    this.GetDocMousePos = function () {
        var cursorPoint = bansheeMouseToClient(this);
        return this.GetDocPos(cursorPoint);
    };

    this.GetZoomStride = function()
    {
        return m_fZoomStride;
    };

    this.GetMaxZoomFactor = function()
    {
      return m_maxZoomFactor;
    };

    this.AutoZoom = function (bIn, fNewZoom, ptPivot, newZoomStride) {

        m_SaveState.SaveState(this);

        var bPivotZoom = Boolean(fNewZoom && ptPivot);
        var fZoom;
        if (bPivotZoom)
            fZoom = fNewZoom;//Zoom around pivot-point
        else {//Mousewheel
            if (newZoomStride)
                m_fZoomStride = newZoomStride;

            if (bIn)
                fZoom = this.m_Zoom * m_fZoomStride;
            else
                fZoom = this.m_Zoom / m_fZoomStride;

        }

        var fNewScale = fZoom / 100;
        var curr, next;

        if (bPivotZoom) {
            curr = this.GetDocPos(ptPivot);
            this.Zoom(fZoom);
            next = this.GetDocPos(ptPivot);
        }
        else {
            curr = this.GetDocMousePos();
            this.Zoom(fZoom);
            next = this.GetDocMousePos();
        }


        var fx = (next[0] - curr[0]) * fNewScale;
        var fy = (next[1] - curr[1]) * fNewScale;

        this.m_HorzOffset += fx;
        this.m_VertOffset += fy;
        this.Zoom(fZoom);

        if (!m_SaveState.CompareState(this))
            __NotifyProjectionChanged(this);

    };

    this.Invalidate = function () {
        var i, iCount = bansheeComponentsCount(this);
        for (i = 0; i < iCount; i++)
            this.Components[i].Invalidate();

    };

    this.OnMouseExit = function () {
        this.m_bDragging = false;
    };

    function __BeginDrag(inst) {
        var cursorInfo = inst.Banshee.GetCursorInfo();
        inst.m_dx = cursorInfo[0] - inst.m_HorzOffset;
        inst.m_dy = cursorInfo[1] - inst.m_VertOffset;
        inst.m_bDragging = true;

    }
    function __Drag(inst) {
        if (inst.m_bDragging) {
            m_SaveState.SaveState(inst);
            var cursorInfo = inst.Banshee.GetCursorInfo();
            inst.m_HorzOffset = cursorInfo[0] - inst.m_dx;
            inst.m_VertOffset = cursorInfo[1] - inst.m_dy;
            CalcOutputRect(inst, m_CurrOutputDim[0], m_CurrOutputDim[1]);

            if (!m_SaveState.CompareState(inst))
                __NotifyProjectionChanged(inst);
          return true;
        }
        else
          return false;
    }

    function __EndDrag(inst) {
        inst.m_bDragging = false;
    }

  this.SetOffsets = function(horzOffset,vertOffset)
  {
    m_SaveState.SaveState(this);
    this.m_HorzOffset = horzOffset;
    this.m_VertOffset = vertOffset;
    CalcOutputRect(this, m_CurrOutputDim[0], m_CurrOutputDim[1]);
    if (!m_SaveState.CompareState(this))
      __NotifyProjectionChanged(this);
  };


  this.OnMouseDown = function (e) {

        if (bansheeGetMouseButton(e) === 0)//Left button
        {
         /*
            if (m_bGoogleMapsMode)
              this.HandleMouseMap(e)
          else*/
          //this.FormatStage(this.m_HorzOffset, this.m_VertOffset);
          __BeginDrag(this);
        }
        else
        if (bansheeGetMouseButton(e) === 1)//Mid button
          this.DoGestureCustomZoom();
      return false;
    };

    this.OnMouseUp = function (e) {
        if (bansheeGetMouseButton(e) === 0)//Left button
            __EndDrag(this);
      return true;
    };

    this.OnMouseMove = function () {
        __Drag(this);
        return true;
    };

    this.OnMouseWheel = function (event) {

        /*if (m_bGoogleMapsMode)
            this.DoMapZoom(bansheeGetWheelDelta(event) > 0);
        else*/
          bansheeSafeCall(this.Owner, 'OnMouseWheel', event);
        return true;
    };

    this.DoGestureCustomZoom = function()
    {
      var _min = this.GetZoomZero() * 100;
      var _max = _min * m_maxZoomFactor;
      var currpoint = bansheeMouseToClient(this);
      if (this.m_Zoom < _min + (_max-_min) * 0.5)
        this.AutoZoom(true,_max,currpoint);
      else
        this.AutoZoom(true,_min,currpoint);
    };

    this.DoGesturePinch = function(bOut)
    {
      m_fZoomStride = 1.05;
      this.AutoZoom(bOut);
    };

    //Gesture-Event from Banshee via Hammer.js
    this.OnGesture = function (evt) {
        var gest = evt.gesture;

        switch (evt.type)
        {
          case 'dragstart':{ __BeginDrag(this);break;}
          case 'drag':{__Drag(this);break}
          case 'release':{__EndDrag(this);break;}
          case 'doubletap':{this.DoGestureCustomZoom();break;}
          case 'pinchin':{this.DoGesturePinch(false);break;}
          case 'pinchout':{this.DoGesturePinch(true);break;}
          case 'swipeleft':{bansheeSafeCall(this.Owner,'OnSwipeNextPrev',true);break;}
          case 'swiperight':{bansheeSafeCall(this.Owner,'OnSwipeNextPrev',false);break;}
        }
      return true;
    };

    var m_PinchStartLen = 0;
    var m_PinchStartZoom = 0;
    var m_PinchPivot = [0, 0];
    var m_bPinching = false;
    this.OnBansheeGesture = function (szEventName, e) {
        if (szEventName === 'pinch') {
            //bansheeTraceOut(this,'Pinch');
            var currLen = bansheeGetPinchVectorLength(e);
            var zNew = (currLen - m_PinchStartLen) / 10;
            var newZoom = m_PinchStartZoom + zNew;
            this.AutoZoom(true, newZoom, m_PinchPivot);
        }
        else
            if (szEventName === 'pinchBegin') {
                __EndDrag(this);
                m_PinchPivot = bansheeGetPinchCenter(e);
                m_PinchStartZoom = this.m_Zoom;
                m_PinchStartLen = bansheeGetPinchVectorLength(e);
                m_bPinching = true;
                //bansheeTraceOut(this,'PinchBegin');
            }
            else
                if (szEventName === 'pinchEnd') {
                    m_bPinching = false;
                    //bansheeTraceOut(this,'PinchEnd');
                }
                else
                    if (szEventName === 'touchstart') {
                        if (!m_bPinching)
                            __BeginDrag(this);
                    }
                    else
                        if (szEventName === 'touchmove') {
                            if (!m_bPinching)
                                __Drag(this);
                        }
                        else
                            if (szEventName === 'touchend' || szEventName === 'touchcancel')
                                __EndDrag(this);
    };


    this.OnStageLeave = function () {
        this.m_bDragging = false;
    };

    this.HitTest = function (x, y) {
        return bansheeUIHitTest(this.Owner, x, y);
    };

    this.Free = function () {
        m_SaveState = null;
        bansheeFree(this);
    };

    /*
    var m_currWorldX = 35187;
    var m_currWorldY = 21490;
    var m_currWorldZ = 16;

    var m_bGoogleMapsMode = false;

    var m_wcAbsX = 0;
    var m_wcAbsY = 0;
    */
    this.GetGoogleMap = function(child)
    { //'https://khms1.google.de/kh/v=140&src=app&x=1099&y=673&z=11';
      /*
      m_bGoogleMapsMode = true;

      var x = parseInt(child.wx / 256);
      var y = parseInt(child.wy / 256);
      var z = m_currWorldZ;//11;

      x += m_currWorldX;
      y += m_currWorldY;
      //Die image map
      var res = 'https://khms1.google.de/kh/v=140&src=app&x='+ x + '&y='+ y + '&z='+ z;
      //Die Text Labels
      var textDesc = 'https://mts1.google.com/vt/lyrs=h@239000000&hl=de&src=app&x='+x +'&y='+y+'&z='+z +'&s=Galileo';
      child.AssignMedia(textDesc,8);
      return res;
      */
    };


    this.HandleMouseMap = function(e)
    {
        /*
        var scale = this.m_Zoom / 100;
        var maxX = 1024 * scale;
        var maxY = 1024 * scale;


        var ptPos = bansheeMouseToClient(this);
        var thresh = 20;
        if (ptPos[0] < thresh)
        {
          //m_currWorldX--;
          //this.UpdateGoogleMaps();
          m_currWorldX--;
          this.CalcWorldPosition(true);
          return;
        }
        if (ptPos[0] > maxX- thresh)
        {
          m_currWorldX++;
          //this.UpdateGoogleMaps();
          this.CalcWorldPosition(true);
          return;
        }

        if (ptPos[1] < thresh)
        {
          m_currWorldY--;
          this.UpdateGoogleMaps();
          return;
        }
        if (ptPos[1] > maxY - thresh * 2)
        {
          m_currWorldY++;
          this.UpdateGoogleMaps();
          return;
        }
        //Center zoom
        var midX = (ptPos[0] - 256) / (256 * _GetEffectiveGoogleMapsZoom());
        var midY = (ptPos[1] - 256)/ (256 * _GetEffectiveGoogleMapsZoom());

        m_wcAbsX += midX;
        m_wcAbsY += midY;
        m_currWorldZ++;

        if (m_currWorldZ > 20)
            m_currWorldZ = 5;
        this.SetMapPosition(m_wcAbsX,m_wcAbsY,m_currWorldZ);
        */
    };

    this.DoMapZoom = function(bIn)
    {
      /*
      var ptPos = bansheeMouseToClient(this);
      var midX,midY;

      if (bIn)
      {
        m_currWorldZ++;
        if (m_currWorldZ > 20)
        {
          m_currWorldZ = 20;
          return;
        }
      }
      else
      {
        m_currWorldZ--;
        if (m_currWorldZ < 4)
        {
          m_currWorldZ = 4;
          return;
        }
      }
      midX = (ptPos[0] - 256) / (256 * _GetEffectiveGoogleMapsZoom());
      midY = (ptPos[1] - 256) / (256 * _GetEffectiveGoogleMapsZoom());
      m_wcAbsX += midX;
      m_wcAbsY += midY;
      this.SetMapPosition(m_wcAbsX,m_wcAbsY,m_currWorldZ);
      */
    };

    function _GetEffectiveGoogleMapsZoom()
    {
        var fac = m_currWorldZ- 4;
        return Math.pow(2, fac);
    }

    this.CalcWorldPosition = function(bUpdateMaps)
    {
      /*
      m_wcAbsX = m_currWorldX / _GetEffectiveGoogleMapsZoom();
      m_wcAbsY = m_currWorldY / _GetEffectiveGoogleMapsZoom();
      if (bUpdateMaps)
        this.SetMapPosition(m_wcAbsX,m_wcAbsY,m_currWorldZ);
      */
    };


    this.SetMapPosition = function(xWorld,yWorld,displayZoom)
    {
        /*
        m_currWorldZ = displayZoom;
        var eZoom = _GetEffectiveGoogleMapsZoom();
        xWorld *= eZoom;
        yWorld *= eZoom;

        xWorld = parseInt(xWorld);
        yWorld = parseInt(yWorld);

        //this.Banshee.SetText('mx:' + x + ' my:' + y + ' fac:'+eZoom + ' x:'+xIn + ' y:'+yIn);
        m_currWorldX = xWorld;
        m_currWorldY = yWorld;
        this.UpdateGoogleMaps();
        */
    };



    this.UpdateGoogleMaps = function()
    {
      /*
      this.Banshee.SetText(m_currWorldZ + ' x='+m_currWorldX + ' y='+m_currWorldY + '['+m_wcAbsX+','+m_wcAbsY+']');
      var iCnt = bansheeComponentsCount(this);
      for (var i = 0; i < iCnt;i++)
        this.Components[i].AssignMedia('GOOGLE_MAP',1);
      */
    };

    this.StopGoogleMaps = function()
    {
      m_bGoogleMapsMode = false;
      /*
      // m_currWorldX = 549; m_currWorldY = 335;  m_currWorldZ = 10;

      // m_currWorldX = 35187; m_currWorldY = 21490; m_currWorldZ = 16;

      m_currWorldX = 281512;
      m_currWorldY = 172051;
      m_currWorldZ = 19;

      this.CalcWorldPosition(false);
      */
    };



    //Register..
    this.Banshee.AddControl(this);
    this.InitializeComponent();
}

//TDocView****************************************************************************
//***********************************************************************************
