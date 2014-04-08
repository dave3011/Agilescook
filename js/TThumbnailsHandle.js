function TThumbnailsHandle(owner, parent, banshee) {
  bansheeInitComponent(this, owner, banshee, 'TThumbnailsHandle');
  bansheeInitVisual(this, parent, false);

  this.m_NO_OnShowThumbnails = null;
  this.m_NO_OnHideThumbnails = null;
  this.Cursor = -21;

  var m_anchor = null;
  var m_anchorIcon = null;
  var m_thumbnailsVisible = true;

  var MAXIMIZE = 'ausblenden';
  var SHOW = 'erweitern';

  var minimizeIcon = '&#58939;';
  var restoreIcon = '&#58940;';

  this.InitializeComponent = function()
  {
    if (this.CanvasCtrl)
      this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;
    this.DivCtrl.style.cssText = CSS_THUMBNAILS_HANDLE;

    m_anchor = document.createElement("a");
    m_anchor.innerHTML = SHOW;
    this.DivCtrl.appendChild(m_anchor);

    m_anchorIcon = document.createElement("a");
    m_anchorIcon.innerHTML = minimizeIcon;
    this.DivCtrl.appendChild(m_anchorIcon);

    m_anchor.style.cssText = CSS_THUMBNAIL_HANDLE_TEXT;
    m_anchorIcon.style.cssText = CSS_THUMBNAIL_HANDLE_ICON;

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
    if (m_thumbnailsVisible) {
      bansheeNotifyOwner(self, self.m_NO_OnMaximizeThumbnails);
    } else {
      bansheeNotifyOwner(self, self.m_NO_OnHideThumbnails);
    }
    bansheeSyncSmartLayer(self);
  };

  this.Show = function(){
    m_anchor.innerHTML = SHOW;
    m_anchorIcon.innerHTML = minimizeIcon;
    m_thumbnailsVisible = true;
    bansheeSyncSmartLayer(this);
  };

  this.Maximize = function(){
    m_anchor.innerHTML = MAXIMIZE;
    m_anchorIcon.innerHTML = restoreIcon;
    m_thumbnailsVisible = false;
    bansheeSyncSmartLayer(this);
  };

  this.SyncBanshee = function() {
    bansheeSyncSmartLayer(this);
  };

  this.Banshee.AddControl(this);
  this.InitializeComponent();
}
