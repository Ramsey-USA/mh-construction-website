// MH Construction - About Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeAboutPage();
});

function initializeAboutPage() {
    try {
        // Initialize all about page functionality
        initializeScrollAnimations();
        initializeValueCards();
        initializeCounterAnimations();
        initializeCertifications();
        initializeTeamCards();
        
        console.log('About page initialized successfully');
    } catch (error) {
        console.error('Error initializing about page:', error);
    }
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                
                // Log section view if analytics available
                if (typeof analytics !== 'undefined') {
                    const sectionName = entry.target.id || entry.target.className;
                    analytics.logEvent('about_section_viewed', {
                        section: sectionName
                    });
                }
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('.company-overview, .core-values, .veteran-story, .leadership-team, .certifications, .why-choose-us');
    sections.forEach(section => {
        observer.observe(section);
    });
}

function initializeValueCards() {
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach(card => {
        // Add click functionality for flip effect
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            
            // Log value card interaction
            if (typeof analytics !== 'undefined') {
                const valueName = card.querySelector('h3').textContent;
                analytics.logEvent('value_card_clicked', {
                    value_name: valueName
                });
            }
        });

        // Add keyboard support
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('flipped');
            }
        });

        // Make cards focusable for accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Click to learn more about this value');
    });
}

function initializeCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

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
        
        // Format the number based on context
        let displayValue = Math.floor(current);
        if (element.textContent.includes('%')) {
            displayValue += '%';
        } else if (element.textContent.includes('+')) {
            displayValue += '+';
        }
        
        element.textContent = displayValue;
    }, 16);
    
    // Log analytics event if available
    if (typeof analytics !== 'undefined') {
        const statLabel = element.closest('.stat')?.querySelector('.stat-label')?.textContent || 'unknown';
        analytics.logEvent('counter_animated', {
            counter_name: statLabel,
            final_value: target
        });
    }
}

function initializeCertifications() {
    const certCards = document.querySelectorAll('.certification-card');
    
    certCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 12px 24px rgba(57, 104, 81, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'var(--shadow-card)';
        });
        
        card.addEventListener('click', function() {
            const certName = this.querySelector('h3').textContent;
            
            // Log certification view
            if (typeof analytics !== 'undefined') {
                analytics.logEvent('certification_viewed', {
                    certification_name: certName
                });
            }
            
            // Add visual feedback
            this.style.borderColor = 'var(--primary-green)';
            setTimeout(() => {
                this.style.borderColor = 'var(--field-02)';
            }, 500);
        });
        
        // Make focusable for keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                card.click();
            }
        });
    });
}

function initializeTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            const image = this.querySelector('.team-image img');
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const image = this.querySelector('.team-image img');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
        
        // Track team member contact clicks
        const emailLink = card.querySelector('.team-email');
        if (emailLink) {
            emailLink.addEventListener('click', function(e) {
                const memberName = card.querySelector('.team-name').textContent;
                
                if (typeof analytics !== 'undefined') {
                    analytics.logEvent('team_contact_clicked', {
                        member_name: memberName,
                        contact_method: 'email'
                    });
                }
            });
        }
    });
}

// Initialize choose items with enhanced interactions
function initializeChooseItems() {
    const chooseItems = document.querySelectorAll('.choose-item');
    
    chooseItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.choose-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.choose-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        item.addEventListener('click', function() {
            const reasonTitle = this.querySelector('h3').textContent;
            
            if (typeof analytics !== 'undefined') {
                analytics.logEvent('choose_reason_clicked', {
                    reason: reasonTitle
                });
            }
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Load team members from Firebase or use fallback
async function loadTeamMembers() {
    try {
        if (typeof FirebaseUtils !== 'undefined') {
            const teamMembers = await FirebaseUtils.getCollection('teamMembers');
            
            if (teamMembers && teamMembers.length > 0) {
                renderTeamMembers(teamMembers);
                return;
            }
        }
        
        // Use static team data as fallback
        console.log('Using static team member data');
        
    } catch (error) {
        console.error('Error loading team members:', error);
    }
}

function renderTeamMembers(members) {
    const teamGrid = document.querySelector('.team-grid');
    if (!teamGrid) return;
    
    teamGrid.innerHTML = members.map(member => `
        <div class="team-card">
            <div class="team-image">
                <img src="${member.imageUrl || 'images/placeholder-person.jpg'}" 
                     alt="${member.name}" 
                     loading="lazy"
                     onerror="this.src='images/placeholder-person.jpg'">
            </div>
            <div class="team-info">
                <h3 class="team-name">${member.name}</h3>
                <p class="team-title">${member.title}</p>
                <p class="team-bio">${member.bio}</p>
                ${member.credentials ? `
                    <div class="team-credentials">
                        ${member.credentials.map(cred => `<span class="credential">${cred}</span>`).join('')}
                    </div>
                ` : ''}
                ${member.email ? `
                    <div class="team-contact">
                        <a href="mailto:${member.email}" class="team-email">
                            <i class="fas fa-envelope"></i>
                            Contact ${member.name.split(' ')[0]}
                        </a>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    // Re-initialize team card interactions
    initializeTeamCards();
}

// Export functions for global access
window.AboutPage = {
    initializeAboutPage,
    loadTeamMembers,
    animateCounter,
    initializeCounterAnimations,
    initializeCertifications
};

// Initialize choose items when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeChooseItems();
});
