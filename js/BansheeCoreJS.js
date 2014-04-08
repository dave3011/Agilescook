var BANSHEE_RUNTIME = 'BansheeJS Version 1.0';
var __isWEBKIT = false;

var BANSHEE_SMPTE_TICKS = 60;//60 frames / sec
//3*3 Matrix
function TMatrix3x3() {
    this.m = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    this.inv = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    this.Multiply = function (mat) {

        if (!(mat instanceof TMatrix3x3))
            return false;

        var a = this.m;
        var b = mat.m;
        var c = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                c[i][j] = 0;
                for (var k = 0; k < 3; k++)
                    c[i][j] = c[i][j] + a[i][k] * b[k][j];
            }
        }
        this.m = c;
        return true;
    };

    this.VectorMultiply = function (x, y) {
        var res = [0, 0];
        var m = this.m;
        res[0] = x * m[0][0] + y * m[1][0] + m[2][0];
        res[1] = x * m[0][1] + y * m[1][1] + m[2][1];
        return res;
    };

    this.Inverse = function () {
        var a = this.m;
        var c = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        /*
        var det=a[0][0] * (a[1][1]*a[2][2]-a[2][1]*a[1][2])-a[0][1]*(a[1][0]*a[2][2]-a[1][2]*a[2][0])+a[0][2]*(a[1][0]*a[2][1]-a[1][1]*a[2][0]);//adjoin
        if (det === 0)
          return false;
        var det1 = 1 / det;
        c[0][0]=(a[1][1]*a[2][2]-a[2][1]*a[1][2]) * det1;
        c[0][1]=-(a[1][0]*a[2][2]-a[1][2]*a[2][0]) * det1;
        c[0][2]=(a[1][0]*a[2][1]-a[2][0]*a[1][1]) * det1;
        c[1][0]=-(a[0][1]*a[2][2]-a[0][2]*a[2][1]) * det1;
        c[1][1]=(a[0][0]*a[2][2]-a[0][2]*a[2][0]) * det1;
        c[1][2]=-(a[0][0]*a[2][1]-a[2][0]*a[0][1]) * det1;
        c[2][0]=(a[0][1]*a[1][2]-a[0][2]*a[1][1]) * det1;
        c[2][1]=-(a[0][0]*a[1][2]-a[1][0]*a[0][2]) * det1;
        c[2][2]=(a[0][0]*a[1][1]-a[1][0]*a[0][1]) * det1;
        */
        //cache array access
        var a00 = a[0][0];
        var a01 = a[0][1];
        var a11 = a[1][1];
        var a10 = a[1][0];
        var a20 = a[2][0];
        var a21 = a[2][1];
        var a22 = a[2][2];
        var a12 = a[1][2];
        var a02 = a[0][2];

        var det = a00 * (a11 * a22 - a21 * a12) - a01 * (a10 * a22 - a12 * a20) + a02 * (a10 * a21 - a11 * a20);//adjoin
        if (det === 0)
            return false;
        var det1 = 1 / det;
        c[0][0] = (a11 * a22 - a21 * a12) * det1;
        c[0][1] = -(a12 * a22 - a12 * a20) * det1;
        c[0][2] = (a10 * a21 - a20 * a11) * det1;
        c[1][0] = -(a01 * a22 - a02 * a21) * det1;
        c[1][1] = (a00 * a22 - a02 * a20) * det1;
        c[1][2] = -(a00 * a21 - a20 * a01) * det1;
        c[2][0] = (a01 * a12 - a02 * a11) * det1;
        c[2][1] = -(a00 * a12 - a10 * a02) * det1;
        c[2][2] = (a00 * a11 - a10 * a01) * det1;

        this.inv = c;
        return true;
    };

    this.Rotate = function (angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        this.m[0][0] = cos;
        this.m[0][1] = sin;
        this.m[1][0] = -sin;
        this.m[1][1] = cos;
    };
}

function bansheeVectorSubtract2D(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
}

function bansheeVectorLength2D(a, b) {
    if (b) {
        var vec = bansheeVectorSubtract2D(a, b);
        return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    }
    else
        return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}

var bansheeQueryPerformanceCounter;
if (window.performance && window.performance.webkitNow) {
    //console.log("Using webkit high performance timer");
    bansheeQueryPerformanceCounter = function () { return window.performance.webkitNow(); };
}
else {
    if (window.performance && window.performance.now) {
        //console.log("high performance timer");
        bansheeQueryPerformanceCounter = function () { return window.performance.now(); };
    }
    else {
        //console.log("Using low performance timer");
        bansheeQueryPerformanceCounter = function () { return new Date().getTime(); };
    }
}

function StrToIntDef(valIn, defOut) {
    var val = parseInt(valIn, 10);
    return isNaN(val) ? defOut : val;
}

function StrToFloatDef(valIn, defOut) {
    var val = parseFloat(valIn);
    return isNaN(val) ? defOut : val;
}

var m_hexTable = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
function bansheeGetHexValue(val, numSymbols,bNoPrefix) {
    var result = '';
    while (numSymbols--) {
        result = m_hexTable[val & 0xF] + result;
        val >>= 4;
    }
    if (bNoPrefix)
      return result;
    else
      return '0x' + result;
}


function bansheeStringTrimLeft(szIn) {
    if (szIn && (typeof (szIn) === 'string')) {
        var iCnt = szIn.length;
        for (var i = 0; i < iCnt; i++) {
            if (szIn.charCodeAt(i) > 32)
                return szIn.substring(i);
        }
    }
    return szIn;
}

function bansheeIncludeTrailingSlash(szIn) {
    if (szIn && (typeof (szIn) === 'string')) {
        if (szIn.charAt(szIn.length - 1) !== '/')
            return szIn + '/';
    }
    return szIn;
}

//Firefox-Bug
function bansheeZeroFloatPrecision(doubleIn)
{
  return Math.abs(doubleIn) < 0.000001?0:doubleIn;
}

function bansheeStringList(text)
{
  var result = [];

  if (text && (typeof (text) === 'string'))
  {
    var iPos = text.indexOf('\n');
    if (iPos >= 0) {
    var szText;
      while (true) {
        szText = text.substring(0, iPos);
        result.push(szText);
        text = text.substring(iPos + 1);
        iPos = text.indexOf('\n');
        if (iPos < 0) {
          szText = text;
        break;
        }
    }
    result.push(szText);
    }
    else
      result.push(text);
  }

  return result;
}


function __critError(szOut) {
    if (szOut)
        alert(BANSHEE_RUNTIME + '\n' + szOut);
}

function _dot(v1x, v1y, v2x, v2y) {
    return (v1x * v2x + v1y * v2y);
}

function bansheePtInRect(x, y, a, b, c, d) {
    return ((x >= a) && (y >= b) && (x < c) && (y < d));
}


function bansheeLineHit(x, y, p1x, p1y, p2x, p2y, minDist) {
    var min, max;
    if (p1x > p2x) {
        min = p2x;
        max = p1x;
    }
    else {
        min = p1x;
        max = p2x;
    }
    if (x < min - minDist)
        return false;
    if (x > max + minDist)
        return false;

    if (p1y > p2y) {
        min = p2y;
        max = p1y;
    }
    else {
        min = p1y;
        max = p2y;
    }

    if (y < min - minDist)
        return false;
    if (y > max + minDist)
        return false;


    var v1x, v1y, v2x, v2y;

    v1x = p1x - p2x;
    v1y = p1y - p2y;

    if ((v1x == 0) && (v1y == 0))
        return false;

    v2x = -v1y;
    v2y = v1x;

    var dot = _dot(v2x, v2y, x - p1x, y - p1y);
    var len = Math.sqrt(v1x * v1x + v1y * v1y);

    return Math.abs(dot / len) < minDist;
}

function _attr(o, n, v) {
    if (o && n)
        o.setAttribute(n, v);
}

function _bounds(o, w, h) {
    o.style.width = w + 'px';
    o.style.height = h + 'px';
}

function _pos(o, x, y) {
    o.style.left = x + 'px';
    o.style.top = y + 'px';
}

function bansheeReflect(obj, target) {
    var szOut = '';
    for (var prop in obj)
        szOut += prop.toString() + ' = ' + obj[prop] + '\n';
    if (target && __isFunc(target))
        target(szOut);
    else
        alert(szOut);
}

function bansheeSizeFirstChild(obj, w, h) {
    if (obj == null)
        return false;
    var o = obj.firstElementChild;
    if (!o)
        return false;
    _attr(o, 'width', w);
    _attr(o, 'height', h);
    return true;
}

function bansheeSetBoundsRect(ctrl, x, y, w, h) {
    if (!ctrl)
        return false;
    if (ctrl.x === x && ctrl.y === y && ctrl.w === w && ctrl.h === h)
        return false;
    ctrl.x = x;
    ctrl.y = y;
    ctrl.w = w;
    ctrl.h = h;
    return true;
}

function bansheeUpdateBounds(o) {
    bansheeSetBounds(o, o.x, o.y, o.w, o.h);
}

function bansheeSetBounds(ctrl, x, y, w, h, szProj) {
    if (!ctrl)
        return false;
    /*
    if (!bansheeSetBoundsRect(ctrl,x,y,w,h))
         return false;
    */

  x = bansheeZeroFloatPrecision(x);
  y = bansheeZeroFloatPrecision(y);
  w = bansheeZeroFloatPrecision(w);
  h = bansheeZeroFloatPrecision(h);



    bansheeSetBoundsRect(ctrl, x, y, w, h);
    if (!szProj)
        szProj = 'absolute';
    //HTML div-object
    var trg = ctrl.DivCtrl;
    if (trg) {
        trg.style.position = szProj;
        _pos(trg, x, y);
        _bounds(trg, w, h);
        /*
        _attr(trg, 'width', w);// +'px');
        _attr(trg, 'height', h);// +'px');
        */
    }
    trg = ctrl.EmbedCtrl;
    if (trg) {
        trg.style.position = szProj;
        _attr(trg, 'width', w);
        _attr(trg, 'height', h);
        bansheeSizeFirstChild(trg, w, h);
        _attr(trg, 'disabled', 'true');
    }
    trg = ctrl.CanvasCtrl;
    if (trg) {
        //update the canvas
        trg.style.position = szProj;
        _attr(trg, 'width', w);
        _attr(trg, 'height', h);
    }
    bansheeSafeCall(ctrl, 'Invalidate');
    if (ctrl.Banshee)
        ctrl.Banshee.SendCancelMode(ctrl);//update the cursor, mouse control
    return true;
}

