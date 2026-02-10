// 🚀 PREMIUM INTERACTIVE SCORM JAVASCRIPT
// Enhanced UX with smooth animations and interactions

class PremiumSCORM {
  constructor() {
    this.initializeAnimations();
    this.initializeInteractivity();
    this.initializeProgressTracking();
  }

  // 🎨 Initialize smooth animations
  initializeAnimations() {
    // Fade in elements on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.course-card, .interactive-box, .info-box').forEach(el => {
      observer.observe(el);
    });
  }

  // 🎮 Initialize interactive elements
  initializeInteractivity() {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', this.createRipple);
    });

    // Add hover sound effect (optional)
    document.querySelectorAll('.quiz-option').forEach(option => {
      option.addEventListener('mouseenter', () => {
        option.style.transform = 'translateX(4px) scale(1.01)';
      });
      
      option.addEventListener('mouseleave', () => {
        option.style.transform = 'translateX(0) scale(1)';
      });
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ✨ Create ripple effect
  createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  // 📊 Progress tracking
  initializeProgressTracking() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      this.updateProgress();
    }
  }

  updateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    const sections = document.querySelectorAll('.course-section');
    const completedSections = document.querySelectorAll('.course-section.completed');
    
    if (sections.length > 0) {
      const progress = (completedSections.length / sections.length) * 100;
      progressBar.style.width = progress + '%';
      progressBar.setAttribute('aria-valuenow', progress);
    }
  }
}

// 🎯 Quiz Handler with Premium UX
class PremiumQuiz {
  constructor() {
    this.currentQuestion = 0;
    this.score = 0;
    this.answers = [];
  }

  // Select answer with animation
  selectAnswer(optionElement, questionIndex, answerIndex) {
    // Remove previous selection
    const allOptions = optionElement.parentElement.querySelectorAll('.quiz-option');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Add selection with animation
    optionElement.classList.add('selected');
    this.answers[questionIndex] = answerIndex;
    
    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    // Visual feedback
    optionElement.style.transform = 'scale(0.98)';
    setTimeout(() => {
      optionElement.style.transform = 'scale(1)';
    }, 100);
  }

  // Check answer with premium feedback
  checkAnswer(optionElement, isCorrect) {
    if (isCorrect) {
      optionElement.classList.add('correct');
      this.showFeedback('✅ ถูกต้อง! ยอดเยี่ยม!', 'success');
      this.score++;
      
      // Confetti effect (optional)
      this.createConfetti();
    } else {
      optionElement.classList.add('incorrect');
      this.showFeedback('❌ ไม่ถูกต้อง ลองใหม่อีกครั้ง', 'error');
      
      // Shake animation
      optionElement.style.animation = 'shake 0.5s ease';
    }
    
    // Disable all options after answer
    const allOptions = optionElement.parentElement.querySelectorAll('.quiz-option');
    allOptions.forEach(opt => {
      opt.style.pointerEvents = 'none';
      opt.style.opacity = '0.7';
    });
  }

  // Show feedback message
  showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `feedback-message ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 2rem;
      border-radius: 12px;
      background: ${type === 'success' ? 'linear-gradient(135deg, #4caf50, #45a049)' : 'linear-gradient(135deg, #f44336, #e53935)'};
      color: white;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      z-index: 1000;
      animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => feedback.remove(), 300);
    }, 3000);
  }

  // Create confetti effect
  createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f5576c', '#4facfe'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: 50%;
        left: 50%;
        opacity: 1;
        border-radius: 50%;
        pointer-events: none;
        z-index: 999;
      `;
      
      document.body.appendChild(confetti);
      
      const angle = (Math.PI * 2 * i) / confettiCount;
      const velocity = 5 + Math.random() * 5;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      let x = 0, y = 0, opacity = 1;
      
      const animate = () => {
        x += vx;
        y += vy + 2; // gravity
        opacity -= 0.02;
        
        confetti.style.transform = `translate(${x}px, ${y}px)`;
        confetti.style.opacity = opacity;
        
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          confetti.remove();
        }
      };
      
      animate();
    }
  }

  // Calculate and show final score
  showFinalScore() {
    const percentage = (this.score / this.answers.length) * 100;
    let message = '';
    let emoji = '';
    
    if (percentage >= 90) {
      message = 'ยอดเยี่ยมมาก! คุณเป็นผู้เชี่ยวชาญ!';
      emoji = '🏆';
    } else if (percentage >= 70) {
      message = 'ดีมาก! คุณเข้าใจเนื้อหาเป็นอย่างดี';
      emoji = '🌟';
    } else if (percentage >= 50) {
      message = 'ผ่าน! แต่ควรทบทวนเนื้อหาอีกครั้ง';
      emoji = '👍';
    } else {
      message = 'ควรศึกษาเนื้อหาเพิ่มเติม';
      emoji = '📚';
    }
    
    const scoreCard = document.createElement('div');
    scoreCard.className = 'score-card';
    scoreCard.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 3rem;
        border-radius: 24px;
        text-align: center;
        box-shadow: 0 16px 48px rgba(0,0,0,0.25);
        animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      ">
        <div style="font-size: 4rem; margin-bottom: 1rem;">${emoji}</div>
        <h2 style="color: white; margin-bottom: 1rem;">คะแนนของคุณ</h2>
        <div style="font-size: 3rem; font-weight: 700; margin-bottom: 1rem;">
          ${this.score}/${this.answers.length}
        </div>
        <div style="font-size: 2rem; margin-bottom: 1rem;">${percentage.toFixed(0)}%</div>
        <p style="font-size: 1.25rem; color: rgba(255,255,255,0.9);">${message}</p>
      </div>
    `;
    
    document.querySelector('.container').appendChild(scoreCard);
  }
}

// 🎬 Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const premiumSCORM = new PremiumSCORM();
  window.premiumQuiz = new PremiumQuiz();
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    @keyframes scaleIn {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  console.log('🚀 Premium SCORM Initialized!');
});

// 📱 Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PremiumSCORM, PremiumQuiz };
}
