var API = null;

function findAPI(win) {
  var attempts = 0;
  while (win.API == null && win.parent != null && win.parent != win && attempts < 7) {
    attempts++;
    win = win.parent;
  }
  return win.API;
}

function getAPI() {
  if (API == null) {
    API = findAPI(window);
  }
  return API;
}

function LMSInitialize() {
  var api = getAPI();
  if (api == null) {
    console.log("Unable to locate the LMS API");
    return "false";
  }
  var result = api.LMSInitialize("");
  if (result.toString() != "true") {
    console.log("LMSInitialize failed");
  }
  return result.toString();
}

function LMSFinish() {
  var api = getAPI();
  if (api == null) {
    console.log("Unable to locate the LMS API");
    return "false";
  }
  var result = api.LMSFinish("");
  return result.toString();
}

function LMSGetValue(name) {
  var api = getAPI();
  if (api == null) {
    console.log("Unable to locate the LMS API");
    return "";
  }
  return api.LMSGetValue(name);
}

function LMSSetValue(name, value) {
  var api = getAPI();
  if (api == null) {
    console.log("Unable to locate the LMS API");
    return "false";
  }
  var result = api.LMSSetValue(name, value);
  if (result.toString() != "true") {
    console.log("LMSSetValue(" + name + ", " + value + ") failed");
  }
  return result.toString();
}

function LMSCommit() {
  var api = getAPI();
  if (api == null) {
    console.log("Unable to locate the LMS API");
    return "false";
  }
  var result = api.LMSCommit("");
  if (result.toString() != "true") {
    console.log("LMSCommit failed");
  }
  return result.toString();
}

function LMSGetLastError() {
  var api = getAPI();
  if (api == null) {
    console.log("Unable to locate the LMS API");
    return "";
  }
  return api.LMSGetLastError().toString();
}

function LMSGetErrorString(errorCode) {
  var api = getAPI();
  if (api == null) {
    console.log("Unable to locate the LMS API");
    return "";
  }
  return api.LMSGetErrorString(errorCode);
}

function LMSGetDiagnostic(errorCode) {
  var api = getAPI();
  if (api == null) {
    console.log("Unable to locate the LMS API");
    return "";
  }
  return api.LMSGetDiagnostic(errorCode);
}