function bansheeUIHitTest(o, x, y, bModal,bFullWindow) {
    if (bModal)
        return o.Enabled && o.UIActive && o.Visible;
    if (!o.Enabled || !o.UIActive || !o.Visible)
        return false;
    var ptAbs = bansheeStagePos(o.DivCtrl, o.Banshee.DivCtrl);
    x -= ptAbs[0]; y -= ptAbs[1]; x += o.x; y += o.y;

    var oX,oY,oW,oH;
    if (bFullWindow)
    {
      oX = o.x;
      oY = o.y;
      oW = o.DivCtrl.offsetWidth;
      oH = o.DivCtrl.offsetHeight;
    }
    else
    {
      oX = o.x + o.DivCtrl.clientLeft + bansheeTranslateValue(o.DivCtrl.style.paddingLeft, 0);
      oY = o.y + o.DivCtrl.clientTop + bansheeTranslateValue(o.DivCtrl.style.paddingTop, 0);
      oW = o.w;
      oH = o.h;
    }

    return bansheePtInRect(x, y, oX, oY, oX + oW, oY + oH);
}

function bansheeClientMousePos(o) {
    var cur = o.Banshee.GetCursorInfo();
    return [cur[0] - o.x, cur[1] - o.y];
}

function bansheeGetPos(o,bFullscreen) {
    var l, t;
    l = t = 0;
  /*
  if (bFullscreen)
      return [l,t];
  */

    while (o) {
        l += o.offsetLeft;
        t += o.offsetTop;

        if (o.scrollLeft)
            l += o.scrollLeft;
        if (o.scrollTop)
            t += o.scrollTop;

        o = o.offsetParent;
    }
    if (window.pageXOffset)
        l -= window.pageXOffset;

    if (window.pageYOffset)
        t -= window.pageYOffset;

    if (__isWEBKIT) {
        if (window.scrollX)
            l -= window.scrollX;
        if (window.scrollY)
            t -= window.scrollY;
    }
    return [l, t];
}

function bansheeStagePos(o, bansheeDIV) {
    var l, t;
    l = t = 0;
    while (o) {
        l += o.offsetLeft;
        t += o.offsetTop;

        if (o.scrollLeft)
            l -= o.scrollLeft;
        if (o.scrollTop)
            t -= o.scrollTop;


        o = o.offsetParent;
        if (o == bansheeDIV)
            break;
    }
    return [l, t];
}



function bansheeClipView(ctrl, x, y, w, h) {
    if (!ctrl || !ctrl.DivCtrl)
        return false;

  x = bansheeZeroFloatPrecision(x);
  y = bansheeZeroFloatPrecision(y);
  w = bansheeZeroFloatPrecision(w);
  h = bansheeZeroFloatPrecision(h);

    ctrl.DivCtrl.style.clip = 'rect(' + y + 'px ' + (x+w) + 'px ' + (y+h) + 'px ' + x + 'px)';
    return true;
}

function bansheeCancelDefEvent(e) {
    bansheeSafeCall(e, 'stopPropagation');
    bansheeSafeCall(e, 'preventDefault');
}

function bansheeGetKeyCode(evt) {
    return (evt.keyCode != null ? evt.keyCode : evt.which);
}

function bansheeGetWheelDelta(evt) {
    return (evt.wheelDelta != null ? evt.wheelDelta : -evt.detail);
}

function bansheeMouseToClient(self) {
    if (!self || !self.Banshee)
        return [0, 0];
    else {
        var a = self.Banshee.GetCursorInfo();
        var b = bansheeStagePos(self.DivCtrl,self.Banshee.DivCtrl);
        return [a[0] - b[0], a[1] - b[1]];
    }
}

function bansheeGetPinchVectorLength(e) {
    if (e && e.touches && e.touches.length === 2) {
        var pt1 = e.touches.item(0);
        var pt2 = e.touches.item(1);
        var v1 = [pt1.clientX, pt1.clientY];
        var v2 = [pt2.clientX, pt2.clientY];
        return bansheeVectorLength2D(v1, v2);
    }
    else
        return 0;
}

function bansheeGetPinchCenter(e) {
    if (e && e.touches && e.touches.length === 2) {
        var pt1 = e.touches.item(0);
        var pt2 = e.touches.item(1);
        var x1 = pt1.clientX;
        var y1 = pt1.clientY;
        var x2 = pt2.clientX;
        var y2 = pt2.clientY;
        var min = [x1 < x2 ? x1 : x2, y1 < y2 ? y1 : y2];
        var max = [x1 < x2 ? x2 : x1, y1 < y2 ? y2 : y1];
        return [min[0] + max[0] * 0.5, min[1] + max[1] * 0.5];
    }
    else
        return [0, 0];
}


function bansheeNotify(o, m, a, b, c) {
    if (o && o[m]) {
        return o[m](a, b, c);
    }
    return false;
}

function bansheeSetOwner(_self, _owner) {
    if (!_self || _self.Owner === _owner)
        return false;
    var iIdx = -1;
    if (_self.Owner && _self.Owner.Components) {
        iIdx = _self.Owner.Components.indexOf(_self);
        _self.Owner.Components.splice(iIdx, 1);
    }
    _self.Owner = null;
    if (!_owner)
        return false;
    if (_owner.Components)
        _owner.Components.push(_self);
    else {
        _owner.Components = [];
        _owner.Components.push(_self);
    }
    _self.Owner = _owner;
    return true;
}

function bansheeComponentsCount(_self) {
    if (!_self || !_self.Components)
        return -1;
    return _self.Components.length;
}

function bansheeRemoveControl(obj, banshee) {
    if (!obj || !banshee)
        return;
    banshee.RemoveControl(obj);
}

function HtmlStageObject(_parent, bEmbed) {
    this.m_div = document.createElement('div');

    if (bEmbed)
        this.m_embed = document.createElement('div');//innerHTML wird das embed-object enthalten;
    else
        this.m_embed = null;

    this.m_canvas = document.createElement('canvas');
    this.m_div.appendChild(this.m_canvas);

    //this.m_canvas = null;

    if (this.m_embed)
        this.m_div.appendChild(this.m_embed);

    if (_parent)
        _parent.appendChild(this.m_div);
    else
        document.body.appendChild(this.m_div);
}

function __bansheesetUIActive(obj, bUIActive) {
    if (!obj)
        return;
    if (!obj.Visible || !obj.Enabled)
        bUIActive = false;

    obj.UIActive = bUIActive;

    if (obj.DivCtrl)
    {
      if (!bUIActive)
        obj.DivCtrl.style.pointerEvents = 'none';
      else
        obj.DivCtrl.style.pointerEvents = 'auto';
    }


    if (!obj.Components)
        return;
    var i, iCount = bansheeComponentsCount(obj);
    for (i = 0; i < iCount; i++)
        __bansheesetUIActive(obj.Components[i], bUIActive);
}

function bansheeCSSTransform(s, d) {
    if (__isWEBKIT) {
        s['webkitTransform'] = d;
        return 0;
    }
    else {
        s['transform'] = d;
        return 1;
    }
}

function bansheeAddHTMLClass(smartLayer, classname) {
    if (smartLayer && smartLayer.DivCtrl && classname) {
        smartLayer.DivCtrl.classList.add(classname);
        bansheeSyncSmartLayer(smartLayer);
    }
}

function bansheeRemoveHTMLClass(smartLayer, classname) {
    if (smartLayer && smartLayer.DivCtrl && classname) {
        smartLayer.DivCtrl.classList.remove(classname);
        bansheeSyncSmartLayer(smartLayer);
    }
}

function bansheeSyncSmartLayer(smartLayer) {
    if (!smartLayer)
        return;


    //oX = o.x + o.DivCtrl.clientLeft + bansheeTranslateValue(o.DivCtrl.style.paddingLeft,0);
    //oY = o.y + o.DivCtrl.clientTop + bansheeTranslateValue(o.DivCtrl.style.paddingTop,0);

    var div = smartLayer.DivCtrl;

    smartLayer.x = div.offsetLeft + div.clientLeft + bansheeTranslateValue(div.style.paddingLeft, 0);
    smartLayer.y = div.offsetTop + div.clientTop + bansheeTranslateValue(div.style.paddingTop, 0);
    smartLayer.w = div.clientWidth;
    smartLayer.h = div.clientHeight;

    if (smartLayer.CanvasCtrl)
    {
      _attr(smartLayer.CanvasCtrl, 'width', smartLayer.w);
      _attr(smartLayer.CanvasCtrl, 'height', smartLayer.h);
    }


    if (smartLayer.Banshee)
        smartLayer.Banshee.SendCancelMode(smartLayer);//update the cursor, mouse control

    bansheeSafeCall(smartLayer,'Invalidate',null);

}

function bansheeSetEnabled(o, bEnabled) {
    if (!o)
        return;
    o.Enabled = bEnabled;
    __bansheesetUIActive(o, bEnabled);
    if (o.Banshee)
      o.Banshee.SendCancelMode(o);//update the cursor, mouse control

}

function bansheeSetVisible(o, bVis) {
    if (!o || !o.DivCtrl)
        return;
    o.Visible = bVis;

    if (!bVis) {
        o.DivCtrl.style.visibility = 'hidden';
        __bansheesetUIActive(o, false);
    }
    else {
        o.DivCtrl.style.visibility = 'visible';
        if (o.Enabled)
            __bansheesetUIActive(o, true);
        bansheeSafeCall(o, 'Invalidate');
    }
}


function __isFunc(f) { return typeof (f) === 'function'; }

function __isObject(f) { return typeof (f) === 'object'; }

function bansheeNotifyOwner(_this, _func, params) {
    if (!_func)
        return null;
    if (!_this || !_this.Owner) {
        __critError('bansheeNotifyOwner::' + 'Cannot access owner of ' + _this);
        return null;
    }
    if (typeof (_this.Owner[_func]) === 'function') {
        return _this.Owner[_func](_this, params);
    }
    else {
        __critError('bansheeNotifyOwner::' + _func + ' is not a function');
        return null;
    }
}

function bansheeSenderCall(_this, _inst, _func, params) {
    if (!_inst || !_func) {
        __critError('bansheeSenderCall::' + 'Cannot access Instance ' + _inst);
        return -1;
    }
    if (typeof (_inst[_func]) == 'function') {
        return _inst[_func](_this, params);
    }
    else {
        __critError('bansheeSenderCall::' + _func + ' is not a function');
        return -2;
    }
}

function bansheeSafeCall(_inst, _func, params) {
    if (!_inst || !_func) {
        return -1;
    }
    if (typeof (_inst[_func]) == 'function') {
        return _inst[_func](params);
    }
    else {
        if (!_inst[_func])
            return -3;
        //__critError(_func + ' is not a function of object ' + _inst.ClassName);
        return -2;
    }
}

