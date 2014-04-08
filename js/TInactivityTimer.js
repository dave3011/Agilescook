/**
 * Im Ping-Response-Header wird das Attribut 'x_hash' erwartet, ein Hashwert zur identifikation der Session.
 * @param pingURI String mit einem Formatparameter für den Hashcode, z.B: '/blueprint/servlet/bv/ping/{0}'
 * @param sessionTimeoutInSeconds Aktueller Timeout der Session in Sekunden, z.B. 1800
 * @param pingIntervalInSeconds Anzahl von Sekunden, in denen geprüft werden soll, ob die Session abgelaufen ist.
 */
function TInactivityTimer(pingURI) {
  var m_self = this;
  var m_pingURI = pingURI;
  var m_sessionTimeoutInSeconds = 1800;
  var m_pingIntervalInSeconds = 60;
  var m_xhr = new XMLHttpRequest();
  var m_hash = '';
  var m_pingTimer = null;
  var m_sessionTimer = null;

  this.p_start = function (pingURI, sessionTimeoutInSeconds, pingIntervalInSeconds) {
    m_pingURI = pingURI;
    m_sessionTimeoutInSeconds = sessionTimeoutInSeconds;
    m_pingIntervalInSeconds = pingIntervalInSeconds;
    m_pingTimer = window.setInterval(_onPingTimeout, m_pingIntervalInSeconds * 1000);
    m_sessionTimer = window.setTimeout(_onSessionTimeout, m_sessionTimeoutInSeconds * 1000);
  };

  this.p_stop = function() {
    if (null != m_pingTimer) window.clearTimeout(m_pingTimer);
    if (null != m_sessionTimer) window.clearTimeout(m_sessionTimer);
  };

  function _onPingTimeout() {
    var sendPing = false;

    if (typeof m_self.p_inactivityTimerWillNotifyServer === 'function') {
      sendPing = m_self.p_inactivityTimerWillNotifyServer(m_self, m_pingIntervalInSeconds);
    }

    if (sendPing) {
      _ping();

      window.clearTimeout(m_sessionTimer);
      m_sessionTimer = window.setTimeout(_onSessionTimeout, m_sessionTimeoutInSeconds * 1000);
    }
  }

  function _onSessionTimeout() {
    _ping();

    window.clearTimeout(m_sessionTimer);
    m_sessionTimer = window.setTimeout(_onSessionTimeout, m_sessionTimeoutInSeconds * 1000);
  }

  function _ping() {
    try {
      m_xhr.abort();
    } catch (e) {
      // ignore
    }

    try {
      m_xhr.open('GET', m_pingURI.replace('{0}', m_hash), true);
      m_xhr.send();
    } catch (err) {
      if (typeof m_self.p_inactivityTimerDidNotifyServer === 'function') {
        m_self.p_inactivityTimerDidNotifyServer(m_self, err.message);
      }
    }
  }

  function _onload() {
    if (m_xhr.status === 200) {
      var location = m_xhr.getResponseHeader("x-location");
      if (location) {
        window.location.href = location;
        return;
      }
      var hash = m_xhr.getResponseHeader("x-hash");
      if (hash) {
        m_hash = hash;
      } else {
        m_hash = '';
      }
      if (typeof m_self.p_inactivityTimerDidNotifyServer === 'function') {
        m_self.p_inactivityTimerDidNotifyServer(m_self, null);
      }
    } else {
      if (typeof m_self.p_inactivityTimerDidNotifyServer === 'function') {
        m_self.p_inactivityTimerDidNotifyServer(m_self, m_xhr.status + ": " + m_xhr.statusText + " [" + m_pingURI.replace('{0}', m_hash) + "]");
      }
    }
  }

  function _onerror() {
  }

  m_xhr.onload = _onload;
  m_xhr.onerror = _onerror;

  // Delegate methods
  this.p_inactivityTimerWillNotifyServer = function (sender, pingIntervalInSeconds) {
    return true;
  };

  this.p_inactivityTimerDidNotifyServer = function(sender, errormsg) {

  };
}