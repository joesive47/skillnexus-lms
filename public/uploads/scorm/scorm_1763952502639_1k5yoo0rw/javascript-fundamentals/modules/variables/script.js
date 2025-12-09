// Initialize SCORM and variables
let progress = 0;
let quizAnswers = { q1: false, q2: false };
let variables = {
    string: '',
    number: 0,
    boolean: null,
    array: []
};

document.addEventListener('DOMContentLoaded', function() {
    if (window.scorm) {
        scorm.initialize();
        scorm.setStatus('incomplete');
        
        const savedProgress = scorm.getValue('cmi.progress_measure');
        if (savedProgress) {
            progress = parseFloat(savedProgress) * 100;
            updateProgressBar();
        }
    }
    
    window.addEventListener('scroll', trackProgress);
});

function trackProgress() {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progress = Math.max(progress, Math.min(scrollPercent, 70));
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

function updateString() {
    const input = document.getElementById('stringInput');
    const output = document.getElementById('stringOutput');
    variables.string = input.value;
    
    if (input.value) {
        output.innerHTML = `let message = "${input.value}";`;
        output.style.color = '#28a745';
        recordInteraction('string_demo', 'fill-in', input.value, 'correct');
    } else {
        output.innerHTML = 'let message = "";';
        output.style.color = '#6c757d';
    }
}

function updateNumber() {
    const input = document.getElementById('numberInput');
    const output = document.getElementById('numberOutput');
    variables.number = parseFloat(input.value) || 0;
    
    if (input.value) {
        output.innerHTML = `let count = ${input.value};`;
        output.style.color = '#28a745';
        recordInteraction('number_demo', 'fill-in', input.value, 'correct');
    } else {
        output.innerHTML = 'let count = 0;';
        output.style.color = '#6c757d';
    }
}

function updateBoolean() {
    const input = document.getElementById('booleanInput');
    const output = document.getElementById('booleanOutput');
    
    if (input.value) {
        variables.boolean = input.value === 'true';
        output.innerHTML = `let isActive = ${input.value};`;
        output.style.color = '#28a745';
        recordInteraction('boolean_demo', 'choice', input.value, 'correct');
    } else {
        variables.boolean = null;
        output.innerHTML = 'let isActive = null;';
        output.style.color = '#6c757d';
    }
}

function updateArray() {
    const input = document.getElementById('arrayInput');
    const output = document.getElementById('arrayOutput');
    
    if (input.value) {
        variables.array = input.value.split(',').map(item => item.trim());
        const arrayString = variables.array.map(item => `"${item}"`).join(', ');
        output.innerHTML = `let items = [${arrayString}];`;
        output.style.color = '#28a745';
        recordInteraction('array_demo', 'fill-in', input.value, 'correct');
    } else {
        variables.array = [];
        output.innerHTML = 'let items = [];';
        output.style.color = '#6c757d';
    }
}

function showAllVariables() {
    const output = document.getElementById('allVariables');
    let html = '<h5>🔍 ตัวแปรทั้งหมดที่คุณสร้าง:</h5>';
    
    html += `<div style="margin: 10px 0;">
        <strong>String:</strong> "${variables.string}" (typeof: ${typeof variables.string})<br>
        <strong>Number:</strong> ${variables.number} (typeof: ${typeof variables.number})<br>
        <strong>Boolean:</strong> ${variables.boolean} (typeof: ${typeof variables.boolean})<br>
        <strong>Array:</strong> [${variables.array.join(', ')}] (typeof: ${typeof variables.array}, length: ${variables.array.length})
    </div>`;
    
    output.innerHTML = html;
    
    // Update progress for interaction
    progress = Math.max(progress, 60);
    updateProgressBar();
    
    recordInteraction('show_all_variables', 'choice', 'clicked', 'correct');
}

function checkAnswer(element, isCorrect, questionNum) {
    const options = element.parentElement.querySelectorAll('li');
    options.forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
    });
    
    const feedbackId = `quiz-feedback-${questionNum}`;
    const feedback = document.getElementById(feedbackId);
    
    if (isCorrect) {
        element.classList.add('correct');
        quizAnswers[`q${questionNum}`] = true;
        
        if (questionNum === 1) {
            feedback.innerHTML = '<div style="color: green; font-weight: bold; margin-top: 10px;">✅ ถูกต้อง! const ใช้สำหรับค่าคงที่</div>';
        } else if (questionNum === 2) {
            feedback.innerHTML = '<div style="color: green; font-weight: bold; margin-top: 10px;">✅ ถูกต้อง! typeof "Hello World" คือ "string"</div>';
        }
        
        recordInteraction(`quiz_q${questionNum}`, 'choice', element.textContent.charAt(0), 'correct');
    } else {
        element.classList.add('incorrect');
        feedback.innerHTML = '<div style="color: red; font-weight: bold; margin-top: 10px;">❌ ไม่ถูกต้อง ลองใหม่อีกครั้ง</div>';
        recordInteraction(`quiz_q${questionNum}`, 'choice', element.textContent.charAt(0), 'incorrect');
    }
    
    // Update progress if both questions answered correctly
    if (quizAnswers.q1 && quizAnswers.q2) {
        progress = Math.max(progress, 90);
        updateProgressBar();
    }
    
    if (window.scorm) {
        scorm.setProgress(progress);
        scorm.commit();
    }
}

function recordInteraction(id, type, response, result) {
    if (window.scorm) {
        scorm.recordInteraction(id, type, response, result, 'Variables module interaction');
    }
}

function completeModule() {
    if (!quizAnswers.q1 || !quizAnswers.q2) {
        alert('⚠️ กรุณาทำแบบทดสอบให้เสร็จทั้ง 2 ข้อ');
        return;
    }
    
    progress = 100;
    updateProgressBar();
    
    if (window.scorm) {
        scorm.setStatus('completed');
        scorm.setProgress(100);
        scorm.setScore(88, 0, 100);
        scorm.commit();
        scorm.terminate();
    }
    
    alert('🎉 ยินดีด้วย! คุณเข้าใจเรื่องตัวแปรและชนิดข้อมูลแล้ว');
    console.log('Variables module completed successfully');
}

window.addEventListener('beforeunload', function() {
    if (window.scorm && progress > 0) {
        scorm.setProgress(progress);
        scorm.commit();
    }
});