function bansheeExternalCall(_func, params) {
    if (!_func || !((typeof (_func) == 'function')))
        return -1;
    return _func(params);
}


function bansheeInitComponent(o, owner, banshee, className, name) {
    if (!o)
        return false;
    o.Banshee = banshee;
    o.ClassName = className;
    o.Name = name;
    o.Tag = 0;
    o.Loading = 0;
    if (owner)
        bansheeSetOwner(o, owner);
    return true;
}

function bansheeFreeComponents(o) {
    if (!o)
        return;
    var iCount = bansheeComponentsCount(o) - 1;
    for (var i = iCount; i >= 0; i--) {
        if (o.Components[i].Free)
            o.Components[i].Free();

        if (o.Banshee) {
            bansheeSetOwner(o.Components[i], null);
            o.Banshee.RemoveControl(o.Components[i]);
        }
    }
}
function bansheeFree(o) {
    if (!o)
        return;
    bansheeFreeComponents(o);
    bansheeSetOwner(o, null);
    if (o.Banshee)
        o.Banshee.RemoveControl(o);

    o.Banshee = null;
    o.ClassName = null;
    o.Name = null;
    o.Tag = null;
    o.Loading = null;
}

function bansheeInitVisual(obj, htmlParent, bCreateEmbed) {
    if (!obj)
        return false;
    if (htmlParent) {
        obj.htmlCtrls = new HtmlStageObject(htmlParent, bCreateEmbed);
        obj.DivCtrl = obj.htmlCtrls.m_div;
        obj.CanvasCtrl = obj.htmlCtrls.m_canvas;
        obj.EmbedCtrl = obj.htmlCtrls.m_embed;

        if (obj.EmbedCtrl) {
            obj.EmbedCtrl.disabled = 'true';
        }
        obj.Parent = htmlParent;
    }
    else
        obj.Parent = null;
    obj.x = obj.y = obj.w = obj.h = 0;
    obj.Visible = true;
    obj.Enabled = true;
    obj.Draggable = false;
    obj.UIActive = obj.Owner ? obj.Owner.UIActive : true;
    obj.ZOrder = 0;
    obj.Opacity = 1.0;//Smart++ AlphaFactor (Alpha-Factor für den kompletten Layer)
    obj.Scale = 1.0;//Zoom Factor
    obj.Cursor = 0;//Cursor ID
    return true;
}

function bansheeOverride(_htmlElement, _methodOrg, _layer, _methodTrg) {
    if (!_htmlElement || !_methodOrg || !_layer || !_methodTrg)
        return null;
    var retVal = null;
    if (__isFunc(_htmlElement[_methodOrg])) {
        retVal = _htmlElement[_methodOrg];
    }
    if (!__isFunc(_layer[_methodTrg]))
        return null;
    _htmlElement[_methodOrg] = _layer[_methodTrg].bind(_layer);
    return retVal;
}

function bansheeInherited(_func, params) {
    if (__isFunc(_func))
        _func(params);
}

function bansheeGetCompPath(o) {
    if (!o)
        return 'ERROR in==null';
    var szOut;
    szOut = o.ClassName;
    o = o.Owner;
    while (o) {
        szOut = o.ClassName + '/' + szOut;
        o = o.Owner;
    }
    return szOut;
}

function bansheeTraceOut(o, szOut) {
    if (!o || szOut === null || szOut.length == 0 || !o.Banshee)
        return;
    bansheeSenderCall(o, o.Banshee, 'TraceOut', o.ClassName + ':' + szOut);
}

function bansheeErrorOut(o, szOut) {
    if (!o || szOut === null || szOut.length == 0 || !o.Banshee)
        return;
    bansheeSenderCall(o, o.Banshee, 'ErrorOut', o.ClassName + ':' + szOut);
}

//*********************************************************************
//Smart++ AnimController **********************************************
//*********************************************************************
function TAnimStates() {
  this.m_bSetBounds = false;
  this.m_bOpacity = false;
  this.m_bScale = false;
}

function Bezier_Spline(f,ctrl0,ctrl1,ctrl2,ctrl3)
{
  var ab = ctrl0 + (ctrl1 - ctrl0) * f;
  var bc = ctrl1 + (ctrl2 - ctrl1) * f;
  var cd = ctrl2 + (ctrl3 - ctrl2) * f;

  var abbc = ab + (bc-ab) * f;
  var bccd = bc + (cd-bc) * f;
  return abbc + (bccd - abbc) * f;
}


function TAnimController(obj, speed, src,lpfFunc) {

    var m_states = new TAnimStates();
    var m_props = [];
    var m_speed = speed;//1000
    var m_fTicks = 1000 / BANSHEE_SMPTE_TICKS;// 60 fps
    var m_fProgress = 0;

   /*
  function   Util_BEZIER_SPLINE( u1(*,u2,u3*),ctrl0,ctrl1,ctrl2,ctrl3 : single):single;
  var ab,bc,cd,abbc,bccd : single;
  begin
  (*ab    := lerp(ctrl0,ctrl1,u1);
  bc    := lerp(ctrl1,ctrl2,u1);
  cd    := lerp(ctrl2,ctrl3,u1);
  abbc  := lerp(ab,bc,u1);
  bccd  := lerp(bc,cd,u1);
  result := lerp(abbc,bccd,u1);*)
  //a + (b-a) * t;
  ab    := ctrl0 + (ctrl1 - ctrl0) * u1;
  bc    := ctrl1 + (ctrl2 - ctrl1) * u1;
  cd    := ctrl2 + (ctrl3 - ctrl2) * u1;

  abbc  := ab + (bc-ab) * u1;
  bccd  := bc + (cd-bc) * u1;

  result := abbc + (bccd - abbc) * u1;
  end;
  */


  this.Animate = function () {
        if (m_fProgress >= m_speed)
            return false;
        m_fProgress += m_fTicks;
        var bFinalize;
        bFinalize = (m_fProgress >= m_speed);
        var iCnt = m_props.length;
        for (var i = 0; i < iCnt; i += 3) {
            var pitch, val, currProp;
            if (!bFinalize) {

                if (lpfFunc)
                {
                  var a = m_props[i + 2];
                  var b = m_props[i + 1];
                  val = lpfFunc(m_fProgress,m_speed,a,b);
                }
                else
                {
                  pitch = (m_props[i + 1] - m_props[i + 2]) / m_speed;
                  pitch *= m_fProgress;
                  val = pitch + m_props[i + 2];
                }
              /*
              var a = m_props[i + 2];
              var b = m_props[i + 1];
              val = Bezier_Spline ( m_fProgress / m_speed,
                                    a,
                                    b ,
                                    b ,
                                    b
                                  )
              */
            }
            else
                val = m_props[i + 1];//Avoid rounding errors && divs by zero
            currProp = m_props[i];
            obj[currProp] = val;
        }

        if (m_states.m_bSetBounds)
            obj.SetBounds(obj.x, obj.y, obj.w, obj.h);

        if (m_states.m_bScale && obj.DivCtrl) {
            var invX = (1 - obj.Scale) * obj.w * 0.5;
            var invY = (1 - obj.Scale) * obj.h * 0.5;
            var trans = ' translate' + '(' + invX + 'px' + ',' + invY + 'px' + ') ';
            var scale = ' scale' + '(' + obj.Scale + ') ';
            var s = trans + scale;
            bansheeCSSTransform(obj.DivCtrl.style, s);
        }

        if (m_states.m_bOpacity && obj.DivCtrl)
            obj.DivCtrl.style['opacity'] = obj.Opacity;

        return !bFinalize;
    };


    this.Init = function () {
        for (var prop in src) {
            if (obj[prop] != undefined) {
                m_props.push(prop);//prop-name
                m_props.push(src[prop]);//target-value
                m_props.push(obj[prop]);//src-value
                if (prop === 'x' || prop === 'y' || prop === 'w' || prop === 'h')
                    m_states.m_bSetBounds = true;
                else if (prop == 'Opacity')
                    m_states.m_bOpacity = true;
                else if (prop == 'Scale')
                    m_states.m_bScale = true;
            }
        }
        if (m_speed <= 0) {//Autoset
            m_speed = 1;
            this.Animate();//Set the props
        }

    };
    this.Init();
}


//***********************************************************************
//Rendering stuff
//***********************************************************************

function bansheeGetDC(layer) {
    return (layer.CanvasCtrl === null) ? null : layer.CanvasCtrl.getContext('2d');
}

function bansheeFillRect(dc, x, y, w, h, color) {
    if (dc) {
        if (color)
            dc.fillStyle = color;
        dc.fillRect(x, y, w, h);
    }
}

function bansheeRoundRect(dc,x,y,w,h,r,color)
{
  if (dc)
  {
    if (w < 2 * r)
      r = w * 0.5;
    if (h < 2 * r)
      r = h * 0.5;
    if (color)
      dc.strokeStyle = color;

    dc.beginPath();
    dc.moveTo(x+r, y);
    dc.arcTo(x+w, y,   x+w, y+h, r);
    dc.arcTo(x+w, y+h, x,   y+h, r);
    dc.arcTo(x,   y+h, x,   y,   r);
    dc.arcTo(x,   y,   x+w, y,   r);
    dc.closePath();
    dc.stroke();
  }
}



function bansheeSelectBrush(dc, color) {
    if (dc) dc.fillStyle = color;
}

function bansheeTextOut(dc, x, y, text, color) {
    if (dc && text !== null) {
        if (color)
            dc.fillStyle = color;
        dc.textBaseline = 'top';

        var measure = dc.measureText('W ');
        var dummyheight = measure.width;

        var iPos = text.indexOf('\n');
        if (iPos >= 0) {
            var szText;
            while (true) {
                szText = text.substring(0, iPos);
                dc.fillText(szText, x, y);
                text = text.substring(iPos + 1);
                iPos = text.indexOf('\n');
                y += dummyheight;
                if (iPos < 0) {
                    szText = text;
                    break;
                }
            }
            dc.fillText(szText, x, y);

        }
        else
            dc.fillText(text, x, y);
    }
}
/*
var font = “20px sans-serif”
var d = document.createElement(”span”);
d.style.cssText = “font: “ + font + “ height: 1em; display: block”
// the value to multiply PX’s by to convert to EM’s
var EM2PX = 1 / d.offsetHeight;
*/

function bansheeSelectFont(dc, fontname) {
    if (dc && fontname)
        dc.font = fontname;
}


