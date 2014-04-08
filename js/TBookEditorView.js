// 0(BANSHEE) Banshee-JS
//    1(TBookEditorView) a.k.a. MainLayer You're here
//          2(TBookViewer)
//              3(TDocViewer)
//                  4(TMipmapPresenter 0)
//                  4(TMipmapPresenter N-1)
//              3(TCanvasPainter)
//                --Custom List of Geometry (TPolyline)
//              3(TOccluderManager)
//                  4(TOccluder 0)
//                  4(TOccluder N-1)
//          2(TCommandPanel) Left
//              3(TSmartLayer 0)
//              3(TSmartLayer N-1)
//          2(TCommandPanel) Right
//              3(TSmartLayer 0)
//              3(TSmartLayer N-1)
//          2(TCommandPanel) PenStrokePanel
//              3(TSmartLayer 0)
//              3(TSmartLayer N-1)
//          2(TCommandPanel) MarkerStrokePanel
//              3(TSmartLayer 0)
//              3(TSmartLayer N-1)
//          2(TGlobalView)
//              Bitte beschreiben


// APP_DATA_DIR is global for the application after it was linked. Initialize it here for development.
var APP_DATA_DIR = '';
var TEXTURES_DATA_DIR = '';


function p_CreateScookMainlayer(a, b, c) {
  return new TBookEditorView(a, b, c);
}

