
// SCORM 1.2 API Wrapper
var scormAPI = null;

function findAPI(win) {
  var attempts = 0;
  while (win.API == null && win.parent != null && win.parent != win && attempts < 7) {
    attempts++;
    win = win.parent;
  }
  return win.API;
}

function getAPI() {
  if (scormAPI == null) {
    scormAPI = findAPI(window);
  }
  return scormAPI;
}

function scormInit() {
  var api = getAPI();
  if (api != null) {
    api.LMSInitialize("");
    return true;
  }
  return false;
}

function scormFinish() {
  var api = getAPI();
  if (api != null) {
    api.LMSFinish("");
    return true;
  }
  return false;
}

function scormSetValue(name, value) {
  var api = getAPI();
  if (api != null) {
    api.LMSSetValue(name, value);
    api.LMSCommit("");
    return true;
  }
  return false;
}

function scormGetValue(name) {
  var api = getAPI();
  if (api != null) {
    return api.LMSGetValue(name);
  }
  return "";
}

// Auto-initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', function() {
    scormInit();
    scormSetValue('cmi.core.lesson_status', 'incomplete');
  });
  
  window.addEventListener('beforeunload', function() {
    scormSetValue('cmi.core.lesson_status', 'completed');
    scormFinish();
  });
}
