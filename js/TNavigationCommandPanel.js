function TNavigationCommandPanel(_owner,_parent, _banshee) {
  bansheeInitComponent(this, _owner, _banshee, 'TNavigationCommandPanel');
  bansheeInitVisual(this, _parent, false);

  //NotifyOwner function(s)
  this.NO_OnCommand = null;
  this.NO_OnGoToPage = null;

  //***********************************

  this.CurrCommand = null;

  var bDisplayModal = false;

  this.CommandComponent = null;//Current Click-Component

  var m_Decorator = null;
  var m_PageSelector = null;
  var m_VersionSelector = null;

  this.InitializeComponent = function () {
    m_Decorator = new TCreatorDecorator(null, this.DivCtrl, _banshee);
    m_Decorator.SetVisible(false);

    var prevPageCommandData = new TCommandPanelData();
    prevPageCommandData.m_Command = 'Prev';
    prevPageCommandData.m_IconString = '&#58945;';
    prevPageCommandData.m_NumFramesX = 4;
    prevPageCommandData.m_Hint = 'Vorherige Seite';
    prevPageCommandData.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    prevPageCommandData.m_AutoFormat = false;
    prevPageCommandData.m_ColorScheme = [CONST_ICON_PAGE, CONST_ICON_BG_PAGE];
    createSmartLayer(this, prevPageCommandData);

    var homeCommandData = new TCommandPanelData();
    homeCommandData.m_Command = 'Home';
    homeCommandData.m_IconString = '&#58972;';
    homeCommandData.m_NumFramesX = 4;
    homeCommandData.m_Hint = 'Zur ersten Seite';
    homeCommandData.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    homeCommandData.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    createSmartLayer(this, homeCommandData);

    m_PageSelector = new TPageSelector(this, this.DivCtrl, this.Banshee);
    m_PageSelector.NO_OnGoToPage = 'OnGoToPage';

    var thumbnailsCommandData = new TCommandPanelData();
    thumbnailsCommandData.m_Command = 'Thumbnails';
    thumbnailsCommandData.m_IconString = '&#58912;';
    thumbnailsCommandData.m_NumFramesX = 4;
    thumbnailsCommandData.m_Hint = 'Schnellnavigation ein-/ ausblenden';
    thumbnailsCommandData.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    thumbnailsCommandData.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    createSmartLayer(this, thumbnailsCommandData);

    m_VersionSelector = new TVersionSelector(this, this.DivCtrl, this.Banshee);
    m_VersionSelector.NO_OnSelectVersion = 'OnSelectVersion';
    m_VersionSelector.m_Command = 'Select Version';

    /*var versionCommandData = new TCommandPanelData();
    versionCommandData.m_Command = 'SwitchBookVersion';
    versionCommandData.m_IconString = '&#58921;';
    versionCommandData.m_IconStringInactive = '&#58920;';
    versionCommandData.m_NumFramesX = 4;
    versionCommandData.m_Hint = 'Lehrer-/ Schülerfassung umschalten';
    versionCommandData.m_cssClass = CSS_DEFAULT_BUTTON + CSS_VERSION_BUTTON_SIZE;
    versionCommandData.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    createSmartLayer(this, versionCommandData);*/

    var nextPageCommandData = new TCommandPanelData();
    nextPageCommandData.m_Command = 'Next';
    nextPageCommandData.m_IconString = '&#58946;';
    nextPageCommandData.m_NumFramesX = 4;
    nextPageCommandData.m_Hint = 'Nächste Seite';
    nextPageCommandData.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    nextPageCommandData.m_AutoFormat = false;
    nextPageCommandData.m_ColorScheme = [CONST_ICON_PAGE, CONST_ICON_BG_PAGE];
    createSmartLayer(this, nextPageCommandData);

    this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;
    this.DivCtrl.style.cssText += CSS_NAVIGATIONPANELHORIZONTAL;

    bansheeSyncSmartLayer(this);
  };

  function _getCommandIdx(o,szCMD) {
    var i, iCount = bansheeComponentsCount(o);
    for (i = 0; i < iCount; i++)
      if (o.Components[i].m_Command == szCMD)
        return i;
    return -1;
  }

  this.Free = function()
  {
    bansheeFree(this);
  };

  var m_AnimController = null;
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
    else {
      m_Decorator.SetVisible(bVis);
      bansheeSetVisible(this, bVis);
    }
    bDisplayModal = bModal;
  };

  this.HitTest = function (x,y) {
    return bansheeUIHitTest(this,x,y,bDisplayModal);
  };

  this.OnMouseClick = function()
  {
    if (bDisplayModal)
      this.SetVisible(false);
  };

  function createSmartLayer(inst, commandData) {
    var smartLayer = new TSmartLayer(inst, inst.DivCtrl, inst.Banshee);
    //Verbinde das OnClick-Event
    smartLayer.NO_OnMouseClick = 'btnClicked';
    smartLayer.m_Command = commandData.m_Command;
    smartLayer.m_NO_OnRenderCanvas = inst.OnRenderChildCanvas;

    if (commandData.m_ImageUrl) {
      smartLayer.m_paintColor = null;
      smartLayer.AssignMedia(commandData.m_ImageUrl,1);
    }

    //Overlay CMD Buttons
    var icon = document.createElement('p');
    icon.innerHTML = commandData.m_IconString;
    icon.style.cssText = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    smartLayer.DivCtrl.appendChild(icon);

    smartLayer.SetEnabled(true);
    smartLayer.SetCursor(-21);//Click
    bansheeSenderCall(inst, smartLayer, 'SetHint', commandData.m_Hint);
    smartLayer.SetTextureFrames(commandData.m_NumFramesX, commandData.m_NumFramesY);
    smartLayer.SetCSSStyle(commandData.m_cssClass);
    smartLayer.SetColorScheme(commandData.m_ColorScheme[0], commandData.m_ColorScheme[1]);
    smartLayer.Tag = commandData.m_Tag;
    smartLayer.IconString = commandData.m_IconString;
    smartLayer.IconStringInactive = commandData.m_IconStringInactive;

    if (!commandData.m_AutoFormat)
    {
      smartLayer.UserData = 'no align';
    }
  }

  this.SetLeftPageNum = function(leftPageNum) {
    m_PageSelector.SetLeftPageNum(leftPageNum);
  };

  this.SetRightPageNum = function(rightPageNum) {
    m_PageSelector.SetRightPageNum(rightPageNum);
  };

  this.OnGoToPage = function(o, e) {
    bansheeNotifyOwner(this, this.NO_OnGoToPage, e);
  };

  this.OnSelectVersion = function(o, e) {
    bansheeNotifyOwner(this, this.NO_OnSelectVersion, e);
  };

  this.DisplayTextCommands = function()
  {
    var i,iCount;
    iCount = bansheeComponentsCount(this);
    for (i = 0;i < iCount;i++ )
      this.Components[i].SetText(this.Components[i].m_Command);
  };

  this.SetDecorationOrientation = function(orientation) {
    m_Decorator.SetOrientation(orientation);
    m_Decorator.SetVisible(true);
  };

  this.SetAlign = function (iMode) {
    this.m_Align = iMode;
    this.UpdateAlign();
  };

  this.OnStageSizeChanged = function () {
    this.UpdateAlign();
  };

  this.Invalidate = function () {
  };

  this.SetBounds = function (x, y, w, h) {
    bansheeSetBounds(this, x, y, w, h);
    //bansheeClipView(this,0,0,w,h);
  };

  this.TopDown = function () {
  };

  this.LeftRight = function (bClamp) {
  };

  this.UpdateAlign = function () {
    if (this.CanvasCtrl)
      this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;
  };

  //Product
  this.btnClicked = function (obj) {
    this.CommandComponent = obj;
    this.CurrCommand = obj.m_Command;
    bansheeNotifyOwner(this, this.NO_OnCommand, this.CurrCommand);
    this.CommandComponent = null;
  };

  this.ButtonCheck = function( command,bCheck) {
    var iIdx = _getCommandIdx(this,command);
    if (iIdx < 0)
      return;
    this.Components[iIdx].setChecked(bCheck);
  };

  this.ButtonEnable = function( command,bEnable) {
    var iIdx = _getCommandIdx(this,command);
    if (iIdx < 0)
      return;
    this.Components[iIdx].SetEnabled(bEnable);
  };

  this.ButtonSetHint = function( command, hint) {
    var iIdx = _getCommandIdx(this,command);
    if (iIdx < 0)
      return;
    this.Components[iIdx].SetHint(hint);
  };

  this.ButtonSetCSS = function( command, css) {
    var iIdx = _getCommandIdx(this,command);
    if (iIdx < 0)
      return;
    this.Components[iIdx].SetCSSStyle(css);
  };

  this.VersionButtonSetCSS = function(css){
    m_VersionSelector.DivCtrl.style.cssText = css;
  };

  this.SetVersionButtonState = function(versionButtonState, isTeacherVersion){
    m_VersionSelector.SetVersionButtonState(versionButtonState, isTeacherVersion);
  };

  this.StartAnimation = function(iMode)
  {
    switch (iMode)
    {
      case 0 :  m_AnimController = null;
        this.Banshee.RemoveAnimControl(this);
        break;
      //Show
      case 1 :  m_AnimController = new TAnimController(this,150,{Opacity:1});
        bansheeSetVisible(this,true);
        this.Banshee.AddAnimControl(this);
        break;
      //Hide
      case 2 :  m_AnimController = new TAnimController(this,10,{Opacity:0});
        bansheeSetVisible(this,true);
        this.Banshee.AddAnimControl(this);
        break;
    }
  };

  this.OnAnimationDone = function()
  {
    if (m_AnimController)
    {
      if (!m_AnimController.Animate())
      {
        this.StartAnimation(0);
        if (this.Opacity < 0.1)
          bansheeSetVisible(this,false);
      }
    }
    else
      this.StartAnimation(0);
  };

  this.Banshee.AddControl(this);
  this.InitializeComponent();
}