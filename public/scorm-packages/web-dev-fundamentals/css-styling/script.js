// CSS Styling Lesson JavaScript
class CSSLessson {
    constructor() {
        this.currentSection = 1;
        this.totalSections = 4;
        this.quizAnswers = { q1: 'a', q2: 'b', q3: 'c' };
        this.userAnswers = {};
        this.startTime = new Date();
        this.demoStates = {
            colorChanged: false,
            sizeChanged: false,
            borderAdded: false,
            flexColumn: false,
            gridThreeColumns: false
        };
        
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
        const saved = localStorage.getItem('css_lesson_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentSection = data.currentSection || 1;
                this.userAnswers = data.userAnswers || {};
                this.demoStates = data.demoStates || this.demoStates;
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
            demoStates: this.demoStates,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('css_lesson_progress', JSON.stringify(progressData));
        
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
                    demoStates: this.demoStates
                };
                
                window.API.saveSuspendData(suspendData);
            }
        }
    }

    // CSS Demo Functions
    changeColor() {
        const demoBox = document.getElementById('demoBox');
        if (demoBox) {
            if (this.demoStates.colorChanged) {
                demoBox.classList.remove('color-changed');
                this.demoStates.colorChanged = false;
            } else {
                demoBox.classList.add('color-changed');
                this.demoStates.colorChanged = true;
            }
            this.saveProgress();
        }
    }

    changeSize() {
        const demoBox = document.getElementById('demoBox');
        if (demoBox) {
            if (this.demoStates.sizeChanged) {
                demoBox.classList.remove('size-changed');
                this.demoStates.sizeChanged = false;
            } else {
                demoBox.classList.add('size-changed');
                this.demoStates.sizeChanged = true;
            }
            this.saveProgress();
        }
    }

    addBorder() {
        const demoBox = document.getElementById('demoBox');
        if (demoBox) {
            if (this.demoStates.borderAdded) {
                demoBox.classList.remove('border-added');
                this.demoStates.borderAdded = false;
            } else {
                demoBox.classList.add('border-added');
                this.demoStates.borderAdded = true;
            }
            this.saveProgress();
        }
    }

    // Interactive CSS Editor
    applyCss() {
        const editor = document.getElementById('cssEditor');
        const target = document.getElementById('cssTarget');
        
        if (editor && target) {
            const cssCode = editor.value;
            
            // Remove existing style element
            const existingStyle = document.getElementById('dynamic-css');
            if (existingStyle) {
                existingStyle.remove();
            }
            
            // Create new style element
            const styleElement = document.createElement('style');
            styleElement.id = 'dynamic-css';
            styleElement.textContent = cssCode;
            document.head.appendChild(styleElement);
            
            // Apply the class to target
            target.className = 'css-target my-style';
            
            // Visual feedback
            target.style.border = '3px solid #4caf50';
            setTimeout(() => {
                target.style.border = '2px solid #dee2e6';
            }, 2000);
        }
    }

    // Layout Demo Functions
    toggleFlexDirection() {
        const flexContainer = document.querySelector('.flex-container');
        if (flexContainer) {
            if (this.demoStates.flexColumn) {
                flexContainer.classList.remove('flex-column');
                this.demoStates.flexColumn = false;
            } else {
                flexContainer.classList.add('flex-column');
                this.demoStates.flexColumn = true;
            }
            this.saveProgress();
        }
    }

    toggleGridColumns() {
        const gridContainer = document.querySelector('.grid-container');
        if (gridContainer) {
            if (this.demoStates.gridThreeColumns) {
                gridContainer.classList.remove('grid-three-columns');
                this.demoStates.gridThreeColumns = false;
            } else {
                gridContainer.classList.add('grid-three-columns');
                this.demoStates.gridThreeColumns = true;
            }
            this.saveProgress();
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
        alert(`🎉 ยินดีด้วย! คุณเรียนจบบทเรียน CSS Styling แล้ว\n\nเวลาที่ใช้: ${totalMinutes} นาที\n\nคุณสามารถไปยังบทเรียนถัดไปได้แล้ว`);
        
        // Redirect or close
        if (window.parent && window.parent !== window) {
            // If in iframe, notify parent
            window.parent.postMessage({
                type: 'lesson_completed',
                lesson: 'css-styling',
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
    if (window.cssLessonInstance) {
        window.cssLessonInstance.nextSection(sectionNumber);
    }
}

function changeColor() {
    if (window.cssLessonInstance) {
        window.cssLessonInstance.changeColor();
    }
}

function changeSize() {
    if (window.cssLessonInstance) {
        window.cssLessonInstance.changeSize();
    }
}

function addBorder() {
    if (window.cssLessonInstance) {
        window.cssLessonInstance.addBorder();
    }
}

function applyCss() {
    if (window.cssLessonInstance) {
        window.cssLessonInstance.applyCss();
    }
}

function toggleFlexDirection() {
    if (window.cssLessonInstance) {
        window.cssLessonInstance.toggleFlexDirection();
    }
}

function toggleGridColumns() {
    if (window.cssLessonInstance) {
        window.cssLessonInstance.toggleGridColumns();
    }
}

function submitQuiz() {
    if (window.cssLessonInstance) {
        window.cssLessonInstance.submitQuiz();
    }
}

function retakeQuiz() {
    if (window.cssLessonInstance) {
        window.cssLessonInstance.retakeQuiz();
    }
}

function completeLesson() {
    if (window.cssLessonInstance) {
        window.cssLessonInstance.completeLesson();
    }
}

// Initialize lesson when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cssLessonInstance = new CSSLessson();
    console.log('🎨 CSS Styling Lesson initialized');
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (window.cssLessonInstance && window.API) {
        window.cssLessonInstance.saveProgress();
    }
});