function THotspot(_owner, _parent, _banshee) {
  bansheeInitComponent(this, _owner, _banshee, 'THotspot');
  bansheeInitVisual(this, _parent, false);

  var ORIENTATION_LEFT = 'left';
  var ORIENTATION_RIGHT = 'right';

  var m_IsUserGenerated = false;
  var m_IsSelected = false;
  var m_Orientation = 0;
  var m_PivotX = 0;
  var m_PivotY = 0;
  var m_NumAssets = 0;
  var m_Decorator = null;

  this.UserData = null; //Any content
  this.NO_OnClick = null;

  this.Scale = 1.0;

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //Weltkoordinaten
  this.wx = 0;
  this.wy = 0;
  this.ww = 0;
  this.wh = 0;
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  this.InitializeComponent = function () {
    this.ww = 45;
    this.wh = 45;
    this.SetWorldTransform(this.wx, this.wy, this.ww, this.wh);
    m_Decorator = new TCreatorDecorator(this, this.DivCtrl, _banshee);
  };

  this.SetNumAssets = function(numAssets) {
    m_NumAssets = numAssets;

    if (m_NumAssets > 1) {
      this.ww = 60;
    }
  };

  this.GetNumAssets = function() {
    return m_NumAssets;
  };

  this.SetIsUserGenerated = function() {
    m_IsUserGenerated = true;
  };

  this.IsUserGenerated = function() {
    return m_IsUserGenerated;
  };

  this.GetSelected = function() {
    return m_IsSelected;
  };

  this.SetSelected = function(isSelected) {
    m_IsSelected = isSelected;
    this.Invalidate();
  };

  this.Invalidate = function() {
    var scale = StrToFloatDef(this.Scale, 1.0);
    var dc = bansheeGetDC(this);
   
      
    dc.setTransform(1.0, 0, 0, 1.0, 0, 0);
    dc.clearRect(0, 0, this.w, this.h);

    if(m_IsSelected){
      var backgroundColor = '#f17100';
      var foregroundColor = '#ffffff';
    }
    else{
      var backgroundColor = '#ffffff';
      var foregroundColor = '#f17100';
    }
    var gradientColor = '#808080';
    var decoratorColor = '#f17100';

    //Gradients
    if (m_Orientation === ORIENTATION_LEFT)
      var gradient = dc.createLinearGradient(0,0,10,0);
    else
      var gradient = dc.createLinearGradient(this.w,0,this.w-10,0);
    gradient.addColorStop(0,backgroundColor);
    gradient.addColorStop(0.3,backgroundColor);
    gradient.addColorStop(0.5,gradientColor);
    gradient.addColorStop(0.5,backgroundColor);
    gradient.addColorStop(0.8,backgroundColor);
    gradient.addColorStop(0.99,gradientColor);
    gradient.addColorStop(1,backgroundColor);
    if (m_NumAssets > 1)
      dc.fillStyle = gradient;
    else
      dc.fillStyle = backgroundColor;
    dc.fillRect(0,0,this.w, this.h);

    //Decorator
    dc.fillStyle = decoratorColor;
    if (m_Orientation === ORIENTATION_LEFT)
      dc.fillRect(this.w-5,0,this.w,this.h);
    else
      dc.fillRect(0,0,5,this.h);

    //Assetcount
    dc.fillStyle = foregroundColor;
    dc.textBaseline = 'middle';
    dc.font = 16 * this.Scale + 'pt open_sansregular';

    var text = m_NumAssets.toString();
    if (m_Orientation === ORIENTATION_LEFT){
      dc.textAlign = 'start';
      dc.fillText(text, this.w - dc.measureText(text).width - (15 * this.Scale), (this.h) / 2);
    }
    else{
      dc.textAlign = 'start';
      dc.fillText(m_NumAssets.toString(), 15 * this.Scale, (this.h) / 2);
    }
  };

  this.GetOrientation = function () {
      return m_Orientation;
  };

  this.SetOrientation = function (value) {
    m_Orientation = value;
    this.Invalidate();

    m_Decorator.SetOrientation(m_Orientation);
  };

  this.GetPivotPoint = function() {
    //TODO
    return null;
  };

  this.SetPivotPoint = function (value)
  {
    var parts = value.split(',');
    if (parts[0] != null) {
        m_PivotX = getPivot(parts[0], this.ww);
    }
    if (parts[1] != null) {
        m_PivotY = getPivot(parts[1], this.wh);
    }

    if (m_PivotX === 0) {
      this.SetOrientation(ORIENTATION_RIGHT);
    } else {
      this.SetOrientation(ORIENTATION_LEFT);
    }
  };

  function getPivot(value, fStride) {

      if (value === "min")
          return 0.0;
      if (value === "mid")
          return fStride * 0.5;
      if (value === "max")
          return fStride;

      return value;
  };

  this.SetVisible = function (bVis) {
    bansheeSetVisible(this,bVis);
  };

  this.SetBounds = function (x, y, w, h) {
    bansheeSetBounds(this, x, y, w, h);
  };

  this.SetWorldTransform = function(wx, wy, ww, wh)
  {
    var fScale = StrToFloatDef(this.Scale,1.0);
    this.wx = wx;
    this.wy = wy;
    this.ww = ww;
    this.wh = wh;
    this.SetBounds((this.wx - m_PivotX) * fScale,
                   (this.wy - m_PivotY) * fScale,
                   this.ww * fScale,
                   this.wh * fScale);
  };

  this.SetHint = function (sender, szText) {
    if (this.DivCtrl)
      this.DivCtrl.title = szText;
  };

  this.HitTest = function (x, y) {
    return bansheeUIHitTest(this,x,y);
  };

  this.OnMouseClick = function() {
    bansheeNotifyOwner(this, this.NO_OnClick, this);
  };

  this.Free = function () {
    bansheeFree(this);
  };

  this.OnEmbedLoaded = function () {
    bansheeSetBounds(this, this.x, this.y, this.w + 1, this.h + 1);
    bansheeSetBounds(this, this.x, this.y, this.w - 1, this.h - 1);
  };

  this.OnGesture = function (evt) {
    if (evt.type === 'tap')
      bansheeNotifyOwner(this, this.NO_OnClick);

    return true;
  };

  this.ReadProperty = function(name,value)
  {
    if (name === 'fccs:UserData') {
        this.UserData = value;
    }
    if (name === 'fccs:NumAssets') {
        this.SetNumAssets(parseInt(value));
    }
    if (name === 'fccs:Pivot') {
        this.SetPivotPoint(value);
    }
  };

  this.OnLoaded = function()
  {
    this.wx = this.x;
    this.wy = this.y;

    this.SetWorldTransform(this.wx, this.wy, this.ww, this.wh);
  };

  this.GetWorldBounds = function()
  {
    return [this.wx,this.wy,this.ww,this.wh];
  };

  //*********************
  this.Banshee.AddControl(this);
  this.InitializeComponent();

}