//Spielt den Mainlayer in diesem Produkt (SCOOK)
function TBookEditorView(_owner, _parent, _banshee) {
  bansheeInitComponent(this, _owner, _banshee, 'TBookEditorView');
  bansheeInitVisual(this, _parent, false);

  var m_BookViewer = null;
  var m_GlobalView = null;

  var m_ToolsPanel = null;
  var m_ZoomPanel = null;
  var m_NavigationPanel = null;
  var m_PenStrokePanel = null;
  var m_MarkerStrokePanel = null;
  var m_VisibilityPanel = null;
  var m_FormsPanel = null;

  var m_assetsView = null;
  var m_TocView = null;

  var m_recentPenSelection = 0;
  var m_recentPenStrokeColor;
  var m_recentPenStrokeThickness;
  var m_recentMarkerSelection = 0;
  var m_recentMarkerStrokeColor;
  var m_recentMarkerStrokeThickness;
  var m_recentFormsSelection = 0;
  var m_recentFormsColor;
  var m_recentFormsThickness;

  var deleteModeActive = false;

  var PANEL_VISIBILITY_TIME = 15000; //ms

  var m_BookID = null;

  var m_HidePanelTimer = null;

  var isTeacherVersion = false;
  var m_VersionButtonState = 'hidden';
  var isUserLoggedIn = false;

  //var configDialog = null;

  this.Free = function () {
    bansheeFree(this);
  };

  function BuildCommandCommandPanelButtons_Tools() {
    var res = [];
    var butt;

    butt = new TCommandPanelData();
    butt.m_Command = 'Move';
    butt.m_IconString = '&#58900;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Buch verschieben';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'Pen';
    butt.m_IconString = '&#58902;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Zeichenwerkzeug';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'Marker';
    butt.m_IconString = '&#58903;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Markierwerkzeug';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    /*butt = new TCommandPanelData();
    butt.m_Command = 'Forms';
    butt.m_IconString = '&#58903;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Formenwerkzeug';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);*/

    butt = new TCommandPanelData();
    butt.m_Command = 'Comment';
    butt.m_IconString = '&#58901;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Notiz hinzufügen';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'Occluder';
    butt.m_IconString = '&#58905;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Verdecker hinzufügen';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'Highlight';
    butt.m_IconString = '&#58904;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Highlight hinzufügen';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'Visibility Panel';
    butt.m_IconString = '&#58964;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Elemente ein-/ ausblenden';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'Delete';
    butt.m_IconString = '&#58936;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Löschen';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    return res;
  }

  function BuildCommandCommandPanelButtons_Zoom() {
    var res = [];
    var butt;

    butt = new TCommandPanelData();
    butt.m_Command = 'ZoomIn';
    butt.m_IconString = '&#58917;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Vergrößern';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'ZoomOut';
    butt.m_IconString = '&#58916;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Verkleinern';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'Fit';
    butt.m_IconString = '&#58922;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Buch einpassen';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'FullScreen';
    butt.m_IconString = '&#58910;';
    butt.m_IconStringInactive = '&#58911;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Vollbildmodus';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    return res;
  }

  function BuildCommandCommandPanelButtons_PenStroke() {
    var res = [];
    var butt;

    for (var i = 0; i < CONST_PEN_STROKE_COLORS.length; i++) {
      for (var j = 0; j < CONST_PEN_STROKE_THICKNESSES.length; j++) {

        butt = new TCommandPanelData();
        butt.m_Command = 'SetPenStroke ' + CONST_PEN_STROKE_COLORS[i] + ' ' + CONST_PEN_STROKE_THICKNESSES[j];
        butt.m_NumFramesX = 4;
        butt.m_Hint = 'Farbe wählen';
        if (j === 0) {
          butt.m_cssClass = CSS_COLOR_BUTTON + CSS_COLOR_BUTTON_SIZE + CSS_FLOAT_LEFT + CSS_CLEAR;
        }
        else {
          butt.m_cssClass = CSS_COLOR_BUTTON + CSS_COLOR_BUTTON_SIZE + CSS_FLOAT_LEFT;
        }
        butt.m_Tag = [CONST_PEN_STROKE_COLORS[i], CONST_PEN_STROKE_THICKNESSES[j]];
        butt.m_ColorScheme = [CONST_ICON_COLOR, CONST_ICON_BG_COLOR];
        res.push(butt);
      }
    }
    return res;
  }

  function BuildCommandCommandPanelButtons_MarkerStroke() {
    var res = [];
    var butt;

    for (var i = 0; i < CONST_MARKER_STROKE_COLORS.length; i++) {
      for (var j = 0; j < CONST_MARKER_STROKE_THICKNESSES.length; j++) {
        butt = new TCommandPanelData();
        butt.m_Command = 'SetMarkerStroke ' + CONST_MARKER_STROKE_COLORS[i] + ' ' + CONST_MARKER_STROKE_THICKNESSES[j];
        butt.m_NumFramesX = 4;
        butt.m_Hint = 'Farbe wählen';
        butt.m_cssClass = CSS_COLOR_BUTTON + CSS_COLOR_BUTTON_SIZE + CSS_FLOAT_LEFT + CSS_CLEAR;
        butt.m_Tag = [CONST_MARKER_STROKE_COLORS[i], CONST_MARKER_STROKE_THICKNESSES[j]];
        butt.m_ColorScheme = [CONST_ICON_COLOR, CONST_ICON_BG_COLOR];
        res.push(butt);
      }
    }

    return res;
  }

  function BuildCommandCommandPanelButtons_Forms() {
    var res = [];
    var butt;

    butt = new TCommandPanelData();
    butt.m_Command = 'Line';
    butt.m_IconString = '&#58913;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Linie';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_AutoFormat = false;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'Circle';
    butt.m_IconString = '&#58913;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Kreis';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_AutoFormat = false;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'Rect';
    butt.m_IconString = '&#58913;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Viereck';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_AutoFormat = false;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'Arrow';
    butt.m_IconString = '&#58913;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Pfeil';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE;
    butt.m_AutoFormat = false;
    butt.m_ColorScheme = [CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT];
    res.push(butt);

    var cnt = 0;
    for (var i = 0; i < CONST_FORMS_COLORS.length; i++) {
      for (var j = 0; j < CONST_FORMS_THICKNESSES.length; j++) {
        butt = new TCommandPanelData();
        butt.m_Command = 'SetFormStroke ' + CONST_FORMS_COLORS[i] + ' ' + CONST_FORMS_THICKNESSES[j];
        butt.m_NumFramesX = 4;
        butt.m_Hint = 'Farbe wählen';
        butt.m_cssClass = CSS_COLOR_BUTTON + CSS_COLOR_BUTTON_SIZE + CSS_FLOAT_LEFT;
        if(cnt === 0 || cnt === 5) butt.m_cssClass += CSS_CLEAR;
        butt.m_Tag = [CONST_FORMS_COLORS[i], CONST_FORMS_THICKNESSES[j]];
        butt.m_ColorScheme = [CONST_ICON_COLOR, CONST_ICON_BG_COLOR];
        res.push(butt);
      }
      cnt++;
    }

    return res;
  }

  function BuildCommandCommandPanelButtons_Visibility() {
    var res = [];
    var butt;

    butt = new TCommandPanelData();
    butt.m_Command = 'Toggle Drawings';
    butt.m_IconString = '&#58964;';
    butt.m_IconStringInactive = '&#58965;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Zeichnungen ein-/ ausblenden';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_TOGGLEDRAWINGS_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_VISIBILITY_BUTTON_ICON + CSS_VISIBILITY_BUTTON_SIZE_DRAWING;
    butt.m_ColorScheme = [CONST_ICON_VIS, CONST_ICON_BG_VIS];
    butt.m_Decorator = 'VisibilityDecorator';
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'Toggle Comments';
    butt.m_IconString = '&#58964;';
    butt.m_IconStringInactive = '&#58965;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Notizen ein-/ ausblenden';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_VISIBILITY_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_VISIBILITY_BUTTON_ICON + CSS_VISIBILITY_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_VIS, CONST_ICON_BG_VIS];
    butt.m_Decorator = 'VisibilityDecorator';
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'Toggle Occluders';
    butt.m_IconString = '&#58964;';
    butt.m_IconStringInactive = '&#58965;';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Verdecker ein-/ ausblenden';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_VISIBILITY_BUTTON_SIZE;
    butt.m_IconCssClass = CSS_VISIBILITY_BUTTON_ICON + CSS_VISIBILITY_BUTTON_SIZE;
    butt.m_ColorScheme = [CONST_ICON_VIS, CONST_ICON_BG_VIS];
    butt.m_Decorator = 'VisibilityDecorator';
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'Nothing';
    butt.m_IconString = '';
    butt.m_IconStringInactive = '';
    butt.m_NumFramesX = 4;
    butt.m_Hint = '';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_VISIBILITY_BUTTON_SIZE_TEXT;
    butt.m_IconCssClass = CSS_VISIBILITY_BUTTON_TEXT + CSS_VISIBILITY_BUTTON_SIZE_TEXT;
    butt.m_ColorScheme = [CONST_ICON_VIS, CONST_ICON_BG_VIS];
    res.push(butt);

    butt = new TCommandPanelData();
    butt.m_Command = 'Toggle All';
    butt.m_IconString = 'Alle aus';
    butt.m_IconStringInactive = 'Alle an';
    butt.m_NumFramesX = 4;
    butt.m_Hint = 'Alles ein-/ ausblenden';
    butt.m_cssClass = CSS_DEFAULT_BUTTON + CSS_VISIBILITY_BUTTON_SIZE_TEXT;
    butt.m_IconCssClass = CSS_VISIBILITY_BUTTON_TEXT + CSS_VISIBILITY_BUTTON_SIZE_TEXT;
    butt.m_ColorScheme = [CONST_ICON_VIS, CONST_ICON_BG_VIS];
    res.push(butt);

    return res;
  }

  this.InitializeComponent = function () {
    if (m_BookViewer) {
      return;
    }

    m_BookViewer = new TBookViewer(this, this.DivCtrl, this.Banshee);
    m_BookViewer.m_NO_OnBookLoaded = 'OnBookDataComplete';
    m_BookViewer.m_NO_OnStageComplete = 'OnStageDataComplete';
    m_BookViewer.m_NO_OnProjectionChanged = 'OnProjectionChanged';
    m_BookViewer.m_NO_OnHotspotSelectionChanged = 'OnHotspotSelectionChanged';
    m_BookViewer.m_NO_OnScreenOccluderDeleted = 'OnScreenOccluderDeleted';

    //Setze den Zoom-Zero Comparator auf FitToScreen(ClientArea)
    m_BookViewer.SetZoomZeroComparator(0, false);

    m_BookViewer.SetCSSStyle(CSS_BOOKVIEWER);

    //Create the command panels
    m_ToolsPanel = new TCommandPanel(this, this.DivCtrl, this.Banshee);
    m_ToolsPanel.NO_OnCommand = 'OnToolsPanelCommand';
    m_ToolsPanel.SetCSSStyle(CSS_TOOLSPANELHORIZONTAL);
    var arrBtns = BuildCommandCommandPanelButtons_Tools(this.Banshee);
    for (var i = 0; i < arrBtns.length; i++) {
      m_ToolsPanel.AddButton(arrBtns[i]);
    }

    m_ZoomPanel = new TCommandPanel(this, this.DivCtrl, this.Banshee);
    m_ZoomPanel.NO_OnCommand = 'OnZoomPanelCommand';
    m_ZoomPanel.SetCSSStyle(CSS_ZOOMPANELHORIZONTAL);
    arrBtns = BuildCommandCommandPanelButtons_Zoom(this.Banshee);
    for (var i = 0; i < arrBtns.length; i++) {
      m_ZoomPanel.AddButton(arrBtns[i]);
    }

    m_NavigationPanel = new TCommandPanel(this, this.DivCtrl, this.Banshee);
    m_NavigationPanel.NO_OnCommand = 'OnNavigationPanelCommand';

    m_NavigationPanel = new TNavigationCommandPanel(this, this.DivCtrl, this.Banshee);
    m_NavigationPanel.NO_OnCommand = 'OnNavigationPanelCommand';
    m_NavigationPanel.NO_OnGoToPage = 'OnGoToPage';
    m_NavigationPanel.NO_OnSelectVersion = 'OnSelectVersion';

    m_PenStrokePanel = new TCommandPanel(this, this.DivCtrl, this.Banshee);
    m_PenStrokePanel.NO_OnCommand = 'OnPenStrokePanelCommand';
    m_PenStrokePanel.SetCSSStyle(CSS_PENSTROKEPANEL + CSS_BOX_SHADOW);
    m_PenStrokePanel.SetDecorationOrientation('strokepanel');
    arrBtns = BuildCommandCommandPanelButtons_PenStroke();
    for (var i = 0; i < arrBtns.length; i++) {
      m_PenStrokePanel.AddButton(arrBtns[i]);
    }
    m_PenStrokePanel.ButtonCheck(m_PenStrokePanel.Components[1].m_Command, true);

    m_MarkerStrokePanel = new TCommandPanel(this, this.DivCtrl, this.Banshee);
    m_MarkerStrokePanel.NO_OnCommand = 'OnMarkerStrokePanelCommand';
    m_MarkerStrokePanel.SetCSSStyle(CSS_MARKERSTROKEPANEL + CSS_BOX_SHADOW);
    m_MarkerStrokePanel.SetDecorationOrientation('strokepanel');
    arrBtns = BuildCommandCommandPanelButtons_MarkerStroke();
    for (var i = 0; i < arrBtns.length; i++) {
      m_MarkerStrokePanel.AddButton(arrBtns[i]);
    }
    m_MarkerStrokePanel.ButtonCheck(m_MarkerStrokePanel.Components[1].m_Command, true);

    m_VisibilityPanel = new TCommandPanel(this, this.DivCtrl, this.Banshee);
    m_VisibilityPanel.NO_OnCommand = 'OnVisibilityPanelCommand';
    m_VisibilityPanel.SetCSSStyle(CSS_VISIBILITYPANEL + CSS_BOX_SHADOW);
    m_VisibilityPanel.SetDecorationOrientation('visibilitypanel');
    arrBtns = BuildCommandCommandPanelButtons_Visibility();
    for (var i = 0; i < arrBtns.length; i++) {
      m_VisibilityPanel.AddButton(arrBtns[i]);
    }
    m_VisibilityPanel.ButtonEnable('Nothing', false);

    m_FormsPanel = new TCommandPanel(this, this.DivCtrl, this.Banshee);
    m_FormsPanel.NO_OnCommand = 'OnFormsPanelCommand';
    m_FormsPanel.SetCSSStyle(CSS_FORMSPANEL + CSS_BOX_SHADOW);
    m_FormsPanel.SetDecorationOrientation('strokepanel');
    arrBtns = BuildCommandCommandPanelButtons_Forms();
    for (var i = 0; i < arrBtns.length; i++) {
      m_FormsPanel.AddButton(arrBtns[i]);
    }

    m_GlobalView = new TGlobalView(this, this.DivCtrl, this.Banshee);
    m_GlobalView.m_NO_OnStageChangeRequest = 'OnStageChangeRequest';
    m_GlobalView.m_NO_OnHideThumbnails = 'OnHideThumbnails';
    m_GlobalView.SetVisible(false);

    if (!this.Banshee.CanDoFullscreen()) {
      m_ZoomPanel.ButtonEnable('FullScreen', false);
      m_ZoomPanel.ButtonSetHint('Move', 'Vollbildmodus ist in diesem Browser nicht verfügbar');
    }

    m_BookViewer.SetScreenOccluderVisible(false);

    //if (isTeacherVersion) {
      m_NavigationPanel.SetVersionButtonState(m_VersionButtonState);
    //}

    //Set States
    m_BookViewer.SetDocViewOffsets(CONST_DOCVIEW_OFFSETS[0], CONST_DOCVIEW_OFFSETS[1], CONST_DOCVIEW_OFFSETS[2], CONST_DOCVIEW_OFFSETS[3]);
  };

  this.OnGoToPage = function (o, pageNum) {
    var numStages = m_BookViewer.GetNumStages();
    var stageNum = (pageNum - (pageNum % 2)) / 2 + 1;

    if (stageNum > numStages - 1) {
      stageNum = numStages - 1;
    }

    if (stageNum >= 0) {
      this.DoChangeStage(stageNum);
    }

    updateUpperUI(this);
    updateLowerUI(this);
  };

  this.OnSelectVersion = function () {
    this.Banshee.Notify('p_OnSwitchBookVersion');
  };

  function resetHidePanelTimer() {
    if (m_HidePanelTimer !== null) {
      window.clearTimeout(m_HidePanelTimer);
      m_HidePanelTimer = null;
    }
  };

  function startHidePanelTimer(panel, timeout) {
    resetHidePanelTimer();
    m_HidePanelTimer = window.setTimeout(function () {
      panel.SetVisible(false);
      m_HidePanelTimer = null;
      if(panel == m_VisibilityPanel){
        m_ToolsPanel.ButtonCheck('Visibility Panel', false);
      }
    }, timeout);
  };

  this.OnHideThumbnails = function(sender){
    m_NavigationPanel.ButtonCheck('Thumbnails', false);
    m_GlobalView.SetVisible(false);
  };

  function resetCanvasPainter() {
    m_BookViewer.SetCanvasPainterEnabled(false);
    m_BookViewer.SetCanvasPainterMouseMoveDeletes(false);
    m_BookViewer.SetCanvasPainterCursor(0);
  }

  this.OnToolsPanelCommand = function (obj, szCommand) {
    m_BookViewer.SetCanvasPainterMouseMoveDeletes(false);
    m_ToolsPanel.UncheckAll();
    resetCanvasPainter();
    deleteModeActive = false;

    var parentPos = bansheeStagePos(obj.DivCtrl, this.Banshee.DivCtrl);
    var pos = bansheeStagePos(obj.CommandComponent.DivCtrl, this.DivCtrl);

    switch (szCommand) {
      case 'Move':
        resetHidePanelTimer();
        m_PenStrokePanel.SetVisible(false);
        m_MarkerStrokePanel.SetVisible(false);
        m_VisibilityPanel.SetVisible(false);
        m_FormsPanel.SetVisible(false);
        m_ToolsPanel.ButtonCheck('Delete', false);
        obj.ButtonCheck(obj.CurrCommand, true);
        break;
      case 'Pen':
        m_VisibilityPanel.SetVisible(false);
        m_MarkerStrokePanel.SetVisible(false);
        m_FormsPanel.SetVisible(false);

        m_BookViewer.SetCanvasPainterEnabled(true);
        var penColor = m_recentPenStrokeColor == null ? CONST_PEN_STROKE_COLORS[0] : m_recentPenStrokeColor;
        m_BookViewer.SetCanvasPainterPenColor(penColor);
        var penThickness = m_recentPenStrokeThickness == null ? CONST_PEN_STROKE_THICKNESSES[0] : m_recentPenStrokeThickness;
        m_BookViewer.SetCanvasPainterPenThickness(penThickness);
        m_BookViewer.SetCanvasPainterCursor(1);
        obj.ButtonCheck(obj.CurrCommand, true);

        pos[1] += 48;
        if (!m_PenStrokePanel.Visible) {
          m_PenStrokePanel.SetVisible(true);
          m_PenStrokePanel.SetBounds(pos[0], pos[1], m_PenStrokePanel.width, m_PenStrokePanel.height);
          startHidePanelTimer(m_PenStrokePanel, PANEL_VISIBILITY_TIME);
        }
        else {
          m_PenStrokePanel.SetVisible(false);
          resetHidePanelTimer();
        }
        break;
      case 'Marker':
        m_VisibilityPanel.SetVisible(false);
        m_PenStrokePanel.SetVisible(false);
        m_FormsPanel.SetVisible(false);
        m_BookViewer.SetCanvasPainterEnabled(true);

        obj.ButtonCheck(obj.CurrCommand, true);
        var penColor = m_recentMarkerStrokeColor == null ? CONST_MARKER_STROKE_COLORS[0] : m_recentMarkerStrokeColor;
        var argb = new TARGBColor(0, 0, 0, 0);
        argb.Assign(penColor);
        argb.m_a = CONST_MARKER_STROKE_OPACITY;
        m_BookViewer.SetCanvasPainterPenColor(argb);
        var penThickness = m_recentMarkerStrokeThickness == null ? CONST_MARKER_STROKE_THICKNESSES[0] : m_recentMarkerStrokeThickness;
        m_BookViewer.SetCanvasPainterPenThickness(penThickness);
        m_BookViewer.SetCanvasPainterCursor(2);

        pos[1] += 48;
        if (!m_MarkerStrokePanel.Visible) {
          m_MarkerStrokePanel.SetVisible(true);
          m_MarkerStrokePanel.SetBounds(pos[0], pos[1], m_MarkerStrokePanel.width, m_MarkerStrokePanel.height);
          startHidePanelTimer(m_MarkerStrokePanel, PANEL_VISIBILITY_TIME);
        }
        else {
          m_MarkerStrokePanel.SetVisible(false);
          resetHidePanelTimer();
        }
        break;
      case 'Forms':
        m_VisibilityPanel.SetVisible(false);
        m_MarkerStrokePanel.SetVisible(false);
        m_PenStrokePanel.SetVisible(false);
        pos[1] += 48;
        if (!m_FormsPanel.Visible) {
          m_BookViewer.SetCanvasPainterEnabled(true);
          obj.ButtonCheck(obj.CurrCommand, true);
          m_FormsPanel.SetVisible(true);
          m_FormsPanel.SetBounds(pos[0], pos[1], m_FormsPanel.width, m_FormsPanel.height);
          var penColor = m_recentFormsColor == null ? CONST_FORMS_COLORS[0] : m_recentFormsColor;
          m_BookViewer.SetCanvasPainterPenColor(penColor);
          var penThickness = m_recentFormsThickness == null ? CONST_FORMS_THICKNESSES[0] : m_recentFormsThickness;
          m_BookViewer.SetCanvasPainterPenThickness(penThickness);
          m_BookViewer.SetCanvasPainterCursor(1);
          startHidePanelTimer(m_FormsPanel, PANEL_VISIBILITY_TIME);
        }
        else {
          obj.ButtonCheck(obj.CurrCommand, true);
          m_FormsPanel.SetVisible(false);
          resetHidePanelTimer();
        }
        break;
      case 'Occluder':
        m_VisibilityPanel.SetVisible(false);
        m_PenStrokePanel.SetVisible(false);
        m_MarkerStrokePanel.SetVisible(false);
        m_FormsPanel.SetVisible(false);
        resetHidePanelTimer();
        var bookOffset = m_BookViewer.GetBookOffset();
        m_BookViewer.EmitOccluder(  (-1 * bookOffset[0] + 150) / (m_BookViewer.GetZoom() / 100),
                (-1 * bookOffset[1] + 50) / (m_BookViewer.GetZoom() / 100),
                140 / m_BookViewer.GetZoomZero(),
                72 / m_BookViewer.GetZoomZero());
        m_ToolsPanel.ButtonCheck('Move', true);
        break;
      case 'Highlight':
        resetHidePanelTimer();
        m_VisibilityPanel.SetVisible(false);
        m_PenStrokePanel.SetVisible(false);
        m_MarkerStrokePanel.SetVisible(false);
        m_FormsPanel.SetVisible(false);
        if(m_BookViewer.GetScreenOccluderVisible() == true){
          m_BookViewer.SetScreenOccluderVisible(false);
          m_ToolsPanel.ButtonCheck('Highlight', false);
        }
        else{
          if (!m_BookViewer.GetScreenOccludersData()) {
            var bookOffset = m_BookViewer.GetBookOffset();
            m_BookViewer.EmitScreenOccluder(  (-1 * bookOffset[0] + 100) / (m_BookViewer.GetZoom() / 100),
                    (-1 * bookOffset[1] + 50) / (m_BookViewer.GetZoom() / 100),
                    400,
                    300);
          }
          m_BookViewer.SetScreenOccluderVisible(true);
          m_ToolsPanel.ButtonCheck('Highlight', true);
        }
        m_ToolsPanel.ButtonCheck('Move', true);
        break;
      case 'Comment':
        resetHidePanelTimer();
        m_VisibilityPanel.SetVisible(false);
        m_PenStrokePanel.SetVisible(false);
        m_MarkerStrokePanel.SetVisible(false);
        m_FormsPanel.SetVisible(false);
        //generate 1 comment
        var bookOffset = m_BookViewer.GetBookOffset();
        m_BookViewer.EmitComment( (-1 * bookOffset[0] + 50) / (m_BookViewer.GetZoom() / 100),
                                  (-1 * bookOffset[1] + 50) / (m_BookViewer.GetZoom() / 100),
                                  400,
                                  300);
        m_ToolsPanel.ButtonCheck('Move', true);
        break;
      case 'Visibility Panel':
        pos[1] += 36;
        pos[0] = parentPos[0] + 46;
        m_PenStrokePanel.SetVisible(false);
        m_MarkerStrokePanel.SetVisible(false);
        m_FormsPanel.SetVisible(false);
        if (!m_VisibilityPanel.Visible) {
          resetHidePanelTimer();
          m_VisibilityPanel.SetVisible(true);
          m_VisibilityPanel.SetBounds(pos[0], pos[1], m_VisibilityPanel.width, m_VisibilityPanel.height);
          obj.ButtonCheck(obj.CurrCommand, true);
          startHidePanelTimer(m_VisibilityPanel, PANEL_VISIBILITY_TIME);
          m_VisibilityPanel.SetDecorationPosition('collapse');
        }
        else {
          m_VisibilityPanel.SetVisible(false);
          obj.ButtonCheck(obj.CurrCommand, false);
        }
        m_ToolsPanel.ButtonCheck('Move', true);
        break;
      case 'Delete':
        resetHidePanelTimer();
        m_VisibilityPanel.SetVisible(false);
        m_PenStrokePanel.SetVisible(false);
        m_MarkerStrokePanel.SetVisible(false);
        m_BookViewer.SetCanvasPainterEnabled(true);
        m_BookViewer.SetCanvasPainterMouseMoveDeletes(true);
        deleteModeActive = true;
        m_ToolsPanel.ButtonCheck('Move', false);
        obj.ButtonCheck(obj.CurrCommand, true);
        break;
    }
  };

  this.OnZoomPanelCommand = function (obj, szCommand) {
    resetCanvasPainter();
    m_ToolsPanel.UncheckAll();
    m_PenStrokePanel.SetVisible(false);
    m_MarkerStrokePanel.SetVisible(false);

    switch (szCommand) {
      case 'FullScreen':
        this.Banshee.SetFullScreen();
        this.Banshee.Notify("p_OnFullScreenChanged", this.Banshee.GetFullScreen());
        obj.ButtonCheck(obj.CurrCommand, this.Banshee.GetFullScreen());
        var FullScreenButton = obj.GetCommandObject(obj, szCommand);
        if(this.Banshee.GetFullScreen()){
          FullScreenButton.SetCSSStyle(CSS_DEFAULT_BUTTON + CSS_FULLSCREEN_BUTTON_SIZE);
          FullScreenButton.SetIconCSSStyle(CSS_FULLSCREEN_BUTTON_ICON + CSS_FULLSCREEN_BUTTON_SIZE);
          FullScreenButton.SetColorScheme(CONST_ICON_INVERSE, CONST_ICON_BG_INVERSE);
        }
        else{
          FullScreenButton.SetCSSStyle(CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE);
          FullScreenButton.SetIconCSSStyle(CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE);
          FullScreenButton.SetColorScheme(CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT);
        }
        obj.ButtonCheck('Move', true);
        break;
      case 'ZoomIn':
        m_BookViewer.Zoom(m_BookViewer.GetZoom() * m_BookViewer.GetZoomStride());
        break;
      case 'ZoomOut':
        m_BookViewer.Zoom(m_BookViewer.GetZoom() / m_BookViewer.GetZoomStride());
        break;
      case 'Fit':
        m_BookViewer.ZoomZero();
        break;
    }
  };

  this.OnNavigationPanelCommand = function (obj, szCommand) {
    var bCheck;
    switch (szCommand) {
      case 'Prev':
        this.DoChangeStage(PREV_PAGES);
        break;
      case 'Home':
        this.DoChangeStage(0);
        break;
      case 'Thumbnails':
        m_GlobalView.SetVisible(!m_GlobalView.Visible);
        m_GlobalView.Visible ? m_NavigationPanel.ButtonCheck('Thumbnails', true) : m_NavigationPanel.ButtonCheck('Thumbnails', false);
        break;
      case 'Next':
        this.DoChangeStage(NEXT_PAGES);
        break;
    }
  };

  this.OnPenStrokePanelCommand = function (obj, szCommand) {
    var command = szCommand;
    var splitCommand = command.split(' ');
    switch (splitCommand[0]) {
      case 'SetPenStroke':
        m_BookViewer.SetCanvasPainterGeometryMode('lines');
        m_BookViewer.SetCanvasPainterPenColor(splitCommand[1]);
        m_BookViewer.SetCanvasPainterPenThickness(splitCommand[2]);
        m_recentPenStrokeColor = splitCommand[1];
        m_recentPenStrokeThickness = splitCommand[2];
        m_PenStrokePanel.SetVisible(false);
        m_PenStrokePanel.UncheckAll();
        m_PenStrokePanel.ButtonCheck(szCommand, true);
        break;
    }
  };

  this.OnMarkerStrokePanelCommand = function (obj, szCommand) {
    var command = szCommand;
    var splitCommand = command.split(' ');
    switch (splitCommand[0]) {
      case 'SetMarkerStroke':
        m_BookViewer.SetCanvasPainterGeometryMode('lines');
        var argb = new TARGBColor(0, 0, 0, 0);
        argb.Assign(splitCommand[1]);
        argb.m_a = CONST_MARKER_STROKE_OPACITY;
        m_BookViewer.SetCanvasPainterPenColor(argb);
        m_BookViewer.SetCanvasPainterPenThickness(splitCommand[2]);
        m_recentMarkerStrokeColor = splitCommand[1];
        m_recentMarkerStrokeThickness = splitCommand[2];
        m_MarkerStrokePanel.SetVisible(false);
        m_MarkerStrokePanel.UncheckAll();
        m_MarkerStrokePanel.ButtonCheck(szCommand, true);
        break;
    }
  };

  this.OnVisibilityPanelCommand = function (obj, szCommand) {
    resetCanvasPainter();

    switch (szCommand) {
      case 'Toggle Drawings':
        //toggle Pen Layer visibility
        var canvasPainterVisible = !m_BookViewer.GetCanvasPainterVisible();
        m_BookViewer.SetCanvasPainterVisible(canvasPainterVisible);
        startHidePanelTimer(m_VisibilityPanel, PANEL_VISIBILITY_TIME);
        obj.ButtonCheck(obj.CurrCommand, canvasPainterVisible);
        m_ToolsPanel.ButtonEnable('Pen', canvasPainterVisible);
        m_ToolsPanel.ButtonEnable('Marker', canvasPainterVisible);
        break;
      case 'Toggle Occluders':
        //toggle Occluders Layer visibility
        if(isUserLoggedIn){
          var occludersVisible = !m_BookViewer.GetOccludersVisible();
          m_BookViewer.SetOccludersVisible(occludersVisible);
          startHidePanelTimer(m_VisibilityPanel, PANEL_VISIBILITY_TIME);
          obj.ButtonCheck(obj.CurrCommand, occludersVisible);
          m_ToolsPanel.ButtonEnable('Occluder', occludersVisible);
        }
        break;
      case 'Toggle Comments':
        //toggle Comments Layer visibility
        if(isUserLoggedIn){
          var commentsVisible = !m_BookViewer.GetCommentsVisible();
          m_BookViewer.SetCommentsVisible(commentsVisible);
          startHidePanelTimer(m_VisibilityPanel, PANEL_VISIBILITY_TIME);
          obj.ButtonCheck(obj.CurrCommand, commentsVisible);
          m_ToolsPanel.ButtonEnable('Comment', commentsVisible);
        }
        break;
      case 'Toggle All':
        startHidePanelTimer(m_VisibilityPanel, PANEL_VISIBILITY_TIME);
        if(!m_BookViewer.GetCanvasPainterVisible() || !m_BookViewer.GetCommentsVisible() || !m_BookViewer.GetOccludersVisible()){
          m_BookViewer.SetCanvasPainterVisible(true);
          obj.ButtonCheck('Toggle Drawings', true);
          if(isUserLoggedIn){
            m_BookViewer.SetCommentsVisible(true);
            obj.ButtonCheck('Toggle Comments', true);
            m_BookViewer.SetOccludersVisible(true);
            obj.ButtonCheck('Toggle Occluders', true);
          }
          obj.ButtonCheck('Toggle All', true);
        }
        else{
          m_BookViewer.SetCanvasPainterVisible(false);
          obj.ButtonCheck('Toggle Drawings', false);
          if(isUserLoggedIn){
            m_BookViewer.SetCommentsVisible(false);
            obj.ButtonCheck('Toggle Comments', false);
            m_BookViewer.SetOccludersVisible(false);
            obj.ButtonCheck('Toggle Occluders', false);
          }
          obj.ButtonCheck('Toggle All', false);
        }
          updateUpperUI(this);
        break;
    }
    if(!m_BookViewer.GetCanvasPainterVisible() || !m_BookViewer.GetCommentsVisible() || !m_BookViewer.GetOccludersVisible()){
      obj.ButtonCheck('Toggle All', false);
    }
    else{
      obj.ButtonCheck('Toggle All', true);
    }
  };

  this.OnFormsPanelCommand = function (obj, szCommand) {
    var command = szCommand;
    var splitCommand = command.split(' ');
    console.log(szCommand);

    switch (splitCommand[0]) {
      case 'Line':
        m_BookViewer.SetCanvasPainterGeometryMode('line');
        break;
      case 'Rect':
        m_BookViewer.SetCanvasPainterGeometryMode('rect');
        break;
      case 'Circle':
        m_BookViewer.SetCanvasPainterGeometryMode('circle');
        break;
      case 'Ellipse':
        m_BookViewer.SetCanvasPainterGeometryMode('ellipse');
        break;
      case 'Arrow':
        m_BookViewer.SetCanvasPainterGeometryMode('arrow');
        break;
      case 'SetFormStroke':
        //m_BookViewer.SetCanvasPainterGeometryMode('lines');
        m_BookViewer.SetCanvasPainterPenColor(splitCommand[1]);
        m_BookViewer.SetCanvasPainterPenThickness(splitCommand[2]);
        m_recentFormsColor = splitCommand[1];
        m_recentFormsThickness = splitCommand[2];
        m_FormsPanel.UncheckAll();
        m_FormsPanel.ButtonCheck(szCommand, true);
        break;
    }
  };

