// About Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeAboutPage();
});

async function initializeAboutPage() {
    try {
        await Promise.all([
            loadTeamMembers(),
            initializeCounterAnimations(),
            initializeValuesAccordion(),
            initializeCertifications()
        ]);
    } catch (error) {
        console.error('Error initializing about page:', error);
    }
}

// Load team members from Firebase
async function loadTeamMembers() {
    try {
        const teamGrid = document.getElementById('team-grid');
        if (!teamGrid) return;
        
        const teamMembers = await FirebaseUtils.getCollection(collections.teamMembers);
        
        if (teamMembers.length === 0) {
            teamGrid.innerHTML = `
                <div class="team-placeholder">
                    <p>Team member profiles coming soon...</p>
                </div>
            `;
            return;
        }
        
        teamGrid.innerHTML = teamMembers.map(member => `
            <div class="team-card">
                <div class="team-image">
                    <img src="${member.imageUrl || 'images/team/placeholder-person.jpg'}" 
                         alt="${member.name}" 
                         loading="lazy"
                         onerror="this.src='images/team/placeholder-person.jpg'">
                </div>
                <div class="team-info">
                    <h3 class="team-name">${member.name}</h3>
                    <span class="team-title">${member.title}</span>
                    <p class="team-bio">${member.bio || ''}</p>
                    <div class="team-credentials">
                        ${member.credentials ? member.credentials.map(cred => 
                            `<span class="credential">${cred}</span>`
                        ).join('') : ''}
                    </div>
                    ${member.email ? `
                        <div class="team-contact">
                            <a href="mailto:${member.email}" class="team-email">
                                <i class="icon-email">📧</i> Contact
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        // Add animation to team cards
        const teamCards = document.querySelectorAll('.team-card');
        teamCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-fade-in');
        });
        
    } catch (error) {
        console.error('Error loading team members:', error);
        const teamGrid = document.getElementById('team-grid');
        if (teamGrid) {
            teamGrid.innerHTML = '<p class="error-message">Unable to load team information.</p>';
        }
    }
}

// Initialize counter animations for statistics
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
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
