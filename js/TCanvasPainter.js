// 0(BANSHEE) Banshee-JS
//    1(TBookEditorView) a.k.a. MainLayer
//          2(TBookViewer)
//              3(TDocViewer)
//                  4(TMipmapPresenter 0)
//                  4(TMipmapPresenter N-1)
//              3(TCanvasPainter) You're here
//                --Custom List of Geometry (TPolyline)
//              3(TOccluderManger)
//                  4(TOccluder 0)
//                  4(TOccluder N-1)


//polyLine
function TPolyLine() {
    this.m_PenWidth = 3;
    this.m_PenColor = new TARGBColor(255, 0, 0, 255);
    this.m_Points = [];
    this.m_SelColor = null;

    var m_StartPoint = [0,0];//Temp var to create circles etc.

    this.Render = function (ctx) {
        //Render geometry
        var i, iCount = this.m_Points.length;
        if (iCount > 2) {
            ctx.beginPath();
            ctx.moveTo(this.m_Points[0], this.m_Points[1]);

            for (i = 2; i < iCount; i += 2) {
                ctx.lineTo(this.m_Points[i], this.m_Points[i + 1]);
            }

            ctx.lineWidth = this.m_PenWidth;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            if (this.m_SelColor)
            {
                //ctx.globalAlpha = this.m_SelColor.m_a / 255;
                ctx.strokeStyle = this.m_SelColor.GetCSSColor();
            }
            else
            {
              //ctx.globalAlpha = this.m_PenColor.m_a / 255;
              ctx.strokeStyle = this.m_PenColor.GetCSSColor();//"rgba(255,0,0,0.6)";//this.m_PenColor;//"rgba(255,0,0,0.6)";
            }
            ctx.stroke();//render it
        }
        return iCount;
    };

    this.AddPoint = function (x, y) {
        this.m_Points.push(parseInt(x));
        this.m_Points.push(parseInt(y));
    };

    this.AddLine = function(x,y)
    {//Just emit 2 points  (MoveTo + 1 TargetPoint)
      for (var i = 0; i < 2;i++)
      {
        this.m_Points.push(parseInt(x));
        this.m_Points.push(parseInt(y));
      }
    };
    this.UpdateLine = function(x,y)
    {
      if (this.m_Points.length != 4)//no line-structure (MoveTo + 1 TargetPoint)
        return;
      this.m_Points[2] = parseInt(x);
      this.m_Points[3] = parseInt(y);
    };

    this.AddRect = function(x,y)
    {//Just emit 5 points  (MoveTo + 4 RectPoints)
      for (var i = 0; i < 5;i++)
      {
        this.m_Points.push(parseInt(x));
        this.m_Points.push(parseInt(y));
      }
    };

    this.AddRefPoint = function(x,y)
    {
      m_StartPoint[0] = x;
      m_StartPoint[1] = y;
    };

    this.UpdateCircle = function(x,y)
    {
      this.m_Points.splice(0, this.m_Points.length);//rebuild from scratch

      var vTrg = [x,y];
      var fLength = bansheeVectorLength2D(m_StartPoint, vTrg);
      if (fLength < this.m_PenWidth * 0.5)
        return;

      var frad = (2 * Math.PI) / 360.0;
      for (var i = 0; i < 360;i+=3)
      {
        var fx = Math.sin(i * frad) * fLength;
        var fy = Math.cos(i * frad) * fLength;
        this.AddPoint(m_StartPoint[0] + fx,m_StartPoint[1] + fy);
      }
      //close it
      this.AddPoint(this.m_Points[0],this.m_Points[1]);
    };

  this.HasData = function()
  {
    return this.m_Points && this.m_Points.length > 2;
  };

  this.UpdateEllipse = function(x,y)
  {
    this.m_Points.splice(0, this.m_Points.length);//rebuild from scratch
    var fLengthX = m_StartPoint[0] - x;
    if (fLengthX == 0)
      return;
    var fLengthY = m_StartPoint[1] - y;
    if (fLengthY == 0)
      return;

    var frad = (2 * Math.PI) / 360.0;
    for (var i = 0; i < 360;i+=3)
    {
      var fx = Math.sin(i * frad) * fLengthX;
      var fy = Math.cos(i * frad) * fLengthY;
      this.AddPoint(m_StartPoint[0] + fx,m_StartPoint[1] + fy);
    }
    //close it
    this.AddPoint(this.m_Points[0],this.m_Points[1]);
  };


    this.UpdateRect = function(x,y)
    {
      if (this.m_Points.length != 10)//no rect-structure (MoveTo + 4 RectPoints)
        return;
      //#0 untouched
      //#1 change x upper right
      this.m_Points[2] = parseInt(x);
      //#2 change x,y lower right
      this.m_Points[4] = parseInt(x);
      this.m_Points[5] = parseInt(y);
      //#3 change y lower left
      this.m_Points[7] = parseInt(y);
      //#4 close untouched
    };

  function  Util_RotateVector_Z_2D(pVecSource,pVecCenter,pfDeg)
  {
  var fAngle,fCosine,fSine,fDiffX,fDiffY;
    fAngle  = (pfDeg * Math.PI) / 180;
    fCosine = Math.cos(fAngle);
    fSine   = Math.sin(fAngle);
    fDiffX  = pVecSource[0] - pVecCenter[0];
    fDiffY  = pVecSource[1] - pVecCenter[1];
    //Calc Z-Rotation
    return [pVecCenter[0] + (fDiffX * fCosine - fDiffY * fSine),
            pVecCenter[1] + (fDiffX * fSine   + fDiffY * fCosine)];
  }
  function Util_VectorLength_2D(vecIn)
  {
      return Math.sqrt(vecIn[0] * vecIn[0] + vecIn[1] * vecIn[1]);
  }

  function Util_Normalize_2D(vecIn)
  {
    var fLength = Math.sqrt(vecIn[0] * vecIn[0] + vecIn[1] * vecIn[1]);
    if (fLength == 0)
       fLength = 0.00000001;
    return [vecIn[0] / fLength,vecIn[1] / fLength];
  }

  function Util_VectorAdd_2D(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
  }

  function Util_VectorScalarMultiply_2D(vec, scalar) {
    return [vec[0] * scalar, vec[1] * scalar];
  }

  this.CreateArrow = function(ptFrom,ptTo)
  {
    var vecSource = bansheeVectorSubtract2D(ptTo,ptFrom);
    var fLength = Util_VectorLength_2D(vecSource);
    if (fLength < this.m_PenWidth)
      return;

    var p6 = Util_Normalize_2D(vecSource);


    p6 = Util_RotateVector_Z_2D(p6,[0,0],90);
    var vecRot = p6;

    var p1 = [-p6[0],-p6[1]];


    var thickness = 20;
    var arrowHookHeight = 30;
    var arrowHookLength = 40;

    p6 = Util_VectorScalarMultiply_2D(p6,thickness);
    p1 = Util_VectorScalarMultiply_2D(p1,thickness);


    p6 = Util_VectorAdd_2D(p6,ptFrom);
    p1 = Util_VectorAdd_2D(p1,ptFrom);


    var vecNext = Util_VectorScalarMultiply_2D(vecSource,0.75);
    var bStatic = true;
    if (bStatic)
    {
      var vecHookOffset = Util_Normalize_2D(vecSource);
      vecHookOffset = Util_VectorScalarMultiply_2D(vecHookOffset,arrowHookLength);
      vecNext =  bansheeVectorSubtract2D(vecSource,vecHookOffset);
    }

    //Upper part
    var p2 = Util_VectorAdd_2D(p1,vecNext);
    var p3 = Util_VectorAdd_2D(p2,Util_VectorScalarMultiply_2D([-vecRot[0],-vecRot[1]],arrowHookHeight));
    //lower part
    var p5 = Util_VectorAdd_2D(p6,vecNext);
    var p4 = Util_VectorAdd_2D(p5,Util_VectorScalarMultiply_2D([vecRot[0],vecRot[1]],arrowHookHeight));

    //Fill in the vertices
    this.AddPoint(p6[0] ,p6[1]);
    this.AddPoint(p1[0] ,p1[1]);

    this.AddPoint(p2[0] ,p2[1]);
    this.AddPoint(p3[0] ,p3[1]);

    this.AddPoint(ptTo[0],ptTo[1]);


    this.AddPoint(p4[0] ,p4[1]);
    this.AddPoint(p5[0] ,p5[1]);
    //close the path
    this.AddPoint(p6[0] ,p6[1]);
  };


  this.UpdateArrow = function(x,y)
  {
      this.m_Points.splice(0, this.m_Points.length);//rebuild from scratch
      if ((m_StartPoint[0] - x == 0) && (m_StartPoint[1] - y == 0))
        return;
      //just swap the input vectors for "correct" behaviour --> this.CreateArrow(m_StartPoint,[x,y]);
      this.CreateArrow([x,y],m_StartPoint);
  };



    this.HitTest = function (x, y) {
        if (this.m_Points.length < 4)
            return Boolean(false);
        var iCount = this.m_Points.length;
        for (var i = 0; i < iCount - 2; i += 2) {
            if (bansheeLineHit(x, y, this.m_Points[i], this.m_Points[i + 1], this.m_Points[i + 2], this.m_Points[i + 3], this.m_PenWidth * 0.5))
                return Boolean(true);
        }
        return Boolean(false);
    };


}
//POLYLINE*************************************************************************
//***********************************************************************************
function TPolylineWrapper(oPolyline)
{
  this.PTS = oPolyline.m_Points;//Points array
  this.ST = oPolyline.m_PenWidth;//StrokeThickness
  this.SC = '#'+oPolyline.m_PenColor.ConvertToARGBDword(true);//StrokeColor
}

