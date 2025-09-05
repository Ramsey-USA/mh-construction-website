// MH Construction - Main JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality
    try {
        initializeNavigation();
        initializeHero();
        initializeAnimations();
        initializeCarousel();
        
        console.log('Main app initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});

// Navigation functionality
function initializeNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!header || !navToggle || !navMenu) {
        console.warn('Navigation elements not found');
        return;
    }
    
    // Sticky header on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navToggle.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// Hero section functionality
function initializeHero() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    
    const heroVideo = hero.querySelector('video');
    
    if (heroVideo) {
        // Pause video on mobile to save bandwidth
        if (window.innerWidth < 768) {
            heroVideo.pause();
            heroVideo.style.display = 'none';
        }
        
        // Video error handling
        heroVideo.addEventListener('error', function() {
            console.log('Hero video failed to load, using fallback background');
            hero.style.backgroundImage = 'url("images/hero/construction-hero-fallback.jpg")';
            hero.style.backgroundSize = 'cover';
            hero.style.backgroundPosition = 'center';
        });
    }
}

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    document.querySelectorAll('section, .award-card, .service-card, .project-card, .blog-card').forEach(el => {
        observer.observe(el);
    });
}

// Services Carousel - Simplified version
function initializeCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!carouselTrack || !carouselPrev || !carouselNext || indicators.length === 0) {
        return; // Exit if carousel elements not found
    }
    
    const cards = document.querySelectorAll('.service-carousel-card');
    let currentSlide = 0;
    const totalSlides = cards.length;
    
    function updateCarousel() {
        const translateX = -currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        // Update card active state
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }
    
    // Event listeners
    carouselNext.addEventListener('click', nextSlide);
    carouselPrev.addEventListener('click', prevSlide);
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-advance
    setInterval(nextSlide, 6000);
    
    // Initialize
    updateCarousel();
}

// Counter animation for statistics
function animateCounter(element) {
    const target = parseInt(element.textContent) || parseInt(element.dataset.count);
    if (!target) return;
    
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Initialize counter animations when elements come into view
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count], .stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Initialize counters when DOM is ready
document.addEventListener('DOMContentLoaded', initializeCounters);

// Utility functions
function showSuccessMessage(form, message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'form-message success';
    messageEl.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    form.insertAdjacentElement('afterend', messageEl);
    
    setTimeout(() => messageEl.remove(), 5000);
}

function showErrorMessage(form, message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'form-message error';
    messageEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    form.insertAdjacentElement('afterend', messageEl);
    
    setTimeout(() => messageEl.remove(), 5000);
}

// Export utilities for global access
window.MHConstructionApp = {
    showSuccessMessage,
    showErrorMessage,
    animateCounter
};

// Handle errors globally
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Performance monitoring
window.addEventListener('load', function() {
    console.log('Page loaded successfully');
});
        if (!blogCarousel) return;
        
        const blogPosts = await FirebaseUtils.getCollection(collections.blogPosts);
        
        if (blogPosts.length === 0) {
            blogCarousel.innerHTML = '<p class="no-posts">Blog posts coming soon...</p>';
            return;
        }
        
        // Show latest 3 posts
        const latestPosts = blogPosts.slice(0, 3);
        
        blogCarousel.innerHTML = latestPosts.map(post => `
            <article class="blog-card">
                <img src="${post.featuredImage || 'images/blog/default-blog.jpg'}" 
                     alt="${post.title}" 
                     class="blog-image"
                     loading="lazy"
                     onerror="this.src='images/blog/default-blog.jpg'">
                <div class="blog-content">
                    <time class="blog-date">${new Date(post.publishDate).toLocaleDateString()}</time>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="${post.slug ? `/blog/${post.slug}` : '#'}" class="blog-link">Read More</a>
                </div>
            </article>
        `).join('');
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        const blogCarousel = document.getElementById('blog-carousel');
        if (blogCarousel) {
            blogCarousel.innerHTML = '<p class="error-message">Unable to load blog posts.</p>';
        }
    }
}

