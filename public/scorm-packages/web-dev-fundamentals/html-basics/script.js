// HTML Basics Lesson JavaScript
class HTMLBasicsLesson {
    constructor() {
        this.currentSection = 1;
        this.totalSections = 4;
        this.quizAnswers = { q1: 'a', q2: 'b', q3: 'b' };
        this.userAnswers = {};
        this.startTime = new Date();
        
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
        const saved = localStorage.getItem('html_basics_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentSection = data.currentSection || 1;
                this.userAnswers = data.userAnswers || {};
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
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('html_basics_progress', JSON.stringify(progressData));
        
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
                    userAnswers: this.userAnswers
                };
                
                window.API.saveSuspendData(suspendData);
            }
        }
    }

    // Interactive HTML Preview
    previewHTML() {
        const editor = document.getElementById('htmlEditor');
        const preview = document.getElementById('htmlPreview');
        
        if (editor && preview) {
            const htmlCode = editor.value;
            preview.innerHTML = htmlCode;
            
            // Add some styling to the preview
            preview.style.border = '2px solid #27ae60';
            preview.style.backgroundColor = '#f8fff8';
            
            setTimeout(() => {
                preview.style.border = '2px solid #dee2e6';
                preview.style.backgroundColor = '#f8f9fa';
            }, 2000);
        }
    }

    // Element Demo System
    showElementDemo(elementType) {
        const demoArea = document.getElementById('elementDemo');
        if (!demoArea) return;

        const demos = {
            heading: `
                <h3>🎯 Heading Elements Demo:</h3>
                <h1>Heading 1 - ใหญ่ที่สุด</h1>
                <h2>Heading 2 - ใหญ่รอง</h2>
                <h3>Heading 3 - ปานกลาง</h3>
                <h4>Heading 4 - เล็ก</h4>
                <h5>Heading 5 - เล็กกว่า</h5>
                <h6>Heading 6 - เล็กที่สุด</h6>
                <div class="code-snippet">
                    <strong>Code:</strong> &lt;h1&gt;หัวข้อ&lt;/h1&gt;
                </div>
            `,
            paragraph: `
                <h3>📝 Paragraph Demo:</h3>
                <p>นี่คือย่อหน้าแรก มีข้อความหลายบรรทัด สามารถใส่เนื้อหายาวๆ ได้</p>
                <p>นี่คือย่อหน้าที่สอง แต่ละย่อหน้าจะแยกจากกันด้วยช่องว่าง</p>
                <div class="code-snippet">
                    <strong>Code:</strong> &lt;p&gt;ข้อความ&lt;/p&gt;
                </div>
            `,
            link: `
                <h3>🔗 Link Demo:</h3>
                <a href="https://www.google.com" target="_blank">ลิงก์ไปยัง Google</a><br><br>
                <a href="#section1">ลิงก์ภายในหน้า</a><br><br>
                <a href="mailto:contact@skillnexus.com">ลิงก์อีเมล</a>
                <div class="code-snippet">
                    <strong>Code:</strong> &lt;a href="URL"&gt;ข้อความลิงก์&lt;/a&gt;
                </div>
            `,
            image: `
                <h3>🖼️ Image Demo:</h3>
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzNmOGZiZiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2FtcGxlIEltYWdlPC90ZXh0Pgo8L3N2Zz4K" alt="ตัวอย่างรูปภาพ" style="border: 2px solid #ddd; border-radius: 5px;">
                <div class="code-snippet">
                    <strong>Code:</strong> &lt;img src="path/to/image.jpg" alt="คำอธิบาย"&gt;
                </div>
            `,
            list: `
                <h3>📋 List Demo:</h3>
                <h4>Unordered List (รายการไม่เรียงลำดับ):</h4>
                <ul>
                    <li>รายการที่ 1</li>
                    <li>รายการที่ 2</li>
                    <li>รายการที่ 3</li>
                </ul>
                <h4>Ordered List (รายการเรียงลำดับ):</h4>
                <ol>
                    <li>ขั้นตอนที่ 1</li>
                    <li>ขั้นตอนที่ 2</li>
                    <li>ขั้นตอนที่ 3</li>
                </ol>
                <div class="code-snippet">
                    <strong>Code:</strong> &lt;ul&gt;&lt;li&gt;รายการ&lt;/li&gt;&lt;/ul&gt;
                </div>
            `,
            div: `
                <h3>📦 Div Demo:</h3>
                <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 10px 0;">
                    <h4>กล่องที่ 1</h4>
                    <p>นี่คือเนื้อหาในกล่อง div แรก</p>
                </div>
                <div style="background: #f3e5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
                    <h4>กล่องที่ 2</h4>
                    <p>นี่คือเนื้อหาในกล่อง div ที่สอง</p>
                </div>
                <div class="code-snippet">
                    <strong>Code:</strong> &lt;div&gt;เนื้อหา&lt;/div&gt;
                </div>
            `
        };

        demoArea.innerHTML = demos[elementType] || '<p>ไม่พบตัวอย่างสำหรับ element นี้</p>';
        
        // Add animation
        demoArea.style.animation = 'none';
        setTimeout(() => {
            demoArea.style.animation = 'fadeIn 0.5s ease';
        }, 10);
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
        alert(`🎉 ยินดีด้วย! คุณเรียนจบบทเรียน HTML Basics แล้ว\n\nเวลาที่ใช้: ${totalMinutes} นาที\n\nคุณสามารถไปยังบทเรียนถัดไปได้แล้ว`);
        
        // Redirect or close
        if (window.parent && window.parent !== window) {
            // If in iframe, notify parent
            window.parent.postMessage({
                type: 'lesson_completed',
                lesson: 'html-basics',
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
    if (window.lessonInstance) {
        window.lessonInstance.nextSection(sectionNumber);
    }
}

function previewHTML() {
    if (window.lessonInstance) {
        window.lessonInstance.previewHTML();
    }
}

function showElementDemo(elementType) {
    if (window.lessonInstance) {
        window.lessonInstance.showElementDemo(elementType);
    }
}

function submitQuiz() {
    if (window.lessonInstance) {
        window.lessonInstance.submitQuiz();
    }
}

function retakeQuiz() {
    if (window.lessonInstance) {
        window.lessonInstance.retakeQuiz();
    }
}

function completeLesson() {
    if (window.lessonInstance) {
        window.lessonInstance.completeLesson();
    }
}

// Initialize lesson when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.lessonInstance = new HTMLBasicsLesson();
    console.log('📚 HTML Basics Lesson initialized');
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (window.lessonInstance && window.API) {
        window.lessonInstance.saveProgress();
    }
});