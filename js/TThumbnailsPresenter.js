function TMoveLeftButton(owner, parent, banshee) {

}

function TThumbnailsPresenter(owner, parent, banshee) {
  bansheeInitComponent(this, owner, banshee, 'TThumbnailsPresenter');
  bansheeInitVisual(this, parent, false);

  var m_self = this;
  var m_TextureStrips = [];
  var m_DivCtrl = this.DivCtrl;
  var m_DummyTexture;
  var m_Thumbnails = [];
  var m_currentStageID = -1;
  var m_scrollOffset = [0,0];
  var m_dragging = false;
  var m_startCursorInfoX = 0;
  var m_startCursorInfoY = 0;
  var m_startScrollOffsetX = 0;
  var m_startScrollOffsetY = 0;
  var m_presentationMode = 1; //show
  var maxHeight = 0;

  this.m_NO_OnStageChangeRequest = null;
  this.m_NO_OnSyncNeeded = null;

  this.InitializeComponent = function()
  {
    if (this.CanvasCtrl)
      this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;
    this.DivCtrl.style.cssText = CSS_THUMBNAILS_CONTAINER;

    this.DivCtrl.addEventListener('scroll', updateScrollOffset);

    this.Show();

    bansheeSyncSmartLayer(this);
  };

  function updateScrollOffset()
  {
    if (m_self)
    {
      m_scrollOffset[0] = m_self.DivCtrl.scrollLeft;
      m_scrollOffset[1] = m_self.DivCtrl.scrollTop;
      //bansheeTraceOut(m_self,m_scrollOffset[0] + '-'+m_scrollOffset[1]);
      //update...
    }
  }

  this.OnGesture = function (evt) {
    switch (evt.type) {
      case 'dragstart':
        this.BeginDrag(evt);
        break;
      case 'drag':
        this.ContinueDrag(evt);
        break;
      case 'dragend':
        this.EndDrag(evt);
        break;
    }
    return true;
  };

  this.BeginDrag = function(evt) {
    bansheeTraceOut(this, "begin drag");
    m_startCursorInfoX = banshee.GetCursorInfo()[0];
    m_startCursorInfoY = banshee.GetCursorInfo()[1];

    m_startScrollOffsetX = this.GetScrollOffset()[0];
    m_startScrollOffsetY = this.GetScrollOffset()[1];

    m_dragging = true;
  };

  this.ContinueDrag = function(evt) {
    if (m_dragging) {
      var cursorInfo = banshee.GetCursorInfo();

      var dx = cursorInfo[0] - m_startCursorInfoX;
      var dy = cursorInfo[1] - m_startCursorInfoY;

      var scrollOffsetX = m_startScrollOffsetX - dx;
      var scrollOffsetY = m_startScrollOffsetY - dy;

      this.SetScrollOffset(scrollOffsetX, scrollOffsetY);
    }
  };

  this.EndDrag = function(evt) {
    bansheeTraceOut(this, "end drag");
    m_dragging = false;
  };

  function createThumbnails() {
    var textures = getTextures();

    var iCnt = textures.length;
    for (var i=0; i<iCnt; i++) {
      var texture = textures[i];

      var thumbnail = new TThumbnail(m_self, m_self.DivCtrl, m_self.Banshee);
      m_Thumbnails.push(thumbnail);
      thumbnail.m_NO_OnStageChangeRequest = 'OnStageChangeRequest';
      thumbnail.m_NO_OnBeginDrag = 'BeginDrag';
      thumbnail.m_NO_OnContinueDrag = 'ContinueDrag';
      thumbnail.m_NO_OnEndDrag = 'EndDrag';
      thumbnail.SetTexture(texture);
      thumbnail.SetStageNumber(i);
      if (i===0) { // empty left page and cover
        thumbnail.SetShowLeftPageLabel(false);
        thumbnail.SetShowRightPageLabel(false);
      }
      if (i===1) // page zero and first page
        thumbnail.SetShowLeftPageLabel(false);
      if (i===iCnt-1) // last page and empty right page
        thumbnail.SetShowRightPageLabel(false);
    }
  }

  this.OnLoaded = function() {
    createThumbnails();
    bansheeSyncSmartLayer(this);
  };

  //return x,y offset (child-clipping, Hit-Detection etc.)
  this.GetScrollOffset = function()
  {
    return m_scrollOffset;
  };

  this.SetScrollOffset = function(scrollOffsetX, scrollOffsetY)
  {
    this.DivCtrl.scrollLeft = scrollOffsetX;
    this.DivCtrl.scrollTop = scrollOffsetY;
  };

  this.Clear = function()
  {
    var iCnt = m_Thumbnails.length;
    for(var i=0; i<iCnt; i++) {
      bansheeSafeCall(m_Thumbnails[i],'Free');
    }

    m_TextureStrips = [];
    m_Thumbnails = [];
    m_currentStageID = -1;
  };

  this.SetCSSStyle = function(szTemplate)
  {
    if (this.CanvasCtrl)
      this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;
    this.DivCtrl.style.cssText += szTemplate;
    bansheeSyncSmartLayer(this);
  };

  this.Free = function()
  {
    m_self = null;
    this.DivCtrl.removeEventListener('scroll',__OnTThumbnailsPresenterScroll);
    bansheeFree(this);
  };

  this.OnClassCreate = function(rootInstance, currInst, lpXMLNode)
  {
    if (lpXMLNode.nodeName === 'image') {
      var textureStrip = new TTextureStrip(rootInstance, rootInstance.DivCtrl, rootInstance.Banshee);
      m_TextureStrips.push(textureStrip);
      return textureStrip;
    }
    else
      return rootInstance;
  };

  this.ReadComponentClass = function(lpXMLNode)
  {
    if (bansheeGetClassFromXMLElement(lpXMLNode) === this.ClassName)
    {
      this.Clear();
      bansheeReadComponentClass(this, lpXMLNode, this.OnClassCreate);
    }
  };

  function getTextures(){
    var allTextures = [];

    for (var i=0; i<m_TextureStrips.length; i++) {
      var t = m_TextureStrips[i];
      var textures = t.GetTextures();
      for (var j=0; j< textures.length; j++) {
        var texture = textures[j];
        allTextures.push(texture);
      }
    }

    return allTextures;
  };

  this.SetCurrentStage = function(stageID) {
    if (m_currentStageID !== -1 )
      m_Thumbnails[m_currentStageID].UnsetCurrent();

    if (stageID !== -1 && m_Thumbnails[stageID] === undefined) {
      bansheeTraceOut(this, "No thumbnail for stage ID " + stageID + " found.");
      return;
    }

    m_currentStageID = stageID;

    if (m_currentStageID !== -1 ) {
      m_Thumbnails[m_currentStageID].SetCurrent();
      scrollToStage(m_currentStageID);
    }
  };

  function scrollToStage(stageID) {
    if (stageID === -1)
      return;

    var stageBoundingRect = m_Thumbnails[stageID].GetBoundingRect();

    // scroll right
    var stageOffsetRight = stageBoundingRect.x + stageBoundingRect.w;
    if (stageOffsetRight > m_self.w + m_scrollOffset[0]) {
      m_self.DivCtrl.scrollLeft = stageOffsetRight - m_self.w + THUMBNAIL_OVERFLOW_WIDTH;
    }

    // scroll left
    var stageOffsetLeft = stageBoundingRect.x;
    if (stageOffsetLeft < m_scrollOffset[0]) {
      m_self.DivCtrl.scrollLeft = stageOffsetLeft - THUMBNAIL_OVERFLOW_WIDTH;
    }

    // scroll down
    var stageOffsetBottom = stageBoundingRect.y + stageBoundingRect.h;
    if (stageOffsetBottom > m_self.h + m_scrollOffset[1]) {
      m_self.DivCtrl.scrollTop = stageOffsetBottom - m_self.h + THUMBNAIL_OVERFLOW_HEIGHT;
    }

    // scroll up
    var stageOffsetTop = stageBoundingRect.y;
    if (stageOffsetTop < m_scrollOffset[1]) {
      m_self.DivCtrl.scrollTop = stageOffsetTop - THUMBNAIL_OVERFLOW_HEIGHT;
    }

    updateScrollOffset();
  }

  this.Show = function() {
    m_presentationMode = 0;
    updateStyleForPresentationMode(this);
    scrollToStage(m_currentStageID);
    syncComponents(m_self);
  };

  this.Maximize = function() {
    m_presentationMode = 1;
    updateStyleForPresentationMode(this);
    scrollToStage(m_currentStageID);
    syncComponents(m_self);
  };

  function syncComponents(inst) {
    bansheeSyncSmartLayer(inst);
    bansheeNotifyOwner(inst, inst.m_NO_OnSyncNeeded, null);
    var iCnt = m_Thumbnails.length;
    for(var i=0; i<iCnt; i++) {
      bansheeSafeCall(m_Thumbnails[i], 'SyncBanshee');
    }
  }

  this.HitTest = function (x, y) {
    return bansheeUIHitTest(this, x - m_scrollOffset[0], y - m_scrollOffset[1]);
  };

  function updateStyleForPresentationMode(inst) {
    switch (m_presentationMode) {
      case 0: // show
        inst.DivCtrl.style.cssText = CSS_THUMBNAILS_CONTAINER + CSS_THUMBNAILS_CONTAINER_VISIBLE;
        inst.DivCtrl.style.height = CSS_SCROLL_VIEWER_CONTAINER_COLLAPSED_HEIGHT;
        break;
      case 1: // maximize
        inst.DivCtrl.style.cssText = CSS_THUMBNAILS_CONTAINER_OVERVIEW;
        inst.DivCtrl.style.height = Math.abs(maxHeight) - parseFloat(inst.DivCtrl.style.marginTop) - parseFloat(inst.DivCtrl.style.marginBottom) + 'px';
        break;
    }
    bansheeSyncSmartLayer(inst);
  }

  this.OnStageChangeRequest = function(e, stageNumber) {
    bansheeNotifyOwner(this, this.m_NO_OnStageChangeRequest, stageNumber);
  };

  this.SetVisible = function (bVis) {
    bansheeSetVisible(this,bVis)
  };

  this.SetEnabled = function (bEnabled) {
    bansheeSetEnabled(this, bEnabled);
  };

  this.SetBounds = function (x, y, w, h) {
    bansheeSetBounds(this, x, y, w, h);
  };

  this.SetMaxHeight = function(_maxHeight){
    maxHeight = _maxHeight;
  };


  //Sync
  this.OnStageSizeChanged = function(wh)
  {
    updateStyleForPresentationMode(this); // This is a workaround that's only needed because there is code messing
                                          // with the banshee size when the browser window is resized. Without it,
                                          // the thumbnail overview doesn't scale with the underlying bookviewer.
    bansheeSyncSmartLayer(this);
    m_scrollOffset[0] = m_self.DivCtrl.scrollLeft;
    m_scrollOffset[1] = m_self.DivCtrl.scrollTop;
  };



  this.Banshee.AddControl(this);
  this.InitializeComponent();
}