function TThumbnail(owner, parent, banshee) {
  bansheeInitComponent(this, owner, banshee, 'TThumbnail');
  bansheeInitVisual(this, parent, false);

  this.Cursor = -21; //pointer cursor

  this.m_NO_OnStageChangeRequest = null;
  this.m_NO_OnBeginDrag = null;
  this.m_NO_OnContinueDrag = null;
  this.m_NO_OnEndDrag = null;

  var m_DivCtrl = this.DivCtrl;
  var m_CanvasCtrl = this.CanvasCtrl;
  var m_texture = null;
  var m_img = null;
  var m_imgContainer = null;
  var m_Label = null;
  var m_stageNumber = 0;
  var m_current = false;
  var m_showLeftPageLabel = true;
  var m_showRightPageLabel = true;

  this.InitializeComponent = function()
  {
    this.CanvasCtrl.style.cssText = CSS_DIM_ZERO;
    this.DivCtrl.style.cssText = CSS_THUMBNAIL;

    m_imgContainer = document.createElement('div');
    m_DivCtrl.appendChild(m_imgContainer);
    m_imgContainer.style.cssText = CSS_THUMBNAIL_IMAGE_CONTAINER_DEFAULT + CSS_BOX_SHADOW;

    m_img = document.createElement('div');
    m_imgContainer.appendChild(m_img);

    m_Label = document.createElement('a');
    m_DivCtrl.appendChild(m_Label);
    m_Label.style.cssText = CSS_THUMBNAIL_TEXT;

    bansheeSyncSmartLayer(this);
  };

  function labelText() {
    var text;
    if (m_showLeftPageLabel && m_showRightPageLabel)
      text = 2*(m_stageNumber-1) + " / " + (2*(m_stageNumber-1) + 1);
    else if (m_showLeftPageLabel && !m_showRightPageLabel)
      text = 2*(m_stageNumber-1);
    else if (!m_showLeftPageLabel && m_showRightPageLabel)
      text = 2*(m_stageNumber-1) + 1;
    else
      text = "&nbsp;";
    return text;
  }

  this.SetShowLeftPageLabel = function(show) {
    m_showLeftPageLabel = show;
    this.Invalidate();
  };

  this.SetShowRightPageLabel = function(show) {
    m_showRightPageLabel = show;
    this.Invalidate();
  };

  this.SetTexture = function(texture) {
    var textureWidth = texture.Width;
    var textureHeight = texture.Height;
    var targetHeight = THUMBNAIL_HEIGHT;
    var scaleFactor = THUMBNAIL_HEIGHT / texture.Height;
    var numX = texture.numTilesX;
    var numY =texture.numTilesY;

    m_img.style.width = texture.Width * scaleFactor + 'px';
    m_img.style.height = texture.Height * scaleFactor + 'px';
    m_img.style.backgroundImage = 'url(' + TEXTURES_DATA_DIR + texture.Href + ')';
    m_img.style.backgroundPosition = -1 * texture.X * scaleFactor + "px " + -1 * texture.Y * scaleFactor + "px";
    m_img.style.backgroundSize = textureWidth * scaleFactor * numX + 'px ' + textureHeight * scaleFactor * numY + 'px';

    bansheeSyncSmartLayer(this);
  };

  this.GetBoundingRect = function() {
    return {
      x: this.DivCtrl.offsetLeft - bansheeTranslateValue(this.DivCtrl.style.marginLeft, 0),
      y: this.DivCtrl.offsetTop - bansheeTranslateValue(this.DivCtrl.style.marginTop, 0),
      w: bansheeTranslateValue(this.DivCtrl.style.marginLeft, 0) + this.DivCtrl.offsetWidth + bansheeTranslateValue(this.DivCtrl.style.marginRight, 0),
      h: bansheeTranslateValue(this.DivCtrl.style.marginTop, 0) + this.DivCtrl.offsetHeight + bansheeTranslateValue(this.DivCtrl.style.marginBottom, 0)
    };
  };

  this.OnMouseClick = function (e) {
    bansheeNotifyOwner(this, this.m_NO_OnStageChangeRequest, m_stageNumber);
  };

  this.OnGesture = function (evt) {
    switch (evt.type) {
      case 'tap':
        bansheeNotifyOwner(this, this.m_NO_OnStageChangeRequest, m_stageNumber);
        break;
      case 'dragstart':
        bansheeNotifyOwner(this, this.m_NO_OnBeginDrag, evt);
        break;
      case 'drag':
        bansheeNotifyOwner(this, this.m_NO_OnContinueDrag, evt);
        break;
      case 'dragend':
        bansheeNotifyOwner(this, this.m_NO_OnEndDrag, evt);
        break;
    }
    return true;
  };

  function highlightImage() {
    m_imgContainer.style.cssText = CSS_THUMBNAIL_IMAGE_CONTAINER_HOVER + CSS_THUMBNAIL_BOX_SHADOW;
    //m_img.style.opacity = '0.5';
  }

  function resetHightlightImage() {
    m_imgContainer.style.cssText = CSS_THUMBNAIL_IMAGE_CONTAINER_DEFAULT + CSS_BOX_SHADOW;
    //m_img.style.opacity = '1.0';
  }

  this.OnMouseEnter = function (e) {
    if (!m_current)
      highlightImage();
  };

  this.OnMouseExit = function (e) {
    if (!m_current)
      resetHightlightImage();
  };

  this.HitTest = function (x, y)
  {
    //#1 test owner
    var bHit = this.Owner.HitTest(x,y);
    if (!bHit)
      return bHit;
    //#2 test self
    var result = [0,0];
    if (this.Owner.GetScrollOffset)
      result = this.Owner.GetScrollOffset();
    return bansheeUIHitTest(this, x + result[0] , y + result[1]);
  };

  this.Invalidate = function() {
    m_Label.innerHTML = labelText();
  };

  this.SetStageNumber = function(stageNumber)
  {
    m_stageNumber = stageNumber;
    m_Label.innerHTML = labelText();
  };

  this.SetCurrent = function() {
    m_current = true;
    highlightImage();
  };

  this.UnsetCurrent = function() {
    m_current = false;
    resetHightlightImage();
  };

  this.GetStageNumber = function()
  {
    return m_stageNumber;
  };

  this.SyncBanshee = function() {
    bansheeSyncSmartLayer(this);
  };

  this.Free = function()
  {
    bansheeFree(this);
  };

  this.Banshee.AddControl(this);
  this.InitializeComponent();
}