function bansheeTranslateValue(szValIn, defValue) {
    if (!szValIn)
        return defValue;
    var iPos = szValIn.indexOf('px');
    if (iPos > 0)
        szValIn = szValIn.substring(0, iPos);
    return StrToFloatDef(szValIn, defValue);
}

function bansheeClampColorChannelValue(val) {
    if (val < 0)
        return 0;
    if (val > 255)
        return 255;
    return val;
}



function TARGBColor(a, r, g, b) {
    this.m_a = parseInt(a);
    this.m_r = parseInt(r);
    this.m_g = parseInt(g);
    this.m_b = parseInt(b);

    this.GetCSSColor = function () {
        return 'rgba(' + this.m_r + ',' + this.m_g + ',' + this.m_b + ',' + this.m_a / 255 + ')';
    };

    this.Assign = function (newColor) {
        if (newColor instanceof TARGBColor) {
            this.m_a = newColor.m_a;
            this.m_r = newColor.m_r;
            this.m_g = newColor.m_g;
            this.m_b = newColor.m_b;
        }
        else
            if (typeof (newColor) === 'number') {
                this.FromARGB(newColor);
            }
            else
                if (typeof (newColor) === 'string') {
                    if (newColor.length === 7)// RGB bsp:'#ff00ff'
                    {
                        newColor = newColor.substr(1);
                        this.FromARGB('0xFF' + newColor);
                    }
                    else
                        if (newColor.length === 9)// ARGB bsp:'#7Fff00ff'
                        {
                            newColor = newColor.substr(1);
                            this.FromARGB('0x' + newColor);
                        }
                }
    };

    this.ClampColors = function () {
        this.m_a = bansheeClampColorChannelValue(this.m_a);
        this.m_r = bansheeClampColorChannelValue(this.m_r);
        this.m_g = bansheeClampColorChannelValue(this.m_g);
        this.m_b = bansheeClampColorChannelValue(this.m_b);
    };

    this.FromARGB = function (dwARGBIn) {
        var val = parseInt(dwARGBIn);
        if (isNaN(val)) {

            this.m_a = 255;
            this.m_r = 255;
            this.m_g = 255;
            this.m_b = 255;
        }
        else {
            this.m_a = (val & 0xFF000000) >>> 24;
            this.m_r = (val & 0xFF0000) >>> 16;
            this.m_g = (val & 0xFF00) >>> 8;
            this.m_b = (val & 0xFF);
        }
    };

    this.ConvertToARGBDword = function (bNoPrefix) {
        this.ClampColors();
        var val = (this.m_a << 24) + (this.m_r << 16) + (this.m_g << 8) + this.m_b;
        return bansheeGetHexValue(val, 8,bNoPrefix);
    };
}


//***********************************************************************
//Rendering stuff END
//***********************************************************************

function bansheeGetMouseButton(e) {
    return e.button;
}

//Component reader
//o == zielObjekt, node == xmlNode
function bansheeReadComponentProps(owner, node, lpfConstruct) {
    var o = null;
    if (lpfConstruct) {
        if (__isFunc(lpfConstruct))
            o = new lpfConstruct(owner, owner.DivCtrl, owner.Banshee);
        else
            if (__isObject(lpfConstruct))
                o = lpfConstruct;
    }
    else
        o = owner;

    if (!o)
        return o;
    var attr = node.attributes;
    if (attr) {
        var iCnt = attr.length;
        for (var i = 0; i < iCnt; i++) {
            var szName = attr[i].nodeName;
            if (szName === 'x')
                o.x = bansheeTranslateValue(attr[i].nodeValue, o.x);
            else if (szName === 'y')
                o.y = bansheeTranslateValue(attr[i].nodeValue, o.y);
            else if (szName === 'width')
                o.w = bansheeTranslateValue(attr[i].nodeValue, o.w);
            else if (szName === 'height')
                o.h = bansheeTranslateValue(attr[i].nodeValue, o.h);
            else if (o.ReadProperty)
                o.ReadProperty(szName, attr[i].nodeValue);
        }
    }
    return o;
}

/*
 1 Elementknoten
 2 Attributknoten
 3 Textknoten
 4 Knoten für CDATA-Bereich
 5 Knoten für Entity-Referenz
 6 Knoten für Entity
 7 Knoten für Verarbeitungsanweisung
 8 Knoten für Kommentar
 9 Dokument-Knoten
 10 Dokumenttyp-Knoten
 11 Dokumentfragment-Knoten
 12 Knoten für Notation
 */
function bansheeReadComponentClass(layer, lpXMLNode, lpfClassCreate) {
    if (!layer || !lpXMLNode || !lpfClassCreate) {
        __critError('bansheeReadComponentClass' + '(layer,lpXMLNode,lpfClassCreate) wrong parameters.');
        return;
    }


    function __EmitNode(root, node) {
        var ele = null;
        try {
            ele = lpfClassCreate(layer, root, node);
            if (ele)
                bansheeReadComponentProps(ele, node);
        }
        catch (e) {
            __critError('bansheeReadComponentClass' + '__EmitNode::' + node.nodeType + '---' + node.nodeName + '. ' + e);
            return null;
        }
        return ele;
    }


    function __ScanTree(root, node) {
        if (!node)
            return;
        if (node.nodeType === 1) {
            if (root)
                root.Loading = 1;
            root = __EmitNode(root, node);
        }
        else
            return;

        if (node.childNodes && root) {
            var iCnt = node.childNodes.length;
            for (var i = 0; i < iCnt; i++)
                __ScanTree(root, node.childNodes[i]);
        }
        if (root && root.OnLoaded) {
            root.Loading = 0;
            root.OnLoaded();
        }
    }

    try {
        __ScanTree(layer, lpXMLNode);
    } catch (e) {
        __critError('bansheeReadComponentClass' + '::scanning xml-data-tree.' + e);
    }
}


function bansheeReadComponent(xmlIn, instIn, lpfClassCreate) {
    if (!instIn || !xmlIn || !lpfClassCreate) {
        __critError('bansheeReadComponent' + '(xmlIn,instIn,lpfClassCreate) wrong parameters.');
        return false;
    }
    var m_parser = new DOMParser();
    var m_xmlDoc = null;

    try {
        m_xmlDoc = m_parser.parseFromString(xmlIn, 'text/xml');
    } catch (e) {
        __critError('bansheeReadComponent' + '::parsing xml-data');
        return false;
    }

    if (m_xmlDoc) {
        var iCnt = m_xmlDoc.childNodes.length;
        for (var i = 0; i < iCnt; i++)
            bansheeReadComponentClass(instIn, m_xmlDoc.childNodes[i], lpfClassCreate);
        return true;
    }
    return false;
}

function bansheeGetClassFromXMLElement(lpXMLNode) {
    if (!lpXMLNode || !lpXMLNode.nodeType || !(lpXMLNode.nodeType === 1))//elements only
        return null;
    else {
        var attr = lpXMLNode.attributes;
        if (!attr)
            return null;
        var iCnt = attr.length;
        for (var i = 0; i < iCnt; i++) {
            if (attr[i].nodeName === 'fccs:class')
                return attr[i].nodeValue;
        }
    }
    return null;
}



function bansheeReadXML(xmlIn, instIn, lpfPropCallback) {
    if (!instIn) {
        __critError('bansheeReadXML' + '(xmlIn,instIn,lpfPropCallback) wrong parameters.');
        return null;
    }
    var m_parser = new DOMParser();
    var m_xmlDoc = null;

    function __ReadAttribs(root, node) {
        var attr = node.attributes;
        if (attr) {
            var iCnt = attr.length;
            for (var i = 0; i < iCnt; i++)
                lpfPropCallback(instIn, root, attr[i], 'attribute');
        }
    }

    function __ReadElement(root, node) {
        try {
            __ReadAttribs(root, node);
        }
        catch (e) {
            __critError('bansheeReadXML' + '__ReadElement::' + node.nodeType + '---' + node.nodeName);
            return null;
        }
        return root;
    }

    function __ScanTree(root, node) {
        if (!node)
            return;

        var lpIn = null;
        if (node.nodeType === 1)//Element
        {
            lpIn = lpfPropCallback(instIn, root, node, 'elementBegin');
            root = __ReadElement(root, node);
        }
        else
            return;

        if (node.childNodes) {
            var iCnt = node.childNodes.length;
            for (var i = 0; i < iCnt; i++)
                __ScanTree(root, node.childNodes[i]);
        }
        if (node.nodeType === 1)//Element
            lpfPropCallback(instIn, lpIn, node, 'elementEnd');

    }
    try {
        m_xmlDoc = m_parser.parseFromString(xmlIn, 'text/xml');
    } catch (e) {
        __critError('bansheeReadXML' + '::parsing xml-data');
        return null;
    }

    if (m_xmlDoc && lpfPropCallback) {
        var iCnt = m_xmlDoc.childNodes.length;
        for (var i = 0; i < iCnt; i++)
            __ScanTree(instIn, m_xmlDoc.childNodes[i]);
    }
    return m_xmlDoc;
}



//************************************************************
function bansheeLoadTexture(layer,texInstance,szFilename,szOnTextureLoaded)
{
  if (!layer)
    return null;
  if (texInstance && texInstance.m_Filename === szFilename)
    return texInstance;
  if (szFilename) {
    if (texInstance)
      texInstance.LoadTexture(szFilename);
    else
      return new TBansheeTexture(layer, szFilename, szOnTextureLoaded);
  }
  else {
    bansheeSafeCall(texInstance, 'Free', null);
    texInstance = null;
  }
  return texInstance;
}



