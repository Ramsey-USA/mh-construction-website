// MH Construction - Contact Form Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    try {
        // Initialize all contact page components
        initializeContactForm();
        initializeChatTrigger();
        initializeFormValidation();
        initializeFormAnalytics();
        
        console.log('Contact page initialized successfully');
    } catch (error) {
        console.error('Error initializing contact page:', error);
    }
}

// Contact form handling
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleContactFormSubmission);
    
    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Add character counter for textarea
    const projectDescription = document.getElementById('projectDescription');
    if (projectDescription) {
        addCharacterCounter(projectDescription, 1000);
    }
}

async function handleContactFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Clear previous errors
    clearFormErrors(form);
    
    // Validate form
    if (!validateForm(form)) {
        showFormError('Please fill in all required fields correctly.');
        return;
    }
    
    try {
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<div class="loading"></div> Sending...';
        
        // Collect form data
        const formData = collectFormData(form);
        
        // Add metadata
        formData.timestamp = new Date().toISOString();
        formData.source = 'contact_page';
        formData.userAgent = navigator.userAgent;
        formData.pageUrl = window.location.href;
        
        // Submit to Firebase
        const result = await submitContactForm(formData);
        
        if (result.success) {
            showSuccessMessage('Thank you! Your request has been submitted. We\'ll contact you within 24 hours.');
            form.reset();
            
            // Track successful submission
            if (typeof analytics !== 'undefined') {
                analytics.logEvent('contact_form_submitted', {
                    project_type: formData.projectType,
                    project_size: formData.projectSize,
                    timeline: formData.timeline,
                    form_source: 'contact_page'
                });
            }
            
            // Redirect to thank you page after delay
            setTimeout(() => {
                window.location.href = 'thank-you.html';
            }, 3000);
            
        } else {
            throw new Error(result.error || 'Failed to submit form');
        }
        
    } catch (error) {
        console.error('Contact form submission error:', error);
        showFormError('Sorry, there was an error submitting your request. Please call us at (509) 308-6489.');
        
        // Track error
        if (typeof analytics !== 'undefined') {
            analytics.logEvent('contact_form_error', {
                error_message: error.message,
                form_source: 'contact_page'
            });
        }
    } finally {
        // Restore button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// Form data collection
function collectFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    // Get all form fields
    for (let [key, value] of formData.entries()) {
        if (key.includes('[]')) {
            // Handle checkbox arrays
            const cleanKey = key.replace('[]', '');
            if (!data[cleanKey]) data[cleanKey] = [];
            data[cleanKey].push(value);
        } else {
            data[key] = value;
        }
    }
    
    // Get checkbox values
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        if (checkbox.name.includes('[]')) {
            const key = checkbox.name.replace('[]', '');
            if (!data[key]) data[key] = [];
            data[key].push(checkbox.value);
        } else {
            data[checkbox.name] = checkbox.value;
        }
    });
    
    return data;
}

// Form validation
function validateForm(form) {
    let isValid = true;
    
    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = form.querySelector('#email');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Validate phone format
    const phoneField = form.querySelector('#phone');
    if (phoneField && phoneField.value) {
        const phoneRegex = /^[\d\s\-\+\(\)\.]+$/;
        if (!phoneRegex.test(phoneField.value) || phoneField.value.length < 10) {
            showFieldError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Clear previous error
    clearFieldError(field);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Specific field validations
    switch (field.type) {
        case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'tel':
            if (value && (!/^[\d\s\-\+\(\)\.]+$/.test(value) || value.length < 10)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
    }
    
    return true;
}

function showFieldError(field, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error
    field.parentNode.appendChild(errorElement);
    field.classList.add('error');
    
    // Add error styling to field
    field.style.borderColor = 'var(--accent-red)';
}

function clearFieldError(field) {
    if (typeof field === 'object' && field.target) {
        field = field.target;
    }
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    
    field.classList.remove('error');
    field.style.borderColor = '';
}

function clearFormErrors(form) {
    const errorElements = form.querySelectorAll('.field-error');
    errorElements.forEach(el => el.remove());
    
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
        field.style.borderColor = '';
    });
    
    // Clear form-level messages
    const existingMessages = form.parentNode.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
}

// Success and error messages
function showSuccessMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'form-message success';
    messageEl.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(messageEl, form);
    
    // Scroll to message
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 10000);
}

