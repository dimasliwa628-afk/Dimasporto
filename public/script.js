class PortfolioWebsite {
    constructor() {
        this.navMenu = document.querySelector('.nav-menu');
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.contactForm = document.getElementById('contactForm');
        this.sections = document.querySelectorAll('section');
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupSkillBars();
        this.setupSmoothScrolling();
        this.setupFormHandling();
    }
    setupEventListeners() {
        // Mobile menu toggle
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => {
                this.hamburger?.classList.toggle('active');
                this.navMenu?.classList.toggle('active');
            });
        }
        // Close mobile menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.hamburger?.classList.remove('active');
                this.navMenu?.classList.remove('active');
            });
        });
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar?.classList.add('scrolled');
            }
            else {
                navbar?.classList.remove('scrolled');
            }
        });
    }
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        // Add animation classes to elements
        this.sections.forEach((section, index) => {
            section.classList.add('fade-in');
            observer.observe(section);
        });
        // Animate skill cards
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            card.classList.add('fade-in');
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
        // Animate timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.classList.add('slide-in-left');
            item.style.animationDelay = `${index * 0.2}s`;
            observer.observe(item);
        });
    }
    setupSkillBars() {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillProgress = entry.target;
                    const targetWidth = skillProgress.getAttribute('data-width');
                    if (targetWidth) {
                        setTimeout(() => {
                            skillProgress.style.width = targetWidth;
                        }, 200);
                    }
                }
            });
        }, { threshold: 0.5 });
        this.skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    }
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    setupFormHandling() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
    }
    handleFormSubmit() {
        if (!this.contactForm)
            return;
        const formData = new FormData(this.contactForm);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        // Validate form data
        if (this.validateForm(contactData)) {
            this.showNotification('Pesan berhasil dikirim! Terima kasih atas pesan Anda.', 'success');
            this.contactForm.reset();
        }
        else {
            this.showNotification('Mohon lengkapi semua field yang diperlukan.', 'error');
        }
    }
    validateForm(data) {
        return !!(data.name && data.email && data.subject && data.message);
    }
    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        document.body.appendChild(notification);
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    // Public method to add typing effect
    addTypingEffect(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        };
        typeWriter();
    }
    // Public method to animate counters
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toString();
        }, 16);
    }
}
// Utility functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    static throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    static isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth));
    }
}
// Initialize the portfolio website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new PortfolioWebsite();
    // Add some additional interactive features
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Add a subtle animation to the hero title
        heroTitle.classList.add('fade-in');
    }
    // Add parallax effect to hero section
    window.addEventListener('scroll', Utils.throttle(() => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }, 16));
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});
// Export for potential module usage
export { PortfolioWebsite, Utils };
//# sourceMappingURL=script.js.map