// Load client logos from Firebase
async function loadClientLogos() {
    try {
        const logosGrid = document.querySelector('.logos-grid');
        if (!logosGrid) return;
        
        const clients = await FirebaseUtils.getCollection(collections.clientLogos);
        
        if (clients.length === 0) return;
        
        logosGrid.innerHTML = clients.map(client => `
            <div class="client-logo">
                <img src="${client.logoUrl}" 
                     alt="${client.name}" 
                     loading="lazy"
                     onerror="this.style.display='none'">
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading client logos:', error);
    }
}

// Load awards from Firebase
async function loadAwards() {
    try {
        const awardsGrid = document.querySelector('.awards-grid');
        if (!awardsGrid) return;
        
        const awards = await FirebaseUtils.getCollection(collections.awards);
        
        if (awards.length === 0) return;
        
        // Show latest 3 awards
        const latestAwards = awards.slice(0, 3);
        
        awardsGrid.innerHTML = latestAwards.map(award => `
            <div class="award-card">
                <img src="${award.imageUrl || 'images/awards/default-award.jpg'}" 
                     alt="${award.title}"
                     loading="lazy"
                     onerror="this.src='images/awards/default-award.jpg'">
                <h3>${award.title}</h3>
                <p>${award.description}</p>
                <span class="award-year">${award.year}</span>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading awards:', error);
    }
}

// Initialize animations and scroll effects
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Log section view
                const sectionName = entry.target.id || entry.target.className;
                analytics.logEvent('section_viewed', {
                    section: sectionName
                });
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    document.querySelectorAll('section, .award-card, .service-card, .project-card, .blog-card').forEach(el => {
        observer.observe(el);
    });
}

