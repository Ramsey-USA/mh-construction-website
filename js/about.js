// MH Construction - About Page Functionality

class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupValueCards();
        this.setupStatsCounter();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);

        // Observe sections for animation
        const sections = document.querySelectorAll('.company-overview, .veteran-story, .leadership-team, .certifications, .why-choose-us');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setupValueCards() {
        const valueCards = document.querySelectorAll('.value-card');
        
        valueCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });

            // Add keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.classList.toggle('flipped');
                }
            });

            // Make cards focusable
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', 'Click to learn more about this value');
        });
    }

    setupStatsCounter() {
        const stats = document.querySelectorAll('.stat h3');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => {
            observer.observe(stat);
        });
    }

    animateCounter(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const number = parseInt(text.replace(/[+%]/g, ''));
        
        let current = 0;
        const increment = number / 60; // Animate over ~1 second at 60fps
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            let displayText = Math.floor(current).toString();
            if (hasPlus) displayText += '+';
            if (hasPercent) displayText += '%';
            
            element.textContent = displayText;
        }, 16);
    }
}

// Initialize About page functionality
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
});
function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
    
    // Log analytics event
    analytics.logEvent('counter_animated', {
        counter_name: element.closest('.stat').querySelector('.stat-label').textContent,
        final_value: target
    });
}

// Initialize values accordion functionality
function initializeValuesAccordion() {
    const valueHeaders = document.querySelectorAll('.value-header');
    
    valueHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const valueItem = this.parentElement;
            const content = valueItem.querySelector('.value-content');
            const toggleIcon = this.querySelector('.toggle-icon');
            const isActive = valueItem.classList.contains('active');
            
            // Close all other items
            document.querySelectorAll('.value-item').forEach(item => {
                if (item !== valueItem) {
                    item.classList.remove('active');
                    item.querySelector('.value-content').style.maxHeight = '0';
                    item.querySelector('.toggle-icon').textContent = '+';
                }
            });
            
            // Toggle current item
            if (isActive) {
                valueItem.classList.remove('active');
                content.style.maxHeight = '0';
                toggleIcon.textContent = '+';
            } else {
                valueItem.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                toggleIcon.textContent = '−';
                
                // Log analytics event
                analytics.logEvent('value_expanded', {
                    value_name: this.dataset.value
                });
            }
        });
    });
}

// Initialize certifications with hover effects
function initializeCertifications() {
    const certCards = document.querySelectorAll('.certification-card');
    
    certCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'var(--shadow-card)';
        });
        
        card.addEventListener('click', function() {
            const certName = this.querySelector('h3').textContent;
            analytics.logEvent('certification_viewed', {
                certification_name: certName
            });
        });
    });
}

// Export functions for global access
window.AboutPage = {
    loadTeamMembers,
    initializeCounterAnimations,
    initializeValuesAccordion,
    initializeCertifications
};
