// SCORM 2004 API Wrapper
class SCORMApi {
  constructor() {
    this.API = null;
    this.findAPI();
  }

  findAPI() {
    let win = window;
    let attempts = 0;
    
    while (win && attempts < 10) {
      if (win.API_1484_11) {
        this.API = win.API_1484_11;
        break;
      }
      
      if (win.parent && win.parent !== win) {
        attempts++;
        win = win.parent;
      } else {
        break;
      }
    }
    
    if (!this.API) {
      console.warn('SCORM API not found - running in standalone mode');
    }
  }

  initialize() {
    if (this.API) {
      return this.API.Initialize('') === 'true';
    }
    return true;
  }

  terminate() {
    if (this.API) {
      return this.API.Terminate('') === 'true';
    }
    return true;
  }

  getValue(element) {
    if (this.API) {
      return this.API.GetValue(element);
    }
    return '';
  }

  setValue(element, value) {
    if (this.API) {
      return this.API.SetValue(element, value) === 'true';
    }
    return true;
  }

  commit() {
    if (this.API) {
      return this.API.Commit('') === 'true';
    }
    return true;
  }

  setStatus(status) {
    return this.setValue('cmi.completion_status', status);
  }

  setScore(score, min = 0, max = 100) {
    this.setValue('cmi.score.scaled', (score / max).toString());
    this.setValue('cmi.score.raw', score.toString());
    this.setValue('cmi.score.min', min.toString());
    this.setValue('cmi.score.max', max.toString());
  }

  setProgress(progress) {
    return this.setValue('cmi.progress_measure', (progress / 100).toString());
  }

  recordInteraction(id, type, response, result, description = '') {
    const index = this.getValue('cmi.interactions._count');
    this.setValue(`cmi.interactions.${index}.id`, id);
    this.setValue(`cmi.interactions.${index}.type`, type);
    this.setValue(`cmi.interactions.${index}.learner_response`, response);
    this.setValue(`cmi.interactions.${index}.result`, result);
    this.setValue(`cmi.interactions.${index}.description`, description);
    this.setValue(`cmi.interactions.${index}.timestamp`, new Date().toISOString());
  }
}

// Global SCORM instance
window.scorm = new SCORMApi();