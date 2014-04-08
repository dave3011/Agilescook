// 0(BANSHEE) Banshee-JS
//    1(BookEditorView) a.k.a. MainLayer
//          2(BookViewer)
//              3(DocViewer)
//                  4(MipmapPresenter 0)
//                  4(MipmapPresenter N-1)
//              3(TCanvasPainter) You're here
//                --Custom List of Geometry (TPolyline)
//          2(TCommandPanel) Left  You're here
//          2(TCommandPanel) Right ..or here

//Value-Object zur Initialisierung der Buttons
function TCommandPanelData()
{
  this.m_Command = null;
  this.m_ImageUrl = null;
  this.m_Hint = null;
  this.m_cssClass = null;
  this.m_NumFramesX = 1;
  this.m_NumFramesY = 1;
  this.m_AutoFormat = true;//Default
  this.m_Tag = null;
  this.m_IconString = '';
  this.m_ColorScheme = null;
  this.m_Decorator = '';
  this.m_IconCssClass = null;
}

function TCommandPanel(_owner,_parent, _banshee) {
    bansheeInitComponent(this, _owner, _banshee,'TCommandPanel');
    bansheeInitVisual(this,_parent,false);

    //NotifyOwner function(s)
    this.NO_OnCommand = null;

    this.NO_OnGoToPage = null;

    //***********************************

    this.m_Align = 0;//top

    this.m_Constraints = [0, 0, 50, 50];

    this.CurrCommand = null;

    this.FillStyle = 'red';

    this.Margins = [0,0,0,0];

    var arrControlSizes = [32, 32];
    var bDisplayModal = false;

    this.CommandComponent = null;//Current Click-Component

    var m_Decorator = null;

  function _getCommandIdx(o,szCMD) {
    var i, iCount = bansheeComponentsCount(o);
    for (i = 0; i < iCount; i++)
      if (o.Components[i].m_Command == szCMD)
        return i;
    return -1;
  }

  this.GetCommandObject =function(o,szCMD) {
    var i, iCount = bansheeComponentsCount(o);
    for (i = 0; i < iCount; i++)
      if (o.Components[i].m_Command == szCMD)
        return o.Components[i];
    return -1;
  };

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

    this.AddButton = function (commandData) {
      if (!(commandData instanceof TCommandPanelData))
            return;

      var smartLayer = new TSmartLayer(this, this.DivCtrl, this.Banshee);
      //Verbinde das OnClick-Event
      smartLayer.NO_OnMouseClick = 'btnClicked';
      smartLayer.NO_OnMouseEnter = 'btnEnter';
      smartLayer.NO_OnMouseExit = 'btnExit';
      smartLayer.m_Command = commandData.m_Command;
      smartLayer.m_NO_OnRenderCanvas = this.OnRenderChildCanvas;

      if (commandData.m_ImageUrl) {
        smartLayer.m_paintColor = null;
        smartLayer.AssignMedia(commandData.m_ImageUrl,1);
      }
      //Overlay CMD Buttons
      var icon = null;
      icon = document.createElement('p');
      icon.innerHTML = commandData.m_IconString;
      smartLayer.DivCtrl.appendChild(icon);
      smartLayer.SetIconCSSStyle(commandData.m_IconCssClass);

      smartLayer.SetEnabled(true);
      smartLayer.SetCursor(-21);//Click
      bansheeSenderCall(this, smartLayer, 'SetHint', commandData.m_Hint);
      smartLayer.SetTextureFrames(commandData.m_NumFramesX, commandData.m_NumFramesY);
      smartLayer.SetCSSStyle(commandData.m_cssClass);
      smartLayer.SetColorScheme(commandData.m_ColorScheme[0], commandData.m_ColorScheme[1]);
      smartLayer.Tag = commandData.m_Tag;
      smartLayer.IconString = commandData.m_IconString;
      smartLayer.IconStringInactive = commandData.m_IconStringInactive;
      smartLayer.VisibilityDecorator = commandData.m_Decorator;
      if (!commandData.m_AutoFormat)
      {
        smartLayer.UserData = 'no align';
      }
    };

    this.SetCSSStyle = function(szTemplate)
    {
      if (this.CanvasCtrl)
        this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;
      this.DivCtrl.style.cssText += szTemplate;
      bansheeSyncSmartLayer(this);
    };

    this.SetControlSize = function (wh,constraints) {
        arrControlSizes = wh;
        if (constraints)
          this.m_Constraints = constraints;
        this.UpdateAlign();
    };

    this.SetComponentColors = function(src,trg)
    {
      var i,iCount;
      iCount = bansheeComponentsCount(this);
      for (i = 0;i < iCount;i++ )
        this.Components[i].SetColorValues(src,trg);
    };

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
      //canvas.stroke();
    };

    this.DisplayTextCommands = function()
    {
      var i,iCount;
      iCount = bansheeComponentsCount(this);
      for (i = 0;i < iCount;i++ )
        this.Components[i].SetText(this.Components[i].m_Command);
    };

    this.InitializeComponent = function () {
      m_Decorator = new TCreatorDecorator(this, this.DivCtrl, _banshee);
      m_Decorator.SetVisible(false);
    };

    this.SetDecorationOrientation = function(orientation) {
      m_Decorator.SetOrientation(orientation);
      m_Decorator.SetVisible(true);
    };

    this.SetDecorationPosition = function(position) {
      m_Decorator.SetDecoratorPosition(position);
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
        /*
        var xOff = 5;
        var yOff = 5;
        var stride = 10;
        var iCount = bansheeComponentsCount(this);
        for (var i = 0; i < iCount; i++) {
            var layer = this.Components[i];
            //if (layer.UserData === 'no align')
            //  continue;
            var w = layer.w;
            var h = layer.h;
            layer.SetBounds(xOff, yOff, w,h);//arrControlSizes[0], arrControlSizes[1]);
            yOff += arrControlSizes[1] + stride;
        }
        */
    };

    this.LeftRight = function (bClamp) {
        /*
        var xOff = 5;
        var yOff = 5;
        var stride = 10;
        var iCount = bansheeComponentsCount(this);
        var iTest = 0;
        for (var i = 0; i < iCount; i++) {

            if (bClamp){

            iTest = xOff + arrControlSizes[0] + stride;
            if (iTest >= this.w && i != 0) {
                xOff = 5;
                yOff += arrControlSizes[1] + stride;
            }
        }
          this.Components[i].SetBounds(xOff, yOff, arrControlSizes[0], arrControlSizes[1]);
          xOff += arrControlSizes[0] + stride;
        }
        */
    };

    this.UpdateAlign = function () {
      if (this.CanvasCtrl)
        this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;
      /*
      if (!this.Owner)
            return;

        var w = this.Owner.w;
        var h = this.Owner.h;
        if (this.m_Align === 0) {//Top
            this.SetBounds(this.Margins[0], this.Margins[1], w - this.Margins[2], this.m_Constraints[3]);
            this.LeftRight();
            return;
        }
        if (this.m_Align === 1) {//Right
          this.SetBounds(w - this.m_Constraints[2] - this.Margins[2], this.Margins[1], this.m_Constraints[2], h - (this.Margins[3] + this.Margins[1]));
          this.TopDown();
          return;
        }
        if (this.m_Align === 2) {//Bottom
            this.SetBounds(0, h - this.m_Constraints[3], w, this.m_Constraints[3]);
            this.LeftRight();
            return;
        }
        if (this.m_Align === 3) {//Left
            this.SetBounds(this.Margins[0], this.Margins[1], this.m_Constraints[2], h - (this.Margins[3] + this.Margins[1]));
            this.TopDown();
            return;
        }
        if (this.m_Align === 4) {//Left to right with break
            this.LeftRight(true);
        }
       */
    };

    //Product
    this.btnClicked = function (obj) {
      this.CommandComponent = obj;
      this.CurrCommand = obj.m_Command;
      bansheeNotifyOwner(this, this.NO_OnCommand, this.CurrCommand);
      this.CommandComponent = null;
    };

    this.btnEnter = function(button){
      m_Decorator.SetDecoratorPosition(button);
    };

    this.btnExit = function(button){
      m_Decorator.SetDecoratorPosition('collapse');
    };

  this.ButtonCheck = function( command,bCheck) {
        var iIdx = _getCommandIdx(this,command);
        if (iIdx < 0)
            return;
      this.Components[iIdx].setChecked(bCheck);
    };

    this.getButtonChecked = function(command){
      var iIdx = _getCommandIdx(this,command);
      if (iIdx < 0)
        return;
      return this.Components[iIdx].getChecked();
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

  this.UncheckAll = function(){
      var iCnt = bansheeComponentsCount(this);
      for( var i = 0; i<iCnt;i++){
        if(this.Components[i].ClassName != 'TCreatorDecorator')
          if(this.Components[i].m_Command != 'Highlight'){
            this.Components[i].setChecked(false);
          }
      }
    };

    this.CheckAll = function(){
      var iCnt = bansheeComponentsCount(this);
      for( var i = 0; i<iCnt;i++){
        this.Components[i].setChecked(true);
      }
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