// 0(BANSHEE) Banshee-JS
//    1(TBookEditorView) a.k.a. MainLayer
//          2(TBookViewer)
//              3(TDocViewer)
//                  4(TMipmapPresenter 0) You're here..
//                  4(TMipmapPresenter N-1) ..or here
//              3(TCanvasPainter)
//                --Custom List of Geometry (TPolyline)
//              3(TOccluderManager)
//                  4(TOccluder 0)
//                  4(TOccluder N-1)


function TMipmapValues(zoom, url) {
    this.m_z = zoom;
    this.m_url = url;
}

function TBansheeMipmap(szDesc) {
    this.m_Levels = [];

    function __sortByZoom(a, b) {
        if (a.m_z < b.m_z)
            return -1;
        if (a.m_z > b.m_z)
            return 1;
        return 0;
    }

    function __getLevelDesc(arr, zoomLevel) {
        var iCnt = arr.length;
        for (var i = 0; i < iCnt; i++) {
            if (arr[i].m_z === zoomLevel)
                return arr;
        }
        return null;
    }


    function __addMipLevel(arr, zoomLevel, url) {
        if (zoomLevel < 10 || zoomLevel > 1500 || !url)  //nonsense
            return;

        if (!__getLevelDesc(arr, zoomLevel))
            arr.push(new TMipmapValues(zoomLevel, url));
    }

    function __scanDesc(arr, descIn) {
        if (!descIn)
            return;
        var iPos = descIn.indexOf('=');
        if (iPos > 2) {
            var szZoom = descIn.substring(0, iPos);
            if (szZoom[0] !== 'z')
                return;
            var zoomLevel = StrToFloatDef(szZoom.substring(1, iPos), 0);
            __addMipLevel(arr, zoomLevel, descIn.substring(iPos + 1));
        }
    }

    this.ReadDesc = function (descIn) {
        if (!descIn)
            return;
        var iPos = descIn.indexOf('|');
        if (iPos >= 0) {
            var szText;
            while (true) {
                szText = descIn.substring(0, iPos);
                __scanDesc(this.m_Levels, szText);
                descIn = descIn.substring(iPos + 1);
                iPos = descIn.indexOf('|');
                if (iPos < 0) {
                    szText = descIn;
                    break;
                }
            }
            __scanDesc(this.m_Levels, szText);
        }
        else
            __scanDesc(this.m_Levels, descIn);

        if (this.m_Levels.length > 1)
            this.m_Levels.sort(__sortByZoom);
    };

    this.AddIdentity = function (url) {
        if (!url)
            return;
        if (!__getLevelDesc(this.m_Levels, 100))
            __addMipLevel(this.m_Levels, 100, url);

        if (this.m_Levels.length > 1)
            this.m_Levels.sort(__sortByZoom);
    };

    this.GetBestTexture = function (zoomLevel) {
        var iCnt = this.m_Levels.length;
        if (iCnt === 0)
            return null;
        if (iCnt === 1)
            return this.m_Levels[0].m_url;//Single texture in here

        if (this.m_Levels[0].m_z >= zoomLevel)
            return this.m_Levels[0].m_url;
        if (this.m_Levels[iCnt - 1].m_z <= zoomLevel)
            return this.m_Levels[iCnt - 1].m_url;

        //#1 calc delta
        for (var i = 0; i < iCnt - 1; i++) {
            if (this.m_Levels[i].m_z <= zoomLevel && this.m_Levels[i + 1].m_z >= zoomLevel) {
                var fDelta = this.m_Levels[i].m_z + (this.m_Levels[i + 1].m_z - this.m_Levels[i].m_z) * 0.5;
                if (zoomLevel < fDelta)
                    return this.m_Levels[i].m_url;
                else
                    return this.m_Levels[i + 1].m_url;
            }
        }
        return null;
    };


    this.ReadDesc(szDesc);
}


