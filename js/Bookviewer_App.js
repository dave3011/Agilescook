//Global (namespace) object
var p_BOOKVIEWER= function(htmlParent,szResourcesDataDir,UserID,szTexturesDataDir)
{
  //Hier den Code von Banshee,MainLayer etc. einfügen !!!!!
  // H I E R !!!! (an diese Stelle)
  //Hier den Code von Banshee,MainLayer etc. einfügen ENDE!!!!!

  //*******************************************************
  //Public interface  (p_XXX werden von Linker nicht ersetzt)
  //*******************************************************
  var m_BansheeInstance;
  APP_DATA_DIR = szResourcesDataDir;
  m_UserID = UserID;

  var inst = this;

  if (!szTexturesDataDir)
    szTexturesDataDir = '';
  TEXTURES_DATA_DIR = bansheeIncludeTrailingSlash(szTexturesDataDir);

  this.p_OnBookLoaded = null;
  this.p_OnStageLoaded = null;
  this.p_OnError = null;
  this.p_OnSwitchBookVersion = null;
  this.p_OnHotspotSelectionChanged = null;
  this.p_OnBeforeChangeStage = null;

  function CreateBanshee(htmlParent,x,y,w,h,lpfCreateFunc)
  {
    var bshee = new TBanshee(htmlParent,lpfCreateFunc);
    bshee.p_OnNotification = p_onBansheeNotification;
    bshee.p_OnError = p_onError;
    bshee.SetBounds(x,y,w,h);
    bshee.Init();
    return bshee;
  }

  function p_onBansheeNotification(funcName, params) {
    bansheeSafeCall(inst, funcName, params);
  }

  function p_onError(message) {
    bansheeSafeCall(inst, 'p_OnError', message);
  }

  this.p_SetDataDir = function (szDataDir) {
    APP_DATA_DIR = bansheeIncludeTrailingSlash(szDataDir);
  };

  this.p_HandleMouseWheel = function(e) {
    bansheeSafeCall(m_BansheeInstance, 'HandleMouseWheel', e);
  };

  this.p_LoadBook = function(bookUrl, globalViewURL, dataDir, stageUris, initialStageID) {
    m_BansheeInstance.GetMainLayer().LoadBook(bookUrl, globalViewURL, dataDir, stageUris, initialStageID);
  };

  this.p_GetCurrentStage = function() {
    return m_BansheeInstance.GetMainLayer().GetCurrentStage();
  };

  this.p_GetIdleSeconds = function() {
    return m_BansheeInstance.GetMainLayer().GetIdleSeconds();
  };

  this.p_GetZoom = function () {
    return m_BansheeInstance.GetMainLayer().GetZoom();
  };

  this.p_GetContentSize = function () {
    return m_BansheeInstance.GetMainLayer().GetContentSize();
  };

  this.p_GetBookSize = function () {
    return m_BansheeInstance.GetMainLayer().GetBookSize();
  };

  this.p_GetStageUserData = function () {
    return m_BansheeInstance.GetMainLayer().GetStageUserData();
  };

  this.p_SetStageUserData = function (userData) {
    return m_BansheeInstance.GetMainLayer().SetStageUserData(userData);
  };

  this.p_GetNumStages = function() {
    return m_BansheeInstance.GetMainLayer().GetNumStages();
  };

  this.p_Free = function() {
    bansheeSafeCall(m_BansheeInstance, 'Free', null);
  };

  this.p_EmitHotspot = function(x, y, userData, numAssets, pivotPoint) {
    m_BansheeInstance.GetMainLayer().EmitHotspot(x, y, userData, numAssets, pivotPoint);
  };

  this.p_SetBounds = function(x,y,w,h)
  {
    m_BansheeInstance.SetBounds(x,y,w,h);
  };

  this.p_GoToPage = function(pageNum) {
    m_BansheeInstance.GetMainLayer().OnGoToPage(pageNum);
  };

  this.p_SetVersionButtonState = function(state) { // 'enabled', 'disabled', 'hidden'
    m_BansheeInstance.GetMainLayer().SetVersionButtonState(state);
  };

  this.p_SetIsTeacherVersion = function(isTeacherVersion) {
    m_BansheeInstance.GetMainLayer().SetIsTeacherVersion(isTeacherVersion);
  };

  this.p_SetIsUserLoggedIn = function(isLoggedIn) {
    m_BansheeInstance.GetMainLayer().SetIsUserLoggedIn(isLoggedIn);
  };

  m_BansheeInstance = CreateBanshee(htmlParent,0,0,0,0,p_CreateScookMainlayer);
};