//Banshee-Notification - FullscreenCancelled
  this.FullscreenCancelled = function () {
    //Update button states
    updateUpperUI(this);
    updateLowerUI(this);
  };

//Kommando vom Bookviewer
  this.OnHotspotSelectionChanged = function (obj, params) {
    this.Banshee.Notify('p_OnHotspotSelectionChanged', params);
  };

  this.OnScreenOccluderDeleted = function (obj) {
    m_BookViewer.SetScreenOccluderVisible(false);
    m_ToolsPanel.ButtonCheck('Highlight', false);
    updateUpperUI(this);
  };

  function updateUpperUI(inst) {
    //Disable elements
    m_ToolsPanel.UncheckAll();
    if(!deleteModeActive){
      m_ToolsPanel.ButtonCheck('Move', true);
      resetCanvasPainter();
    }
    else{
      m_ToolsPanel.ButtonCheck('Delete', true);
    }

    //Set Buttonstates
    m_VisibilityPanel.ButtonCheck('Toggle Drawings', m_BookViewer.GetCanvasPainterVisible());

    //Enable elements if needed
    m_ToolsPanel.ButtonEnable('Pen', m_VisibilityPanel.getButtonChecked('Toggle Drawings'));
    m_ToolsPanel.ButtonEnable('Marker', m_VisibilityPanel.getButtonChecked('Toggle Drawings'));
    if(isUserLoggedIn === true){
      m_VisibilityPanel.ButtonCheck('Toggle Occluders', m_BookViewer.GetOccludersVisible());
      m_VisibilityPanel.ButtonCheck('Toggle Comments', m_BookViewer.GetCommentsVisible());
      m_ToolsPanel.ButtonEnable('Comment', m_VisibilityPanel.getButtonChecked('Toggle Comments'));
      m_ToolsPanel.ButtonEnable('Occluder', m_VisibilityPanel.getButtonChecked('Toggle Occluders'));
      m_ToolsPanel.ButtonEnable('Highlight', true);
      if(m_BookViewer.GetScreenOccluderVisible() == true){
        m_ToolsPanel.ButtonCheck('Highlight', true);
      }
      else{
        m_ToolsPanel.ButtonCheck('Highlight', false);
      }
    }
    else{
      m_VisibilityPanel.ButtonCheck('Toggle Occluders', false);
      m_VisibilityPanel.ButtonCheck('Toggle Comments', false);
      m_VisibilityPanel.ButtonCheck('Toggle Highlights', false);
      m_ToolsPanel.ButtonEnable('Comment', false);
      m_ToolsPanel.ButtonEnable('Occluder', false);
      m_ToolsPanel.ButtonEnable('Highlight', false);
    }
    m_ToolsPanel.ButtonCheck('Visibility Panel', m_VisibilityPanel.Visible);

    m_ZoomPanel.ButtonCheck('FullScreen', inst.Banshee.GetFullScreen());

    m_NavigationPanel.SetVersionButtonState(m_VersionButtonState, isTeacherVersion);

    if(inst.Banshee.GetFullScreen() === false){
      var FullScreenButton = m_ZoomPanel.GetCommandObject(m_ZoomPanel, 'FullScreen');
      FullScreenButton.SetCSSStyle(CSS_DEFAULT_BUTTON + CSS_DEFAULT_BUTTON_SIZE);
      FullScreenButton.SetIconCSSStyle(CSS_DEFAULT_BUTTON_ICON + CSS_DEFAULT_BUTTON_SIZE);
      FullScreenButton.SetColorScheme(CONST_ICON_DEFAULT, CONST_ICON_BG_DEFAULT);
    }
  };

  function updateLowerUI(inst) {
    var currStage = m_BookViewer.GetCurrentStage();
    var numStages = m_BookViewer.GetNumStages();

    var firstStage = (currStage !== numStages - 1) && (numStages !== 0);
    m_NavigationPanel.ButtonEnable('Next', firstStage);

    var lastStage = (currStage !== 0) && (numStages !== 0);
    m_NavigationPanel.ButtonEnable('Prev', lastStage);
    m_NavigationPanel.ButtonEnable('Home', lastStage);

    m_GlobalView.SetCurrentStage(currStage);

    var leftPageNum = 2 * (currStage - 1); // TODO: to work correctly, page numbers should be provided by metadata
    var rightPageNum = 2 * (currStage - 1) + 1;
    m_NavigationPanel.SetLeftPageNum(leftPageNum);
    m_NavigationPanel.SetRightPageNum(rightPageNum);

    //Enable elements if needed
    m_GlobalView.Visible ? m_NavigationPanel.ButtonCheck('Thumbnails', true) : m_NavigationPanel.ButtonCheck('Thumbnails', false);
  };

