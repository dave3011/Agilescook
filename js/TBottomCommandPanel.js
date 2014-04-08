function TBottomCommandPanel(_owner,_parent, _banshee) {
  bansheeInitComponent(this, _owner, _banshee, 'TBottomCommandPanel');
  bansheeInitVisual(this, _parent, false);

  //NotifyOwner function(s)
  this.NO_OnCommand = null;
  this.NO_OnGoToPage = null

  //***********************************

  this.CurrCommand = null;

  var bDisplayModal = false;

  this.CommandComponent = null;//Current Click-Component

  var m_Decorator = null;
  var m_PageSelector = null;

  this.InitializeComponent = function () {
    m_Decorator = new TCreatorDecorator(null, this.DivCtrl, _banshee);
    m_Decorator.SetVisible(false);

    var thumbnailsCommandData = new TCommandPanelData();
    thumbnailsCommandData.m_Command = 'Home';
    thumbnailsCommandData.m_IconString = '&#58941;';
    thumbnailsCommandData.m_NumFramesX = 4;
    thumbnailsCommandData.m_Hint = 'Zur ersten Seite';
    thumbnailsCommandData.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    thumbnailsCommandData.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    createSmartLayer(this, thumbnailsCommandData);

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

    var zoomInCommandData = new TCommandPanelData();
    zoomInCommandData.m_Command = 'ZoomIn';
    zoomInCommandData.m_IconString = '&#58924;';
    zoomInCommandData.m_NumFramesX = 4;
    zoomInCommandData.m_Hint = 'Vergrößern';
    zoomInCommandData.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    zoomInCommandData.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    createSmartLayer(this, zoomInCommandData);

    var zoomOutCommandData = new TCommandPanelData();
    zoomOutCommandData.m_Command = 'ZoomOut';
    zoomOutCommandData.m_IconString = '&#58923;';
    zoomOutCommandData.m_NumFramesX = 4;
    zoomOutCommandData.m_Hint = 'Verkleinern';
    zoomOutCommandData.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    zoomOutCommandData.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    createSmartLayer(this, zoomOutCommandData);

    var fitCommandData = new TCommandPanelData();
    fitCommandData.m_Command = 'Fit';
    fitCommandData.m_IconString = '&#58922;';
    fitCommandData.m_NumFramesX = 4;
    fitCommandData.m_Hint = 'Buch einpassen';
    fitCommandData.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    fitCommandData.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    createSmartLayer(this, fitCommandData);

    this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;
    this.DivCtrl.style.cssText += CSS_BOTTOMPANEL;
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
  }

  this.OnRenderChildCanvas = function(layer,canvas)
  {
    if (!(layer.Tag instanceof Array))
      return;

    var color = layer.Tag[0];
    var thickness = layer.Tag[1];
    var w = layer.w;
    var h = layer.h;

    var iconPoints = [
      [(w / 3) + (thickness / 4), (h / 2) - (thickness / 3)],
      [(w - w / 3) + (thickness / 4), (h / 2) - (thickness / 3)],
      [(w - w / 3) - (thickness / 4), (h / 2) + (thickness / 3)],
      [(w / 3) - (thickness / 4), (h / 2) + (thickness / 3)]
    ];

    canvas.beginPath();
    canvas.moveTo(iconPoints[0][0], iconPoints[0][1]);
    canvas.lineTo(iconPoints[1][0], iconPoints[1][1]);
    canvas.lineTo(iconPoints[2][0], iconPoints[2][1]);
    canvas.lineTo(iconPoints[3][0], iconPoints[3][1]);
    canvas.lineTo(iconPoints[0][0], iconPoints[0][1]);
    canvas.closePath();
    canvas.lineWidth = 2;
    canvas.fillStyle = color;
    canvas.fill();
    canvas.strokeStyle = '#ffffff';
    canvas.stroke();
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