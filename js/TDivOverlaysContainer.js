function TDivOverlaysContainer(_owner, _parent, _banshee) {
  bansheeInitComponent(this, _owner, _banshee, 'TDivOverlaysContainer');
  bansheeInitVisual(this,_parent,false);

  //the four div Overlays
  var m_UpperDiv;
  var m_RightDiv;
  var m_LowerDiv;
  var m_LeftDiv;
  var m_Icon;

  function paintIcon(icon){
     var dc = icon.getContext('2d');
     dc.clearRect (0, 0, 50, 50);
     dc.fillStyle = 'rgba(51,51,51,0.30)';
     dc.font = '40px scook icons';
     dc.textAlign = 'center';
     dc.fillText("\ue649",25,50);
  }

  this.InitializeComponent = function()
  {
    var style = CSS_BOOKVIEWER_OUTLINE;
    m_UpperDiv = this.AddHTMLObject(this.DivCtrl,'div',style);
    m_RightDiv = this.AddHTMLObject(this.DivCtrl,'div',style);
    m_LowerDiv = this.AddHTMLObject(this.DivCtrl,'div',style);
    m_LeftDiv = this.AddHTMLObject(this.DivCtrl,'div',style);
    m_Icon = this.AddHTMLObject(this.DivCtrl,'canvas','');
    m_Icon.style.position = 'absolute';
    _attr(m_Icon, 'width',50);
    _attr(m_Icon, 'height',50);
    paintIcon(m_Icon);

    bansheeSetVisible(this,false);
  };

  this.AddHTMLObject = function(parent,szObjectType,szCSSDecl)
  {
    if (!parent)
      return null;

    var o = document.createElement(szObjectType);
    if (o)
    {
      parent.appendChild(o);
      o.style.cssText = szCSSDecl;
      return o;
    }
    else
      return null;
  };

  function PosBounds(divElement,x,y,w,h)
  {
    divElement.style.position = 'absolute';
    _pos(divElement, x, y);
    _bounds(divElement, w, h);
  }

  function FormatDivs(x,y,w,h)
  {
    var borderSize = 2;
    PosBounds(m_UpperDiv,0,0,w,borderSize);
    PosBounds(m_RightDiv,w-borderSize,borderSize,borderSize,h - borderSize * 2);
    PosBounds(m_LowerDiv,0,h-borderSize,w,borderSize);
    PosBounds(m_LeftDiv,0,borderSize,borderSize,h - borderSize * 2);
    paintIcon(m_Icon);
  }

  this.EnableFit = function(bEnable)
  {
    if (bEnable)
      bansheeSetVisible(this,true);
    else
      bansheeSetVisible(this,false);
  };

  this.SetBounds = function(x,y,w,h)
  {
    bansheeSetBounds(this,x,y,0,0);
    FormatDivs(x,y,w,h);
  };

  this.Invalidate = function() {};//do nothing


  this.SetTransform = function(hOffset,vOffset,scale){

  };

  this.Free = function() {
    this.DivCtrl.removeChild(m_UpperDiv);
    m_UpperDiv = null;
    this.DivCtrl.removeChild(m_RightDiv);
    m_RightDiv = null;
    this.DivCtrl.removeChild(m_LowerDiv);
    m_LowerDiv = null;
    this.DivCtrl.removeChild(m_LeftDiv);
    m_LeftDiv = null;
    this.DivCtrl.removeChild(m_Icon);
    m_Icon = null;
    bansheeFree(this);
  };

  this.Banshee.AddControl(this);
  this.InitializeComponent();
}