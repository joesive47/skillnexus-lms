// SCORM API Wrapper for SkillNexus LMS
class ScormAPI {
  constructor() {
    this.initialized = false;
    this.terminated = false;
    this.data = {
      'cmi.core.lesson_status': 'not attempted',
      'cmi.core.score.raw': '',
      'cmi.core.score.max': '100',
      'cmi.core.score.min': '0',
      'cmi.core.session_time': '00:00:00',
      'cmi.core.total_time': '00:00:00',
      'cmi.core.lesson_location': '',
      'cmi.suspend_data': '',
      'cmi.launch_data': '',
      'cmi.student_id': 'student_001',
      'cmi.student_name': 'นักเรียน SkillNexus'
    };
    this.startTime = null;
  }

  // Initialize SCORM session
  LMSInitialize(parameter) {
    if (parameter !== '') {
      return 'false';
    }
    
    if (this.initialized) {
      return 'false';
    }
    
    this.initialized = true;
    this.startTime = new Date();
    console.log('🚀 SCORM Session Initialized');
    return 'true';
  }

  // Terminate SCORM session
  LMSFinish(parameter) {
    if (parameter !== '') {
      return 'false';
    }
    
    if (!this.initialized || this.terminated) {
      return 'false';
    }
    
    // Calculate session time
    if (this.startTime) {
      const endTime = new Date();
      const sessionTime = this.calculateSessionTime(this.startTime, endTime);
      this.LMSSetValue('cmi.core.session_time', sessionTime);
    }
    
    this.terminated = true;
    console.log('✅ SCORM Session Terminated');
    
    // Send completion data to LMS
    this.sendCompletionData();
    
    return 'true';
  }

  // Get value from SCORM data model
  LMSGetValue(element) {
    if (!this.initialized || this.terminated) {
      return '';
    }
    
    const value = this.data[element] || '';
    console.log(`📖 Get: ${element} = ${value}`);
    return value;
  }

  // Set value in SCORM data model
  LMSSetValue(element, value) {
    if (!this.initialized || this.terminated) {
      return 'false';
    }
    
    // Validate element
    if (!this.isValidElement(element)) {
      return 'false';
    }
    
    this.data[element] = value;
    console.log(`💾 Set: ${element} = ${value}`);
    
    // Auto-save important data
    if (element === 'cmi.core.lesson_status' || 
        element === 'cmi.core.score.raw' ||
        element === 'cmi.suspend_data') {
      this.saveToLocalStorage();
    }
    
    return 'true';
  }

  // Commit data to LMS
  LMSCommit(parameter) {
    if (parameter !== '') {
      return 'false';
    }
    
    if (!this.initialized || this.terminated) {
      return 'false';
    }
    
    console.log('💾 Committing data to LMS...');
    this.saveToLocalStorage();
    this.sendProgressData();
    
    return 'true';
  }

  // Get last error code
  LMSGetLastError() {
    return '0'; // No error
  }

  // Get error string
  LMSGetErrorString(errorCode) {
    const errors = {
      '0': 'No error',
      '101': 'General exception',
      '201': 'Invalid argument error',
      '202': 'Element cannot have children',
      '203': 'Element not an array - cannot have count',
      '301': 'Not initialized',
      '401': 'Not implemented error',
      '402': 'Invalid set value, element is a keyword',
      '403': 'Element is read only',
      '404': 'Element is write only',
      '405': 'Incorrect data type'
    };
    
    return errors[errorCode] || 'Unknown error';
  }

  // Get diagnostic information
  LMSGetDiagnostic(errorCode) {
    return `Diagnostic for error ${errorCode}`;
  }

  // Helper methods
  isValidElement(element) {
    const validElements = [
      'cmi.core.lesson_status',
      'cmi.core.score.raw',
      'cmi.core.score.max',
      'cmi.core.score.min',
      'cmi.core.session_time',
      'cmi.core.total_time',
      'cmi.core.lesson_location',
      'cmi.suspend_data',
      'cmi.launch_data',
      'cmi.student_id',
      'cmi.student_name'
    ];
    
    return validElements.includes(element);
  }

  calculateSessionTime(startTime, endTime) {
    const diff = endTime - startTime;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  saveToLocalStorage() {
    try {
      const scormData = {
        data: this.data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('scorm_data', JSON.stringify(scormData));
      console.log('💾 Data saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
    }
  }

  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('scorm_data');
      if (saved) {
        const scormData = JSON.parse(saved);
        this.data = { ...this.data, ...scormData.data };
        console.log('📂 Data loaded from localStorage');
      }
    } catch (error) {
      console.error('❌ Failed to load from localStorage:', error);
    }
  }

  sendProgressData() {
    // Send progress to SkillNexus LMS
    const progressData = {
      lessonStatus: this.data['cmi.core.lesson_status'],
      score: this.data['cmi.core.score.raw'],
      sessionTime: this.data['cmi.core.session_time'],
      suspendData: this.data['cmi.suspend_data'],
      location: this.data['cmi.core.lesson_location']
    };

    // Use fetch API to send data to LMS
    if (typeof fetch !== 'undefined') {
      fetch('/api/scorm/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(progressData)
      }).then(response => {
        if (response.ok) {
          console.log('✅ Progress sent to LMS');
        } else {
          console.error('❌ Failed to send progress to LMS');
        }
      }).catch(error => {
        console.error('❌ Network error:', error);
      });
    }
  }

  sendCompletionData() {
    const completionData = {
      completed: true,
      finalScore: this.data['cmi.core.score.raw'],
      totalTime: this.data['cmi.core.total_time'],
      status: this.data['cmi.core.lesson_status']
    };

    if (typeof fetch !== 'undefined') {
      fetch('/api/scorm/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(completionData)
      }).then(response => {
        if (response.ok) {
          console.log('🎉 Completion data sent to LMS');
        }
      }).catch(error => {
        console.error('❌ Failed to send completion data:', error);
      });
    }
  }

  // Convenience methods for common operations
  setCompleted() {
    this.LMSSetValue('cmi.core.lesson_status', 'completed');
    this.LMSCommit('');
  }

  setPassed(score) {
    this.LMSSetValue('cmi.core.score.raw', score.toString());
    this.LMSSetValue('cmi.core.lesson_status', 'passed');
    this.LMSCommit('');
  }

  setFailed(score) {
    this.LMSSetValue('cmi.core.score.raw', score.toString());
    this.LMSSetValue('cmi.core.lesson_status', 'failed');
    this.LMSCommit('');
  }

  setBookmark(location) {
    this.LMSSetValue('cmi.core.lesson_location', location);
    this.LMSCommit('');
  }

  saveSuspendData(data) {
    this.LMSSetValue('cmi.suspend_data', JSON.stringify(data));
    this.LMSCommit('');
  }

  getSuspendData() {
    const data = this.LMSGetValue('cmi.suspend_data');
    try {
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }
}

// Create global SCORM API instance
window.API = new ScormAPI();
window.API_1484_11 = window.API; // SCORM 2004 compatibility

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  if (window.API) {
    window.API.loadFromLocalStorage();
    console.log('🎯 SCORM API Ready');
  }
});

// Auto-finish when page unloads
window.addEventListener('beforeunload', function() {
  if (window.API && window.API.initialized && !window.API.terminated) {
    window.API.LMSFinish('');
  }
});