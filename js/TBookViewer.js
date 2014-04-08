// 0(BANSHEE) Banshee-JS
//    1(TBookEditorView) a.k.a. MainLayer
//          2(TBookViewer)  You're here
//              3(TDocViewer)
//                  4(TMipmapPresenter 0)
//                  4(TMipmapPresenter N-1)
//              3(TCanvasPainter)
//                --Custom List of Geometry (TPolyline)
//              3(TOccluderManager)
//                  4(TOccluder 0)
//                  4(TOccluder N-1)

function TBookviewerUserDataBlob(jsonCPData,jsonOccData,jsonScrOccData,jsonComManData,jsonHotspotsManData){
  this.CanvasPainterData = jsonCPData;
  this.OccludersData = jsonOccData;
  this.ScreenOccludersData = jsonScrOccData;
  this.CommentsManagerData = jsonComManData;
  this.HotspotsManagerData = jsonHotspotsManData;
}

function TBookheader(){
  this.m_NumStages = 0;
  this.m_Title = '';
  //Default width & height
  this.m_Width = 0;
  this.m_Height = 0;

  this.Assign = function(header)
  {
    if (header instanceof TBookheader) {
      header.m_NumStages = this.m_NumStages;
      header.m_Title = this.m_Title;
      header.m_Width = this.m_Width;
      header.m_Height = this.m_Height;
    }
  };
}

