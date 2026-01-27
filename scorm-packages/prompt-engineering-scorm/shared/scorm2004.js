var API = null;

function findAPI(win) {
  var attempts = 0;
  while (win.API_1484_11 == null && win.parent != null && win.parent != win && attempts < 7) {
    attempts++;
    win = win.parent;
  }
  return win.API_1484_11;
}

function getAPI() {
  if (API == null) {
    API = findAPI(window);
  }
  return API;
}

function initSCORM() {
  var api = getAPI();
  if (api) {
    api.Initialize("");
    api.SetValue("cmi.completion_status", "incomplete");
    api.SetValue("cmi.success_status", "unknown");
    api.Commit("");
  }
}

function setSCORMComplete() {
  var api = getAPI();
  if (api) {
    api.SetValue("cmi.completion_status", "completed");
    api.SetValue("cmi.success_status", "passed");
    api.SetValue("cmi.score.scaled", "1");
    api.Commit("");
  }
}

function setSCORMScore(score) {
  var api = getAPI();
  if (api) {
    api.SetValue("cmi.score.scaled", (score / 100).toString());
    api.SetValue("cmi.score.raw", score.toString());
    api.SetValue("cmi.score.min", "0");
    api.SetValue("cmi.score.max", "100");
    if (score >= 70) {
      api.SetValue("cmi.success_status", "passed");
    } else {
      api.SetValue("cmi.success_status", "failed");
    }
    api.Commit("");
  }
}

function terminateSCORM() {
  var api = getAPI();
  if (api) {
    api.Terminate("");
  }
}

window.addEventListener('load', initSCORM);
window.addEventListener('beforeunload', terminateSCORM);