// Advanced scroll effects
function initializeScrollEffects() {
    // Value cards flip effect
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'rotateY(180deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'rotateY(0deg)';
        });
    });
    
    // Parallax backgrounds
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Contact forms functionality
function initializeContactForms() {
    const contactForms = document.querySelectorAll('form[data-contact-form]');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            try {
                // Show loading state
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="loading"></span> Sending...';
                
                // Get form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Add metadata
                data.timestamp = new Date().toISOString();
                data.source = 'website';
                data.page = window.location.pathname;
                
                // Send to Firebase
                const result = await FirebaseUtils.sendContactForm(data);
                
                if (result.success) {
                    showSuccessMessage(form, 'Thank you! We\'ll contact you soon.');
                    form.reset();
                    
                    analytics.logEvent('contact_form_success', {
                        form_type: data.type || 'contact'
                    });
                } else {
                    throw new Error(result.error || 'Failed to send message');
                }
                
            } catch (error) {
                console.error('Contact form error:', error);
                showErrorMessage(form, 'Sorry, there was an error. Please call (509) 308-6489.');
                
                analytics.logEvent('contact_form_error', {
                    error: error.message
                });
            } finally {
                // Restore button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    });
}

// Services Carousel
document.addEventListener('DOMContentLoaded', function() {
    const carouselTrack = document.getElementById('carousel-track');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const indicators = document.querySelectorAll('.indicator');
    const cards = document.querySelectorAll('.service-carousel-card');
    
    let currentSlide = 0;
    const totalSlides = cards.length; // Now 7 cards instead of 6
    let isTransitioning = false;
    
    // Auto-advance carousel with consistent timing
    let autoAdvanceInterval;
    const autoAdvanceDelay = 6000; // 6 seconds for better user experience
    
    function updateCarousel(smooth = true) {
        if (isTransitioning) return;
        
        isTransitioning = true;
        
        // Calculate the exact position
        const translateX = -currentSlide * 100;
        
        // Apply the transform
        if (carouselTrack) {
            carouselTrack.style.transform = `translateX(${translateX}%)`;
        }
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        // Update card active state
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentSlide);
        });
        
        // Reset transition flag after animation completes
        setTimeout(() => {
            isTransitioning = false;
        }, 600); // Match CSS transition duration
    }
    
    function nextSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    function goToSlide(slideIndex) {
        if (isTransitioning || slideIndex === currentSlide) return;
        currentSlide = slideIndex;
        updateCarousel();
    }
    
    // Event listeners with debouncing
    if (carouselNext) {
        carouselNext.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
            resetAutoAdvance();
        });
    }
    
    if (carouselPrev) {
        carouselPrev.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
            resetAutoAdvance();
        });
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            goToSlide(index);
            resetAutoAdvance();
        });
    });
    
    // Auto-advance functionality
    function startAutoAdvance() {
        autoAdvanceInterval = setInterval(() => {
            if (!isTransitioning) {
                nextSlide();
            }
        }, autoAdvanceDelay);
    }
    
    function stopAutoAdvance() {
        if (autoAdvanceInterval) {
            clearInterval(autoAdvanceInterval);
            autoAdvanceInterval = null;
        }
    }
    
    function resetAutoAdvance() {
        stopAutoAdvance();
        setTimeout(startAutoAdvance, 1500); // Longer delay for user interaction
    }
    
    // Pause auto-advance on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoAdvance);
        carouselContainer.addEventListener('mouseleave', () => {
            setTimeout(startAutoAdvance, 1000);
        });
    }
    
    // Enhanced touch/swipe support with better handling
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let touchStartTime = 0;
    
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            if (isTransitioning) return;
            
            startX = e.touches[0].clientX;
            touchStartTime = Date.now();
            isDragging = true;
            stopAutoAdvance();
        }, { passive: true });
        
        carouselContainer.addEventListener('touchmove', (e) => {
            if (!isDragging || isTransitioning) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        carouselContainer.addEventListener('touchend', () => {
            if (!isDragging || isTransitioning) return;
            
            const diffX = startX - currentX;
            const diffTime = Date.now() - touchStartTime;
            const threshold = 60;
            const speedThreshold = 400;
            
            if (Math.abs(diffX) > threshold && diffTime < speedThreshold) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            isDragging = false;
            setTimeout(startAutoAdvance, 2000);
        }, { passive: true });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isTransitioning) return;
        
        if (document.activeElement.closest('.carousel-container')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
                resetAutoAdvance();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                resetAutoAdvance();
            }
        }
    });
    
    // Initialize carousel
    if (carouselTrack && cards.length > 0) {
        // Ensure proper initial state
        updateCarousel(false);
        
        // Start auto-advance after page loads
        setTimeout(startAutoAdvance, 2000);
    }
    
    // Handle visibility changes to pause/resume auto-advance
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            stopAutoAdvance();
        } else if (document.visibilityState === 'visible') {
            setTimeout(startAutoAdvance, 1000);
        }
    });
});

// Utility functions
function showSuccessMessage(form, message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'form-message success';
    messageEl.textContent = message;
    form.insertAdjacentElement('afterend', messageEl);
    
    setTimeout(() => messageEl.remove(), 5000);
}

function showErrorMessage(form, message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'form-message error';
    messageEl.textContent = message;
    form.insertAdjacentElement('afterend', messageEl);
    
    setTimeout(() => messageEl.remove(), 5000);
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        analytics.logEvent('page_visible');
    } else {
        analytics.logEvent('page_hidden');
    }
});

// Handle errors globally
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    analytics.logEvent('javascript_error', {
        error_message: e.message,
        filename: e.filename,
        line_number: e.lineno
    });
});

// Performance monitoring
window.addEventListener('load', function() {
    setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        
        analytics.logEvent('page_performance', {
            load_time: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
            dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
            first_paint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0)
        });
    }, 1000);
});

// Export utilities for global access
window.MHConstructionApp = {
    loadProjects,
    loadBlogPosts,
    showSuccessMessage,
    showErrorMessage,
    initializeProjectFiltering
};