//called by mainlayer
  this.displayBook = function (sender, oBookInfo) {
    if (!oBookInfo || !oBookInfo.BookUrl) {
      bansheeTraceOut(this, '>> Falsche bookinfo');
      return;
    }
    if (!oBookInfo.DataDir && !oBookInfo.StageUris) {
      bansheeTraceOut(this, 'Was soll das?');
      return;
    }

    m_BookViewer.InitBook(oBookInfo.BookUrl,
            oBookInfo.DataDir,

            oBookInfo.StageUris
    );
  };

  this.OnSystemDragDrop = function (evt) {
    if (evt && evt.dataTransfer) {
      var data = evt.dataTransfer.getData("Text");
      var list = bansheeStringList(data);
      if (list && list.length === 3) {
        this.p_LoadBook(list[0], list[1], list[2]);
      }
    }
  };


//Book viewer data loaded (lpBookRoot XMLRootNode of the globalBook data)
  this.OnBookDataComplete = function (sender, lpBookRoot) {
    var szOut;
    if (lpBookRoot === null) { //Scheiße , Mist, Error - Severe
      szOut = 'OnBookDataComplete:' + lpBookRoot + ' ist nicht gültig.';
      bansheeTraceOut(this, szOut);
    }
    else {
      if (m_TocView) {
        szOut = 'OnBookDataComplete:' + ' initialisiere TOC..';
        bansheeTraceOut(this, szOut);
        //Initialisiere das Inhaltsverzeichnis
        m_TocView.InitTOC(lpBookRoot.getElementsByTagName('tableOfContents')[0]);
      }
    }

    //Notify
    this.Banshee.Notify('p_OnBookLoaded');
  };