function TCanvasPainterJSONSerializer(client) {
  //UMA compatible serialization
    this.OT = 'UMACanvasPainter';//Original "UMACanvasPainter"
    this.DATA = null;

    this.WriteData = function () {

      if (!client || !client.m_geometry || client.m_geometry.length == 0)
        return null;

      this.DATA = [];
      var iCnt = client.m_geometry.length;
      for (var i = 0; i < iCnt;i++)
      {
        if (client.m_geometry[i].HasData())
          this.DATA.push(new TPolylineWrapper(client.m_geometry[i]));
      }
      return JSON.stringify(this);
    };

    this.ReadData = function (szJSONIn) {
      var a = JSON.parse(szJSONIn);
      if (!a)
        return;
       if ((a['OT'] === 'UMACanvasPainter') && (a['DATA'] != null) && (a['DATA'].length > 0))
       {
         var arrPolylines = a['DATA'];
         var iCnt = arrPolylines.length;
         for (var i = 0; i < iCnt;i++)
         {
           var pl = arrPolylines[i];
           if (pl['PTS'] && pl['ST'] && pl['SC'])
           {
             var polyline = new TPolyLine();
             client.m_geometry.push(polyline);

             polyline.m_PenColor.Assign(pl['SC']);
             polyline.m_PenWidth = StrToFloatDef(pl['ST'],3);
             var arrPTS = pl['PTS'];
             if (typeof (arrPTS) === 'object')
                 polyline.m_Points = arrPTS;
           }
         }
       }

    };
}



