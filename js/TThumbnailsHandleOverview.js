function TThumbnailsHandleOverview(owner, parent, banshee) {
  bansheeInitComponent(this, owner, banshee, 'TThumbnailsHandleOverview');
  bansheeInitVisual(this, parent, false);

  this.m_NO_OnMaximizeThumbnails = null;
  this.m_NO_OnShowThumbnails = null;
  this.Cursor = -21;

  var m_anchor = null;
  var m_thumbnailsOverviewVisible = false;

  var MAXIMIZE = 'Übersicht anzeigen';
  var SHOW = 'Übersicht ausblenden';


  this.InitializeComponent = function()
  {
    if (this.CanvasCtrl)
      this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;
    this.DivCtrl.style.cssText = CSS_THUMBNAILS_HANDLE_OVERVIEW;

    m_anchor = document.createElement("a");
    m_anchor.innerHTML = MAXIMIZE;
    this.DivCtrl.appendChild(m_anchor);

    m_anchor.style.cssText = CSS_THUMBNAIL_HANDLE_TEXT;
      
    bansheeSyncSmartLayer(this);
  };
    
  this.HitTest = function (x, y) {
      return bansheeUIHitTest(this, x, y);
  };

  this.OnMouseClick = function (e) {
    toggleThumbnails(this);
  };

  this.OnGesture = function (evt) {
    if (evt.type === 'tap')
      toggleThumbnails(this);
    return true;
  };

  function toggleThumbnails(self) {
    if (m_thumbnailsOverviewVisible) {
      bansheeNotifyOwner(self, self.m_NO_OnShowThumbnails);
    } else {
      bansheeNotifyOwner(self, self.m_NO_OnMaximizeThumbnails);
    }
    bansheeSyncSmartLayer(self);
  };

  this.Show = function(){
    m_anchor.innerHTML = MAXIMIZE;
    m_thumbnailsOverviewVisible = false;
    bansheeSyncSmartLayer(this);
  };

  this.Hide = function(){
    m_anchor.innerHTML = MAXIMIZE;
    m_thumbnailsOverviewVisible = false;
    bansheeSyncSmartLayer(this);
  };

  this.Maximize = function(){
    m_anchor.innerHTML = SHOW;
    m_thumbnailsOverviewVisible = true;
    bansheeSyncSmartLayer(this);
  };

  this.SyncBanshee = function() {
    bansheeSyncSmartLayer(this);
  };

  this.Banshee.AddControl(this);
  this.InitializeComponent();
}