//Book viewer stage complete
  this.OnStageDataComplete = function (sender, params) {
    updateUpperUI(this);
    updateLowerUI(this);
    var wh = [this.w, this.h];
    this.ReformatCommandPanels(wh);

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Rearrange the z-orders
    this.Banshee.UpdateZOrder(this.Banshee, 0);
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    //Notify
    this.Banshee.Notify('p_OnStageLoaded');
  };

  this.SetVisible = function (bVis) {
    bansheeSetVisible(this, bVis);
  };

  this.SetBounds = function (x, y, w, h) {
    bansheeSetBounds(this, x, y, w, h);
  };

  this.HideFloatPanels = function(){
    m_PenStrokePanel.SetVisible(false);
    m_MarkerStrokePanel.SetVisible(false);
    m_FormsPanel.SetVisible(false);
    m_VisibilityPanel.SetVisible(false);
    resetHidePanelTimer();
  };

  this.ReformatCommandPanels = function (wh) {
    this.SetBounds(0, 0, wh[0], wh[1]);

    var leftOffset = CONST_BOOKVIEWER_OFFSETS_LANDSCAPE[0];
    var topOffset = CONST_BOOKVIEWER_OFFSETS_LANDSCAPE[1];
    var rightOffset = CONST_BOOKVIEWER_OFFSETS_LANDSCAPE[2];
    var bottomOffset = CONST_BOOKVIEWER_OFFSETS_LANDSCAPE[3];
    var leftPanelOffset;
    var rightPanelOffset;

    if (wh[0] > CONST_MINBOOKEDITORVIEWWIDTH) {
      topOffset = CONST_BOOKVIEWER_OFFSETS_LANDSCAPE[1];
      bottomOffset = CONST_BOOKVIEWER_OFFSETS_LANDSCAPE[3];
      m_BookViewer.SetZoomZeroComparator(0, true);
    }
    else {
      topOffset = CONST_BOOKVIEWER_OFFSETS_PORTRAIT[1];
      if(m_VersionButtonState !== 'hidden'){
        bottomOffset = CONST_BOOKVIEWER_OFFSETS_PORTRAIT[3];}
      else{
        bottomOffset = CONST_BOOKVIEWER_OFFSETS_LANDSCAPE[3];
      }
      m_BookViewer.SetZoomZeroComparator(1, true);
    }

    //Reformat the stage
    m_BookViewer.SetBounds(leftOffset, topOffset, wh[0] - leftOffset - rightOffset, wh[1] - topOffset - bottomOffset);
    m_BookViewer.ZoomZero();

    if (wh[0] > CONST_MINBOOKEDITORVIEWWIDTH) {
      m_ToolsPanel.DivCtrl.style.cssText = CSS_TOOLSPANELHORIZONTAL;
      m_ZoomPanel.DivCtrl.style.cssText = CSS_ZOOMPANELHORIZONTAL;
      m_NavigationPanel.DivCtrl.style.cssText = CSS_NAVIGATIONPANELHORIZONTAL;
      if(m_VersionButtonState != 'hidden'){
        m_NavigationPanel.VersionButtonSetCSS(CSS_DEFAULT_BUTTON + CSS_VERSION_BUTTON_SIZE);
        m_GlobalView.SetScrollViewerContainerCSS('bottom: 48px;');
        m_NavigationPanel.DivCtrl.style.width = '552px';
      }
      else{
        m_NavigationPanel.VersionButtonSetCSS(CSS_DIM_ZERO);
        m_NavigationPanel.DivCtrl.style.width = '276px';
      }
      m_NavigationPanel.DivCtrl.style.marginLeft = '-' + m_NavigationPanel.w/2 + 'px';

      leftPanelOffset = Math.round(m_BookViewer.GetDocViewDragArea()[0] + CONST_DOCVIEW_OFFSETS[0]);
      rightPanelOffset = Math.round(m_BookViewer.GetDocViewDragArea()[0] + CONST_DOCVIEW_OFFSETS[2]);

      if((m_BookViewer.GetContentSize()[0] * m_BookViewer.GetZoom() / 100) < m_ToolsPanel.w + m_ZoomPanel.w + 10){
        var widthDifference = Math.abs(m_ToolsPanel.w - m_ZoomPanel.w);
        m_ToolsPanel.DivCtrl.style.left = 'auto';
        m_ZoomPanel.DivCtrl.style.right = 'auto';

        m_ToolsPanel.DivCtrl.style.right = (wh[0]/2 + 5 - widthDifference/2) + 'px';
        m_ZoomPanel.DivCtrl.style.left = (wh[0]/2 + 5 + widthDifference/2) + 'px';
      }
      else{
        m_ToolsPanel.DivCtrl.style.right = 'auto';
        m_ZoomPanel.DivCtrl.style.left = 'auto';

        m_ToolsPanel.DivCtrl.style.left = leftPanelOffset + 'px';
        m_ZoomPanel.DivCtrl.style.right = rightPanelOffset + 'px';
      }
    }
    else {
      m_ToolsPanel.DivCtrl.style.cssText = CSS_TOOLSPANELVERTICAL;
      m_ZoomPanel.DivCtrl.style.cssText = CSS_ZOOMPANELVERTICAL;
      m_NavigationPanel.DivCtrl.style.cssText = CSS_NAVIGATIONPANELVERTICAL;
      if(m_VersionButtonState != 'hidden'){
        m_NavigationPanel.VersionButtonSetCSS(CSS_DEFAULT_BUTTON + CSS_VERSION_BUTTON_SIZE_VERTICAL);
        m_GlobalView.SetScrollViewerContainerCSS('bottom: 84px;');
        m_NavigationPanel.DivCtrl.style.width = '276px';
        m_NavigationPanel.DivCtrl.style.height = '72px';
      }
      else{
        m_NavigationPanel.VersionButtonSetCSS(CSS_DIM_ZERO);
        m_NavigationPanel.DivCtrl.style.width = '276px';
        m_NavigationPanel.DivCtrl.style.height = '36px';
      }
      m_NavigationPanel.DivCtrl.style.marginLeft = '-' + m_NavigationPanel.w/2 + 'px';

      m_ToolsPanel.DivCtrl.style.left = leftPanelOffset + 'px';
      m_ZoomPanel.DivCtrl.style.right = rightPanelOffset + 'px';
    }
    m_NavigationPanel.DivCtrl.style.marginLeft = '-' + m_NavigationPanel.DivCtrl.offsetWidth / 2 + 'px';

    m_VisibilityPanel.SetVisible(false);
    m_PenStrokePanel.SetVisible(false);
    m_MarkerStrokePanel.SetVisible(false);
    m_FormsPanel.SetVisible(false);

  };

  this.OnStageSizeChanged = function (wh) {
    this.ReformatCommandPanels(wh);
  };

  this.OnProjectionChanged = function () {
    updateZoomButtons();
    m_GlobalView.SetMaxHeight(m_BookViewer.h);
    this.Banshee.Notify('p_OnProjectionChanged');
  };

  function updateZoomButtons() {
    var zoom = m_BookViewer.GetZoom();
    var minZoom = m_BookViewer.GetZoomZero() * 100;
    var maxZoom = minZoom * m_BookViewer.GetMaxZoomFactor();

    var enableFit = Math.abs(zoom - minZoom) > 0.0001;
    m_ZoomPanel.ButtonEnable('Fit', enableFit);
    m_BookViewer.SetEnableFit(enableFit);

    var enableZoomIn = Math.abs(zoom - maxZoom) > 0.0001;
    m_ZoomPanel.ButtonEnable('ZoomIn', enableZoomIn);

    var enableZoomOut = Math.abs(zoom - minZoom) > 0.0001;
    m_ZoomPanel.ButtonEnable('ZoomOut', enableZoomOut);
    if (enableFit) {
      m_ZoomPanel.ButtonCheck('ZoomIn', true);
      m_ZoomPanel.ButtonCheck('ZoomOut', true);
    }
    else {
      m_ZoomPanel.ButtonCheck('ZoomIn', false);
      m_ZoomPanel.ButtonCheck('ZoomOut', false);
    }
  }