function TMipmapPresenter(_owner, _parent, _banshee) {
    bansheeInitComponent(this, _owner, _banshee, 'TMipmapPresenter');
    bansheeInitVisual(this, _parent, false);

    this.m_Texture0 = null;//Die Texture , die pr�sentiert werden soll.
    this.m_Texture1 = null;//2ter Texturkanal

    this.m_ClipOwner = null;

    this.m_Mipmap = null;

    this.m_PreserveAspectRatio = 'xMid' + 'YMid';
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Weltkoordinaten     Transformationsmatrix >> wird hier nicht gebraucht, da TDocView(owner) die absolute Transformation berechnet.
    this.wx = 0;
    this.wy = 0;
    this.ww = 0;
    this.wh = 0;
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    var m_scale = 1;
    var m_Pos = [0, 0];

    var m_bUseHTMLImage = true;
    var m_bDestroying = false;
    var m_HTMLImage = null;
    var m_LoadingImage = null;

    var m_CurrImage0Filename = null;

    function _SetPosDim(htmlObject,x,y,w,h)
    {
      if (htmlObject)
      {

        htmlObject.style.position = 'relative';
        //BansheeCoreJS.js
        _pos(htmlObject,x,y);
        _bounds(htmlObject,w,h);
      }
    }



    this.InitializeComponent = function()
    {
      if (m_bUseHTMLImage)
      {
        m_HTMLImage = document.createElement('IMG');
        this.DivCtrl.appendChild(m_HTMLImage);
      }

    };


    function _IsClipped(layer)
    {
      if (layer.m_ClipOwner) {
        if (layer.x >= layer.m_ClipOwner.w)
          return true;
        if (layer.y >= layer.m_ClipOwner.h)
          return true;
        if (layer.x + layer.w < layer.m_ClipOwner.x)
          return true;
        if (layer.y + layer.h < layer.m_ClipOwner.y)
          return true;
      }
      return false;
    }



    this.SetBounds = function (x, y, w, h) {
        bansheeSetBounds(this, x, y, w, h);
      _SetPosDim(m_HTMLImage,0,0,w,h);
      bansheeSetVisible(!_IsClipped(this));
      bansheeSetEnabled(this,false);
    };

    this.Invalidate = function () {

        if (m_bUseHTMLImage)
          return;

        if (this.w * this.h <= 0 || _IsClipped(this))
            return;


        var dc = bansheeGetDC(this);

        if (this.m_Texture0 && this.m_Texture0.m_ErrorCode === 1)//Loaded & ready
        {
            var img = this.m_Texture0.m_img;
            var td, x, y, w, h;
            if (img.width > img.height) { //landscape
                td = img.height / img.width;
                w = this.w;
                h = this.w * td;
            }
            else {//portrait
                td = img.width / img.height;
                w = this.h * td;
                h = this.h;
            }
            x = (this.w * 0.5) - (w * 0.5);
            y = (this.h * 0.5) - (h * 0.5);

            if (this.m_PreserveAspectRatio === 'xMid' + 'YMid')//W3C Default
            {
            }
            else if (this.m_PreserveAspectRatio === 'none') { x = 0; y = 0; w = this.w; h = this.h; }
            else if (this.m_PreserveAspectRatio === 'xMin' + 'YMin') { x = 0; y = 0; }
            else if (this.m_PreserveAspectRatio === 'xMid' + 'YMin') { y = 0; }
            else if (this.m_PreserveAspectRatio === 'xMax' + 'YMin') { x = this.w - w; y = 0; }
            else if (this.m_PreserveAspectRatio === 'xMin' + 'YMid') { x = 0; }
            else if (this.m_PreserveAspectRatio === 'xMax' + 'YMid') { x = this.w - w; }
            else if (this.m_PreserveAspectRatio === 'xMin' + 'YMax') { x = 0; y = this.h - h; }
            else if (this.m_PreserveAspectRatio === 'xMid' + 'YMax') { y = this.h - h; }
            else if (this.m_PreserveAspectRatio === 'xMax' + 'YMax') { x = this.w - w; y = this.h - h; }
            //bansheeFillRect(dc,0,0,this.w,this.h,'#ff0000');

            dc.clearRect(0, 0, this.w, this.h);
            dc.setTransform(m_scale, 0, 0, m_scale, m_Pos[0], m_Pos[1]);
            //dc.drawImage(img, 0, 0, img.width, img.height, x, y, w , h);
            this.m_Texture0.RenderFrame(dc,x,y,w,h);
        }

        //
        if (this.m_Texture1 && this.m_Texture1.m_ErrorCode === 1)//Loaded & ready)
          this.m_Texture1.RenderFrame(dc,0,0,this.w,this.h);//Stretch to fill


    };

    this.SetTransform = function (scale, xoff, yoff) {
        m_scale = scale;
        m_Pos[0] = xoff;
        m_Pos[1] = yoff;
        this.Invalidate();
    };

    var m_self = this;

    this.RemoveCurrImage = function()
    {
      if (m_HTMLImage)
      {
        if (m_HTMLImage.parentNode == this.DivCtrl)
          this.DivCtrl.removeChild(m_HTMLImage);
        m_HTMLImage = null;
      }
    };

    function __onImgError()
    {
      m_self.RemoveCurrImage();
    }

    function __onImgLoaded()
    {
      m_self.RemoveCurrImage();
      if (m_bDestroying)
        return;
      m_HTMLImage = m_LoadingImage;
      if (m_HTMLImage)
      {
        m_self.DivCtrl.appendChild(m_HTMLImage);
        m_self.SetBounds(m_self.x,m_self.y,m_self.w,m_self.h);//required for "correct" visualization
      }
    }


    function createImg(url, fn)
    {
      var img = new Image();
      img.onload = fn;
      img.onerror = __onImgError;
      img.src = url;
      return(img);
    }

    this.AssignMedia = function (data, iSlot) {
        if (iSlot === 1) {//First texture channel
          /*
          if (data == 'GOOGLE_MAP')
            data = this.Owner.GetGoogleMap(this);
          */

          if (m_bUseHTMLImage)
          {

            if (m_CurrImage0Filename != data)
            {
              m_CurrImage0Filename = data;
              /*
              if (m_HTMLImage)
              {
                if (m_HTMLImage.parentNode == this.DivCtrl)
                   this.DivCtrl.removeChild(m_HTMLImage);
                m_HTMLImage = null;
              }*/
              //m_HTMLImage.src = data;//sync
              if (m_CurrImage0Filename)
                m_LoadingImage = createImg(data,__onImgLoaded);
                //m_HTMLImage = createImg(data,__onImgLoaded);
            }
          }
          else
            this.m_Texture0 = bansheeLoadTexture(this,this.m_Texture0,data,'OnTextureLoaded');


          return true;//Handled
        }

      if (iSlot === 8) {//Second texture channel
        this.m_Texture1 = bansheeLoadTexture(this,this.m_Texture1,data,'OnTextureLoaded');
        return true;//Handled
      }


        return false;
    };


    this.OnTextureLoaded = function (tex, bSuccess) {
        if (!bSuccess)
        {
            if (tex == this.m_Texture0)
            {
              bansheeTraceOut(this, 'Texture Error chn1:' + tex.m_Filename);
              this.AssignMedia(null,1);
            }
            else if (tex == this.m_Texture1)
            {
              bansheeTraceOut(this, 'Texture Error chn2:' + tex.m_Filename);
              this.AssignMedia(null,8);
            }
        }
        this.Invalidate();
    };


    this.QueryMedia = function (iSlot) {
        if (iSlot === 1)
            return this.m_Texture0 ? this.m_Texture0.m_Filename : null;
        if (iSlot === 8)
          return this.m_Texture1 ? this.m_Texture1.m_Filename : null;

        return null;
    };


    this.Free = function () {

        m_bDestroying = true;
        if (m_bUseHTMLImage && m_HTMLImage)
        {
          try
          {
            this.DivCtrl.removeChild(m_HTMLImage);
          }catch(e) {}
          m_HTMLImage = null;
        }
        this.AssignMedia(null, 1);
        this.AssignMedia(null, 8);
        bansheeFree(this);
    };

    //Deserialisierung:: bansheeReadComponent
    this.ReadProperty = function (name, value) {
        if (name === 'xlink:href') {
            if (!this.m_Mipmap)
                this.m_Mipmap = new TBansheeMipmap(null);
            this.m_Mipmap.AddIdentity(value);
        }
        else
            if (name === 'fccs:mipMap') {
              if (!this.m_Mipmap)
                    this.m_Mipmap = new TBansheeMipmap(value);
                else
                    this.m_Mipmap.ReadDesc(value);
            }
            else
            if (name === 'preserveAspectRatio')
            {
              var meetSlice = value.indexOf(' ');
              if (meetSlice > 0)
                value = value.substr(0,meetSlice);//Ignore meet | slice. It's always "meet"
              this.m_PreserveAspectRatio = value;
            }

    };

    //bansheeReadComponent finished
    this.OnLoaded = function () {
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //Weltkoordinaten
        this.wx = this.x;
        this.wy = this.y;
        this.ww = this.w;
        this.wh = this.h;
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this.SetBounds(this.x, this.y, this.w, this.h);
        this.Invalidate();
    };

    this.UpdateMipmap = function (fZoom) {
        if (this.m_Mipmap) {
            var szTex = this.m_Mipmap.GetBestTexture(fZoom);
            if (szTex)
            {
              if (szTex != 'GOOGLE_MAP')
              {
                if (szTex != null) //whatever..
                  szTex = TEXTURES_DATA_DIR + szTex;
              }
              this.AssignMedia(szTex, 1);
            }
        }
    };

    //test

    /*
    var m_bDragging = false;
    var m_dx = 0;
    var m_dy = 0;
  
    function __BeginDrag(inst)
    {
      var cursorInfo = inst.Banshee.GetCursorInfo();
      m_dx = cursorInfo[0] - m_Pos[0];
      m_dy = cursorInfo[1] - m_Pos[1];
      m_bDragging = true;
  
    }
    function __Drag(inst)
    {
      if (m_bDragging)
      {
        //m_SaveState.SaveState(inst);
        var cursorInfo = inst.Banshee.GetCursorInfo();
        m_Pos[0] = cursorInfo[0] - m_dx;
        m_Pos[1] = cursorInfo[1] - m_dy;
        inst.Invalidate();
      }
    }
  
    function __EndDrag(inst)
    {
      m_bDragging = false;
    }
  
  
    this.OnMouseDown = function(e)
    {
      if (bansheeGetMouseButton(e) === 0)
        __BeginDrag(this);
    };
  
    this.OnMouseMove = function()
    {
       __Drag(this);
    };
  
    this.OnMouseUp = function(e)
    {
      if (bansheeGetMouseButton(e) === 0)
        __EndDrag(this);
    };
  
  
    this.HitTest = function(x,y)
    {
      return bansheeUIHitTest(this,x,y);
    };
  
    this.OnMouseWheel = function(e)
    {
      var a = bansheeGetWheelDelta(e);
      if (a > 0)
        m_scale += 0.1;
      else
        m_scale -= 0.1;
      this.Invalidate();
    }
  
    //Gesture-Event from Banshee via Hammer.js
    this.OnGesture = function(evt)
    {
      var gest = evt.gesture;
      if (evt.type ==='dragstart')
        __BeginDrag(this);
      else
      if (evt.type === 'drag')
        __Drag(this);
      else
      if (evt.type === 'release')
        __EndDrag(this);
      else
      if (evt.type === 'pinchin')
      {
        m_scale -= 0.02;
        this.Invalidate();
      }
      else
      if (evt.type === 'pinchout')
      {
        m_scale += 0.02;
        this.Invalidate();
      }
    };
    */


    //test end


    this.Banshee.AddControl(this);
    this.InitializeComponent();
}