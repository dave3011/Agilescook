function TGlobalView(_owner, _parent, _banshee) {
  bansheeInitComponent(this, _owner, _banshee, 'TGlobalView');
  bansheeInitVisual(this,_parent,false);

  var m_SVGLoader = new TBansheeTextLoader(this, null, 'OnGlobalViewStreamLoaded');
  var m_ScrollViewerContainer = null;
  var bDisplayModal = false;

  this.m_NO_OnStageChangeRequest = null;

  this.InitializeComponent = function()
  {
    m_ScrollViewerContainer = new TScrollViewerContainer(this, this.DivCtrl, _banshee);
    m_ScrollViewerContainer.m_NO_OnStageChangeRequest = 'OnStageChangeRequest';
    m_ScrollViewerContainer.m_NO_OnHideThumbnails = 'OnHideThumbnails';
  };

  this.Load = function(globalViewURL) {
    m_SVGLoader.LoadText(globalViewURL);
  };

  this.Clear = function()
  {
    m_ScrollViewerContainer.Clear();
  };

  this.SetCurrentStage = function(currentStageID) {
    m_ScrollViewerContainer.SetCurrentStage(currentStageID);
  };

  this.OnGlobalViewStreamLoaded = function(loader, success, data)
  {
    this.Clear();
    if (!success)
    {
      bansheeTraceOut(this, '.OnGlobalViewStreamLoaded:: Error loading global view');
    }
    else
    {
      bansheeTraceOut(this, 'Initialisiere Komponenten für global view');
      bansheeReadComponent(data, this, this.OnClassCreate);
    }

    bansheeNotifyOwner(this, this.m_NO_OnGlobalViewComplete, success);
  };

  this.OnClassCreate = function(rootInstance, currInst, lpXMLNode)
  {
    var szClassname = bansheeGetClassFromXMLElement(lpXMLNode);

    m_ScrollViewerContainer.OnClassCreate(rootInstance, currInst, lpXMLNode);

    if (szClassname === null)
      return null;

    return rootInstance;
  };

  this.OnStageChangeRequest = function(e, stageNumber) {
    bansheeNotifyOwner(this, this.m_NO_OnStageChangeRequest, stageNumber);
  };

  this.OnHideThumbnails = function(sender) {
    bansheeNotifyOwner(this, this.m_NO_OnHideThumbnails);
  };

  this.Free = function()
  {
    bansheeFreeComponents(this);
  };

  this.SetVisible = function (bVis,bModal) {

    var bUseOpacityAnim = false;//Activate Opacity Anim, or not.

    if (bUseOpacityAnim)
    {
      if (bVis == this.Visible)
        return;

      if (bVis)
        this.StartAnimation(1);//Show
      else
        this.StartAnimation(2);//Hide
    }
    else
      bansheeSetVisible(this,bVis);
      m_ScrollViewerContainer.OnShowThumbnails(this);
    bDisplayModal = bModal;
  };

  this.SetScrollViewerContainerCSS = function(css){
    m_ScrollViewerContainer.SetCSSStyle(css);
    m_ScrollViewerContainer.OnShowThumbnails();
  };

  this.SetMaxHeight = function(maxHeight){
    m_ScrollViewerContainer.SetMaxHeight(maxHeight);
  };

  this.Banshee.AddControl(this);
  this.InitializeComponent();
}