// Methode zum Wechseln der Bühne
  this.DoChangeStage = function (stageNumber) {
    if (m_BookViewer.GetCurrentStage() === stageNumber)
      return;

    this.Banshee.Notify('p_OnBeforeChangeStage');

    m_BookViewer.SetUserData(null);

    // Goto Stage
    if (stageNumber == PREV_PAGES) {
      m_BookViewer.PrevPages();
    } else if (stageNumber == NEXT_PAGES) {
      m_BookViewer.NextPages();
    } else {
      m_BookViewer.LoadStage(stageNumber);
    }
  };

  this.LoadBook = function (BookUrl, globalViewURL, DataDir, StageUris, initialStageID) {
    if (!BookUrl) {
      bansheeTraceOut(this, '>> Falsche bookinfo');
      return;
    }
    if (!DataDir && !StageUris) {
      bansheeTraceOut(this, 'Was soll das?');
      return;
    }

    m_BookID = BookUrl;

    if (initialStageID === undefined || initialStageID === null) {
      initialStageID = 0;
    }

    m_BookViewer.InitBook(BookUrl, DataDir, StageUris, initialStageID);
    if (globalViewURL) {
      m_GlobalView.Load(globalViewURL);
    }
  };

//Zoom - Property
  this.SetZoom = function (value) {
    m_BookViewer.Zoom(value);
  };

  this.GetZoom = function () {
    return m_BookViewer.GetZoom();
  };

  this.ZoomZero = function () {
    m_BookViewer.ZoomZero();
  };

  this.GetZoomZero = function () {
    return m_BookViewer.GetZoomZero();
  };

