/**
 * SCORM 2004 API Wrapper
 * SkillNexus LMS - Corporate Training
 * Version: 1.0.0
 */

class SCORMDriver {
  constructor() {
    this.API = null;
    this.isInitialized = false;
    this.startTime = null;
    this.sessionTime = 0;
  }

  /**
   * Initialize SCORM connection
   */
  initialize() {
    this.API = this.findAPI(window);
    
    if (!this.API) {
      console.error('SCORM API not found!');
      return false;
    }

    const result = this.API.Initialize('');
    
    if (result === 'true') {
      this.isInitialized = true;
      this.startTime = new Date();
      
      // Get existing data
      this.loadData();
      
      console.log('SCORM initialized successfully');
      return true;
    } else {
      console.error('SCORM initialization failed');
      return false;
    }
  }

  /**
   * Find SCORM API in window hierarchy
   */
  findAPI(win) {
    let attempts = 0;
    const maxAttempts = 500;
    
    while (win && attempts < maxAttempts) {
      // SCORM 2004
      if (win.API_1484_11) {
        return win.API_1484_11;
      }
      
      // SCORM 1.2 (fallback)
      if (win.API) {
        return win.API;
      }
      
      // Check parent window
      if (win.parent && win.parent !== win) {
        attempts++;
        win = win.parent;
      } else {
        break;
      }
    }
    
    return null;
  }

  /**
   * Load existing SCORM data
   */
  loadData() {
    if (!this.isInitialized) return null;

    const data = {
      studentId: this.getValue('cmi.learner_id'),
      studentName: this.getValue('cmi.learner_name'),
      lessonStatus: this.getValue('cmi.completion_status'),
      successStatus: this.getValue('cmi.success_status'),
      scoreRaw: this.getValue('cmi.score.raw'),
      scoreMin: this.getValue('cmi.score.min'),
      scoreMax: this.getValue('cmi.score.max'),
      totalTime: this.getValue('cmi.total_time'),
      location: this.getValue('cmi.location'),
      suspendData: this.getValue('cmi.suspend_data')
    };

    console.log('Loaded SCORM data:', data);
    return data;
  }

  /**
   * Get value from LMS
   */
  getValue(element) {
    if (!this.isInitialized) return '';
    
    const value = this.API.GetValue(element);
    const error = this.API.GetLastError();
    
    if (error !== '0') {
      console.warn(`Error getting ${element}:`, this.API.GetErrorString(error));
    }
    
    return value;
  }

  /**
   * Set value to LMS
   */
  setValue(element, value) {
    if (!this.isInitialized) return false;
    
    const result = this.API.SetValue(element, value.toString());
    const error = this.API.GetLastError();
    
    if (error !== '0') {
      console.error(`Error setting ${element}:`, this.API.GetErrorString(error));
      return false;
    }
    
    return result === 'true';
  }

  /**
   * Commit data to LMS
   */
  commit() {
    if (!this.isInitialized) return false;
    
    const result = this.API.Commit('');
    const error = this.API.GetLastError();
    
    if (error !== '0') {
      console.error('Commit error:', this.API.GetErrorString(error));
      return false;
    }
    
    console.log('Data committed successfully');
    return result === 'true';
  }

  /**
   * Set completion status
   */
  setCompleted() {
    this.setValue('cmi.completion_status', 'completed');
    this.setValue('cmi.success_status', 'passed');
    this.commit();
  }

  /**
   * Set incomplete status
   */
  setIncomplete() {
    this.setValue('cmi.completion_status', 'incomplete');
    this.commit();
  }

  /**
   * Set score
   */
  setScore(raw, min = 0, max = 100) {
    this.setValue('cmi.score.raw', raw);
    this.setValue('cmi.score.min', min);
    this.setValue('cmi.score.max', max);
    this.setValue('cmi.score.scaled', (raw / max).toFixed(2));
    
    // Set success status based on mastery score
    const masteryScore = this.getValue('cmi.scaled_passing_score') || 0.8;
    const scaledScore = raw / max;
    
    if (scaledScore >= masteryScore) {
      this.setValue('cmi.success_status', 'passed');
    } else {
      this.setValue('cmi.success_status', 'failed');
    }
    
    this.commit();
  }