function TBansheeTexture(sender, szFile, onLoaded) {
    this.m_img = new Image();
    this.m_ErrorCode = 0;//Loading..
    this.m_Filename = szFile;
    this.OnTextureLoaded = function () {
        this.m_ErrorCode = this.m_img.width * this.m_img.height > 0 ? 1 : 3;//Loaded && ready == 1
        bansheeNotify(sender, onLoaded, this, true);
    };

    this.OnTextureError = function () {
        this.m_ErrorCode = 2;//File could not be found
        bansheeNotify(sender, onLoaded, this, false);
    };

    this.LoadTexture = function (filename) {
        this.m_Filename = filename;
        this.m_ErrorCode = 0;//Loading..
        this.m_img.src = this.m_Filename;
    };

    this.Free = function () {
        this.m_ErrorCode = 0;//Loading..
        this.m_img.src = null;
        this.m_img.onload = null;
        this.m_img.onerror = null;
        delete this.m_img;
        this.m_img = null;
        this.m_Filename = null;
    };

    //******************Frames support*************************************
    var m_TilesX = 1;
    var m_TilesY= 1;
    var m_TU = 0;
    var m_TV = 0;

    this.SetNumFrames = function(iNumTilesX,iNumTilesY)
    {
      m_TilesX = parseInt(iNumTilesX);
      if (m_TilesX <= 0)
        m_TilesX = 1;
      m_TilesY = parseInt(iNumTilesY);
      if (m_TilesY <= 0)
        m_TilesY = 1;
    };

    this.SelectFrame = function(layer,iFrameNum)
    {
      if (this.m_ErrorCode === 1)//Loaded and ready
      {
          if (iFrameNum < 0)
            iFrameNum = 0;

          if (m_TilesY * m_TilesX > 1)
          {
            var img = this.m_img;
            var w = img.width / m_TilesX;
            var h = img.height / m_TilesY;
            var offx = (iFrameNum % m_TilesX);
            m_TU = offx * w;
            iFrameNum -=offx;
            m_TV = iFrameNum / m_TilesY * h;
          }
          else
          {
            m_TU = 0;
            m_TV = 0;
          }
          bansheeSafeCall(layer,'Invalidate');
      }
    };

    this.RenderFrame = function(dc,x,y,w,h)
    {
       if (this.m_ErrorCode === 1)//Loaded and ready
       {
         var img = this.m_img;
         if (m_TilesX * m_TilesY > 1)
          {
            var tw = img.width / m_TilesX;
            var th = img.height / m_TilesY;
            dc.drawImage(img, m_TU, m_TV, tw, th, x, y, w, h);
          }
          else
            dc.drawImage(img,0,0,img.width,img.height,x,y,w,h);
       }
    };



  //******************Frames support END***********************************


    this.m_img.onload = this.OnTextureLoaded.bind(this);
    this.m_img.onerror = this.OnTextureError.bind(this);
    this.LoadTexture(this.m_Filename);
}

function TBansheeTextLoader(sender, file, onLoaded) {
    this.m_xhr = new XMLHttpRequest();
    this.m_ErrorCode = 0;//Loading..
    this.m_Filename = file;

    this.OnDataLoaded = function () {
        this.m_ErrorCode = this.m_xhr.status === 200 ? 1 : 2;//(Loaded && ready === 1) or (Failure === 2)
        bansheeNotify(sender, onLoaded, this, this.m_ErrorCode === 1, this.m_xhr.responseText);
    };

    this.OnDataError = function () {
        this.m_ErrorCode = 2;//Failure === 2
        bansheeNotify(sender, onLoaded, this, false, this.m_xhr.responseText);
    };

    this.LoadText = function (filename) {
        this.m_Filename = filename;
        this.m_ErrorCode = 0;//Loading..
        try {
            this.m_xhr.abort();
        } catch (e) {
            //ignore
        }
        if (this.m_Filename) {
            try {
                this.m_xhr.open('GET', this.m_Filename);
                this.m_xhr.responseType = 'text';
                this.m_xhr.setRequestHeader("If-Modified-Since", "Sat, 01 Jan 2005 00:00:00 GMT"); // force reloading in IE
                this.m_xhr.timeout = 1800000;//Perversistan wartezeit 30 min.
                this.m_xhr.send();
            } catch (e) {
                this.m_ErrorCode = 2;
                bansheeNotify(sender, onLoaded, this, false, 'EXCEPTION:' + e);
            }
        }
    };

    this.Free = function () {
        this.LoadText(null);//implicit abort
        this.m_xhr.onload = null;
        this.m_xhr.onerror = null;
    };


    this.m_xhr.onload = this.OnDataLoaded.bind(this);
    this.m_xhr.onerror = this.OnDataError.bind(this);

    this.LoadText(file);
}

function bansheeCursorIDToCSS(iID)
{
  //Scook overriden standard - cursors
  if (iID == 0)
    iID = 5;

  //-------------
  if (iID === 0)
    return 'default';
  else if (iID === -1)
    return 'none';
  else if (iID === -3)
    return 'crosshair';
  else if (iID === -4)
    return 'text';
  else if (iID === -5)
    return 'move';
  else if (iID === -6)
    return 'sw-resize';
  else if (iID === -7)
    return 'ns-resize';
  else if (iID === -8)
    return 'se-resize';
  else if (iID === -9)
    return 'ew-resize';
  else if (iID === -11)
    return 'wait';
  else if (iID === -19)
    return 'progress';
  else if (iID === -20)
    return 'help';
  else if (iID === -21)
    return 'pointer';
  else if (iID === 1)
    return 'url('+ APP_DATA_DIR + 'Scook_BV_Cursor_Pen.cur), pointer';
  else if (iID === 2)
   return 'url('+ APP_DATA_DIR + 'Scook_BV_Cursor_Marker.cur), pointer';
  else if (iID === 3)
    return 'url('+ APP_DATA_DIR + 'Scook_BV_Cursor_Trash.cur), pointer';
  else if (iID === 4)
    return 'url('+ APP_DATA_DIR + 'Scook_BV_Cursor_pure.cur), pointer';
  else if(iID === 5)
    return 'url('+ APP_DATA_DIR + 'Scook_BV_Cursor_pure.cur), pointer';
  else
    return 'auto';
}


//Cursor - Visualizer
function TCursorManager(_owner, _parent, _banshee) {
    bansheeInitComponent(this, _owner, _banshee, 'TCursorManager');
    bansheeInitVisual(this, _parent, false);

    this.SetBounds = function (x, y, w, h) { bansheeSetBounds(this, x, y, w, h); };
    var m_CurrID = 10000000;
    this.SetCursor = function (iID) {
        if (m_CurrID === iID)
            return;
        this.SetHint('NewCursor = ' + iID);
        //Don't use "switch" . Not tested in Linker-Context yet.
        m_CurrID = iID;
        this.DivCtrl.style.cursor = bansheeCursorIDToCSS(m_CurrID);
    };

    this.SetHint = function(szHintText)
    {
        this.DivCtrl.title = szHintText;
    };

    this.Banshee.AddControl(this);
    this.DivCtrl.style.pointerEvents = 'none';
}


