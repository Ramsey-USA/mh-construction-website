// MH Construction - Project Gallery Functionality

class ProjectGallery {
    constructor() {
        this.projects = [];
        this.currentFilter = 'all';
        this.projectsGrid = document.getElementById('projects-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.init();
    }

    async init() {
        try {
            await this.loadProjectsFromFirebase();
            this.setupFilterButtons();
            this.renderProjects();
        } catch (error) {
            console.error('Error initializing project gallery:', error);
            this.loadSampleProjects(); // Fallback to sample data
        }
    }

    async loadProjectsFromFirebase() {
        try {
            const db = firebase.firestore();
            const projectsSnapshot = await db.collection('projects')
                .where('status', '==', 'published')
                .orderBy('completedDate', 'desc')
                .get();

            this.projects = projectsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log(`Loaded ${this.projects.length} projects from Firebase`);
        } catch (error) {
            console.error('Error loading projects from Firebase:', error);
            throw error;
        }
    }

    loadSampleProjects() {
        // Sample projects for development/fallback
        this.projects = [
            {
                id: 'commercial-office-complex',
                title: 'Modern Office Complex',
                category: 'commercial',
                image: 'images/projects/commercial-office.jpg',
                description: 'A state-of-the-art 50,000 sq ft office complex featuring sustainable design and modern amenities.',
                completedDate: '2024-01-15',
                location: 'Seattle, WA',
                size: '50,000 sq ft',
                duration: '18 months'
            },
            {
                id: 'medical-clinic-expansion',
                title: 'Regional Medical Clinic',
                category: 'medical',
                image: 'images/projects/medical-clinic.jpg',
                description: 'Expansion and renovation of a regional medical facility with specialized treatment rooms.',
                completedDate: '2023-12-10',
                location: 'Portland, OR',
                size: '25,000 sq ft',
                duration: '12 months'
            },
            {
                id: 'church-community-center',
                title: 'Community Faith Center',
                category: 'religious',
                image: 'images/projects/church-center.jpg',
                description: 'New construction of a multi-purpose community and worship center.',
                completedDate: '2023-11-20',
                location: 'Boise, ID',
                size: '15,000 sq ft',
                duration: '14 months'
            },
            {
                id: 'vineyard-tasting-room',
                title: 'Boutique Winery Facility',
                category: 'winery',
                image: 'images/projects/winery-facility.jpg',
                description: 'Custom winery with tasting room, production facility, and barrel storage.',
                completedDate: '2023-10-05',
                location: 'Walla Walla, WA',
                size: '12,000 sq ft',
                duration: '10 months'
            },
            {
                id: 'manufacturing-warehouse',
                title: 'Industrial Manufacturing Plant',
                category: 'industrial',
                image: 'images/projects/manufacturing-plant.jpg',
                description: 'Large-scale manufacturing facility with specialized equipment and workflow design.',
                completedDate: '2023-09-15',
                location: 'Spokane, WA',
                size: '80,000 sq ft',
                duration: '24 months'
            },
            {
                id: 'retail-buildout',
                title: 'Retail Space Renovation',
                category: 'tenant',
                image: 'images/projects/retail-buildout.jpg',
                description: 'Complete tenant improvement for a high-end retail space in downtown core.',
                completedDate: '2023-08-30',
                location: 'Portland, OR',
                size: '8,000 sq ft',
                duration: '6 months'
            }
        ];
    }

    setupFilterButtons() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all buttons
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Set current filter
                this.currentFilter = button.dataset.filter;
                
                // Render filtered projects
                this.renderProjects();
            });
        });
    }

    renderProjects() {
        if (!this.projectsGrid) {
            console.error('Projects grid element not found');
            return;
        }

        // Filter projects based on current filter
        const filteredProjects = this.currentFilter === 'all' 
            ? this.projects 
            : this.projects.filter(project => project.category === this.currentFilter);

        // Clear existing content
        this.projectsGrid.innerHTML = '';

        // Render filtered projects
        filteredProjects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            this.projectsGrid.appendChild(projectCard);
        });

        // Add animation to newly rendered cards
        this.animateCards();
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.category = project.category;
        
        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">
            <div class="project-info">
                <span class="project-category">${this.formatCategory(project.category)}</span>
                <h3 class="project-title">${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-specs">
                    <span class="spec">📍 ${project.location}</span>
                    <span class="spec">📐 ${project.size}</span>
                    <span class="spec">⏱️ ${project.duration}</span>
                </div>
                <button class="btn btn-outline view-project" onclick="projectGallery.openProjectModal('${project.id}')">
                    View Details
                </button>
            </div>
        `;

        return card;
    }

    formatCategory(category) {
        const categoryMap = {
            'commercial': 'Commercial',
            'medical': 'Medical',
            'religious': 'Religious',
            'winery': 'Winery',
            'industrial': 'Industrial',
            'tenant': 'Tenant Improvement'
        };
        return categoryMap[category] || category;
    }

    animateCards() {
        const cards = this.projectsGrid.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    openProjectModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) {
            console.error('Project not found:', projectId);
            return;
        }

        // Create and show modal with project details
        this.showProjectModal(project);
    }

    showProjectModal(project) {
        // Create modal HTML
        const modalHTML = `
            <div class="project-modal" id="project-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${project.title}</h2>
                        <button class="modal-close" onclick="projectGallery.closeProjectModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="project-modal-header">
                            <img src="${project.image}" alt="${project.title}" class="project-modal-image">
                            <div class="project-details">
                                <span class="project-modal-category">${this.formatCategory(project.category)}</span>
                                <h3>${project.title}</h3>
                                <p><strong>Location:</strong> ${project.location}</p>
                                <p><strong>Size:</strong> ${project.size}</p>
                                <p><strong>Duration:</strong> ${project.duration}</p>
                                <p><strong>Completed:</strong> ${new Date(project.completedDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div class="project-modal-body">
                            <h3>Project Overview</h3>
                            <p>${project.description}</p>
                            ${project.features ? `
                                <h3>Key Features</h3>
                                <ul>
                                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                            ` : ''}
                            ${project.testimonial ? `
                                <div class="project-testimonial">
                                    <h3>Client Testimonial</h3>
                                    <blockquote>
                                        <p>"${project.testimonial.quote}"</p>
                                        <cite>— ${project.testimonial.author}, ${project.testimonial.title}</cite>
                                    </blockquote>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = document.getElementById('project-modal');
        modal.style.display = 'flex';
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeProjectModal() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.remove();
        }
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
    }
}

// Initialize project gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a page with projects
    if (document.getElementById('projects-grid')) {
        window.projectGallery = new ProjectGallery();
    }
});
