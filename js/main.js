// MH Construction - Main JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeApp();
});

async function initializeApp() {
    try {
        // Show loading state
        showLoadingState();
        
        // Initialize components
        await Promise.all([
            initializeNavigation(),
            initializeHero(),
            loadProjects(),
            loadBlogPosts(),
            loadClientLogos(),
            loadAwards(),
            initializeAnimations(),
            initializeScrollEffects(),
            initializeContactForms()
        ]);
        
        // Hide loading state
        hideLoadingState();
        
        // Log page view
        analytics.logEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
        
    } catch (error) {
        console.error('Error initializing app:', error);
        hideLoadingState();
    }
}

function showLoadingState() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <img src="images/logo.png" alt="MH Construction" onerror="this.style.display='none'">
            </div>
            <div class="loading-spinner"></div>
            <p>Loading MH Construction...</p>
        </div>
    `;
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(57, 104, 81, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        text-align: center;
    `;
    document.body.appendChild(loadingOverlay);
}

function hideLoadingState() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.remove();
        }, 300);
    }
}

// Navigation functionality
async function initializeNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
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
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger lines
            const lines = navToggle.querySelectorAll('.hamburger-line');
            lines.forEach((line, index) => {
                line.style.transform = navToggle.classList.contains('active') 
                    ? `rotate(${index === 0 ? 45 : index === 1 ? 0 : -45}deg) translate(${index === 1 ? '100px' : '0'}, ${index === 0 ? '7px' : index === 2 ? '-7px' : '0'})`
                    : 'none';
                line.style.opacity = index === 1 && navToggle.classList.contains('active') ? '0' : '1';
            });
            
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
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
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
        });
    });
}

// Hero section functionality
function initializeHero() {
    const hero = document.getElementById('hero');
    const heroVideo = hero?.querySelector('video');
    
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
    
    // Parallax effect for hero content
    window.addEventListener('scroll', function() {
        if (window.innerWidth > 768) {
            const scrolled = window.pageYOffset;
            const parallax = hero?.querySelector('.hero-content');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }
    });
}

// Load projects from Firebase
async function loadProjects() {
    try {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;
        
        const projects = await FirebaseUtils.getCollection(collections.projects);
        
        if (projects.length === 0) {
            projectsGrid.innerHTML = '<p class="no-projects">Projects coming soon...</p>';
            return;
        }
        
        // Show featured projects (limit to 6 for homepage)
        const featuredProjects = projects.filter(p => p.featured).slice(0, 6);
        
        projectsGrid.innerHTML = featuredProjects.map(project => `
            <div class="project-card" data-category="${project.category}">
                <img src="${project.images?.[0] || 'images/placeholder-project.jpg'}" 
                     alt="${project.title}" 
                     class="project-image"
                     loading="lazy"
                     onerror="this.src='images/placeholder-project.jpg'">
                <div class="project-info">
                    <span class="project-category">${project.category}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-meta">
                        <span class="project-location">${project.location}</span>
                        <span class="project-year">${project.year}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Initialize project filtering
        initializeProjectFiltering();
        
    } catch (error) {
        console.error('Error loading projects:', error);
        const projectsGrid = document.getElementById('projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = '<p class="error-message">Unable to load projects. Please try again later.</p>';
        }
    }
}

// Project filtering functionality
function initializeProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.dataset.category;
                const shouldShow = filter === 'all' || category === filter;
                
                card.style.display = shouldShow ? 'block' : 'none';
                
                if (shouldShow) {
                    card.style.animation = 'fadeIn 0.5s ease-in-out';
                }
            });
            
            // Log filter usage
            analytics.logEvent('project_filter_used', {
                filter: filter,
                projects_shown: document.querySelectorAll('.project-card[style*="block"]').length
            });
        });
    });
}

// Load blog posts from Firebase
async function loadBlogPosts() {
    try {
        const blogCarousel = document.getElementById('blog-carousel');
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
    const totalSlides = cards.length;
    let isTransitioning = false; // Prevent rapid clicking
    
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
