function TPageSelector(_owner, _parent, _banshee) {
  bansheeInitComponent(this, _owner, _banshee, 'TPageSelector');
  bansheeInitVisual(this, _parent, false);

  var inst = this;

  var m_Input = null;
  var m_LeftPageNum = null;
  var m_RightPageNum = null;

  this.NO_OnGoToPage = null;

  this.InitializeComponent = function() {
    this.DivCtrl.style.cssText = CSS_PAGE_SELECTOR;
    this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;

    m_Input = document.createElement('input');
    m_Input.style.cssText = CSS_PAGE_SELECTOR_INPUT;
    m_Input.type = 'text';
    m_Input.addEventListener('focus', onFocus);
    m_Input.addEventListener('blur', onBlur);
    m_Input.addEventListener('keydown', onKeyDown);
    this.DivCtrl.appendChild(m_Input);
  };

  function isNumber(value) {
    var isNumberRegExp = /^\d+$/;
    var isNumber = String(value).search(isNumberRegExp) !== -1;
    return isNumber;
  }

  function validateInput() {
    var value = m_Input.value;
    return isNumber(value);
  }

  function onKeyDown(e) {
    if (e.keyCode === 27 || e.keyCode === 9) { //esc or tab
      m_Input.blur(); //unfocus
    }
    if (e.keyCode === 13) { //enter
      if (validateInput()) {
        var pageNum = parseInt(m_Input.value);
        bansheeNotifyOwner(inst, inst.NO_OnGoToPage, pageNum);
      }
      document.activeElement.blur();// Workaround for softkeyboards on mobile devices
      m_Input.blur(); //unfocus
    }
  };

  function updateText() {
    if (m_LeftPageNum > 0 && m_RightPageNum > 0)
      m_Input.value = m_LeftPageNum + ' - ' + m_RightPageNum;
    else if (m_LeftPageNum > 0)
      m_Input.value = m_LeftPageNum + ' - ';
    else if (m_RightPageNum > 0)
      m_Input.value = '' + m_RightPageNum;
    else
      m_Input.value = ' ';
  }

  this.SetLeftPageNum = function(leftPageNum) {
    m_LeftPageNum = leftPageNum;
    updateText();
  };

  this.SetRightPageNum = function(rightPageNum) {
    m_RightPageNum = rightPageNum;
    updateText();
  };

  this.HitTest = function (x, y) {
    return bansheeUIHitTest(this, x, y);
  };

  function onFocus(e) {
    m_Input.value = '';
    m_Input.style.cssText = CSS_PAGE_SELECTOR_INPUT + CSS_PAGE_SELECTOR_INPUT_FOCUS;
  }

  function onBlur(e) {
    m_Input.style.cssText = CSS_PAGE_SELECTOR_INPUT;
    updateText();
  }

  this.Free = function() {
    m_Input.removeEventListener('keydown', onFocus);
    m_Input.removeEventListener('focus', onFocus);
    m_Input.removeEventListener('blur', onBlur);
    bansheeFree(this);
  };

  this.Banshee.AddControl(this);
  this.InitializeComponent();
}
