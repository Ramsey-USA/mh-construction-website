// Projects Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeProjectsPage();
});

async function initializeProjectsPage() {
    try {
        await Promise.all([
            initializeProjectFilters(),
            loadAllProjects(),
            initializeProjectSearch(),
            initializeProjectModal(),
            initializeStatsAnimation()
        ]);
    } catch (error) {
        console.error('Error initializing projects page:', error);
    }
}

let allProjects = [];
let filteredProjects = [];
let currentFilter = 'all';
let projectsPerPage = 12;
let currentPage = 1;

// Load all projects from Firebase
async function loadAllProjects() {
    try {
        const projectsGrid = document.getElementById('projects-grid-full');
        if (!projectsGrid) return;
        
        // Show loading state
        projectsGrid.innerHTML = '<div class="loading-projects">Loading projects...</div>';
        
        allProjects = await FirebaseUtils.getCollection(collections.projects);
        
        if (allProjects.length === 0) {
            projectsGrid.innerHTML = '<p class="no-projects">Projects will be added soon...</p>';
            return;
        }
        
        filteredProjects = [...allProjects];
        renderProjects();
        
    } catch (error) {
        console.error('Error loading projects:', error);
        const projectsGrid = document.getElementById('projects-grid-full');
        if (projectsGrid) {
            projectsGrid.innerHTML = '<p class="error-message">Unable to load projects. Please try again later.</p>';
        }
    }
}

// Render projects with pagination
function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid-full');
    if (!projectsGrid) return;
    
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const projectsToShow = filteredProjects.slice(0, endIndex);
    
    projectsGrid.innerHTML = projectsToShow.map(project => `
        <div class="project-card-full" data-category="${project.category}" data-project-id="${project.id}">
            <div class="project-image-container">
                <img src="${project.images?.[0] || 'images/placeholder-project.jpg'}" 
                     alt="${project.title}" 
                     class="project-image"
                     loading="lazy"
                     onerror="this.src='images/placeholder-project.jpg'">
                <div class="project-overlay">
                    <button class="view-project-btn" onclick="openProjectModal('${project.id}')">
                        View Details
                    </button>
                </div>
            </div>
            <div class="project-info">
                <span class="project-category">${project.category}</span>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <span class="project-location">📍 ${project.location}</span>
                    <span class="project-value">💰 ${project.value || 'Contact for details'}</span>
                    <span class="project-year">📅 ${project.year}</span>
                </div>
                <div class="project-specs">
                    ${project.specs ? project.specs.map(spec => 
                        `<span class="spec">${spec}</span>`
                    ).join('') : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Update load more button
    updateLoadMoreButton();
    
    // Add animation to new projects
    const projectCards = document.querySelectorAll('.project-card-full');
    projectCards.forEach((card, index) => {
        if (index >= startIndex) {
            card.style.animationDelay = `${(index - startIndex) * 0.1}s`;
            card.classList.add('animate-fade-in');
        }
    });
}

// Initialize project filtering
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            applyFilter(filter);
            
            // Reset pagination
            currentPage = 1;
            currentFilter = filter;
            
            // Log analytics
            analytics.logEvent('project_filter_used', {
                filter: filter,
                projects_shown: filteredProjects.length
            });
        });
    });
}

// Apply project filter
function applyFilter(filter) {
    if (filter === 'all') {
        filteredProjects = [...allProjects];
    } else {
        filteredProjects = allProjects.filter(project => 
            project.category.toLowerCase() === filter.toLowerCase()
        );
    }
    
    renderProjects();
}

// Initialize project search
function initializeProjectSearch() {
    const searchInput = document.getElementById('project-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (!searchInput || !searchBtn) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value);
        }, 300);
    });
    
    searchBtn.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
}

// Perform project search
function performSearch(query) {
    if (!query.trim()) {
        applyFilter(currentFilter);
        return;
    }
    
    const searchTerm = query.toLowerCase();
    filteredProjects = allProjects.filter(project => {
        return project.title.toLowerCase().includes(searchTerm) ||
               project.description.toLowerCase().includes(searchTerm) ||
               project.location.toLowerCase().includes(searchTerm) ||
               project.category.toLowerCase().includes(searchTerm);
    });
    
    currentPage = 1;
    renderProjects();
    
    // Log search analytics
    analytics.logEvent('project_search', {
        search_term: query,
        results_count: filteredProjects.length
    });
}

// Update load more button
function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;
    
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    
    if (currentPage >= totalPages) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.onclick = function() {
            currentPage++;
            renderProjects();
        };
    }
}

// Initialize project modal
function initializeProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    
    if (!modal || !modalOverlay || !modalClose) return;
    
    modalClose.addEventListener('click', closeProjectModal);
    modalOverlay.addEventListener('click', closeProjectModal);
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProjectModal();
        }
    });
}

// Open project modal
window.openProjectModal = async function(projectId) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;
    
    // Find project data
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;
    
    // Build modal content
    modalBody.innerHTML = `
        <div class="project-modal-header">
            <div class="project-modal-image">
                <img src="${project.images?.[0] || 'images/placeholder-project.jpg'}" 
                     alt="${project.title}"
                     onerror="this.src='images/placeholder-project.jpg'">
            </div>
            <div class="project-modal-info">
                <span class="project-modal-category">${project.category}</span>
                <h2>${project.title}</h2>
                <p class="project-modal-description">${project.description}</p>
                <div class="project-modal-specs">
                    ${project.specs ? project.specs.map(spec => 
                        `<span class="spec">${spec}</span>`
                    ).join('') : ''}
                </div>
            </div>
        </div>
        
        <div class="project-modal-body">
            <div class="project-details-grid">
                <div class="project-detail">
                    <h4>Location</h4>
                    <p>${project.location}</p>
                </div>
                <div class="project-detail">
                    <h4>Completion Year</h4>
                    <p>${project.year}</p>
                </div>
                <div class="project-detail">
                    <h4>Project Value</h4>
                    <p>${project.value || 'Contact for details'}</p>
                </div>
                <div class="project-detail">
                    <h4>Square Footage</h4>
                    <p>${project.squareFootage || 'N/A'}</p>
                </div>
            </div>
            
            ${project.fullDescription ? `
                <h3>Project Details</h3>
                <p>${project.fullDescription}</p>
            ` : ''}
            
            ${project.challenges ? `
                <h3>Challenges Overcome</h3>
                <ul>
                    ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                </ul>
            ` : ''}
            
            ${project.features ? `
                <h3>Key Features</h3>
                <ul>
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            ` : ''}
            
            ${project.testimonial ? `
                <div class="project-testimonial">
                    <blockquote>
                        <p>"${project.testimonial.quote}"</p>
                        <cite>— ${project.testimonial.author}, ${project.testimonial.title}</cite>
                    </blockquote>
                </div>
            ` : ''}
            
            <div class="project-modal-actions">
                <a href="contact.html" class="btn btn-primary">Start Similar Project</a>
                <button onclick="closeProjectModal()" class="btn btn-outline">Close</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Log analytics
    analytics.logEvent('project_modal_opened', {
        project_id: projectId,
        project_title: project.title,
        project_category: project.category
    });
};

// Close project modal
window.closeProjectModal = function() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Initialize statistics animation
function initializeStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Animate statistic numbers
function animateStatNumber(element) {
    const target = parseInt(element.dataset.count);
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

// Export functions for global access
window.ProjectsPage = {
    loadAllProjects,
    applyFilter,
    performSearch,
    openProjectModal,
    closeProjectModal
};
