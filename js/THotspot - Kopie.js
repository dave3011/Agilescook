function THotspot(_owner, _parent, _banshee) {
  bansheeInitComponent(this, _owner, _banshee, 'THotspot');
  bansheeInitVisual(this, _parent, false);

  var ORIENTATION_LEFT = 'klickstellelinks';
  var ORIENTATION_RIGHT = 'klickstellerechts';

  var m_NumAssets = 0;
  var m_IsUserGenerated = false;
  var m_IsSelected = false;
  var m_Orientation = 0;  

  var m_Decorator = null;

  this.UserData = null; //Any content
  this.NO_OnClick = null;

  this.Scale = 1.0;
  this.wtx = 0, this.wty = 0; //Translation

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //Weltkoordinaten
  this.wx = 0;
  this.wy = 0;
  this.ww = 0;
  this.wh = 0;
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  this.InitializeComponent = function () {
      
    this.ww = 45;
    this.wh = 30;
    this.SetWorldTransform(this.wx, this.wy, this.ww, this.wh);
    m_Decorator = new TCreatorDecorator(this, this.DivCtrl, _banshee);
    //m_Decorator.SetOrientation('klickstellelinks');
    //m_Decorator.SetVisible(true);

    m_NumAssets = 5;
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
    var ctx = bansheeGetDC(this);

    // Multiple Assets
    if (m_NumAssets > 1) {
        this.ww = 60;
        if (m_Orientation === ORIENTATION_LEFT) {
            this.wx = -15;
        }

    }

    ctx.setTransform(1.0, 0, 0, 1.0, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);

    //Background
    ctx.fillStyle = "#f17100";
    ctx.fillRect(0, 0, this.w, this.h);

    //Foreground
    if (!m_IsSelected) {

        if (m_Orientation === ORIENTATION_LEFT) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, this.w - 3, this.h);
        } else {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(3, 0, this.w, this.h);
        }
    }

    //Number
    if (m_IsSelected)
      ctx.fillStyle = "#FFFFFF";
    else
      ctx.fillStyle = "#f17100";
    ctx.font = 16 * this.Scale + 'pt Open Sans Semibold';

    if (m_Orientation === ORIENTATION_LEFT) {
        ctx.fillText(m_NumAssets, this.w -15, (this.h + 10) / 2);
    } else {
        ctx.fillText(m_NumAssets, 10, (this.h + 10) / 2);
    }

    // Multiple Assets
    if (m_NumAssets > 1) {

        var offset = this.w / 10;
        var x1 = offset;
        var x2 = offset * 2;
        var x3 = offset * 3;

        if (m_Orientation === ORIENTATION_RIGHT) {
            x1 = this.w - x1;
            x2 = this.w - x2;
            x3 = this.w - x3;
        }
      
        drawLine(x1, 0, x1, this.h, ctx);
        drawLine(x2, 0, x2, this.h, ctx);
        drawLine(x3, 0, x3, this.h, ctx);
    }

    if (m_Decorator) {
        m_Decorator.SetOrientation(m_Orientation);
        m_Decorator.SetVisible(true);
        m_Decorator.Invalidate();
    }
  };

  drawLine = function(x, y, x1, y1, dc) {
      dc.lineWidth = 0.1;
      dc.beginPath();
      dc.moveTo(x, y);
      dc.lineTo(x1, y1);
      dc.closePath();
      dc.fillStyle = '#f17100';
      dc.stroke();
  }

  this.GetNumAssets = function() {
    return m_NumAssets;
  };

  this.SetNumAssets = function(numAssets) {
    m_NumAssets = numAssets;
  };

  this.GetOrientation = function () {
      return m_Orientation;
  };

  this.SetOrientation = function (orientation) {
      m_Orientation = orientation;
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
    this.SetBounds((this.wx + this.wtx) * fScale, (this.wy + this.wty) * fScale, this.ww * fScale, this.wh * fScale);
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
        this.SetNumAssets(value);
    }
    if (name === 'fccs:Orientation') {
        this.SetOrientation(value);
    }
  };

  this.OnLoaded = function()
  {
    this.wx = this.x;
    this.wy = this.y;

    if (this.x === 0) {
      this.wtx = -1 * this.ww;
    }

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