//HorizontalOffset - Property
  this.SetHorizontalOffset = function (value) {
  };
  this.GetHorizontalOffset = function () {
  };

//VerticalOffset - Property
  this.SetVerticalOffset = function (value) {
  };

  this.GetVerticalOffset = function () {
  };

//Current-Stage property
  this.GetCurrentStage = function () {
    return m_BookViewer.GetCurrentStage();
  };

//NumStages-Getter
  this.GetNumStages = function () {
    return m_BookViewer.GetNumStages();
  };

//CanvasPainter access
//true | false
  this.EnableCanvasPainter = function (bEnable) {
    m_BookViewer.SetCanvasPainterEnabled(bEnable);
  };

  this.SetCanvasPainterPenColor = function (colorString) {
    m_BookViewer.SetCanvasPainterPenColor(colorString);
  };

  this.SetCanvasPainterPenThickness = function (dwThickness) {
    m_BookViewer.SetCanvasPainterPenThickness(dwThickness);
  };

  this.SetCanvasPainterMouseMoveDeletes = function (bDelete) {
    m_BookViewer.SetCanvasPainterMouseMoveDeletes(bDelete);
  };
//CanvasPainter access

  this.GetStageUserData = function () {
    return m_BookViewer.GetUserData();
  };

  this.SetStageUserData = function (stageData) {
    m_BookViewer.SetUserData(stageData);

    this.Banshee.UpdateZOrder(this.Banshee, 0);
  };

