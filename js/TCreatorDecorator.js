function TCreatorDecorator(_owner, _parent, _banshee) {
  bansheeInitComponent(this, _owner, _banshee, 'TCreatorDecorator');
  bansheeInitVisual(this, _parent, false);

  var m_Type = null;

  this.InitializeComponent = function() {
    this.SetOrientation('strokepanel');
  };

  this.SetOrientation = function(orientation) {
    m_Type = orientation;

    if (m_Type == 'strokepanel'){
      this.DivCtrl.style.cssText = CSS_CREATORDECORATOR_STROKEPANEL;
    }
    else if (m_Type == 'visibilitypanel'){
      this.DivCtrl.style.cssText = CSS_CREATORDECORATOR_VISIBILITYPANEL;
    }
    else if (m_Type == 'right'){
      this.DivCtrl.style.cssText = CSS_CREATORDECORATOR_KLICKSTELLERECHTS;
    }
    else if (m_Type == 'left'){
      this.DivCtrl.style.cssText = CSS_CREATORDECORATOR_KLICKSTELLELINKS;
    }
    bansheeSyncSmartLayer(this);
    this.Invalidate();
  };

  this.SetDecoratorPosition = function(sender){
    if(sender!== 'collapse'){
      this.DivCtrl.style.visibility = 'visible';
      this.DivCtrl.style.left = sender.x + sender.w / 2 - this.w /2 + 'px';
    }
    else{
      this.DivCtrl.style.visibility = 'collapse';
    }
  };

  this.SetVisible = function(visible) {
    bansheeSetVisible(this, visible);
    this.Invalidate();
  };

  this.Invalidate = function() {
    if (m_Type == 'strokepanel'){
      var dc = bansheeGetDC(this);
      dc.beginPath();
      dc.moveTo(0, 8);
      dc.lineTo(8, 0);
      dc.lineTo(16, 8);
      dc.lineTo(0, 8);
      dc.closePath();
      dc.fillStyle = '#ffffff';
      dc.fill();
    }

    else if (m_Type == 'visibilitypanel'){
      var dc = bansheeGetDC(this);
      dc.beginPath();
      dc.moveTo(0, 8);
      dc.lineTo(8, 0);
      dc.lineTo(16, 8);
      dc.lineTo(0, 8);
      dc.closePath();
      dc.fillStyle = '#ffffff';
      dc.fill();
    }
    else if (m_Type == 'right') {
        var dc = bansheeGetDC(this);
        dc.beginPath();
        dc.moveTo(8, 0);
        dc.lineTo(0, 8);
        dc.lineTo(8, 16);
        dc.lineTo(8, 0);
        dc.closePath();
        dc.fillStyle = '#f17100';
        dc.fill();
    }
    else if (m_Type == 'left') {
        var dc = bansheeGetDC(this);
        dc.beginPath();
        dc.moveTo(0, 0);
        dc.lineTo(8, 8);
        dc.lineTo(0, 16);
        dc.lineTo(0, 0);
        dc.closePath();
        dc.fillStyle = '#f17100';
        dc.fill();
    }
  };

  this.SetBounds = function (x, y, w, h) {
    bansheeSetBounds(this, x, y, w, h);
  };

  this.Banshee.AddControl(this);
  this.InitializeComponent();
}