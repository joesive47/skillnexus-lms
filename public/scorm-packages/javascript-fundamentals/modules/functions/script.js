// SCORM API Integration
let scormAPI = null;
let progress = 0;
let completed = false;

// Initialize SCORM
function initializeSCORM() {
    scormAPI = getAPIHandle();
    if (scormAPI) {
        scormAPI.LMSInitialize("");
        
        // Get existing progress
        const lessonStatus = scormAPI.LMSGetValue("cmi.core.lesson_status");
        const scoreRaw = scormAPI.LMSGetValue("cmi.core.score.raw");
        
        if (lessonStatus === "completed") {
            completed = true;
            progress = 100;
        } else if (scoreRaw) {
            progress = parseInt(scoreRaw) || 0;
        }
        
        updateProgressBar();
        console.log("SCORM initialized successfully");
    }
}

// Update progress bar
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

// Set SCORM progress
function setProgress(value) {
    progress = Math.min(100, Math.max(0, value));
    updateProgressBar();
    
    if (scormAPI) {
        scormAPI.LMSSetValue("cmi.core.score.raw", progress.toString());
        scormAPI.LMSSetValue("cmi.core.score.min", "0");
        scormAPI.LMSSetValue("cmi.core.score.max", "100");
        
        if (progress >= 80) {
            scormAPI.LMSSetValue("cmi.core.lesson_status", "completed");
            completed = true;
        } else {
            scormAPI.LMSSetValue("cmi.core.lesson_status", "incomplete");
        }
        
        scormAPI.LMSCommit("");
    }
}

// Interactive Functions
function testGreeting() {
    const nameInput = document.getElementById('nameInput');
    const output = document.getElementById('demo-output');
    const name = nameInput.value || 'นักเรียน';
    
    // Function to test
    function createGreeting(name) {
        return `สวัสดี ${name}! ยินดีต้อนรับสู่โลกของ JavaScript Functions! 🎉`;
    }
    
    const result = createGreeting(name);
    output.innerHTML = `<strong>ผลลัพธ์:</strong> ${result}`;
    
    setProgress(progress + 20);
}

function testCalculation() {
    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const output = document.getElementById('demo-output');
    
    const num1 = parseFloat(num1Input.value) || 0;
    const num2 = parseFloat(num2Input.value) || 0;
    
    // Calculator functions
    const calculator = {
        add: (a, b) => a + b,
        subtract: (a, b) => a - b,
        multiply: (a, b) => a * b,
        divide: (a, b) => b !== 0 ? a / b : 'ไม่สามารถหารด้วย 0 ได้'
    };
    
    const results = `
        <strong>ผลลัพธ์การคำนวณ:</strong><br>
        ${num1} + ${num2} = ${calculator.add(num1, num2)}<br>
        ${num1} - ${num2} = ${calculator.subtract(num1, num2)}<br>
        ${num1} × ${num2} = ${calculator.multiply(num1, num2)}<br>
        ${num1} ÷ ${num2} = ${calculator.divide(num1, num2)}
    `;
    
    output.innerHTML = results;
    setProgress(progress + 25);
}

// Quiz functionality
function checkAnswer(element, isCorrect) {
    const options = document.querySelectorAll('.options li');
    const feedback = document.getElementById('quiz-feedback');
    
    // Remove previous styling
    options.forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
    });
    
    // Style the selected answer
    if (isCorrect) {
        element.classList.add('correct');
        feedback.innerHTML = '<div style="color: green; font-weight: bold; margin-top: 10px;">✅ ถูกต้อง! Functions สามารถ return ค่าได้เสมอ</div>';
        setProgress(progress + 30);
    } else {
        element.classList.add('incorrect');
        feedback.innerHTML = '<div style="color: red; font-weight: bold; margin-top: 10px;">❌ ไม่ถูกต้อง ลองใหม่อีกครั้ง</div>';
    }
}

// Complete module
function completeModule() {
    if (progress < 100) {
        setProgress(100);
    }
    
    alert('🎉 ยินดีด้วย! คุณได้เรียนรู้เรื่อง JavaScript Functions เรียบร้อยแล้ว');
    
    if (scormAPI) {
        scormAPI.LMSSetValue("cmi.core.lesson_status", "completed");
        scormAPI.LMSSetValue("cmi.core.exit", "");
        scormAPI.LMSCommit("");
        scormAPI.LMSFinish("");
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSCORM();
    
    // Auto-progress as user scrolls
    let scrollProgress = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (scrollPercent > scrollProgress) {
            scrollProgress = scrollPercent;
            const newProgress = Math.min(progress + 1, Math.floor(scrollPercent / 2));
            if (newProgress > progress) {
                setProgress(newProgress);
            }
        }
    });
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (scormAPI && !completed) {
        scormAPI.LMSSetValue("cmi.core.exit", "suspend");
        scormAPI.LMSCommit("");
        scormAPI.LMSFinish("");
    }
});