//returns [xDim,yDim] as Array (book-xml)
  this.GetBookSize = function () {
    return m_BookViewer.GetBookSize();
  };

//returns [xDim,yDim] as Array (effective Content)
  this.GetContentSize = function () {
    return m_BookViewer.GetContentSize();
  };

  this.GetIdleSeconds = function () {
    return this.Banshee.GetIdleTime();
  };

  this.OnStageChangeRequest = function (e, stageNumber) {
    this.DoChangeStage(stageNumber);
  };

  this.EmitHotspot = function (x, y, userData, numAssets, pivotPoint) {
    m_BookViewer.EmitHotspot(x, y, userData, numAssets, pivotPoint);
  };

  this.SetVersionButtonState = function (state) {
    m_VersionButtonState = state;
    m_NavigationPanel.SetVersionButtonState(state, isTeacherVersion);
  };

  this.SetIsTeacherVersion = function (_isTeacherVersion) {
    isTeacherVersion = _isTeacherVersion;
    m_NavigationPanel.SetVersionButtonState(m_VersionButtonState, isTeacherVersion);
  };

  this.SetIsUserLoggedIn = function (_isUserLoggedIn) {
    isUserLoggedIn = _isUserLoggedIn;

    updateUpperUI(this);
    updateLowerUI(this);
  };

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//globales Interface ENDE
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  this.Banshee.AddControl(this);
  this.InitializeComponent();
}