function showFormError(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'form-message error';
    messageEl.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(messageEl, form);
    
    // Scroll to message
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 8000);
}

// Character counter for textarea
function addCharacterCounter(textarea, maxLength) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.textContent = `0 / ${maxLength}`;
    
    textarea.parentNode.appendChild(counter);
    
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        counter.textContent = `${length} / ${maxLength}`;
        
        if (length > maxLength * 0.9) {
            counter.style.color = 'var(--accent-red)';
        } else if (length > maxLength * 0.7) {
            counter.style.color = 'var(--secondary-tan)';
        } else {
            counter.style.color = 'var(--gray-01)';
        }
        
        if (length > maxLength) {
            this.style.borderColor = 'var(--accent-red)';
        } else {
            this.style.borderColor = '';
        }
    });
}

// Chat trigger functionality
function initializeChatTrigger() {
    const chatTrigger = document.querySelector('.chat-trigger');
    if (chatTrigger) {
        chatTrigger.addEventListener('click', function() {
            // Open chatbot if available
            if (window.chatbot && typeof window.chatbot.toggleChatbot === 'function') {
                window.chatbot.toggleChatbot();
            } else {
                // Fallback to chatbot button
                const chatbotButton = document.getElementById('chatbot-button');
                if (chatbotButton) {
                    chatbotButton.click();
                }
            }
            
            // Track chat trigger usage
            if (typeof analytics !== 'undefined') {
                analytics.logEvent('chat_triggered_from_contact', {
                    trigger_location: 'contact_methods'
                });
            }
        });
    }
}

// Form analytics
function initializeFormAnalytics() {
    if (typeof analytics === 'undefined') return;
    
    // Track form field interactions
    const formFields = document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            analytics.logEvent('contact_form_field_focus', {
                field_name: this.name || this.id,
                field_type: this.type || this.tagName.toLowerCase()
            });
        });
    });
    
    // Track form abandonment
    let formStarted = false;
    let formCompleted = false;
    
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            if (!formStarted) {
                formStarted = true;
                analytics.logEvent('contact_form_started');
            }
        });
    });
    
    // Track page unload without form completion
    window.addEventListener('beforeunload', function() {
        if (formStarted && !formCompleted) {
            analytics.logEvent('contact_form_abandoned');
        }
    });
    
    // Track successful form completion
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function() {
            formCompleted = true;
        });
    }
}

// Submit form to backend
async function submitContactForm(formData) {
    try {
        // Try Firebase first
        if (typeof FirebaseUtils !== 'undefined') {
            const result = await FirebaseUtils.sendContactForm(formData);
            return result;
        }
        
        // Fallback to direct submission
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            return { success: true };
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Fallback: store in localStorage for later retry
        const submissionKey = `contact_submission_${Date.now()}`;
        localStorage.setItem(submissionKey, JSON.stringify(formData));
        
        return { 
            success: false, 
            error: error.message,
            stored: true 
        };
    }
}

// Auto-save form data to prevent loss
function initializeAutoSave() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const AUTOSAVE_KEY = 'mh_contact_form_autosave';
    
    // Load saved data
    const savedData = localStorage.getItem(AUTOSAVE_KEY);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            loadFormData(form, data);
        } catch (error) {
            console.error('Error loading saved form data:', error);
        }
    }
    
    // Save data on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            saveFormData(form, AUTOSAVE_KEY);
        });
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        localStorage.removeItem(AUTOSAVE_KEY);
    });
}

function saveFormData(form, key) {
    const data = {};
    const formData = new FormData(form);
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFormData(form, data) {
    Object.keys(data).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field) {
            field.value = data[key];
        }
    });
}

// Export functions for global access
window.ContactForm = {
    submitContactForm,
    validateForm,
    showSuccessMessage,
    showFormError,
    clearFormErrors
};

// Initialize auto-save after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeAutoSave();
});
