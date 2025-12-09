// Assessment Configuration
const TOTAL_QUESTIONS = 5;
const TIME_LIMIT = 45 * 60; // 45 minutes in seconds
const PASSING_SCORE = 70;

// Assessment State
let currentQuestion = 1;
let answers = {};
let timeLeft = TIME_LIMIT;
let timerInterval;
let startTime;

// Correct answers
const correctAnswers = {
    1: 'B', // Brendan Eich ในปี 1995
    2: 'B', // "53"
    3: 'C', // const PI = 3.14;
    4: 'B', // "object"
    5: 'B'  // return
};

document.addEventListener('DOMContentLoaded', function() {
    initializeAssessment();
    startTimer();
    createQuestionNavigation();
    updateProgress();
    
    if (window.scorm) {
        scorm.initialize();
        scorm.setStatus('incomplete');
        startTime = new Date();
    }
});

function initializeAssessment() {
    // Show first question
    showQuestion(1);
    updateNavigationButtons();
}

function startTimer() {
    timerInterval = setInterval(function() {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            autoSubmitAssessment();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timeLeft').textContent = timeString;
    
    // Change color when time is running out
    const timer = document.getElementById('timer');
    if (timeLeft < 300) { // Less than 5 minutes
        timer.style.background = '#f8d7da';
        timer.style.borderColor = '#dc3545';
        timer.style.color = '#721c24';
    } else if (timeLeft < 600) { // Less than 10 minutes
        timer.style.background = '#fff3cd';
        timer.style.borderColor = '#ffc107';
    }
}

function createQuestionNavigation() {
    const nav = document.getElementById('questionNav');
    nav.innerHTML = '';
    
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
        const navItem = document.createElement('div');
        navItem.className = 'nav-item';
        navItem.textContent = i;
        navItem.onclick = () => goToQuestion(i);
        
        if (i === currentQuestion) {
            navItem.classList.add('current');
        }
        if (answers[i]) {
            navItem.classList.add('answered');
        }
        
        nav.appendChild(navItem);
    }
}

function showQuestion(questionNum) {
    // Hide all questions
    document.querySelectorAll('.question-container').forEach(q => {
        q.classList.remove('active');
    });
    
    // Show current question
    const questionElement = document.querySelector(`[data-question="${questionNum}"]`);
    if (questionElement) {
        questionElement.classList.add('active');
    }
    
    currentQuestion = questionNum;
    updateNavigationButtons();
    createQuestionNavigation();
    updateProgress();
}

function selectAnswer(questionNum, answer) {
    // Remove previous selection
    const questionContainer = document.querySelector(`[data-question="${questionNum}"]`);
    questionContainer.querySelectorAll('.options li').forEach(li => {
        li.classList.remove('selected');
    });
    
    // Mark new selection
    event.target.classList.add('selected');
    
    // Store answer
    answers[questionNum] = answer;
    
    // Record interaction
    recordInteraction(`question_${questionNum}`, 'choice', answer, 
        answer === correctAnswers[questionNum] ? 'correct' : 'incorrect');
    
    // Update navigation
    createQuestionNavigation();
    updateProgress();
    
    // Auto-advance after short delay (optional)
    setTimeout(() => {
        if (currentQuestion < TOTAL_QUESTIONS) {
            nextQuestion();
        } else {
            document.getElementById('submitBtn').style.display = 'inline-block';
            document.getElementById('nextBtn').style.display = 'none';
        }
    }, 1000);
}

function nextQuestion() {
    if (currentQuestion < TOTAL_QUESTIONS) {
        showQuestion(currentQuestion + 1);
    }
}

function previousQuestion() {
    if (currentQuestion > 1) {
        showQuestion(currentQuestion - 1);
    }
}

function goToQuestion(questionNum) {
    showQuestion(questionNum);
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.disabled = currentQuestion === 1;
    
    if (currentQuestion === TOTAL_QUESTIONS) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

function updateProgress() {
    const answeredQuestions = Object.keys(answers).length;
    const progress = (answeredQuestions / TOTAL_QUESTIONS) * 100;
    
    document.getElementById('progressBar').style.width = progress + '%';
    
    if (window.scorm) {
        scorm.setProgress(progress);
        scorm.commit();
    }
}

function submitAssessment() {
    // Check if all questions are answered
    const unansweredQuestions = [];
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
        if (!answers[i]) {
            unansweredQuestions.push(i);
        }
    }
    
    if (unansweredQuestions.length > 0) {
        const proceed = confirm(`คุณยังไม่ได้ตอบคำถามที่ ${unansweredQuestions.join(', ')}\nต้องการส่งคำตอบหรือไม่?`);
        if (!proceed) return;
    }
    
    clearInterval(timerInterval);
    calculateAndShowResults();
}

function autoSubmitAssessment() {
    alert('⏰ หมดเวลาแล้ว! ระบบจะส่งคำตอบให้อัตโนมัติ');
    calculateAndShowResults();
}

function calculateAndShowResults() {
    let correctCount = 0;
    let totalAnswered = 0;
    
    // Calculate score
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
        if (answers[i]) {
            totalAnswered++;
            if (answers[i] === correctAnswers[i]) {
                correctCount++;
            }
        }
    }
    
    const score = totalAnswered > 0 ? Math.round((correctCount / TOTAL_QUESTIONS) * 100) : 0;
    const passed = score >= PASSING_SCORE;
    
    // Hide questions and show results
    document.querySelectorAll('.question-container').forEach(q => q.style.display = 'none');
    document.querySelector('.navigation-buttons').style.display = 'none';
    document.querySelector('.question-nav').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
    
    const results = document.getElementById('results');
    results.style.display = 'block';
    
    // Display score
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.textContent = `${score}%`;
    scoreDisplay.style.color = passed ? '#28a745' : '#dc3545';
    
    // Create breakdown
    const breakdown = document.getElementById('scoreBreakdown');
    breakdown.innerHTML = `
        <h4>${passed ? '🎉 ยินดีด้วย! คุณสอบผ่าน' : '😔 คุณสอบไม่ผ่าน'}</h4>
        <div style="margin: 15px 0;">
            <strong>คะแนนที่ได้:</strong> ${score}% (${correctCount}/${TOTAL_QUESTIONS} ข้อ)<br>
            <strong>เกณฑ์ผ่าน:</strong> ${PASSING_SCORE}%<br>
            <strong>เวลาที่ใช้:</strong> ${formatTime(TIME_LIMIT - timeLeft)}<br>
            <strong>สถานะ:</strong> ${passed ? 'ผ่าน ✅' : 'ไม่ผ่าน ❌'}
        </div>
        <div style="background: ${passed ? '#d4edda' : '#f8d7da'}; padding: 15px; border-radius: 5px; margin: 15px 0;">
            ${passed ? 
                '🌟 ยอดเยี่ยม! คุณมีความเข้าใจพื้นฐาน JavaScript เป็นอย่างดี' : 
                '📚 แนะนำให้ทบทวนบทเรียนและลองทำแบบทดสอบใหม่อีกครั้ง'
            }
        </div>
    `;
    
    // Update SCORM
    if (window.scorm) {
        scorm.setStatus(passed ? 'passed' : 'failed');
        scorm.setScore(score, 0, 100);
        scorm.setProgress(100);
        
        // Record completion time
        const endTime = new Date();
        const duration = Math.round((endTime - startTime) / 1000);
        scorm.setValue('cmi.session_time', `PT${duration}S`);
        
        scorm.commit();
        scorm.terminate();
    }
    
    // Record final interaction
    recordInteraction('assessment_completed', 'other', `score_${score}`, passed ? 'passed' : 'failed');
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} นาที ${remainingSeconds} วินาที`;
}

function reviewAnswers() {
    alert('🔍 ฟีเจอร์ดูเฉลยจะเปิดในหน้าต่างใหม่ (ในระบบจริง)');
    
    // In a real system, this would show detailed answer explanations
    let reviewText = 'เฉลยแบบทดสอบ:\n\n';
    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
        const userAnswer = answers[i] || 'ไม่ได้ตอบ';
        const correct = correctAnswers[i];
        const isCorrect = userAnswer === correct;
        
        reviewText += `คำถามที่ ${i}: คุณตอบ ${userAnswer}, เฉลย ${correct} ${isCorrect ? '✅' : '❌'}\n`;
    }
    
    console.log(reviewText);
}

function recordInteraction(id, type, response, result) {
    if (window.scorm) {
        scorm.recordInteraction(id, type, response, result, 'Assessment interaction');
    }
}

// Prevent page refresh during assessment
window.addEventListener('beforeunload', function(e) {
    if (timeLeft > 0 && Object.keys(answers).length > 0) {
        e.preventDefault();
        e.returnValue = 'คุณกำลังทำแบบทดสอบอยู่ ต้องการออกจากหน้านี้หรือไม่?';
        
        if (window.scorm) {
            scorm.setProgress((Object.keys(answers).length / TOTAL_QUESTIONS) * 100);
            scorm.commit();
        }
    }
});