// JavaScript Interactivity Lesson
class JavaScriptLesson {
    constructor() {
        this.currentSection = 1;
        this.totalSections = 4;
        this.quizAnswers = { q1: 'a', q2: 'a', q3: 'b' };
        this.userAnswers = {};
        this.startTime = new Date();
        this.elementCounter = 0;
        
        this.initializeScorm();
        this.updateProgress();
        this.loadSavedProgress();
    }

    initializeScorm() {
        if (window.API) {
            const initialized = window.API.LMSInitialize('');
            if (initialized === 'true') {
                console.log('✅ SCORM initialized successfully');
                
                // Set initial status
                window.API.LMSSetValue('cmi.core.lesson_status', 'incomplete');
                window.API.LMSCommit('');
                
                // Load saved location
                const savedLocation = window.API.LMSGetValue('cmi.core.lesson_location');
                if (savedLocation) {
                    this.currentSection = parseInt(savedLocation) || 1;
                    this.showSection(this.currentSection);
                }
            }
        }
    }

    updateProgress() {
        const progress = (this.currentSection / this.totalSections) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        // Update SCORM progress
        if (window.API) {
            window.API.LMSSetValue('cmi.core.lesson_location', this.currentSection.toString());
            window.API.LMSCommit('');
        }
    }

    loadSavedProgress() {
        // Load from localStorage as backup
        const saved = localStorage.getItem('js_lesson_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentSection = data.currentSection || 1;
                this.userAnswers = data.userAnswers || {};
                this.elementCounter = data.elementCounter || 0;
                this.showSection(this.currentSection);
            } catch (error) {
                console.error('Failed to load saved progress:', error);
            }
        }
    }

    saveProgress() {
        const progressData = {
            currentSection: this.currentSection,
            userAnswers: this.userAnswers,
            elementCounter: this.elementCounter,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('js_lesson_progress', JSON.stringify(progressData));
        
        // Save to SCORM
        if (window.API) {
            window.API.saveSuspendData(progressData);
        }
    }

    showSection(sectionNumber) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show target section
        const targetSection = document.getElementById(`section${sectionNumber}`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            this.currentSection = sectionNumber;
            this.updateProgress();
            this.saveProgress();
        }
    }

    nextSection(sectionNumber) {
        this.showSection(sectionNumber);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Track section completion
        this.trackSectionCompletion(this.currentSection - 1);
    }

    trackSectionCompletion(sectionNumber) {
        console.log(`📚 Section ${sectionNumber} completed`);
        
        // Update SCORM tracking
        if (window.API) {
            const completedSections = window.API.LMSGetValue('cmi.suspend_data');
            let sections = [];
            
            try {
                const data = JSON.parse(completedSections || '{}');
                sections = data.completedSections || [];
            } catch (error) {
                sections = [];
            }
            
            if (!sections.includes(sectionNumber)) {
                sections.push(sectionNumber);
                
                const suspendData = {
                    completedSections: sections,
                    currentSection: this.currentSection,
                    userAnswers: this.userAnswers,
                    elementCounter: this.elementCounter
                };
                
                window.API.saveSuspendData(suspendData);
            }
        }
    }

    // JavaScript Demo Functions
    showAlert() {
        alert('🎉 นี่คือ JavaScript Alert!');
        this.updateDemoOutput('แสดง Alert เรียบร้อย!');
    }

    changeText() {
        const demoText = document.getElementById('demoText');
        if (demoText) {
            const messages = [
                'ข้อความถูกเปลี่ยนแล้ว!',
                'JavaScript ทำงานได้!',
                'เยี่ยมมาก! 🎉',
                'คุณเก่งมาก! ⭐'
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            demoText.textContent = randomMessage;
            demoText.style.color = '#e67e22';
            demoText.style.fontWeight = 'bold';
        }
    }

    getCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleString('th-TH');
        this.updateDemoOutput(`เวลาปัจจุบัน: ${timeString}`);
    }

    updateDemoOutput(message) {
        const output = document.getElementById('demoOutput');
        if (output) {
            const p = document.createElement('p');
            p.textContent = message;
            p.style.color = '#27ae60';
            p.style.fontWeight = 'bold';
            p.style.marginTop = '10px';
            output.appendChild(p);
            
            // Remove old messages if too many
            const messages = output.querySelectorAll('p');
            if (messages.length > 3) {
                output.removeChild(messages[0]);
            }
        }
    }

    // Interactive JavaScript Editor
    runJavaScript() {
        const editor = document.getElementById('jsEditor');
        const output = document.getElementById('jsOutput');
        
        if (editor && output) {
            const code = editor.value;
            
            try {
                // Create a safe execution context
                const originalLog = console.log;
                let logOutput = '';
                
                console.log = function(...args) {
                    logOutput += args.join(' ') + '\n';
                };
                
                // Execute the code
                eval(code);
                
                // Restore console.log
                console.log = originalLog;
                
                // Show output
                if (logOutput) {
                    output.innerHTML = `<strong>Console Output:</strong><br>${logOutput.replace(/\n/g, '<br>')}`;
                } else {
                    output.innerHTML = '<strong>โค้ดทำงานเรียบร้อย!</strong> ✅';
                }
                
                output.style.border = '2px solid #27ae60';
                output.style.backgroundColor = '#d4edda';
                
            } catch (error) {
                output.innerHTML = `<strong>Error:</strong> ${error.message}`;
                output.style.border = '2px solid #e74c3c';
                output.style.backgroundColor = '#f8d7da';
            }
            
            // Reset styles after 3 seconds
            setTimeout(() => {
                output.style.border = '2px solid #dee2e6';
                output.style.backgroundColor = '#f8f9fa';
            }, 3000);
        }
    }

    // DOM Manipulation Functions
    addElement() {
        const playground = document.getElementById('playground');
        if (playground) {
            this.elementCounter++;
            
            const newElement = document.createElement('div');
            newElement.className = 'sample-element';
            newElement.id = `element-${this.elementCounter}`;
            newElement.innerHTML = `<p>Element ${this.elementCounter}</p>`;
            newElement.style.marginTop = '10px';
            newElement.style.background = this.getRandomColor();
            
            playground.appendChild(newElement);
            
            // Add click event
            newElement.addEventListener('click', () => {
                alert(`คุณคลิกที่ Element ${this.elementCounter}!`);
            });
            
            this.saveProgress();
        }
    }

    changeStyle() {
        const sampleElement = document.getElementById('sampleElement');
        if (sampleElement) {
            const styles = ['highlighted', 'enlarged', 'rotated', 'pulsing'];
            const randomStyle = styles[Math.floor(Math.random() * styles.length)];
            
            // Remove all style classes
            styles.forEach(style => sampleElement.classList.remove(style));
            
            // Add new style
            sampleElement.classList.add(randomStyle);
            
            setTimeout(() => {
                sampleElement.classList.remove(randomStyle);
            }, 2000);
        }
    }

    removeElement() {
        const playground = document.getElementById('playground');
        if (playground) {
            const elements = playground.querySelectorAll('.sample-element:not(#sampleElement)');
            if (elements.length > 0) {
                const lastElement = elements[elements.length - 1];
                lastElement.style.animation = 'fadeOut 0.5s ease';
                setTimeout(() => {
                    playground.removeChild(lastElement);
                }, 500);
            } else {
                alert('ไม่มี Element ให้ลบแล้ว!');
            }
        }
    }

    animateElement() {
        const sampleElement = document.getElementById('sampleElement');
        if (sampleElement) {
            sampleElement.classList.add('animated');
            setTimeout(() => {
                sampleElement.classList.remove('animated');
            }, 1000);
        }
    }

    getRandomColor() {
        const colors = [
            'linear-gradient(135deg, #3498db, #2980b9)',
            'linear-gradient(135deg, #e74c3c, #c0392b)',
            'linear-gradient(135deg, #2ecc71, #27ae60)',
            'linear-gradient(135deg, #f39c12, #e67e22)',
            'linear-gradient(135deg, #9b59b6, #8e44ad)',
            'linear-gradient(135deg, #1abc9c, #16a085)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Event Handling Functions
    handleMouseOver(element) {
        element.style.background = '#2ecc71';
        element.textContent = 'Mouse Over! 🎯';
        this.updateEventOutput('Mouse Over Event ถูกเรียก!');
    }

    handleMouseOut(element) {
        element.style.background = '#3498db';
        element.textContent = 'Hover Me';
        this.updateEventOutput('Mouse Out Event ถูกเรียก!');
    }

    handleClick(element) {
        element.style.background = '#e74c3c';
        element.textContent = 'Clicked! 🎉';
        this.updateEventOutput('Click Event ถูกเรียก!');
        
        setTimeout(() => {
            element.style.background = '#3498db';
            element.textContent = 'Click Me';
        }, 1000);
    }

    handleKeyUp() {
        const input = document.getElementById('textInput');
        if (input) {
            const value = input.value;
            this.updateEventOutput(`KeyUp Event: "${value}" (${value.length} ตัวอักษร)`);
        }
    }

    updateEventOutput(message) {
        const output = document.getElementById('eventOutput');
        if (output) {
            const timestamp = new Date().toLocaleTimeString('th-TH');
            output.innerHTML = `[${timestamp}] ${message}`;
        }
    }

    // Quiz System
    submitQuiz() {
        const questions = ['q1', 'q2', 'q3'];
        let score = 0;
        
        // Collect answers
        questions.forEach(q => {
            const selected = document.querySelector(`input[name="${q}"]:checked`);
            if (selected) {
                this.userAnswers[q] = selected.value;
                if (selected.value === this.quizAnswers[q]) {
                    score++;
                }
            }
        });

        const percentage = Math.round((score / questions.length) * 100);
        const resultDiv = document.getElementById('quizResult');
        const completeBtn = document.querySelector('.complete-btn');
        
        if (resultDiv) {
            resultDiv.classList.remove('hidden');
            
            if (percentage >= 70) {
                resultDiv.className = 'quiz-result pass';
                resultDiv.innerHTML = `
                    🎉 <strong>ยินดีด้วย!</strong><br>
                    คะแนน: ${score}/${questions.length} (${percentage}%)<br>
                    คุณผ่านแบบทดสอบแล้ว!
                `;
                
                if (completeBtn) {
                    completeBtn.classList.remove('hidden');
                }
                
                // Update SCORM score
                if (window.API) {
                    window.API.setPassed(percentage);
                }
                
            } else {
                resultDiv.className = 'quiz-result fail';
                resultDiv.innerHTML = `
                    😔 <strong>เสียใจด้วย</strong><br>
                    คะแนน: ${score}/${questions.length} (${percentage}%)<br>
                    คุณต้องได้คะแนนอย่างน้อย 70% เพื่อผ่าน<br>
                    <button onclick="retakeQuiz()" style="margin-top: 10px;">ทำแบบทดสอบใหม่</button>
                `;
                
                // Update SCORM score
                if (window.API) {
                    window.API.setFailed(percentage);
                }
            }
        }

        this.saveProgress();
    }

    retakeQuiz() {
        // Clear previous answers
        document.querySelectorAll('input[type="radio"]').forEach(input => {
            input.checked = false;
        });
        
        const resultDiv = document.getElementById('quizResult');
        const completeBtn = document.querySelector('.complete-btn');
        
        if (resultDiv) resultDiv.classList.add('hidden');
        if (completeBtn) completeBtn.classList.add('hidden');
        
        this.userAnswers = {};
    }

    completeLesson() {
        // Calculate total time
        const endTime = new Date();
        const totalMinutes = Math.round((endTime - this.startTime) / 60000);
        
        // Update SCORM completion
        if (window.API) {
            window.API.setCompleted();
            
            // Set final data
            const sessionTime = this.calculateSessionTime(this.startTime, endTime);
            window.API.LMSSetValue('cmi.core.session_time', sessionTime);
            window.API.LMSCommit('');
            
            // Finish SCORM session
            window.API.LMSFinish('');
        }

        // Show completion message
        alert(`🎉 ยินดีด้วย! คุณเรียนจบหลักสูตร Web Development Fundamentals แล้ว!\n\nเวลาที่ใช้: ${totalMinutes} นาที\n\nคุณได้เรียนรู้:\n✅ HTML Basics\n✅ CSS Styling\n✅ JavaScript Interactivity\n\nขอแสดงความยินดี! 🏆`);
        
        // Redirect or close
        if (window.parent && window.parent !== window) {
            // If in iframe, notify parent
            window.parent.postMessage({
                type: 'course_completed',
                course: 'web-dev-fundamentals',
                score: this.getQuizScore(),
                timeSpent: totalMinutes
            }, '*');
        }
    }

    calculateSessionTime(startTime, endTime) {
        const diff = endTime - startTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    getQuizScore() {
        const questions = ['q1', 'q2', 'q3'];
        let score = 0;
        
        questions.forEach(q => {
            if (this.userAnswers[q] === this.quizAnswers[q]) {
                score++;
            }
        });
        
        return Math.round((score / questions.length) * 100);
    }
}

// Global functions for HTML onclick events
function nextSection(sectionNumber) {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.nextSection(sectionNumber);
    }
}

function showAlert() {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.showAlert();
    }
}

function changeText() {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.changeText();
    }
}

function getCurrentTime() {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.getCurrentTime();
    }
}

function runJavaScript() {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.runJavaScript();
    }
}

function addElement() {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.addElement();
    }
}

function changeStyle() {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.changeStyle();
    }
}

function removeElement() {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.removeElement();
    }
}

function animateElement() {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.animateElement();
    }
}

function handleMouseOver(element) {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.handleMouseOver(element);
    }
}

function handleMouseOut(element) {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.handleMouseOut(element);
    }
}

function handleClick(element) {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.handleClick(element);
    }
}

function handleKeyUp() {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.handleKeyUp();
    }
}

function submitQuiz() {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.submitQuiz();
    }
}

function retakeQuiz() {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.retakeQuiz();
    }
}

function completeLesson() {
    if (window.jsLessonInstance) {
        window.jsLessonInstance.completeLesson();
    }
}

// Initialize lesson when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.jsLessonInstance = new JavaScriptLesson();
    console.log('⚡ JavaScript Interactivity Lesson initialized');
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (window.jsLessonInstance && window.API) {
        window.jsLessonInstance.saveProgress();
    }
});

// Add CSS for fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
`;
document.head.appendChild(style);