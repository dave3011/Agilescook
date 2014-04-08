
//Ein TestLayer
function TTestLayer(_owner, _parent,_banshee) {
    bansheeInitComponent(this, _owner, _banshee,'TTestLayer');
    bansheeInitVisual(this,_parent,false);

    this.Cursor = -21;//Click-Cursor

    this.m_NO_Clicked = null;
    var m_bOn = false;

    function tuWas(obj)
    {
      alert(obj.ClassName);
    }

    this.InitializeComponent = function()
    {
      if (this.Owner.ClassName === 'TTestLayer')
          return;

        var a = new TTestLayer(this,this.Parent,this.Banshee);
        a.SetBounds(this.x,this.y + 300,100,100);
    };

    this.SetVisible = function (bVis) {
        bansheeSetVisible(this,bVis)
    };

    this.SetEnabled = function (bEnabled) {
        bansheeSetEnabled(this, bEnabled);
    };


    this.SetBounds = function (x, y, w, h) {
        bansheeSetBounds(this, x, y, w, h);
    };

    this.Invalidate = function () {
        var dc = bansheeGetDC(this);
        bansheeFillRect(dc,0,0,this.w,this.h,'#0000ff');
    };

    this.OnMouseDown = function (e) {
      //this.DoCSSTransform();
      //tuWas(this);
      bansheeSafeCall(this.Owner,this.m_NO_Clicked,null);
    };


    this.DoCSSTransform = function()
    {
      var szNew;
      m_bOn = !m_bOn;
      if (m_bOn)
         szNew = 'border:10px solid red;padding:10px;';
      else
        szNew = 'border:0px solid red;padding:0px;';

      var szCurr = this.DivCtrl.style.cssText;
      szCurr += szNew;
      this.DivCtrl.style.cssText = szCurr;

      var container = this.DivCtrl;

      var message = "The height with padding: " + container.clientHeight + "px.\n";
      message += "The height with padding and border: " + container.offsetHeight + "px.\n";

      message += "The width width padding: " + container.clientWidth + "px.\n";
      message += "The width with padding and border: " + container.offsetWidth + "px.\n";
      bansheeTraceOut(this,message);
    };

    this.OnMouseWheel = function(evt){
    };

    this.OnMouseMove = function (e) {
    };

    this.OnMouseClick = function() {
      this.DoCSSTransform();

    };

    this.OnMouseUp = function () { this.ResetInteraction();};

    this.OnStageLeave = function () {this.ResetInteraction();};

    this.OnMouseExit = function () {this.ResetInteraction();};

    this.OnMouseEnter = function () {
      this.Cursor = -3;
    };

    this.ResetInteraction = function () {
    };

    this.HitTest = function (x, y) {
      return bansheeUIHitTest(this,x,y);
    };

    this.Free = function () {
       bansheeFree(this);
    };

    //Gesture-Event from Banshee via Hammer.js
    this.OnGesture = function(evt)
    {
      var gest = evt.gesture;
      gest.preventDefault();
      if (evt.type ==='tap')
        this.DoCSSTransform();
      bansheeTraceOut(this,evt.type);
    };
    //**************************************************************

    //*********************
    this.Banshee.AddControl(this);
    this.InitializeComponent();

}

//TCanvasPainter*************************************************************************
//***********************************************************************************
