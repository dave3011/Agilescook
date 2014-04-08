function TColorController(src,trg) {

    this.Direction = 0;
    this.Opacity = src[0] / 255;
    /**
     * @return {number}
 * @return {number}
     */
    function Clamp(e) {
        if (e < 0)
            return 0;
        if (e > 255)
            return 255;
        return parseInt(e, 10);
    }

    this.Lerp = function (fDelta) {

        if (fDelta < 0)
            fDelta = 0;
        else
            if (fDelta > 1)
                fDelta = 1;
        var srcMul = 1 - fDelta;
        var trgMul = fDelta;

        var a = Clamp(src[0] * srcMul + trg[0] * trgMul);
        var r = Clamp(src[1] * srcMul + trg[1] * trgMul);
        var g = Clamp(src[2] * srcMul + trg[2] * trgMul);
        var b = Clamp(src[3] * srcMul + trg[3] * trgMul);


        this.Opacity = a / 255;

        var szOut = '#';

        var t = r.toString(16);
        if (t.length == 1)
            t = '0' + t;
        szOut += t;

        t = g.toString(16);
        if (t.length == 1)
            t = '0' + t;
        szOut += t;

        t = b.toString(16);
        if (t.length == 1)
            t = '0' + t;
        szOut += t;

        return String(szOut);
    };
}