  /**
   * Set bookmark/location
   */
  setLocation(location) {
    this.setValue('cmi.location', location);
    this.commit();
  }

  /**
   * Save suspend data (for resuming)
   */
  setSuspendData(data) {
    const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
    this.setValue('cmi.suspend_data', jsonData);
    this.commit();
  }

  /**
   * Get suspend data
   */
  getSuspendData() {
    const data = this.getValue('cmi.suspend_data');
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }

  /**
   * Calculate and set session time
   */
  setSessionTime() {
    if (!this.startTime) return;
    
    const endTime = new Date();
    const milliseconds = endTime - this.startTime;
    const timeString = this.convertMillisecondsToSCORMTime(milliseconds);
    
    this.setValue('cmi.session_time', timeString);
    this.commit();
  }

  /**
   * Convert milliseconds to SCORM time format (PThhHmmMss.sS)
   */
  convertMillisecondsToSCORMTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `PT${hours}H${minutes}M${secs}S`;
  }

  /**
   * Record interaction (for quizzes, activities)
   */
  recordInteraction(id, type, response, result, latency = '') {
    const count = parseInt(this.getValue('cmi.interactions._count')) || 0;
    const index = count;
    
    this.setValue(`cmi.interactions.${index}.id`, id);
    this.setValue(`cmi.interactions.${index}.type`, type);
    this.setValue(`cmi.interactions.${index}.learner_response`, response);
    this.setValue(`cmi.interactions.${index}.result`, result);
    this.setValue(`cmi.interactions.${index}.latency`, latency);
    this.setValue(`cmi.interactions.${index}.timestamp`, new Date().toISOString());
    
    this.commit();
  }

  /**
   * Set progress measure (0.0 to 1.0)
   */
  setProgress(progress) {
    const scaled = Math.min(1.0, Math.max(0.0, progress));
    this.setValue('cmi.progress_measure', scaled.toFixed(2));
    this.commit();
  }

  /**
   * Terminate SCORM session
   */
  terminate() {
    if (!this.isInitialized) return false;
    
    // Set session time before terminating
    this.setSessionTime();
    
    const result = this.API.Terminate('');
    const error = this.API.GetLastError();
    
    if (error !== '0') {
      console.error('Terminate error:', this.API.GetErrorString(error));
      return false;
    }
    
    this.isInitialized = false;
    console.log('SCORM terminated successfully');
    return result === 'true';
  }

  /**
   * Get diagnostic info
   */
  getDiagnostic() {
    if (!this.API) return 'API not found';
    return this.API.GetDiagnostic('');
  }

  /**
   * Get last error
   */
  getLastError() {
    if (!this.API) return null;
    
    const errorCode = this.API.GetLastError();
    const errorString = this.API.GetErrorString(errorCode);
    const diagnostic = this.API.GetDiagnostic(errorCode);
    
    return {
      code: errorCode,
      string: errorString,
      diagnostic: diagnostic
    };
  }
}

// Create global instance
const scorm = new SCORMDriver();

// Auto-initialize on page load
window.addEventListener('load', function() {
  if (scorm.initialize()) {
    console.log('SCORM ready');
    
    // Set incomplete status on start
    if (scorm.getValue('cmi.completion_status') === 'unknown' || 
        scorm.getValue('cmi.completion_status') === 'not attempted') {
      scorm.setIncomplete();
    }
  }
});

// Auto-terminate on page unload
window.addEventListener('beforeunload', function() {
  if (scorm.isInitialized) {
    scorm.terminate();
  }
});

// Periodic commit (every 30 seconds)
setInterval(function() {
  if (scorm.isInitialized) {
    scorm.setSessionTime();
    scorm.commit();
  }
}, 30000);

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SCORMDriver;
}
