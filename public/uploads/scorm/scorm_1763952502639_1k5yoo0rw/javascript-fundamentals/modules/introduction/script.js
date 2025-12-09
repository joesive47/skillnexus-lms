// Initialize SCORM
let progress = 0;
let quizCompleted = false;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize SCORM session
    if (window.scorm) {
        scorm.initialize();
        scorm.setStatus('incomplete');
        
        // Get existing progress if any
        const savedProgress = scorm.getValue('cmi.progress_measure');
        if (savedProgress) {
            progress = parseFloat(savedProgress) * 100;
            updateProgressBar();
        }
    }
    
    // Auto-progress as user scrolls
    window.addEventListener('scroll', trackProgress);
});

function trackProgress() {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progress = Math.max(progress, Math.min(scrollPercent, 80)); // Max 80% until quiz completed
    updateProgressBar();
    
    if (window.scorm) {
        scorm.setProgress(progress);
        scorm.commit();
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

function showAlert() {
    alert('🎉 นี่คือการทำงานของ JavaScript!');
    recordInteraction('demo_alert', 'choice', 'clicked', 'correct');
}

function changeColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.background = `linear-gradient(135deg, ${randomColor}, #764ba2)`;
    
    const output = document.getElementById('demo-output');
    output.innerHTML = `🎨 เปลี่ยนสีพื้นหลังเป็น ${randomColor} แล้ว!`;
    
    recordInteraction('demo_color', 'choice', randomColor, 'correct');
}

function showTime() {
    const now = new Date();
    const timeString = now.toLocaleString('th-TH');
    
    const output = document.getElementById('demo-output');
    output.innerHTML = `⏰ เวลาปัจจุบัน: ${timeString}`;
    
    recordInteraction('demo_time', 'choice', 'clicked', 'correct');
}

function checkAnswer(element, isCorrect) {
    // Remove previous selections
    const options = document.querySelectorAll('.options li');
    options.forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
    });
    
    // Mark the selected answer
    if (isCorrect) {
        element.classList.add('correct');
        document.getElementById('quiz-feedback').innerHTML = 
            '<div style="color: green; font-weight: bold; margin-top: 10px;">✅ ถูกต้อง! JavaScript ถูกสร้างขึ้นในปี 1995</div>';
        
        if (!quizCompleted) {
            quizCompleted = true;
            progress = Math.max(progress, 90);
            updateProgressBar();
        }
        
        recordInteraction('quiz_year', 'choice', 'B', 'correct');
    } else {
        element.classList.add('incorrect');
        document.getElementById('quiz-feedback').innerHTML = 
            '<div style="color: red; font-weight: bold; margin-top: 10px;">❌ ไม่ถูกต้อง ลองใหม่อีกครั้ง</div>';
        
        recordInteraction('quiz_year', 'choice', element.textContent.charAt(0), 'incorrect');
    }
    
    if (window.scorm) {
        scorm.setProgress(progress);
        scorm.commit();
    }
}

function recordInteraction(id, type, response, result) {
    if (window.scorm) {
        scorm.recordInteraction(id, type, response, result, 'Introduction module interaction');
    }
}

function completeModule() {
    if (!quizCompleted) {
        alert('⚠️ กรุณาทำแบบทดสอบให้เสร็จก่อน');
        return;
    }
    
    progress = 100;
    updateProgressBar();
    
    if (window.scorm) {
        scorm.setStatus('completed');
        scorm.setProgress(100);
        scorm.setScore(85, 0, 100);
        scorm.commit();
        scorm.terminate();
    }
    
    alert('🎉 ยินดีด้วย! คุณเสร็จสิ้นบทเรียนแรกแล้ว');
    
    // In a real LMS, this would navigate to the next module
    console.log('Module completed successfully');
}

// Prevent page unload without saving progress
window.addEventListener('beforeunload', function() {
    if (window.scorm && progress > 0) {
        scorm.setProgress(progress);
        scorm.commit();
    }
});