//Bookviewer
function TBookViewer(_owner, _parent, _banshee) {
  bansheeInitComponent(this, _owner, _banshee, 'TBookViewer');
  bansheeInitVisual(this, _parent, false);

  //NotifyOwner function(s)
  this.m_NO_OnHotspotSelectionChanged = null;
  this.m_NO_OnBookLoaded = null;
  this.m_NO_OnProjectionChanged = null;
  this.m_NO_OnStageComplete = null;
  this.m_NO_OnScreenOccluderDeleted = null;

  this.m_NO_OnError = null;
  //***********************************

  var m_EnableFit = true;

  var m_DocViewer = null;
  var m_CanvasPainter = null;
  var m_HotspotsManager = null;
  var m_OccluderManager = null;
  var m_CommentsManager = null;
  var m_ScreenOccluder = null;

  var m_DivOverlays = null;

  var m_BookLoader = new TBansheeTextLoader(this, null, 'OnBookLoaded');

  var m_BookHeader = null;
  var m_DataDir = null;
  var m_StageUrls = null;

  var m_SVGLoader = new TBansheeTextLoader(this, null, 'OnPageStreamLoaded');
  var m_CurrentStageID = -1;
  var m_DesiredStageID = -1;
  var m_classesFound = ['Docview:nein', 'Hotspots:nein'];//Docview,hotspots-manager
  var m_xmlDoc = null;
  var m_BookRoot = null;

  var m_DocViewOffsets = [CONST_DOCVIEW_OFFSETS[0], CONST_DOCVIEW_OFFSETS[1], CONST_DOCVIEW_OFFSETS[2], CONST_DOCVIEW_OFFSETS[3]];

  function ResetStreamInfo() {
    m_classesFound = ['Docview:nein', 'Hotspots:nein'];//Docview,hotspots-manager
  }


  var m_self = this;

  function _OnKeydown(e)
  {
    var trg = e.srcElement? e.srcElement: e.target;
    if (trg !== m_self.DivCtrl)
      return;
    var speed = 8 * m_DocViewer.m_Zoom / 100;
    var keycode = bansheeGetKeyCode(e);
    switch (keycode)
    {
      case 13 : m_DocViewer.ZoomZero();break;//Return
      case 107 :m_DocViewer.AutoZoom(true);break;//+
      case 109 :m_DocViewer.AutoZoom(false);break;//Minus
      case 37 :m_DocViewer.SetOffsets(m_DocViewer.m_HorzOffset + speed,m_DocViewer.m_VertOffset);break;//Left
      case 40 :m_DocViewer.SetOffsets(m_DocViewer.m_HorzOffset,m_DocViewer.m_VertOffset - speed);break;//Up
      case 39 :m_DocViewer.SetOffsets(m_DocViewer.m_HorzOffset - speed,m_DocViewer.m_VertOffset);break;//right
      case 38 :m_DocViewer.SetOffsets(m_DocViewer.m_HorzOffset,m_DocViewer.m_VertOffset + speed);break;//Down
      default : return;
    }
    bansheeCancelDefEvent(e);
  }


  this.InitializeComponent = function () {

    //this.CanvasCtrl.style.zIndex = 100;
    //this.CanvasCtrl.style.pointerEvents = 'none';

    if (bansheeComponentsCount(this) > 0)
      return;

    this.DivCtrl.addEventListener('keydown',_OnKeydown);
    _attr(this.DivCtrl, 'tabindex', 0);


    //#1 Docview
    m_DocViewer = new TDocView(this, this.DivCtrl, this.Banshee);
    m_DocViewer.m_NO_OnProjectionChanged = 'OnProjectionChanged';

    //#2 Canvaspainter

    m_CanvasPainter = new TCanvasPainter(this, this.DivCtrl, this.Banshee);
    m_CanvasPainter.SetEnabled(false);

    //#3 Occluder
    m_OccluderManager = new TOccluderManager(this, this.DivCtrl, this.Banshee);

    //#4 Kommentare
    m_CommentsManager = new TCommentsManager(this, this.DivCtrl, this.Banshee);

    /* Funkt nicht (Chrome's body-element scrollbar explodiert, trotz clipping)
     this.DivCtrl.style.overflowX = 'hidden';
     this.DivCtrl.style.overflowY = 'hidden';
     bansheeReflect(this.DivCtrl.style,AppTraceOut);
     */
    //#3 Hotspots (a.k.a. Klickstellen)

    m_HotspotsManager= new THotspotsManager(this, this.DivCtrl, this.Banshee);
    m_HotspotsManager.NO_OnHotspotSelectionChanged = 'OnHotspotSelectionChanged';
    //m_HotspotsManager.SetEnabled(false);

    m_ScreenOccluder = new TScreenOccluder(this, this.DivCtrl, this.Banshee);
    m_ScreenOccluder.m_NO_OnScreenOccluderDeleted = 'OnScreenOccluderDeleted';


    //View Overlays
    //m_DivOverlays = new TDivOverlaysContainer(this, this.DivCtrl, this.Banshee);

  };

  this.SetCSSStyle = function(style)
  {
    //this.DivCtrl.style.cssText += style;
    //bansheeSyncSmartLayer(this);
  };

  this.SetEnableFit = function(enableFit){
    m_EnableFit = enableFit;
    /*
    if(enableFit)
      this.SetCSSStyle(CSS_BOOKVIEWER_BOX_SHADOW_ON);
    else
      this.SetCSSStyle(CSS_BOOKVIEWER_BOX_SHADOW_OFF);
    this.Invalidate();
    */
    if (m_DivOverlays)
      m_DivOverlays.EnableFit(m_EnableFit);
  };

  this.GetEnableFit = function(){
    return m_EnableFit;
  };

  this.Invalidate = function () {
  };

  this.SetBounds = function (x, y, w, h) {
    if (bansheeSetBounds(this, x, y, w, h) === true) {
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //Das ist Pflicht
      bansheeClipView(this,0,0,this.w,this.h);
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      var off = 0;
      m_DocViewer.SetBounds(  m_DocViewOffsets[0],
              m_DocViewOffsets[1],
              w - (m_DocViewOffsets[0] + m_DocViewOffsets[2]),
              h - (m_DocViewOffsets[1] + m_DocViewOffsets[3]));

      if (m_DivOverlays)
        m_DivOverlays.SetBounds(0,0,w,h);
    }
  };

  this.OnProjectionChanged = function () {
    var sc = m_DocViewer.m_Zoom / 100;
    var x, y, w, h;
    x = m_DocViewer.m_docx + m_DocViewer.m_HorzOffset + m_DocViewer.x;
    y = m_DocViewer.m_docy + m_DocViewer.m_VertOffset + m_DocViewer.y;
    w = m_DocViewer.m_dimX * sc;
    h = m_DocViewer.m_dimY * sc;
    if (m_CanvasPainter) {
      m_CanvasPainter.SetTransform(x,y,sc);
      m_CanvasPainter.SetBounds(0, 0, this.w, this.h);
    }
    if (m_HotspotsManager) {
      m_HotspotsManager.Scale = sc;
      m_HotspotsManager.SetBounds(x, y, this.w, this.h);
    }
    if (m_OccluderManager)
    {
      m_OccluderManager.SetTransform(x,y,sc);
      m_OccluderManager.SetBounds(0, 0, this.w, this.h);
    }

    if (m_CommentsManager)
    {
      m_CommentsManager.SetTransform(x,y,sc);
      m_CommentsManager.SetBounds(0, 0, this.w, this.h);
    }

    if (m_ScreenOccluder)
    {
      m_ScreenOccluder.SetTransform(x,y,sc);
      m_ScreenOccluder.SetBounds(0,0,this.w,this.h);
    }

    bansheeSafeCall(this.Owner,this.m_NO_OnProjectionChanged,null);
  };

  this.GetBookOffset = function(){
    return[m_DocViewer.m_HorzOffset, m_DocViewer.m_VertOffset];
  };

  this.GetDocViewDragArea = function()
  {
    return [m_DocViewer.m_docx,m_DocViewer.m_docy,m_DocViewer.m_docw + m_DocViewer.x , m_DocViewer.m_doch + m_DocViewer.y];
  };

  this.GetDocViewClientArea = function()
  {
    return [m_DocViewer.x,m_DocViewer.y,m_DocViewer.w,m_DocViewer.h];
  };

  this.GetDocViewClipRect = function()
  {
    return [0,0,this.w,this.h];
    /*
     return [m_DocViewer.x + m_DocViewer.m_docx,
     m_DocViewer.y + m_DocViewer.m_docy,
     Math.min(m_DocViewer.w,m_DocViewer.m_docw),
     Math.min(m_DocViewer.h,m_DocViewer.m_doch)];
     */
  };

  this.InitBook = function (szBookUrl, szSVGUrl, arrStageUris,InitialStageID) {
    if (!m_DocViewer)
      return false;

    //m_DocViewer.StopGoogleMaps();

    if (!szBookUrl)//Kann URL oder buchXML sein
    {
      bansheeTraceOut(this, 'szBookURL == null');
      return false;
    }

    m_DataDir = bansheeIncludeTrailingSlash(szSVGUrl);
    m_StageUrls = arrStageUris;
    m_CurrentStageID = -1;

    if (InitialStageID)
      m_DesiredStageID = parseInt(InitialStageID);
    else
      m_DesiredStageID = -1;



    if (szBookUrl[0] === '<')//Assume XML
    {
      bansheeTraceOut(this, 'Loading book' + ' from XML-Input.');
      this.OnBookLoaded(null, true, szBookUrl);
    }
    else {
      bansheeTraceOut(this, 'Loading book' + ' @ ' + szBookUrl);
      m_BookLoader.LoadText(szBookUrl);
    }
    return true;
  };

  this.OnBookLoaded = function (loader, success, data) {
    m_BookHeader = null;
    m_xmlDoc = null;
    m_BookRoot = null;
    if (!success) {
      this.Clear();
      m_CurrentStageID = -1;
      bansheeTraceOut(this, '.OnBookLoaded :: Error loading bookdata.');
      //ärgerlich :: Firefox hat den xml-content.
      //bansheeReadXML(data,this,this.OnReadBookProps);
      bansheeNotifyOwner(this, this.m_NO_OnBookLoaded, null);
    }
    else {
      m_xmlDoc = bansheeReadXML(data, this, null);
      //Init
      if (!m_xmlDoc) {
        bansheeNotifyOwner(this, this.m_NO_OnBookLoaded, null);
        return;
      }
      m_BookRoot = m_xmlDoc.getElementsByTagName('book')[0];
      if (!m_BookRoot) {
        bansheeNotifyOwner(this, this.m_NO_OnBookLoaded, null);
        return;
      }
      m_BookHeader = new TBookheader();
      var node = m_BookRoot.getAttribute('numStages');
      //#1
      if (node)
        m_BookHeader.m_NumStages = StrToIntDef(node, 0);
      //#2
      node = m_BookRoot.getAttribute('width');
      if (node)
        m_BookHeader.m_Width = StrToFloatDef(node, 256);
      //#3
      node = m_BookRoot.getAttribute('height');
      if (node)
        m_BookHeader.m_Height = StrToFloatDef(node, 256);

      var initialID = 0;
      //#4
      node = m_BookRoot.getAttribute('initialStageId');
      if (node)
        initialID = StrToFloatDef(node, 0);


      if (m_DesiredStageID >= 0 && m_DesiredStageID < m_BookHeader.m_NumStages)
        this.LoadStage(m_DesiredStageID);
      else
        this.LoadStage(initialID);

      //Title
      node = m_BookRoot.getElementsByTagName('title')[0];
      if (node && node.firstChild && node.firstChild.nodeType === 3)//Textnode
        m_BookHeader.m_Title = node.firstChild.nodeValue;

      bansheeTraceOut(this, 'Buch geladen.' + ' Stages:' + this.GetNumStages());
      if (m_StageUrls && m_StageUrls.length !== this.GetNumStages())
        bansheeTraceOut(this, 'Warnung>>' + ' Stages:' + this.GetNumStages() + ' StageURIs:' + m_StageUrls.length);
      bansheeNotifyOwner(this, this.m_NO_OnBookLoaded, m_BookRoot);
    }
  };

  this.LoadStage = function (iID) {//Aggregation der DocView,Klickstellen etc.

    if (m_CurrentStageID === iID)
      return;

    m_CurrentStageID = iID;
    var szFile = '';
    if (m_StageUrls) {
      if (m_CurrentStageID < m_StageUrls.length)
        szFile = m_StageUrls[m_CurrentStageID].toString();
    }
    else {
      if (!m_BookLoader.m_Filename || m_BookLoader.m_Filename.indexOf('.txt') > 0)
        szFile = m_DataDir + 'Stage_' + m_CurrentStageID + '.txt';
      else
        szFile = m_DataDir + m_CurrentStageID;
    }
    bansheeTraceOut(this, 'Loading stage from:' + szFile);
    m_SVGLoader.LoadText(szFile);
    
    //Added by David
    updateStage();
    
    
  };

  this.Clear = function () {
    ResetStreamInfo();
    m_DocViewer.Clear();

    bansheeSafeCall(m_CanvasPainter, 'Clear');
    bansheeSafeCall(m_HotspotsManager, 'Clear');
    bansheeSafeCall(m_OccluderManager, 'Clear');
    bansheeSafeCall(m_ScreenOccluder, 'Clear');
  };

  this.OnClassCreate = function (rootInstance, currInst, lpXMLNode) {
    var szClassname = bansheeGetClassFromXMLElement(lpXMLNode);
    if (szClassname === m_DocViewer.ClassName) {
      m_classesFound[0] = 'Docview:ja';
      m_DocViewer.ReadComponentClass(lpXMLNode);
      return null;//Stop enumeration
    }

    if (m_HotspotsManager && szClassname === m_HotspotsManager.ClassName) {
      m_classesFound[1] = 'Hotspots:ja';
      m_HotspotsManager.ReadComponentClass(lpXMLNode);
      return null;//Stop enumeration
    }
    if (szClassname === null)
      return null;

    return rootInstance;
  };

  this.OnLoaded = function (root) {
    if (!m_BookHeader)
      bansheeTraceOut(this, 'Fehler bei der Initialisierung des Buchs');
    else {
      var szPageInfo = 'No info';//' Seite '+ m_CurrentPageID + '/'+ (m_CurrentPageID + 1)+' ';
      bansheeTraceOut(this, 'StageID:' + m_CurrentStageID + ' \"' + m_BookHeader.m_Title + '\"' + szPageInfo + '[' + m_classesFound + ']');
    }
  };

  this.OnPageStreamLoaded = function (loader, success, data) {
    this.Clear();
    if (!success) {
      this.Invalidate();
      bansheeTraceOut(this, '.OnPageStreamLoaded:: Error loading stage ' + m_CurrentStageID);
      //ärgerlich :: Firefox hat den svg-content.
      //bansheeReadComponent(data,this,this.OnClassCreate);
    }
    else {
      bansheeTraceOut(this, 'Initialisiere Komponenten für Stage ' + m_CurrentStageID);
      bansheeReadComponent(data, this, this.OnClassCreate);
    }

    m_DocViewer.ZoomZero();
    bansheeNotifyOwner(this, this.m_NO_OnStageComplete, success);

  };

  this.GetNumStages = function () {
    return m_BookHeader ? m_BookHeader.m_NumStages : 0;
  };

  this.GetCurrentStage = function () {
    return m_CurrentStageID;
  };

  this.GetContentSize = function () {
    return m_DocViewer.GetContentSize();
  };

  this.GetBookSize = function () {
    return (m_BookHeader) ? [m_BookHeader.m_Width, m_BookHeader.m_Height] : [0, 0];
  };

  //Called in OnSwipe DOCVIEW
  this.OnSwipeNextPrev = function(bNext)
  {
    if (bNext)
      bansheeSafeCall(this.Owner,"DoChangeStage",NEXT_PAGES);
    else
      bansheeSafeCall(this.Owner,"DoChangeStage",PREV_PAGES);
  };

  this.NextPages = function () {

    if (m_CurrentStageID + 1 >= this.GetNumStages())
      return;
    this.LoadStage(m_CurrentStageID + 1);
  };

  this.PrevPages = function () {
    if (m_CurrentStageID - 1 < 0)
      return;
    this.LoadStage(m_CurrentStageID - 1);
  };

  this.GetZoomStride = function()
  {
    return m_DocViewer.GetZoomStride();
  };

  this.ZoomZero = function () {
    m_DocViewer.ZoomZero();
  };

  this.GetZoomZero = function() {
    return m_DocViewer.GetZoomZero();
  };

  this.Zoom = function (zoomLevel) {

    zoomLevel = StrToFloatDef(zoomLevel, m_DocViewer.m_Zoom);

    if (zoomLevel === m_DocViewer.m_Zoom)
      return;
    m_DocViewer.AutoZoom(true, zoomLevel, [this.Banshee.w * 0.5, this.Banshee.h * 0.5]);
  };

  this.GetZoom = function () {
    return m_DocViewer.m_Zoom;
  };

  this.GetMaxZoomFactor = function()
  {
    return m_DocViewer.GetMaxZoomFactor();
  };

  this.GetDocMousePos = function () {
    return m_DocViewer.GetDocMousePos();
  };

  this.Free = function ()
  {
    this.DivCtrl.removeEventListener('keydown',_OnKeydown);
    bansheeFree(this);
  };


  this.Activate = function() { return true; };

  this.GetCanvasPainterMouseMoveDeletes = function () {
    return m_CanvasPainter ? m_CanvasPainter.m_MouseMoveDeletes : false;
  };

  this.SetCanvasPainterMouseMoveDeletes = function (bEnable) {
    if (m_CanvasPainter) {
      m_CanvasPainter.m_MouseMoveDeletes = bEnable;
      m_CanvasPainter.Deselect();
      m_CanvasPainter.Invalidate();
    }
    if (m_CommentsManager)
      m_CommentsManager.m_MouseMoveDeletes = bEnable;
    if (m_OccluderManager)
      m_OccluderManager.m_MouseMoveDeletes = bEnable;
    if(m_ScreenOccluder)
      m_ScreenOccluder.m_MouseMoveDeletes = bEnable;
  };

  this.GetCanvasPainterEnabled = function () {
    return m_CanvasPainter ? m_CanvasPainter.Enabled : false;
  };

  this.SetCanvasPainterEnabled = function (bEnable) {
    if (m_CanvasPainter)
      m_CanvasPainter.SetEnabled(bEnable);
  };

  this.SetCanvasPainterPenColor = function (colorString) {
    if (m_CanvasPainter)
      m_CanvasPainter.m_PenColor.Assign(colorString);
  };

  this.SetCanvasPainterPenThickness = function (dwThickness) {
    if (m_CanvasPainter)
      m_CanvasPainter.m_PenWidth = parseInt(dwThickness);
  };

  this.GetCanvasPainterPenThickness = function () {
    if (m_CanvasPainter)
      return m_CanvasPainter.m_PenWidth;
    else
      return -1;
  };

  this.SetCanvasPainterCursor = function (iNum) {
    m_CanvasPainter.SetCursor(iNum);
  };


  this.SetCanvasPainterVisible = function (bVis) {
    bansheeSafeCall(m_CanvasPainter,'SetVisible',Boolean(bVis));
  };

  this.GetCanvasPainterVisible = function () {
    return m_CanvasPainter?m_CanvasPainter.Visible:false;
  };

  //szMode = 'line' (Default), 'rect'
  this.SetCanvasPainterGeometryMode = function(szMode)
  {
    if (m_CanvasPainter)
      m_CanvasPainter.m_GeometryMode = szMode;
  };

  function _VerifyEmission(main,inst,x,y,w,h)
  {
    //return[x,y];
    var iCnt,startX,badX,badY,size;
     iCnt = bansheeComponentsCount(inst);
     startX = x;
     badX = x;
     badY = y;
     size = main.GetContentSize();

     for (var i = 0; i < iCnt;i++)
     {
     var aComp = inst.Components[i];
      if (Math.round(aComp.wx) == Math.round(badX) && Math.round(aComp.wy) == Math.round(badY))
     {
     badX = Math.round(aComp.wx) + 30;
     badY = Math.round(aComp.wy) + 30;
     if (badY + h > size[1])
     {
     x +=30;
     badX = x;
     badY = y;
     if (badX + w > size[0])
     {
     badX = startX;
     badY = y;
     break;
     }
     }

     }
     }
     return [badX,badY];
  }

  //Comparator func für TDocView-ZoomZero
  //#1 Standard auf dieser Welt
  function CompFitBestMatch(w,h)
  {
    return (w > h)
  }
  //#2 Scookens Extrawurst
  function CompFillClientArea(w,h)
  {
    return (w < h);
  }

  this.SetZoomZeroComparator = function(iMode,bRecalc)
  {
    if (iMode === 0)
      m_DocViewer.m_NO_FitComparator = CompFitBestMatch;
    else
    if (iMode === 1)
      m_DocViewer.m_NO_FitComparator = CompFillClientArea;
    else
      m_DocViewer.m_NO_FitComparator = null;//DocView-Standard impl == Scookens Extrawurst

    if (bRecalc)
      this.ZoomZero();
  };

  //DocView
  this.SetDocViewOffsets = function(x,y,w,h)
  {
    m_DocViewOffsets[0] = StrToFloatDef(x,0);
    m_DocViewOffsets[1] = StrToFloatDef(y,0);
    m_DocViewOffsets[2] = StrToFloatDef(w,0);
    m_DocViewOffsets[3] = StrToFloatDef(h,0);
    this.SetBounds(this.x,this.y,this.w,this.h);
  };

  //Comments
  this.EmitComment = function(x,y,w,h)
  {
    if (m_CommentsManager)
    {
      var pos = _VerifyEmission(this,m_CommentsManager,x,y,w,h);
      m_CommentsManager.EmitComment(pos[0],pos[1],w,h);
    }
  };

  this.EmitHotspot = function(stageID, x, y, userData, numAssets, pivotPoint) {
    if (m_HotspotsManager)
      m_HotspotsManager.EmitHotspot(stageID, x, y, userData, numAssets, pivotPoint);
  };

  //Screen-Occluder
  this.SetScreenOccluderVisible = function (bVis) {
    bansheeSafeCall(m_ScreenOccluder,'SetVisible',Boolean(bVis));
  };
  this.GetScreenOccluderVisible = function () {
    return m_ScreenOccluder?m_ScreenOccluder.Visible:false;
  };
  this.EmitScreenOccluder = function (x,y,w,h) {
    if (m_ScreenOccluder)
      m_ScreenOccluder.EmitScreenOccluder(x,y,w,h);
  };

  //Occluders
  this.SetOccludersVisible = function (bVis)
  {
    bansheeSafeCall(m_OccluderManager,'SetVisible',Boolean(bVis));
  };
  this.GetOccludersVisible = function ()
  {
    return m_OccluderManager?m_OccluderManager.Visible:false;
  };

  this.EmitOccluder = function(x,y,w,h)
  {
    if (m_OccluderManager)
    {
      var pos = _VerifyEmission(this,m_OccluderManager,x,y,w,h);
      m_OccluderManager.EmitOccluder(pos[0],pos[1],w,h);
    }
  };

  //Comments
  this.SetCommentsVisible = function(bVis)
  {
    bansheeSafeCall(m_CommentsManager,'SetVisible',Boolean(bVis));
  };
  this.GetCommentsVisible = function()
  {
    return m_CommentsManager?m_CommentsManager.Visible:false;
  };


  this.OnMouseWheel = function (evt) {
    var a = bansheeGetWheelDelta(evt);
    if (a > 0)
      m_DocViewer.AutoZoom(true);
    else
      m_DocViewer.AutoZoom(false);
  };

  //Canvas-Painter ruft diese Methode bei DoubleTap auf.
  this.PerformGestureZoom = function()
  {
    m_DocViewer.DoGestureCustomZoom();
  };
  //Canvas-Painter ruft diese Methode bei pinchin-out auf.
  this.PerformGesturePinch = function(bOut)
  {
    m_DocViewer.DoGesturePinch();
  };

  this.HideFloatPanels = function(){
    _owner.HideFloatPanels();
  };

  //**********************************************************************************************************
  //Data In-out
  //**********************************************************************************************************

  this.GetUserData = function () {

    var cpData, occData, soData, commentsData, hotspotsData;
    cpData = this.GetCanvasPainterData();
    occData = this.GetOccludersData();
    soData = this.GetScreenOccludersData();
    commentsData = this.GetCommentsData();
    hotspotsData = this.GetHotspotsData();
    if (cpData || occData || soData || commentsData || hotspotsData)
      return JSON.stringify(new TBookviewerUserDataBlob(cpData, occData, soData, commentsData, hotspotsData));
    return null;
  };

  this.SetUserData = function (lpszData) {
    var serObject = null;
    if (lpszData)
    {
      try
      {
        serObject = JSON.parse(lpszData);
      }
      catch(e) {
        //Ignore
      }
    }

    if (serObject)//Hopefully a TBookviewerUserDataBlob object
    {
      this.SetCanvasPainterData(serObject.CanvasPainterData);
      this.SetOccludersData(serObject.OccludersData);
      this.SetScreenOccludersData(serObject.ScreenOccludersData);
      this.SetCommentsData(serObject.CommentsManagerData);
      this.SetHotspotsData(serObject.HotspotsManagerData);
    }
    else
    {
      this.SetCanvasPainterData(null);
      this.SetOccludersData(null);
      this.SetScreenOccludersData(null);
      this.SetCommentsData(null);
      this.SetHotspotsData(null);
    }
  };

  this.GetCanvasPainterData = function() {return m_CanvasPainter ? m_CanvasPainter.GetData() : null;};
  this.SetCanvasPainterData = function(lpszData) { if (m_CanvasPainter) m_CanvasPainter.SetData(lpszData);};

  this.GetOccludersData = function() {return m_OccluderManager ? m_OccluderManager.GetData() : null;};
  this.SetOccludersData = function(lpszData) { if (m_OccluderManager) m_OccluderManager.SetData(lpszData);};

  this.GetScreenOccludersData = function() {return m_ScreenOccluder ? m_ScreenOccluder.GetData() : null;};
  this.SetScreenOccludersData = function(lpszData) { if (m_ScreenOccluder) m_ScreenOccluder.SetData(lpszData);};

  this.GetCommentsData = function() {return m_CommentsManager ? m_CommentsManager.GetData() : null;};
  this.SetCommentsData = function(lpszData) { if (m_CommentsManager) m_CommentsManager.SetData(lpszData);};

  this.GetHotspotsData = function() {return m_HotspotsManager ? m_HotspotsManager.GetData() : null;};
  this.SetHotspotsData = function(lpszData) { if (m_HotspotsManager) m_HotspotsManager.SetData(lpszData);};

  //**********************************************************************************************************
  //Data In-out END
  //**********************************************************************************************************


  this.GetBookHeader = function()
  {
    var result = new TBookheader();
    if (m_BookHeader)
      m_BookHeader.Assign(result);
    return result;
  };

  //Product
  this.OnHotspotSelectionChanged = function (obj, params) {
    bansheeNotifyOwner(this, this.m_NO_OnHotspotSelectionChanged, params);
  };

  this.OnScreenOccluderDeleted = function (obj) {
    bansheeNotifyOwner(this, this.m_NO_OnScreenOccluderDeleted);
  };

  //Register..
  this.Banshee.AddControl(this);
  this.InitializeComponent();
}