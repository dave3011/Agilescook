function TUserDataLocalStorage() {
  var STORAGE_KEY_PREFIX = 'BookViewer';

  this.ReadGlobalUserData = function(bookID) {
    if (bookID === null) {
      return null;
    }

    var storageKey = STORAGE_KEY_PREFIX + '.' + bookID;
    return sessionStorage.getItem(storageKey);
  };

  this.WriteGlobalUserData = function(bookID, userData) {
    if (bookID === null || userData === null) {
      return;
    }

    var storageKey = STORAGE_KEY_PREFIX + '.' + bookID;
    sessionStorage.setItem(storageKey, userData);
  };

  this.ReadStageUserData = function(bookID, stageID) {
    if (bookID === null || stageID === null) {
      return null;
    }

    var storageKey = STORAGE_KEY_PREFIX + '.' + bookID + '.' + stageID;
    var data = sessionStorage.getItem(storageKey);
    return data;
  };

  this.WriteStageUserData = function(bookID, stageID, userData) {
    if (stageID === null || userData === null) {
      return;
    }

    var storageKey = STORAGE_KEY_PREFIX + '.' + bookID + '.' + stageID;
    sessionStorage.setItem(storageKey, userData);
  };

  this.ClearUserData = function () {
    sessionStorage.clear();
  };
}

