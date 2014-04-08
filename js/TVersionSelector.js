function TVersionSelector(_owner, _parent, _banshee) {
  bansheeInitComponent(this, _owner, _banshee, 'TVersionSelector');
  bansheeInitVisual(this, _parent, false);

  var inst = this;

  var leftText = null;
  var icon = null;
  var rightText = null;
  var m_LeftPageNum = null;
  var m_RightPageNum = null;
  var _versionButtonState = false;
  this.Cursor = -21;

  this.NO_OnSelectVersion = null;

  this.InitializeComponent = function() {
    this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;

    leftText = document.createElement('p');
    leftText.innerHTML = 'Schülerfassung';
    leftText.style.cssText = 'position: absolute; right: 50%; margin-right: 34px;' + CSS_VERSION_BUTTON_TEXT;
    this.DivCtrl.appendChild(leftText);

    icon = document.createElement('img');
    icon.style.cssText = 'position: absolute; left: 50%; margin-left: -24px;';
    icon.src = ''+ APP_DATA_DIR + 'Scook_BV_Switch_on.png';
    this.DivCtrl.appendChild(icon);

    rightText = document.createElement('p');
    rightText.innerHTML = 'Lehrerfassung';
    rightText.style.cssText = 'position: absolute; left:50%; margin-left: 34px;' + CSS_VERSION_BUTTON_TEXT;
    this.DivCtrl.appendChild(rightText);
  };

  this.SetVersionButtonState = function(versionButtonState, isTeacherVersion){
    _versionButtonState = versionButtonState;
    if(versionButtonState == 'enabled'){
      if(isTeacherVersion){
        leftText.style.color = 'grey';
        icon.src = ''+ APP_DATA_DIR + 'Scook_BV_Switch_on.png';
        rightText.style.color = 'black';
        this.DivCtrl.style.backgroundColor = 'white';
      }
      else{
        leftText.style.color = 'black';
        icon.src = ''+ APP_DATA_DIR + 'Scook_BV_Switch_off.png';
        rightText.style.color = 'grey';
        this.DivCtrl.style.backgroundColor = 'transparent';
      }
    }
    else{
      leftText.style.color = 'grey';
      icon.src = ''+ APP_DATA_DIR + 'Scook_BV_Switch_disabled.png';
      rightText.style.color = 'grey';
      this.DivCtrl.style.backgroundColor = 'transparent';
    }
  };

  this._setBackgroundColor = function(color){
    if(this.DivCtrl.style.backgroundColor !== 'white' && _versionButtonState != 'hidden')
    this.DivCtrl.style.backgroundColor = color;
  };

  this.HitTest = function (x, y) {
    return bansheeUIHitTest(this, x, y);
  };

  this.OnMouseEnter = function () {
    this._setBackgroundColor('rgba(255,255,255,0.32)');
  };

  this.OnMouseExit = function () {
    this._setBackgroundColor('transparent');
  };

  this.OnMouseClick = function () {
    bansheeNotifyOwner(this,this.NO_OnSelectVersion);
  };

  //Gesture-Event from Banshee via Hammer.js
  this.OnGesture = function (evt) {
    if (evt.type === 'tap')
      bansheeNotifyOwner(this, this.NO_OnSelectVersion);
    return true;
  };

  this.Free = function() {
    bansheeFree(this);
  };

  this.Banshee.AddControl(this);
  this.InitializeComponent();
}