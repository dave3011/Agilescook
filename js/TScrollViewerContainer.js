function TScrollViewerContainer(owner, parent, banshee)
{
  bansheeInitComponent(this, owner, banshee, 'TScrollViewerContainer');
  bansheeInitVisual(this, parent, false);

  this.m_NO_OnStageChangeRequest = null;

  var m_ThumbnailsPresenter = null;
  var m_ThumbnailsHandle = null;
  var m_classesFound = ['ThumbnailsPresenter:nein'];

  this.InitializeComponent = function()
  {
    if (this.CanvasCtrl)
    this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;
    this.DivCtrl.style.cssText = CSS_SCROLL_VIEWER_CONTAINER + CSS_SCROLLBAR + CSS_BOX_SHADOW;

    m_ThumbnailsPresenter = new TThumbnailsPresenter(this,this.DivCtrl, this.Banshee);
    m_ThumbnailsPresenter.m_NO_OnStageChangeRequest = 'OnStageChangeRequest';
    m_ThumbnailsPresenter.m_NO_OnSyncNeeded = 'OnSyncNeeded';

    m_ThumbnailsHandle = new TThumbnailsHandle(this, this.DivCtrl, this.Banshee);
    m_ThumbnailsHandle.m_NO_OnShowThumbnails = 'OnShowThumbnails';
    m_ThumbnailsHandle.m_NO_OnMaximizeThumbnails = 'OnMaximizeThumbnails';
    m_ThumbnailsHandle.m_NO_OnHideThumbnails = 'OnHideThumbnails';
  };

  this.SetCurrentStage = function(currentStageID) {
    m_ThumbnailsPresenter.SetCurrentStage(currentStageID);
  };

  function ResetStreamInfo() {
    m_classesFound = ['ThumbnailsPresenter:nein'];
  };

  this.Clear = function() {
    ResetStreamInfo();
  };

  this.OnClassCreate = function(rootInstance, currInst, lpXMLNode)
  {
    var szClassname = bansheeGetClassFromXMLElement(lpXMLNode);

    if (szClassname === m_ThumbnailsPresenter.ClassName)
    {
      m_classesFound[0] = 'ThumbnailsPresenter:ja';
      m_ThumbnailsPresenter.ReadComponentClass(lpXMLNode);
      return null;//Stop enumeration
    }

    if (szClassname === null)
      return null;

    return rootInstance;
  };

  this.OnShowThumbnails = function(sender) {
    m_ThumbnailsPresenter.Show();
    m_ThumbnailsHandle.Show();
  };

  this.OnMaximizeThumbnails = function(sender) {
    m_ThumbnailsPresenter.Maximize();
    m_ThumbnailsHandle.Maximize();
  };

  this.OnHideThumbnails = function(sender) {
    bansheeNotifyOwner(this, this.m_NO_OnHideThumbnails);
  };

  this.OnStageChangeRequest = function(e, stageNumber) {
    bansheeNotifyOwner(this, this.m_NO_OnStageChangeRequest, stageNumber);
    this.OnShowThumbnails(this); // when opening a stage from the thumbnail overview, switch that back to normal
  };

  this.OnSyncNeeded = function() {
    bansheeSyncSmartLayer(this);
    m_ThumbnailsHandle.SyncBanshee();
  };

  this.Free = function()
  {
    bansheeFreeComponents(this);
  };

  this.SetVisible = function(visible){
    if(visible == true){
      this.DivCtrl.style.cssText = CSS_SCROLL_VIEWER_CONTAINER_COLLAPSED;
    }
    else{
      this.DivCtrl.style.cssText = CSS_SCROLL_VIEWER_CONTAINER;
    }
  };

  this.SetCSSStyle = function(szTemplate)
  {
    this.DivCtrl.style.cssText += szTemplate;
    bansheeSyncSmartLayer(this);
  };

  this.SetMaxHeight = function(maxHeight){
    m_ThumbnailsPresenter.SetMaxHeight(maxHeight);
  };

  this.HitTest = function (x, y) {
    return bansheeUIHitTest(this,x,y);
  };

  this.Banshee.AddControl(this);
  this.InitializeComponent();
}