function TSmartLayer(_owner,_parent,_banshee,htmlSource,bCreateEmbed) {
    bansheeInitComponent(this, _owner, _banshee,'TSmartLayer');
    bansheeInitVisual(this,_parent,bCreateEmbed);

    this._defaultColor = null;
    this.m_paintColor = this._defaultColor;

    this._geometry = [];

    this.ClipOwner = null;
    this.m_Text = null;

    this.m_Ticks = 0;

    this.m_Texture0 = null;
    this.TextureReflection = false;

    //this.m_ColorController = new TColorController([255,255,255,255], [255,255,255,255]);

    //NotifyOwner function(s)
    this.NO_OnMouseClick = null;
    this.NO_OnMouseEnter = null;
    this.NO_OnMouseExit = null;

    //***********************************

    this.m_Command = null;
    
    var m_bChecked = false;

    var m_DefaultTextureFrame = 1;
    var m_IconColors = ['green','green','green','green'];
    var m_IconBgColors = ['red','red','red','red'];
    var m_IconColor = m_IconColors[1];
    var m_IconBgColor = m_IconBgColors[1];

  this.UserData = null;//Any content

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Weltkoordinaten
    this.wx = 0;
    this.wy = 0;
    this.ww = 0;
    this.wh = 0;
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    this.m_NO_OnRenderCanvas = null;

    this.InitializeComponent = function () {
    };

    this.SetCursor = function (iNum) {
        this.Cursor = iNum;
    };

    this.SetCSSStyle = function(szTemplate)
    {
      this.DivCtrl.style.cssText += szTemplate;
      bansheeSyncSmartLayer(this);
    };

    this.SetIconCSSStyle = function(szTemplate)
    {
      for(var i = 0;i < this.DivCtrl.childNodes.length;i++){
        if(this.DivCtrl.childNodes[i].type = 'p'){
          this.DivCtrl.childNodes[i].style.cssText += szTemplate;
        }
      }
      bansheeSyncSmartLayer(this);
    };

      this.SetColorScheme = function(colors, bgColors){
      m_IconColors = colors;
      m_IconBgColors = bgColors;
      m_IconColor = m_IconColors[1];
      m_IconBgColor = m_IconBgColors[1];
      __SetIconColor(this, m_IconColors[1], m_IconBgColors[1]);
    };

    this.SetColorValues = function(src,trg)
    {
      //this.m_ColorController = new TColorController(src, trg);
      //this.m_paintColor = this.m_ColorController.Lerp(1);
      //this.Invalidate();
    };

    this.SetText = function (szText) {
        this.m_Text = szText;
        this.Invalidate();
    };

    this.SetEnabled = function (bEnabled) {
      bansheeSetEnabled(this, bEnabled);
      if (bEnabled){
        __SetTextureFrame(this,1);
        __SetIconColor(this, m_IconColors[1], m_IconBgColors[1]);
      }
      else{
        __SetTextureFrame(this,2);
        __SetIconColor(this, m_IconColors[2], m_IconBgColors[2]);
      }
    };

    this.getChecked = function () { return m_bChecked; };

    this.setChecked = function (bChecked) {
        var iconString = '';
        if (this.IconString)
          iconString = this.IconString;
        //if (m_bChecked == bChecked)
            //return;
        m_bChecked = bChecked;
        
        if (m_bChecked){
          m_DefaultTextureFrame = 0;
          m_IconColor = m_IconColors[0];
          m_IconBgColor = m_IconBgColors[0];
            iconString = this.IconString;
        }
        else{
          m_DefaultTextureFrame = 1;
          m_IconColor = m_IconColors[1];
          m_IconBgColor = m_IconBgColors[1];
          if(this.IconStringInactive)
            iconString = this.IconStringInactive;
        }
      __SetTextureFrame(this,m_DefaultTextureFrame);
      __SetIconColor(this, m_IconColor, m_IconBgColor);
      __SetIconString(this, iconString);
    };

    this.SetVisible = function (bVis) {
      bansheeSetVisible(this,bVis);
    };

    this.SetBounds = function (x, y, w, h) {
        bansheeSetBounds(this, x, y, w, h);
    };

    this.SetTextureFrames = function(numXFrames,numYFrames)
    {
      if (this.m_Texture0)
        this.m_Texture0.SetNumFrames(numXFrames,numYFrames);
    };

    function __SetTextureFrame(self,iFrame)
    {
      if (self.m_Texture0){
        if (!self.Enabled){
          iFrame = 2;
        }
        else {
          if (m_bChecked && iFrame === 3){//roll over && checked
            iFrame = m_DefaultTextureFrame;
          }
        }
        self.m_Texture0.SelectFrame(self,iFrame);
      }
    };

    function __SetIconColor(self,iconColor,bgColor){
      if(self.DivCtrl.childNodes){
        if (!self.Enabled){
          iconColor = m_IconColors[2];
          bgColor = m_IconBgColors[2];
        }
        else {
          if (m_bChecked){
            iconColor = m_IconColors[0];
            bgColor = m_IconBgColors[0];
          }
        }
        self.DivCtrl.childNodes[1].style.color = iconColor;
        self.DivCtrl.style.backgroundColor = bgColor;
      }
    };

    function __SetIconString(self,iconString){
      self.DivCtrl.childNodes[1].innerHTML = iconString;
    };

    this.SetWorldTransform = function(wx,wy,ww,wh)
    {
      var fScale = this.Scale;
      this.wx = wx;
      this.wy = wy;
      this.ww = ww;
      this.wh = wh;
      this.SetBounds(wx * fScale,wy * fScale,ww * fScale,wh * fScale);
    };

    this.SetScale = function(fScale)
    {
      if (fScale === this.Scale)
        return;
      this.Scale = fScale;
      this.SetWorldTransform(this.wx,this.wy,this.ww,this.wh);
    };

    this.SetHint = function (sender, szText) {
        if (this.DivCtrl)
          this.DivCtrl.title = szText;
    };

    this.Invalidate = function () {
        if (!this.CanvasCtrl)
            return;
        if (this.ClipOwner) {
            if (this.x >= this.ClipOwner.w)
                return;
            if (this.y >= this.ClipOwner.h)
                return;
            if (this.x + this.w < this.ClipOwner.x)
                return;
            if (this.y + this.h < this.ClipOwner.y)
                return;
        }
        var ctx = bansheeGetDC(this);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.w, this.h);


        //if (this.m_paintColor)
        //  bansheeFillRect(ctx,0,0,this.w,this.h,this.m_paintColor);

        if (this.m_Texture0)
        {
          //ctx.globalAlpha = this.m_ColorController.Opacity;
          this.m_Texture0.RenderFrame(ctx,0,0,this.w,this.h);
        }

        if (this.m_Text) {
            bansheeSelectFont(ctx,'14px Verdana');
            bansheeTextOut(ctx,0,0,this.m_Text,'#ffffff');
        }

        if (this.m_NO_OnRenderCanvas)
          this.m_NO_OnRenderCanvas(this,ctx);
    };

    this.OnTextureLoaded = function(tex,bSuccess)
    {
      if (!bSuccess)
        bansheeTraceOut(this,'Texture Error:' + tex.m_Filename);

      if (this.Enabled){
        __SetTextureFrame(this,m_DefaultTextureFrame);
        __SetIconColor(this,m_IconColor,m_IconBgColor);
      }
      else{
        __SetTextureFrame(this,2);
        __SetIconColor(this, m_IconColors[2], m_IconBgColors[2]);
      }
    };

    this.OnMouseDown = function()
    {
      __SetTextureFrame(this,0);
      __SetIconColor(this, m_IconColors[0], m_IconBgColors[0]);
    };

    this.OnMouseUp = function()
    {
      __SetTextureFrame(this,m_DefaultTextureFrame);
      __SetIconColor(this, m_IconColor, m_IconBgColor);
    };

    this.OnMouseEnter = function () {
      __SetTextureFrame(this,3);
      __SetIconColor(this, m_IconColors[3], m_IconBgColors[3]);
      if(this.VisibilityDecorator != ''){
      bansheeNotifyOwner(this, this.NO_OnMouseEnter, this);
      }
    };

    this.OnMouseExit = function () {
      __SetTextureFrame(this,m_DefaultTextureFrame);
      __SetIconColor(this, m_IconColor, m_IconBgColor);
      if(this.VisibilityDecorator != ''){
        bansheeNotifyOwner(this, this.NO_OnMouseExit, this);
      }
    };

    this.HitTest = function (x, y) {
      return bansheeUIHitTest(this,x,y);
    };

    this.Free = function () {
      this.AssignMedia(null,1);
      bansheeFree(this);
    };

    this.AssignMedia = function(data,iSlot)
    {
        if (iSlot === 1){//First texture channel
          this.m_Texture0 = bansheeLoadTexture(this,this.m_Texture0,data,'OnTextureLoaded');
          return true;//Handled
        }
        if (iSlot === 3)
        {
            this.SetText(data);
            return Boolean(true);
        }

        if (iSlot === -2)//Create an SVG - File (embed). not implemented in Smart++ !!!HACK!!!
        {
            if (!this.EmbedCtrl)
                return Boolean(false);
            //Der Trick mit dem embed-tag
            this.EmbedCtrl.innerHTML = '<embed src=' + data + ' type="image/svg+xml" style="position:absolute;" disabled="true" contentEditable="false"/>';
            //IE braucht das nicht. Firefox,Chrome... schon.
            var o = this.EmbedCtrl.firstElementChild;
            if (o) o.onload = this.OnEmbedLoaded.bind(this);
            //************************************************
            bansheeSizeFirstChild(this.EmbedCtrl, this.w, this.h);
            return Boolean(true);
        }
        return Boolean(false);
    };

    this.QueryMedia = function(iSlot)
    {
        if (iSlot === 1)
            return this.m_Texture0?this.m_Texture0.m_Filename:null;
        if (iSlot === 3)
          return this.m_Text;
        return null;
    };

    this.OnEmbedLoaded = function () {
        bansheeSetBounds(this, this.x, this.y, this.w + 1, this.h + 1);
        bansheeSetBounds(this, this.x, this.y, this.w - 1, this.h - 1);
    };

    this.OnMouseClick = function () {
      bansheeNotifyOwner(this,this.NO_OnMouseClick);
    };

    //Gesture-Event from Banshee via Hammer.js
    this.OnGesture = function (evt) {
      if (evt.type === 'tap')
          bansheeNotifyOwner(this, this.NO_OnMouseClick);

      return true;
    };

    //Deserialisierung:: bansheeReadComponent (Bem: x,y,w,h wurden von bansheeReadComponent gesetzt)
    this.ReadProperty = function(name,value)
    {
      if (name ==='xlink:href') //Texture Channel #1
        this.AssignMedia(value,1);
      else
      if (name === 'fccs:UserData')//custom
        this.UserData = value;
    };

    //bansheeReadComponent finished
    this.OnLoaded = function()
    {
      this.SetWorldTransform(this.x,this.y,this.w,this.h);
      __SetTextureFrame(this,1);//Default Up-State
      __SetIconColor(this, CONST_ICON_DEFAULT);
      this.Invalidate();
    };

    //*********************
    this.Banshee.AddControl(this);
    this.InitializeComponent();

}
//TSmartLayer*************************************************************************
//***********************************************************************************
