function THotspotWrapper(hotspot)
{
  var serData = hotspot.GetWorldBounds();
  this.PTS = [parseInt(serData[0]),parseInt(serData[1]),parseInt(serData[2]),parseInt(serData[3])]; //Bounds rect
  this.ID = hotspot.UserData;
}

function THotspotsJSONSerializer(client) {
  this.OT = 'HotspotsManager';
  this.DATA = null;

  this.WriteData = function () {

    var iCnt = bansheeComponentsCount(client);
    if (!client || iCnt == 0)
      return null;

    this.DATA = [];
    for (var i = 0; i < iCnt;i++) {
      var hotspot = client.Components[i];
      if (hotspot.IsUserGenerated()) {
        this.DATA.push(new THotspotWrapper(client.Components[i]));
      }
    }
    return JSON.stringify(this);
  };

  this.ReadData = function (szJSONIn) {
    var a = JSON.parse(szJSONIn);
    if (!a)
      return;
    if ((a['OT'] === 'HotspotsManager') && (a['DATA'] != null) && (a['DATA'].length > 0))
    {
      var arrHotspots = a['DATA'];
      var iCnt = arrHotspots.length;
      for (var i = 0; i < iCnt;i++)
      {
        var pl = arrHotspots[i];
        if (pl['PTS'])
        {
          var pts = pl['PTS'];
          var id = pl['ID'];
          var hotspot = client.EmitHotspot(parseInt(pts[0]),
                                           parseInt(pts[1]), id);
          hotspot.SetIsUserGenerated();
        }
      }
    }

  };
}

function THotspotsManager(owner, parent, banshee) {
  bansheeInitComponent(this, owner, banshee, 'THotspotsManager');
  bansheeInitVisual(this, parent, false);

  var m_SelectedHotspot = null;

  this.NO_OnHotspotSelectionChanged = null;

  this.InitializeComponent = function() {
  };

  this.SetBounds = function(x, y, w, h) {
    bansheeSetBounds(this, x, y, 0, 0);
    bansheeClipView(this,-this.x,-this.y,this.Owner.w,this.Owner.h);
    var cnt = bansheeComponentsCount(this);
    for (var i=0; i<cnt; i++) {
      var cmp = this.Components[i];
      cmp.Scale = this.Scale;
      cmp.SetWorldTransform(cmp.wx, cmp.wy, cmp.ww, cmp.wh);
    }
  };

  this.SetVisible = function (bVis) {
      bansheeSetVisible(this, bVis);
  };

  this.Clear = function() {
    bansheeFreeComponents(this);
    bansheeSafeCall(this, 'Invalidate');
  };

  this.ClearUserGenerated = function() {
    var iCount = bansheeComponentsCount(this) - 1;
    for (var i = iCount; i >= 0; i--) {
      var hotspot = this.Components[i];

      if (!hotspot.IsUserGenerated())
        continue;

      if (hotspot.Free)
        hotspot.Free();

      bansheeSetOwner(hotspot, null);
      this.Banshee.RemoveControl(hotspot);
    }

    bansheeSafeCall(this, 'Invalidate');
  };

  this.ReadComponentClass = function (lpXMLNode) {
    if (bansheeGetClassFromXMLElement(lpXMLNode) === this.ClassName) {
      this.Clear();
      bansheeReadComponentClass(this, lpXMLNode, this.OnClassCreate);
    }
  };

  this.OnClassCreate = function (rootInstance, currInst, lpXMLNode) {
    if (lpXMLNode.nodeName === 'image')
    {
      return new THotspot(rootInstance, rootInstance.DivCtrl, rootInstance.Banshee);
    }
    else
      return rootInstance;
  };

  this.OnLoaded = function() {
    var cnt = bansheeComponentsCount(this);
    for (var i=0; i<cnt; i++) {
      var cmp = this.Components[i];
      cmp.NO_OnClick = 'OnHotspotClicked';
    }
  };

  this.OnHotspotClicked = function(selectedHotspot) {
    if (m_SelectedHotspot !== null) {
      m_SelectedHotspot.SetSelected(false);
    }

    if (m_SelectedHotspot === selectedHotspot)
      m_SelectedHotspot = null;
    else
      m_SelectedHotspot = selectedHotspot;

    if (m_SelectedHotspot !== null) {
      m_SelectedHotspot.SetSelected(true);
      bansheeNotifyOwner(this, this.NO_OnHotspotSelectionChanged, m_SelectedHotspot.UserData);
      bansheeTraceOut(this, "Hotspot selected.");
    }
    else {
      bansheeNotifyOwner(this, this.NO_OnHotspotSelectionChanged, null);
      bansheeTraceOut(this, "Hotspot deselected.");
    }
  };

  this.HitTest = function (x, y) {
    return bansheeUIHitTest(this, x, y);
  };

  this.EmitHotspot = function(x, y, userData, numAssets) {
    var hotspot = new THotspot(this, this.DivCtrl, banshee);
    hotspot.UserData = userData;
    hotspot.NumAssets = numAssets;
    return hotspot;
  };

  this.GetData = function () {
    if (bansheeComponentsCount(this) > 0)
      return (new THotspotsJSONSerializer(this)).WriteData();
    return null;
  };

  this.SetData = function (jsonData) {
    this.ClearUserGenerated();
    if (jsonData)
    {
      new THotspotsJSONSerializer(this).ReadData(jsonData);
      bansheeSafeCall(this, 'Invalidate');
    }
  };

  this.Banshee.AddControl(this);
  this.InitializeComponent();
}