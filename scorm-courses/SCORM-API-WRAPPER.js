/**
 * SCORM 2004 4th Edition API Wrapper
 * Handles all SCORM communication with LMS
 */

var SCORM = (function() {
    var API = null;
    var findAttempts = 0;
    var maxAttempts = 500;
    
    /**
     * Find SCORM API in parent/opener windows
     */
    function findAPI(win) {
        findAttempts++;
        
        if (findAttempts > maxAttempts) {
            console.error("SCORM API not found after " + maxAttempts + " attempts");
            return null;
        }
        
        if (win.API_1484_11) {
            return win.API_1484_11;
        }
        
        if (win.parent && win.parent != win) {
            return findAPI(win.parent);
        }
        
        if (win.opener) {
            return findAPI(win.opener);
        }
        
        return null;
    }
    
    /**
     * Initialize SCORM connection
     */
    function initialize() {
        API = findAPI(window);
        
        if (!API) {
            console.warn("SCORM API not found - running in standalone mode");
            return false;
        }
        
        var result = API.Initialize("");
        
        if (result == "true") {
            console.log("SCORM initialized successfully");
            
            // Set initial values
            setValue("cmi.completion_status", "incomplete");
            setValue("cmi.success_status", "unknown");
            setValue("cmi.session_time", "PT0H0M0S");
            commit();
            
            return true;
        } else {
            console.error("SCORM initialization failed: " + getLastError());
            return false;
        }
    }
    
    /**
     * Terminate SCORM connection
     */
    function terminate() {
        if (!API) return true;
        
        var result = API.Terminate("");
        
        if (result == "true") {
            console.log("SCORM terminated successfully");
            return true;
        } else {
            console.error("SCORM termination failed: " + getLastError());
            return false;
        }
    }
    
    /**
     * Get value from LMS
     */
    function getValue(element) {
        if (!API) return "";
        
        var value = API.GetValue(element);
        var error = API.GetLastError();
        
        if (error != "0") {
            console.error("GetValue error for " + element + ": " + getErrorString(error));
        }
        
        return value;
    }
    
    /**
     * Set value to LMS
     */
    function setValue(element, value) {
        if (!API) return false;
        
        var result = API.SetValue(element, value);
        var error = API.GetLastError();
        
        if (error != "0") {
            console.error("SetValue error for " + element + ": " + getErrorString(error));
            return false;
        }
        
        return result == "true";
    }
    
    /**
     * Commit data to LMS
     */
    function commit() {
        if (!API) return true;
        
        var result = API.Commit("");
        var error = API.GetLastError();
        
        if (error != "0") {
            console.error("Commit error: " + getErrorString(error));
            return false;
        }
        
        return result == "true";
    }
    
    /**
     * Get last error code
     */
    function getLastError() {
        if (!API) return "0";
        return API.GetLastError();
    }
    
    /**
     * Get error string
     */
    function getErrorString(errorCode) {
        if (!API) return "";
        return API.GetErrorString(errorCode);
    }
    
    /**
     * Get diagnostic info
     */
    function getDiagnostic(errorCode) {
        if (!API) return "";
        return API.GetDiagnostic(errorCode);
    }
    
    /**
     * Set completion status
     */
    function setCompleted() {
        setValue("cmi.completion_status", "completed");
        commit();
    }
    
    /**
     * Set success status
     */
    function setPassed() {
        setValue("cmi.success_status", "passed");
        commit();
    }
    
    function setFailed() {
        setValue("cmi.success_status", "failed");
        commit();
    }
    
    /**
     * Set score
     */
    function setScore(score, min, max) {
        min = min || 0;
        max = max || 100;
        
        var scaled = (score - min) / (max - min);
        
        setValue("cmi.score.scaled", scaled.toFixed(2));
        setValue("cmi.score.raw", score.toString());
        setValue("cmi.score.min", min.toString());
        setValue("cmi.score.max", max.toString());
        commit();
    }
    
    /**
     * Set session time
     */
    function setSessionTime(totalSeconds) {
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;
        
        var timeString = "PT" + hours + "H" + minutes + "M" + seconds + "S";
        setValue("cmi.session_time", timeString);
        commit();
    }
    
    /**
     * Set location (bookmark)
     */
    function setLocation(location) {
        setValue("cmi.location", location);
        commit();
    }
    
    /**
     * Get location (bookmark)
     */
    function getLocation() {
        return getValue("cmi.location");
    }
    
    /**
     * Set suspend data
     */
    function setSuspendData(data) {
        var jsonData = JSON.stringify(data);
        setValue("cmi.suspend_data", jsonData);
        commit();
    }
    
    /**
     * Get suspend data
     */
    function getSuspendData() {
        var data = getValue("cmi.suspend_data");
        if (data) {
            try {
                return JSON.parse(data);
            } catch(e) {
                console.error("Error parsing suspend data:", e);
                return null;
            }
        }
        return null;
    }
    
    // Public API
    return {
        initialize: initialize,
        terminate: terminate,
        getValue: getValue,
        setValue: setValue,
        commit: commit,
        getLastError: getLastError,
        getErrorString: getErrorString,
        getDiagnostic: getDiagnostic,
        setCompleted: setCompleted,
        setPassed: setPassed,
        setFailed: setFailed,
        setScore: setScore,
        setSessionTime: setSessionTime,
        setLocation: setLocation,
        getLocation: getLocation,
        setSuspendData: setSuspendData,
        getSuspendData: getSuspendData
    };
})();

// Auto-initialize on page load
window.addEventListener('load', function() {
    SCORM.initialize();
    
    // Track time spent
    var startTime = new Date().getTime();
    
    // Save time on page unload
    window.addEventListener('beforeunload', function() {
        var endTime = new Date().getTime();
        var totalSeconds = Math.floor((endTime - startTime) / 1000);
        SCORM.setSessionTime(totalSeconds);
        SCORM.terminate();
    });
});