function TBanshee(htmlParent, lpfMainLayerCreateFunc, szPositionType) {
    bansheeInitComponent(this, null, this, 'TBanshee');
    bansheeInitVisual(this, htmlParent, false);

    var BANSHEE_WINDOW_BACKGROUND_COLOR = 'white';
    var BANSHEE_WINDOW_TEXT_COLOR = 'black';//'#eeeeee';

    //Events
    this.p_OnError = null;
    this.p_OnNotification = null;
    //***************************************************

    this.m_Controls = [];
    this.m_CursorInfo = [0, 0, 0];

    this.m_CurrMouseControl = null;

    this.m_AnimControls = [];

    var m_f = this;
    var m_GameTimer = window.setInterval(function bansheeGameTimer() { __bansheegametimer(m_f); }, 1000 / BANSHEE_SMPTE_TICKS);

    //MainLayer
    var m_MainLayer = null;
    //************************
    var m_focusControl = null;
    var m_codeAdapters = null;
    //var currentModule = null;
    var m_bAutoFocus = false;
    var m_bZDirty = false;

    var m_TraceOutWindow = null;
    var m_CursorManager = null;

    this.m_KeepEventPropagation = false;

    var m_PositionType = szPositionType ? szPositionType : 'relative'; //'static','relative','absolute' or 'fixed'

    var m_IgnoreMouseEvents = false;

    function __bansheegametimer(obj) {
        if (obj.Animate)
            obj.Animate();
    }

    function __TestWebkit(o) {
        if (__isWEBKIT)
            return;

        for (var prop in o) {
            if (prop.toString().indexOf('webkitT') == 0) {
                __isWEBKIT = true;
                break;
            }
        }
    }

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Custom Events Section
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    //Mousewheel-Handler
    function bansheeHandleMouseWheel(e) {
        if (m_f)
            m_f.HandleMouseWheel(e);
    }

    //touch - handlers

    /*
     readonly    attribute TouchList touches;
     readonly    attribute TouchList targetTouches;
     readonly    attribute TouchList changedTouches;
     readonly    attribute boolean   altKey;
     readonly    attribute boolean   metaKey;
     readonly    attribute boolean   ctrlKey;
     readonly    attribute boolean   shiftKey;
   */
    /*
    interface Touch {
      readonly    attribute long        identifier;
      readonly    attribute EventTarget target;
      readonly    attribute long        screenX;
      readonly    attribute long        screenY;
      readonly    attribute long        clientX;
      readonly    attribute long        clientY;
      readonly    attribute long        pageX;
      readonly    attribute long        pageY;
    };
    */

    var m_bPinch = false;

    function triggerTouchEvent(szEventName, e) {
        if (!m_f)
            return;

        if (m_bPinch && (szEventName === 'touchcancel' || szEventName === 'touchend')) {
            //Prepare pinch-end
            m_bPinch = false;
            if (m_f.m_CurrMouseControl)
                bansheeNotify(m_f.m_CurrMouseControl, 'OnBansheeGesture', 'pinchEnd', e);
        }


        //bansheeTraceOut(m_f,'Touch:'+szEventName);

        if (m_f.m_CurrMouseControl)
            bansheeNotify(m_f.m_CurrMouseControl, 'OnBansheeGesture', szEventName, e);
    }

    function bansheeHandleTouchStart(e) {
        if (m_f) {
            if (e.touches.length == e.targetTouches.length) {
                /**
                 * If all of the active touch points are on the "touchable"
                 * element, the length properties should be the same.
                 */

                //bansheeTraceOut(m_f,'All points are on target element');
            }

            if (e.touches.length > 1) {
                /**
                 * On a single touch input device, there can only be one point
                 * of contact on the surface, so the following code can only
                 * execute when the terminal supports multiple touches.
                 */
                //bansheeTraceOut(m_f,'Hello Multiple Touch!');
            }
            else {
                /*
                var pt = e.touches.item(0);
                if (pt)
                  bansheeTraceOut(m_f,'TouchDown:'+ pt.identifier + ' : '+ pt.clientX + ' : '+ pt.clientY);
                else
                  bansheeTraceOut(m_f,'TouchDown == null');
                */
            }

            var pt1 = e.touches.item(0);
            m_f.m_CurrMouseControl = m_f.__GetCaptureControl(pt1);//Hack : normalerweise ist das ein Maus-event, aber die Function braucht nur e.clientX u. e.clientY


            triggerTouchEvent('touchstart', e);
            m_f.HandleEvent(e);
        }
    }

    function bansheeHandleTouchEnd(e) {
        if (m_f) {
            triggerTouchEvent('touchend', e);
            m_f.HandleEvent(e);
        }
    }

    function bansheeHandleTouchCancel(e) {
        if (m_f) {
            triggerTouchEvent('touchcancel', e);
            m_f.HandleEvent(e);
        }
    }

    function bansheeHandleTouchMove(e) {
        if (m_f) {
            var pt1 = e.touches.item(0);
            m_f.__UpdateCursorPos(pt1);//Hack : normalerweise ist das ein Maus-event, aber die Function braucht nur e.clientX u. e.clientY


            if ((e.touches.length == e.targetTouches.length) && (e.touches.length == 2))//Pinch?
            {

                if (!m_bPinch) {
                    m_bPinch = true;
                    triggerTouchEvent('pinchBegin', e);
                }
                /*
                var pt1 = e.touches.item(0);
                var pt2 = e.touches.item(1);
        
                var v1 = [pt1.clientX,pt1.clientY];
                var v2 = [pt2.clientX,pt2.clientY];
                var fLength = bansheeVectorLength2D(v1,v2);
                */
                triggerTouchEvent('pinch', e);
                //bansheeTraceOut(m_f,'banshee pinch > ' + fLength);
            }
            //bansheeTraceOut(m_f,'touchmove');
            triggerTouchEvent('touchmove', e);
            m_f.HandleEvent(e);
        }
    }



    function __handleHammer(evt) {
        var gest = evt.gesture;

        //bansheeReflect(gest.touches[0],AppTraceOut);
        //gest.preventDefault();
        var pos = bansheeGetPos(m_f.DivCtrl,m_bFullScreen);
        m_f.m_CursorInfo[0] = gest.touches[0].clientX - pos[0];
        m_f.m_CursorInfo[1] = gest.touches[0].clientY - pos[1];

        if (evt.type === 'touch' || evt.type === 'hold' || evt.type === 'tap' || evt.type === 'doubletap' || evt.type === 'dragstart') {
            m_f.m_CurrMouseControl = m_f.PickControl(m_f.m_CursorInfo[0], m_f.m_CursorInfo[1]);
            //bansheeTraceOut(m_f,'CAPTURE::'+m_f.m_CurrMouseControl);
        }

        var compText = m_f.m_CurrMouseControl === null?'No control':m_f.m_CurrMouseControl.ClassName;

        bansheeTraceOut(m_f,'Hammer Event:' + evt.type+ ' @'+compText);


      if (m_f.m_CurrMouseControl)
        {
            var result =  bansheeSafeCall(m_f.m_CurrMouseControl, 'OnGesture', evt);
            if (result === true)
            {
              //if (evt.type === 'tap')
              //  return;//Do not 'cancel' this event
                m_f.HandleEvent(gest);
            }
        }
    }


    function WINDOW_WIDTH()
    {
      if (window.innerWidth)
        return window.innerWidth;
      else
      if (document.body && document.body.offsetWidth)
        return document.body.offsetWidth;
      else
        return 0;
    }

    function WINDOW_HEIGHT() {
      if (window.innerHeight)
        return window.innerHeight;
      else
      if (document.body && document.body.offsetHeight)
        return document.body.offsetHeight;
       else
        return 0;
    }

    //ANIMATION - FRAME
  /*function() {
      var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      window.requestAnimationFrame = requestAnimationFrame;
      })();
   */
  /*
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

    var start = null;

    function step(timestamp) {
      var progress;
        if (start === null)
          start = timestamp;
      progress = timestamp - start;

      if (progress < 33) {
        requestAnimationFrame(step);
      }
    }

    //requestAnimationFrame(step);
    //********************************************
   */




    var m_bFullScreen = false;
    /*
    var m_OrgRect = [0,0,0,0];
    var m_iResetMode = 0;
    var m_realWindowSize = [0,0];
    */

    function ON_WINDOW_SIZE_CHANGED()
    {
      __WindowSizeChanged();
      /*
      if (m_bFullScreen)
      {
        if (m_iResetMode === 0)
        {
          m_OrgRect[0] = m_f.x;
          m_OrgRect[1] = m_f.y;
          m_OrgRect[2] = m_f.w;
          m_OrgRect[3] = m_f.h;

          m_iResetMode = 1;
          bansheeTraceOut(m_f,'Init:' + m_OrgRect[0]);
          m_f.SetBounds(0,0,m_realWindowSize[0],m_realWindowSize[1]);
          __WindowSizeChanged();
        }
        else
        {
          if (m_f.w != m_realWindowSize[0] || m_f.h != m_realWindowSize[1])
          {
            m_bFullScreen = false;
            ON_WINDOW_SIZE_CHANGED();
          }
        }
      }
      else
      {

        if (m_iResetMode == 1 && (m_OrgRect[2] != m_f.w || m_OrgRect[3] != m_f.h))
        {
          m_iResetMode = 0;
          bansheeTraceOut(m_f,'Reset:' + m_OrgRect[0]);
          m_f.SetBounds(m_OrgRect[0],m_OrgRect[1],m_OrgRect[2],m_OrgRect[3]);
          __WindowSizeChanged();
        }
        else
        {
          /*
          if (m_OrgRect[2] * m_OrgRect[3] > 0)
          {
            if (m_OrgRect[2] != m_f.w || m_OrgRect[3] != m_f.h)
            {
              bansheeTraceOut(m_f,'Set:' + m_OrgRect[0]);
              m_f.SetBounds(m_OrgRect[0],m_OrgRect[1],m_OrgRect[2],m_OrgRect[3]);
              __WindowSizeChanged();
            }

          }

        }
      }
      */
    }

    function ON_WINDOW_RESIZE()
    {
      /*var currW = WINDOW_WIDTH();
      var currH = WINDOW_HEIGHT();
      if (m_realWindowSize[0] != currW || m_realWindowSize[1] != currH)
      {
        m_realWindowSize[0] = currW;
        m_realWindowSize[1] = currH;*/
        ON_WINDOW_SIZE_CHANGED();
      //}
    }



    /*
    drag, dragstart, dragend, dragup, dragdown, dragleft, dragright
    swipe, swipeup, swipedown, swipeleft, swiperight
    */
    var hammerEvents = 'hold tap touch transform doubletap pinchin pinchout release dragstart drag dragend dragup dragdown swipeleft swiperight swipeup swipedown';
    this.AddCustomEventHandlers = function () {
        var elem = this.DivCtrl;


        window.addEventListener('resize',ON_WINDOW_RESIZE);

        if (elem.addEventListener) { // all browsers except IE before version 9
            // Internet Explorer, Opera, Google Chrome and Safari
            elem.addEventListener("mousewheel", bansheeHandleMouseWheel, false);
            // Firefox
            elem.addEventListener("DOMMouseScroll", bansheeHandleMouseWheel, false);

            try {
                if (('ontouchstart' in window) && Hammer)
                {
                    //m_IgnoreMouseEvents = true;

                    var hammertime = Hammer(elem).on(hammerEvents, function(event) {
                      __handleHammer(event);
                    });

                    /*
                    //touch
                    elem.addEventListener("touchstart", bansheeHandleTouchStart, false);
                    elem.addEventListener("touchend", bansheeHandleTouchEnd, false);
                    elem.addEventListener("touchmove", bansheeHandleTouchMove, false);
                    elem.addEventListener("touchcancel", bansheeHandleTouchCancel, false);
                    */

                }
            } catch (e) {
                console.log(BANSHEE_RUNTIME + ':Error while initializing hammer events');
                console.log(e);
            }
        }
    };


    this.RemoveCustomEventHandlers = function () {
        var elem = this.DivCtrl;
        window.removeEventListener('onresize',ON_WINDOW_RESIZE);

      if (elem.removeEventListener) {
            elem.removeEventListener("mousewheel", bansheeHandleMouseWheel, false);
            elem.removeEventListener("DOMMouseScroll", bansheeHandleMouseWheel, false);
            try {
                if (('ontouchstart' in window) && Hammer)
                {
                    m_IgnoreMouseEvents = false;

                    var hammertime = Hammer(elem).off(hammerEvents, function(event) {
                      __handleHammer(event);
                    });
                    /*                    //touch
                    elem.removeEventListener("touchstart", bansheeHandleTouchStart, false);
                    elem.removeEventListener("touchend", bansheeHandleTouchEnd, false);
                    elem.removeEventListener("touchmove", bansheeHandleTouchMove, false);
                    elem.removeEventListener("touchcancel", bansheeHandleTouchCancel, false);
                    */
                }
            } catch (e) {
                console.log(BANSHEE_RUNTIME + ':Error while removing hammer events');
                console.log(e);
            }


        }
    };

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Custom Events Section END
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    var m_IdleTicks = 0;

    this.Animate = function () {

      //Reflect the state of the Fullscreen-mode (Browser Escape etc.)
      if (m_bFullScreen)
      {
        m_bFullScreen = Boolean(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement);
        if (!m_bFullScreen)
          bansheeSafeCall(m_MainLayer,'FullscreenCancelled');
      }
      /*
      if (document.activeElement)
      {
        if (document.activeElement != m_focusControl)
        {
          var old = m_focusControl;
          m_focusControl = document.activeElement;
          this.Broadcast('OnFocusChanged', [old, m_focusControl]);
        }
      }
      */


      m_IdleTicks++;
        var iCnt = this.m_AnimControls.length - 1;
        for (var i = iCnt; i >= 0 ; i--)
            this.m_AnimControls[i].OnAnimationDone();
        if (m_bAutoFocus) {
            m_bAutoFocus = false;
            /*
            return;
            if (this.DivCtrl.setActive)
              this.DivCtrl.setActive();
            this.DivCtrl.focus();
            */
        }

      //requestAnimationFrame(step);

    };


    this.Init = function () {
        if (m_MainLayer) {
            alert('BANSHEE' + '::Nur ein MainLayer erlaubt');
            return;
        }
        this.SetText(BANSHEE_RUNTIME);
        __TestWebkit(this.DivCtrl.style);
        _attr(this.DivCtrl, 'tabindex', -1);//Das html focus-element


        this.DivCtrl.style.overflowX = 'hidden';
        this.DivCtrl.style.overflowY = 'hidden';



        m_MainLayer = lpfMainLayerCreateFunc(this, this.DivCtrl, this);//new TUMAMainLayer(this, this.DivCtrl, this);


        //m_CursorManager = new TCursorManager(this, this.DivCtrl, this);
        //Refresh
        this.SetBounds(this.x, this.y, this.w, this.h);
        m_bAutoFocus = true;

        /*
        m_TraceOutWindow = new TMessageBox(this,this.DivCtrl, this.Banshee);
        m_TraceOutWindow.SetBounds(30,0,this.Banshee.w * 0.8,this.Banshee.h);
        m_TraceOutWindow.SetVisible(false);
        */

    };

    this.DisplayTraceOutWindow = function () {
        if (m_TraceOutWindow)
            m_TraceOutWindow.SetVisible(true, true);
    };

    this.TraceOut = function (sender, szOut) {
        this.ErrorOut(sender, szOut);
        /*
        if (szOut === null || szOut.length == 0 || !m_TraceOutWindow)
          return;
        if (m_TraceOutWindow.m_Text === null)
          m_TraceOutWindow.m_Text = szOut+'\n';
        else
          m_TraceOutWindow.m_Text += szOut+'\n';
        m_TraceOutWindow.Invalidate();
        */
    };

    this.ErrorOut = function (sender, szOut) {
        //alert(this.p_OnError);
        //alert("ErrorOut:" + szOut);
        if (!szOut || szOut.length == 0 || !this.p_OnError)
            return;
        bansheeExternalCall(this.p_OnError, szOut);
    };

    this.Notify = function (eventName, param){
      if (!this.p_OnNotification || !((typeof (this.p_OnNotification) == 'function')))
        return -1;
      this.p_OnNotification(eventName, param);
    };

    this._pickCodeAdapter = function (szName) {
        if (szName == null || szName.length < 3 || !m_codeAdapters)
            return -2;
        var szId = 'function ' + szName + '(';
        var iCnt = m_codeAdapters.length;
        for (var i = 0; i < iCnt; i++) {
            if (m_codeAdapters[i].toString().indexOf(szId) == 0)
                return i;
        }
        return -1;
    };

    this.InitFromHTMLTree = function (htmlObject, smartObject) {
        var currCode = htmlObject.getAttribute('data-codeadapter');
        var bNotify = false;
        var iIdx = this._pickCodeAdapter(currCode);
        if (iIdx >= 0) {
            smartObject = new m_codeAdapters[iIdx](smartObject, null, this, htmlObject);
            bNotify = true;
        }

        var iCount = htmlObject.children.length;
        for (var i = 0; i < iCount; i++)
            this.InitFromHTMLTree(htmlObject.children[i], smartObject);

        if (bNotify && smartObject && smartObject.InitializeComponent)
            smartObject.InitializeComponent();
    };



    this.InitFromHTML = function (divElementSource, codeAdapters) {
        if (!divElementSource) {
            __critError('BANSHEE' + '::InitFromHTML divElementSource == null');
            return;
        }
        m_codeAdapters = codeAdapters;
        this.InitFromHTMLTree(divElementSource, this);
    };


    this.SetBounds = function (x, y, w, h) {

        if (bansheeSetBounds(this, x, y, w, h, m_PositionType) === true) {
            bansheeClipView(this, 0, 0, w, h);
            this.Broadcast('OnStageSizeChanged', [w, h]);
            if (m_CursorManager)
                m_CursorManager.SetBounds(0, 0, w, h);
            __SyncStagePosition(this);
        }
    };

    this.Invalidate = function () {
       /*
        var dc = bansheeGetDC(this);
        bansheeFillRect(dc, 0, 0, this.w, this.h, BANSHEE_WINDOW_BACKGROUND_COLOR);
        if (this.m_Text) {
            bansheeSelectFont(dc, '12px Verdana');
            bansheeTextOut(dc, 2, 2, this.m_Text, BANSHEE_WINDOW_TEXT_COLOR);
        }
       */
    };

    this.SetText = function (txt) {
        this.m_Text = txt;
        this.Invalidate();
    };

    this.__UpdateCursorPos = function (e) {
      //this.SetText('>>>>>>> Client:' + e.clientX + ' : ' + e.clientY);
      if (m_bFullScreen)
        {
          this.m_CursorInfo[0] = parseInt(e.clientX);
          this.m_CursorInfo[1] = parseInt(e.clientY);
        }
        else
        {
          var pt = bansheeGetPos(this.DivCtrl,m_bFullScreen);
          this.m_CursorInfo[0] = parseInt(e.clientX - pt[0]);
          this.m_CursorInfo[1] = parseInt(e.clientY - pt[1]);
        }
    };

  function __TestFocusActivation(ctrl)
  {
    return;//Probleme im IE
    while (ctrl)
    {
      var bActivate = bansheeSafeCall(ctrl,'Activate');
      if (bActivate === true)
      {
        if (ctrl.DivCtrl)
        {
          if (ctrl.DivCtrl.setActive)
            ctrl.DivCtrl.setActive();
          if (ctrl.DivCtrl.focus)
            ctrl.DivCtrl.focus();
        }
        return;
      }
      ctrl = ctrl.Owner;
    }
  }


    this.__GetCaptureControl = function (e) { this.__UpdateCursorPos(e); return this.PickControl(this.m_CursorInfo[0], this.m_CursorInfo[1]); };
    this.__PostMouseEvent = function (e, func) {
        __ResetIdleCounter();
        if (m_IgnoreMouseEvents)//Gesture-Mode
            return;
        var ctrl;
        if (m_CaptureControl)
          ctrl = m_CaptureControl;
        else
          ctrl = this.__GetCaptureControl(e);

        var result = bansheeNotify(ctrl, func, e);
        if (result)
          this.HandleEvent(e);
        __UpdateCursor(this);

      if (func == 'OnMouseDown')
        __TestFocusActivation(ctrl);


    };
    this.__PostKeyEvent = function (e, func) {
      __ResetIdleCounter();
      var result = bansheeNotify(m_focusControl, func, e);
      if (result)
        this.HandleEvent(e);
    };

    function __UpdateCursor(banshee) {
        if (m_CursorManager) {
            if (banshee.m_CurrMouseControl)
                m_CursorManager.SetCursor(banshee.m_CurrMouseControl.Cursor);
            else
                m_CursorManager.SetCursor(0);
        }
        else
        if (banshee.m_CurrMouseControl)
        {
          var ctrl = banshee.m_CurrMouseControl.DivCtrl;
          if (ctrl)
             ctrl.style.cursor = bansheeCursorIDToCSS(banshee.m_CurrMouseControl.Cursor);
        }
    }

    function __ResetIdleCounter() {
        m_IdleTicks = 0;
    }

    this.GetIdleTime = function () {
        return m_IdleTicks / BANSHEE_SMPTE_TICKS;
    };

    var m_CaptureControl = null;
    this.SetMouseCapture = function(layer,bSet)
    {
      if (bSet)
        m_CaptureControl = layer;
      else
      {
        if (layer === m_CaptureControl)
          m_CaptureControl = null;
      }
    };

    this.MouseMove = function (e) {
        __ResetIdleCounter();
        if (m_IgnoreMouseEvents)//Gesture-Mode
        {
            //bansheeTraceOut(this,'Warning MOUSEMOVE');
            bansheeCancelDefEvent(e);
            return;
        }
        var o = null;

        if (m_CaptureControl)
        {
          this.__UpdateCursorPos(e);//Need to update the cursor-pointer-pos
          o = m_CaptureControl;
        }
        else
        {
          o = m_f.__GetCaptureControl(e);

          if (m_f.m_CurrMouseControl != o) {
            bansheeNotify(m_f.m_CurrMouseControl, 'OnMouseExit', e);
            m_f.m_CurrMouseControl = o;
            bansheeNotify(o, 'OnMouseEnter', e);
          }
        }
        bansheeNotify(o, 'OnMouseMove', e);
        m_f.HandleEvent(e);
        __UpdateCursor(m_f);
    };

    this.MouseDown = function (e) {
        /* supported in IE & Firefox only
        if (this.DivCtrl.setCapture)
        {
          this.DivCtrl.setCapture();
          bansheeTraceOut(this,'setCapture');
        }
        else
        {
          if (e.target.setCapture)
          {
            e.target.setCapture();
            bansheeTraceOut(this,'setCapture via e.Target');
          }
          else
            bansheeTraceOut(this,'NO SETCAPTURE');
  
        }
        */

        if (m_IgnoreMouseEvents)//Gesture-Mode
        {
            bansheeTraceOut(this, 'Warning MOUSEDOWN');
            //bansheeCancelDefEvent(e);
            return;
        }
        m_bAutoFocus = true;
        this.__PostMouseEvent(e, 'OnMouseDown');

        /*
        //Test
        var a = this.PickControl(this.m_CursorInfo[0], this.m_CursorInfo[1]);
        if (a)
          bansheeTraceOut(this,'Currmousecontrol:'+ a.ClassName);
        */

    };
    this.MouseUp = function (e) {

        if (m_IgnoreMouseEvents)//Gesture-Mode
            return;

        //this.DivCtrl.releaseCapture();
        this.__PostMouseEvent(e, 'OnMouseUp');
    };

    this.SendCancelMode = function (layer) {
        if (this.m_CurrMouseControl == layer) {
            this.m_CurrMouseControl = this.PickControl(this.m_CursorInfo[0], this.m_CursorInfo[1]);
            __UpdateCursor(this);
        }
    };

    this.MouseEnter = function (e) {
        if (m_IgnoreMouseEvents)//Gesture-Mode
            return;

        var o = this.__GetCaptureControl(e);
        if (this.m_CurrMouseControl != o) {
            bansheeNotify(this.m_CurrMouseControl, 'OnMouseExit', e);
            this.m_CurrMouseControl = o;
            bansheeNotify(o, 'OnMouseEnter', e);
        }
        this.HandleEvent(e);
        __UpdateCursor(this);

    };

    this.MouseLeave = function (e) {
        if (m_IgnoreMouseEvents)//Gesture-Mode
            return;
        this.__UpdateCursorPos(e);
        var x, y;
        x = this.m_CursorInfo[0];
        y = this.m_CursorInfo[1];
        if (x <= 0 || y <= 0 || x >= this.w || y >= this.h)
        {
            bansheeNotify(this.m_CurrMouseControl, 'OnMouseExit', e);
            this.m_CurrMouseControl = null;
            this.Broadcast('OnStageLeave', e);
        }
    };

    this.MouseClick = function (e) { this.__PostMouseEvent(e, 'OnMouseClick'); };
    this.MouseDblClick = function (e) { this.__PostMouseEvent(e, 'OnMouseDblClick'); };
    this.KeyPress = function (e) { this.__PostKeyEvent(e, 'OnKeyPress'); };
    this.KeyDown = function (e) { this.__PostKeyEvent(e, 'OnKeyDown'); };
    this.KeyUp = function (e) { this.__PostKeyEvent(e, 'OnKeyUp'); };
    //No proper mousewheel-handler in div-element
    this.HandleMouseWheel = function (e) { this.__PostMouseEvent(e, 'OnMouseWheel'); };

    this.FocusSet = function (e) {bansheeTraceOut(this,'FocusSet'); };
    this.FocusLost = function (e) {bansheeTraceOut(this,'FocusLost'); };


    this.SystemDragOver = function(e)
    {
      //bansheeTraceOut(this,'SystemDragOver');
      bansheeCancelDefEvent(e);
    };

    this.SystemDrop = function(e)
    {
      //bansheeTraceOut(this,'SystemDrop');
      var iCnt = this.m_Controls.length;
      for (var i = 0; i < iCnt;i++)
        bansheeSafeCall(this.m_Controls[i],'OnSystemDragDrop',e);
      bansheeCancelDefEvent(e);
    };



  //Smart controls
    this.AddControl = function (ctrl) {
        if ((!ctrl) || (!ctrl.ClassName) || (this.m_Controls.indexOf(ctrl) >= 0))
            return;
        this.m_Controls.push(ctrl);
        m_bZDirty = true;
    };

    this.HandleEvent = function (e) {
        if (!this.m_KeepEventPropagation)
            bansheeCancelDefEvent(e);
    };

    function __RemoveHTML(ctrl) {
        if (ctrl && ctrl.DivCtrl) {
            //Remove the div container
            ctrl.EmbedCtrl = null;
            ctrl.CanvasCtrl = null;
            if (ctrl.Parent)
                ctrl.Parent.removeChild(ctrl.DivCtrl);
            else
                document.body.removeChild(ctrl.DivCtrl);
            ctrl.Parent = null;
            ctrl.DivCtrl = null;
            ctrl.htmlCtrls = null;
        }
    }

    this.RemoveControl = function (ctrl) {
        var i = this.m_Controls.indexOf(ctrl);
        if (i >= 0) {
            __RemoveHTML(ctrl);

            if (m_CaptureControl == ctrl)
              m_CaptureControl = null;

            if (this.m_CurrMouseControl == ctrl)
              this.m_CurrMouseControl = null;

            this.RemoveAnimControl(ctrl);
            delete this.m_Controls[i];
            this.m_Controls.splice(i, 1);
        }
    };

    //*******************************
    this.PickControl = function (x, y) {

        if (m_CaptureControl)
          return m_CaptureControl;

        if (m_bZDirty)
            this.UpdateZOrder(this, 0);
        var o;
        var iCnt = this.m_Controls.length - 1;
        for (var i = iCnt; i >= 0 ; i--) {
            o = this.m_Controls[i];
            if (o.UIActive && o.HitTest && o.HitTest(x, y))
                return o;
        }
        return null;
    };

    this.Broadcast = function (f, p) {
        var iCnt = this.m_Controls.length;
        for (var i = 0; i < iCnt ; i++) {
            if (this.m_Controls[i][f]) {
                this.m_Controls[i][f](p);
            }
        }
    };

    this.GetCursorInfo = function () { return this.m_CursorInfo; };

    this.TraceCursor = function (e, text) {
        this.__UpdateCursorPos(e);
        var x = this.m_CursorInfo[0];
        var y = this.m_CursorInfo[1];

        this.SetText(text + '>' + x + ':' + y);
    };

    this.SetFocusControl = function (obj) {
        if (this.m_Controls.indexOf(obj) >= 0)
            m_focusControl = obj;
    };

    this.GetMainLayer = function () { return m_MainLayer; };

    var m_zIndex;
    function __SortByZ(a, b) {
        if (a.ZOrder < b.ZOrder)
            return -1;
        if (a.ZOrder > b.ZOrder)
            return 1;
        return 0;
    }
    function __WalkTree(obj) {
        obj.ZOrder = m_zIndex;
        if (obj.DivCtrl)
          obj.DivCtrl.style.zIndex = obj.ZOrder;
        m_zIndex++;
        var iCount = bansheeComponentsCount(obj);
        for (var i = 0; i < iCount; i++)
            __WalkTree(obj.Components[i]);
    }

    this.UpdateZOrder = function (layer, zIndex) {
        m_zIndex = zIndex;
        __WalkTree(layer);
        this.m_Controls.sort(__SortByZ);
        m_bZDirty = false;
    };


    //***********************************************************
    //Load-Unload Library
    //***********************************************************
    /*
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      try
      {
          if (xhr.status === 200)  // OK
          {
              var s = document.createElement('script');
              s.type = 'text/javascript';
              s.text = xhr.responseText;
              alert('SUCCESS::\n'+ s.text);
              var c = document.getElementsByTagName('script')[0];
              c.parentNode.insertBefore(s, c);
              _attr(s,'fccsModule',currentModule);

          }
          else
          {
              currentModule = null;
              alert('Could not load module ::'+currentModule);

          }
      }catch(e)
      {
        alert('ERROR INJECTING CODE::'+ e);
      }
    };

    this.LoadModule = function(url)
    {
       try
       {
        currentModule = url;
        xhr.open("GET", url);
        xhr.responseType = "text";
        xhr.send();
       } catch (e) {
        alert('Banshee::LoadModule',e);
       }
    };

    this.DisplayScripts = function()
    {
      var c = document.getElementsByTagName('script')[0];
      bansheeReflect(c);
    };


    this.tryInvoke = function(s)
    {
      try
      {
        __lib(s);
      } catch(e){
        alert('Could not invoke "async_load" with '+s)
      }
    };


    this.UnloadModule = function()
    {
        this.DisplayScripts();
        if (currentModule == null)
          return;
        var i = 0;
        while (true)
        {
          var c = document.getElementsByTagName('script')[i++];
          if (!c)
            break;
          if (c.getAttribute('fccsModule') === currentModule)
          {
            currentModule = null;
            c.parentNode.removeChild(c);
            return;
          }
        }
    };
    */
    //***********************************************************
    //Load-Unload Library END
    //***********************************************************

    this.Free = function () {
        this.RemoveCustomEventHandlers();
        clearInterval(m_GameTimer);
        bansheeFreeComponents(this);
        m_MainLayer = null;
        m_TraceOutWindow = null;


        this.DivCtrl.onmouseover = null;
        this.DivCtrl.onmouseout = null;
        this.DivCtrl.onmousedown = null;
        this.DivCtrl.onmousemove = null;
        this.DivCtrl.onmouseup = null;
        this.DivCtrl.onclick = null;
        this.DivCtrl.ondblclick = null;
        this.DivCtrl.onkeypress = null;
        this.DivCtrl.onkeydown = null;
        this.DivCtrl.onkeyup = null;
        this.DivCtrl.onfocus = null;
        this.DivCtrl.onblur = null;
        //Drag'n Drop
        this.DivCtrl.ondragover = null;
        this.DivCtrl.ondrop = null;

        __RemoveHTML(this);
    };


    this.GetFocusControl = function () { return m_focusControl; };

    this.AddAnimControl = function (ctrl) { if ((!ctrl) || (!ctrl.ClassName) || (this.m_AnimControls.indexOf(ctrl) >= 0) || !ctrl.OnAnimationDone) return; this.m_AnimControls.push(ctrl); };
    this.RemoveAnimControl = function (ctrl) { var i = this.m_AnimControls.indexOf(ctrl); if (i >= 0) this.m_AnimControls.splice(i, 1); };


    function __SyncStagePosition(o)
    {
      if (o && o.DivCtrl){
        bansheeSyncSmartLayer(o);
      }
      var iCnt = bansheeComponentsCount(o);
      for (var i = 0; i < iCnt;i++)
        __SyncStagePosition(o.Components[i]);
    }

    function __WindowSizeChanged()
    {
      if (m_f)
      {
        __SyncStagePosition(m_f);
        m_f.SetBounds(0,0,m_f.w,m_f.h);
      }
    }

    this.CanDoFullscreen = function() {
      var divCtrl = this.DivCtrl.parentNode;
      if (divCtrl.requestFullscreen) {
        return true;
      } else if (divCtrl.mozRequestFullScreen) {
        return true;
      } else if (divCtrl.webkitRequestFullscreen) {
        return true;
      }
      return false;
    };

    this.SetFullScreen = function()
    {
      var divCtrl = this.DivCtrl.parentNode;
      if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement)
      {

        if (divCtrl.requestFullscreen) {
          m_bFullScreen = true;
          divCtrl.requestFullscreen();
        } else if (divCtrl.mozRequestFullScreen) {
          m_bFullScreen = true;
          divCtrl.mozRequestFullScreen();
        } else if (divCtrl.webkitRequestFullscreen) {
          m_bFullScreen = true;
          divCtrl.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      }
      else
      {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
          m_bFullScreen = false;
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
          m_bFullScreen = false;
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
          m_bFullScreen = false;
        }
      }
      return m_bFullScreen;
    };

    this.GetFullScreen = function(){
      return m_bFullScreen;
    };

  //Event handlers
    /*
    this.DivCtrl.addEventListener('mouseover',this.MouseEnter,true);
    this.DivCtrl.addEventListener('mouseout',this.MouseLeave,true);
    this.DivCtrl.addEventListener('mousemove',this.MouseMove,true);
    */

    this.DivCtrl.onmouseover = this.MouseEnter.bind(this);
    this.DivCtrl.onmouseout = this.MouseLeave.bind(this);

    this.DivCtrl.onmousedown = this.MouseDown.bind(this);
    this.DivCtrl.onmousemove = this.MouseMove.bind(this);
    this.DivCtrl.onmouseup = this.MouseUp.bind(this);
    this.DivCtrl.onclick = this.MouseClick.bind(this);

    //Drag'n Drop
    this.DivCtrl.ondragover = this.SystemDragOver.bind(this);
    this.DivCtrl.ondrop = this.SystemDrop.bind(this);


    /* Später..
      this.DivCtrl.ondblclick = this.MouseDblClick.bind(this);
     this.DivCtrl.onkeydown = this.KeyDown.bind(this);
     this.DivCtrl.onkeyup = this.KeyUp.bind(this);
     this.DivCtrl.onkeypress = this.KeyPress.bind(this);

     */
    /*
    this.DivCtrl.onfocus = this.FocusSet.bind(this); //Focus bubbelt nicht. Eigentlich ist focusin (http://www.w3.org/TR/DOM-Level-3-Events/#event-type-focusIn)
                                                     //das richtige Event. Wird nur leider von Chrome und FF nicht unterstützt.
    this.DivCtrl.onblur = this.FocusLost.bind(this); //Blur bubbelt nicht. Eigentlich ist focusout (http://www.w3.org/TR/DOM-Level-3-Events/#event-type-focusOut)
                                                     //das richtige Event. Wird nur leider von Chrome und FF nicht unterstützt.
    */

    this.AddCustomEventHandlers();

}