//canvasPainter
function TCanvasPainter(_owner, _parent, _banshee) {
    bansheeInitComponent(this, _owner, _banshee, 'TCanvasPainter');
    bansheeInitVisual(this, _parent, false);


    this.m_PenWidth = CONST_PEN_STROKE_THICKNESSES[0];
    this.m_PenColor = new TARGBColor(255, 0, 0, 255);

    this.m_geometry = [];
    this.ClipOwner = null;

    this.m_MouseMovePainting = false;
    this.m_MouseMoveDeletes = false;
    this.m_CurrPolyline = null;

    this.Cursor = 0;//Default-Cursor

    this.m_GeometryMode = 'lines';//Default emit polylines


    var m_Updatestage = 0;


    this.SetVisible = function (bVis) {
        bansheeSetVisible(this, bVis)
    };

    this.SetEnabled = function (bEnabled) {
        bansheeSetEnabled(this, bEnabled);
    };


    this.SetBounds = function (x, y, w, h) {
      var rcDocViewClip = this.Owner.GetDocViewClipRect();
      //bansheeClipView(this, 0, 0, w, h);
      bansheeClipView(this, rcDocViewClip[0], rcDocViewClip[1], rcDocViewClip[2], rcDocViewClip[3]);
      bansheeSetBounds(this, x, y, w, h);
    };

    var m_Transform = [0,0];
    this.SetTransform = function(x,y,scale)
    {
      m_Transform[0] = x;
      m_Transform[1] = y;
      this.Scale = StrToFloatDef(scale,1.0);
    };

    this.Invalidate = function () {
      var scale = StrToFloatDef(this.Scale,1.0);
      if (scale <= 0)
        return;
        var ctx = bansheeGetDC(this);
        if (!ctx)
          return;

        ctx.setTransform(scale, 0, 0, scale, m_Transform[0], m_Transform[1]);
        var xOff,yOff;
        var scaleInv = 1 / scale;
        xOff = -m_Transform[0] * scaleInv;
        yOff = -m_Transform[1] * scaleInv;
        ctx.clearRect(xOff,yOff, this.w * scaleInv, this.h * scaleInv);



        //Render geometry
        var i, iCount = this.m_geometry.length;
        for (i = 0; i < iCount; i++)
            this.m_geometry[i].Render(ctx);
    };

    this.Clear = function () {
        this.m_geometry.splice(0, this.m_geometry.length);
        this.Invalidate();
    };

    this.DisposeGeometry = function (o) {
        var iIdx = this.m_geometry.indexOf(o);
        if (iIdx < 0)
            return;
        this.m_geometry.splice(iIdx, 1);
        this.Invalidate();
    };

    /**
     * @return {null}
     */
    this.GetGeometryHit = function () {
        if (!this.Banshee)
            return null;
        var p = this.getMousePos();
        for (var i = 0; i < this.m_geometry.length; i++) {
            if (this.m_geometry[i].HitTest(p[0], p[1]) == true)
                return this.m_geometry[i];
        }
        return null;
    };

    this.OnMouseDown = function (e) {
      _owner.HideFloatPanels();
        if (bansheeGetMouseButton(e) === 0) {
            this.m_MouseMovePainting = true;
            if (this.m_MouseMoveDeletes) {
                var o = this.GetGeometryHit();
                if (o)
                    this.DisposeGeometry(o);
            }
            else
                this.EmitPoint();
        }
        else
        if (bansheeGetMouseButton(e) === 1)
          bansheeSafeCall(this.Owner,'PerformGestureZoom',null);
      return false;
    };

    this.OnMouseWheel = function (evt) {
        bansheeSafeCall(this.Owner, 'OnMouseWheel', evt);
        return true;
    };

    this.OnMouseMove = function (e) {
        if (this.m_MouseMoveDeletes) {
            this.Cursor = 3;
            this.Deselect();
            var o = this.GetGeometryHit();
            if (o) {
                o.m_SelColor = new TARGBColor(255,255,0,0);//'#2d86c2';
                m_Updatestage++;
            }
            this.LazyInvalidate();
            return true;
        }

        if (this.m_MouseMovePainting) {
            this.EmitPoint();
        }
        return true;
    };

    this.OnMouseUp = function (e) {
        if (bansheeGetMouseButton(e) === 0)
            this.ResetInteraction();
      return true;
    };


    this.OnGesture = function (evt) {
      var gest = evt.gesture;
      var o;
      if (evt.type === 'dragstart')
      {
        this.m_MouseMovePainting = true;
        if (this.m_MouseMoveDeletes) {
          o = this.GetGeometryHit();
          if (o)
            this.DisposeGeometry(o);
        }
        else
          this.EmitPoint();
      }
      else
      if (evt.type === 'drag')
      {
        if (this.m_MouseMoveDeletes)
        {
          this.Deselect();
          o = this.GetGeometryHit();
          if (o) {
            o.m_SelColor = new TARGBColor(255, 255, 0, 0);
            m_Updatestage++;
          }
          this.LazyInvalidate();
          return true;
        }

        if (this.m_MouseMovePainting) {
          _owner.HideFloatPanels();
          this.EmitPoint();
        }
      }
      else
      if (evt.type === 'release') {
        if (this.m_MouseMoveDeletes)
        {
          o = this.GetGeometryHit();
          if (o && o.m_SelColor)
            this.DisposeGeometry(o);
        }

        this.ResetInteraction();
      }
      else
      if (evt.type === 'doubletap')
        bansheeSafeCall(this.Owner,'PerformGestureZoom',null);
      else
      if (evt.type === 'pinchin')
        bansheeSafeCall(this.Owner,'PerformGesturePinch',false);
      else
      if (evt.type === 'pinchout')
        bansheeSafeCall(this.Owner,'PerformGesturePinch',true);

      return true;
    };

    this.OnStageLeave = function () { this.ResetInteraction(); };

    this.OnMouseExit = function () { this.ResetInteraction(); };

    this.ResetInteraction = function () {
        this.m_MouseMovePainting = false;
        this.m_CurrPolyline = null;
    };

    this.Deselect = function () {
        m_Updatestage = 0;
        for (var i = 0; i < this.m_geometry.length; i++) {
            if (this.m_geometry[i].m_SelColor)
                m_Updatestage++;
            this.m_geometry[i].m_SelColor = null;
        }
    };

    this.LazyInvalidate = function () {
        if (m_Updatestage > 0)
            this.Invalidate();
        m_Updatestage = 0;
    };

    this.EmitPoint = function (){
      var p = this.getMousePos();
        if (this.m_CurrPolyline == null) {
            this.m_CurrPolyline = new TPolyLine();
            this.m_geometry.push(this.m_CurrPolyline);
            this.m_CurrPolyline.m_PenColor.Assign(this.m_PenColor);
            this.m_CurrPolyline.m_PenWidth = this.m_PenWidth;

            if (this.m_GeometryMode == 'rect')
              this.m_CurrPolyline.AddRect(p[0], p[1]);
            else if (this.m_GeometryMode == 'line')
              this.m_CurrPolyline.AddLine(p[0], p[1]);
            else if (this.m_GeometryMode == 'circle')
              this.m_CurrPolyline.AddRefPoint(p[0], p[1]);
            else if (this.m_GeometryMode == 'ellipse')
              this.m_CurrPolyline.AddRefPoint(p[0], p[1]);
            else if (this.m_GeometryMode == 'arrow')
              this.m_CurrPolyline.AddRefPoint(p[0], p[1]);
        }

        switch (this.m_GeometryMode)
        {
          case 'lines' : this.m_CurrPolyline.AddPoint(p[0], p[1]);break;
          case 'rect' : this.m_CurrPolyline.UpdateRect(p[0], p[1]);break;
          case 'line' : this.m_CurrPolyline.UpdateLine(p[0], p[1]);break;
          case 'circle' : this.m_CurrPolyline.UpdateCircle(p[0], p[1]);break;
          case 'ellipse' : this.m_CurrPolyline.UpdateEllipse(p[0], p[1]);break;
          case 'arrow' : this.m_CurrPolyline.UpdateArrow(p[0], p[1]);break;
          default: this.m_CurrPolyline.AddPoint(p[0], p[1]);//lines
        }

        this.Invalidate();
    };

  this.SetCursor = function (iNum) {
    this.Cursor = iNum;
  };

    this.getMousePos = function () {
        var a = bansheeNotifyOwner(this, 'GetDocMousePos', null);
        if (a)
            return a;
        return this.Banshee.GetCursorInfo();
    };

    this.HitTest = function (x, y) {
      var ptAbs = bansheeStagePos(this.DivCtrl, this.Banshee.DivCtrl);
      x -= ptAbs[0]; y -= ptAbs[1]; x += this.x; y += this.y;
      var rcTest = this.Owner.GetDocViewClipRect();
      return bansheePtInRect(x, y, rcTest[0], rcTest[1], rcTest[0] + rcTest[2], rcTest[1] + rcTest[3]);
    };

    this.GetData = function () {
        if (this.m_geometry)
            return (new TCanvasPainterJSONSerializer(this)).WriteData();
        return null;
    };

    this.SetData = function (jsonData) {
        this.Clear();
        if (jsonData)
        {
          (new TCanvasPainterJSONSerializer(this)).ReadData(jsonData);
          this.Invalidate();
        }
    };


    this.Free = function () {
        bansheeFree(this);
    };

    //*********************
    this.Banshee.AddControl(this);
}

//TCanvasPainter*************************************************************************
//***********************************************************************************
