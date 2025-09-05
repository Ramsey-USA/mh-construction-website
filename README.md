mh-construction-website
MH Construction Website Development - GitHub Project
AI Development Instructions
This repository contains instructions for developing a professional website for MH Construction using HTML, CSS, JavaScript, Firebase, and Google APIs. Follow these detailed specifications to create a modern, responsive, and user-friendly website with integrated backend services and AI-powered chatbot functionality.

Project Overview: This project is the official website for MH Construction, a veteran-owned company committed to building with honesty, integrity, and trust. The website is designed to be an immersive and engaging experience, showcasing our expertise and dedication to our clients.
🎯 Project Objectives
Create a professional construction company website that:

Showcases MH Construction's services and expertise
Provides excellent user experience across all devices
Implements modern web development best practices with Firebase backend
Features a prominent AI-powered chatbot for project consultation
Maintains fast loading times and accessibility standards
Reflects the company's core values and professional image
Integrates Google APIs for enhanced functionality
🔥 Firebase & Google API Integration Requirements
Firebase Services to Implement
// Required Firebase Services

- Firebase Authentication (for admin/client portals)

- Cloud Firestore (for project data, testimonials, blog posts)

- Firebase Storage (for project images, documents)

- Firebase Hosting (for deployment)

- Cloud Functions (for form processing, email notifications)

- Firebase Analytics (for user behavior tracking)
Google APIs Integration
// Required Google APIs

- Google Maps API (for service area visualization)

- Google Places API (for location services)

- Google reCAPTCHA v3 (for form security)

- Google Analytics 4 (for advanced tracking)

- Google Search Console API (for SEO monitoring)

- Gmail API (for contact form email processing)
Firebase Configuration
// firebase-config.js

const firebaseConfig = {

  apiKey: "your-api-key",

  authDomain: "mh-construction.firebaseapp.com",

  projectId: "mh-construction",

  storageBucket: "mh-construction.appspot.com",

  messagingSenderId: "your-sender-id",

  appId: "your-app-id",

  measurementId: "your-measurement-id"

};
🤖 AI Chatbot Requirements - PROMINENT FEATURE
Chatbot Specifications
The chatbot must be a prominent, always-visible feature that provides construction project consultation and advice.
Visual Requirements
Position: Fixed floating button in bottom-right corner
Size: 60px x 60px minimum, expandable to 400px x 600px chat window
Colors: Primary green (#396851) with secondary tan (#BD9264) accents
Icon: Construction helmet or chat bubble with MH logo
Animation: Subtle pulse animation to draw attention
Z-index: 9999 to ensure always on top
Functionality Requirements
// Chatbot Core Features

- Real-time construction project consultation

- Cost estimation guidance

- Service recommendations based on project type

- FAQ responses about MH Construction services

- Lead capture and contact information collection

- Integration with Firebase for conversation logging

- Handoff to human representatives during business hours
Chatbot Knowledge Base
The chatbot should be trained on:

MH Construction services and capabilities
Construction industry best practices
Cost estimation guidelines
Project timeline expectations
Permit and regulatory information for WA, OR, ID
Company policies and procedures
Common construction terminology and processes
Implementation Options
Custom AI Integration (Recommended)

OpenAI GPT API integration
Custom training on MH Construction data
Firebase Functions for backend processing

Third-party Solutions

Dialogflow integration with Google Cloud
Microsoft Bot Framework
Rasa Open Source
Chatbot UI/UX Requirements
/* Chatbot Styling Requirements */

.chatbot-container {

  position: fixed;

  bottom: 20px;

  right: 20px;

  z-index: 9999;

  font-family: 'Inter', sans-serif;

}

.chatbot-button {

  width: 60px;

  height: 60px;

  background: var(--primary-green);

  border-radius: 50%;

  box-shadow: 0 4px 12px rgba(57, 104, 81, 0.3);

  animation: pulse 2s infinite;

}

.chatbot-window {

  width: 400px;

  height: 600px;

  background: white;

  border-radius: 12px;

  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);

}
📁 Updated File Structure
mh-construction-website/

├── index.html

├── about.html

├── services.html

├── projects.html

├── contact.html

├── css/

│   ├── style.css

│   ├── responsive.css

│   ├── components.css

│   └── chatbot.css

├── js/

│   ├── main.js

│   ├── navigation.js

│   ├── contact-form.js

│   ├── gallery.js

│   ├── firebase-config.js

│   ├── firebase-functions.js

│   └── chatbot.js

├── images/

│   ├── hero/

│   ├── projects/

│   ├── team/

│   ├── icons/

│   └── chatbot/

├── assets/

│   ├── fonts/

│   └── documents/

├── firebase/

│   ├── functions/

│   ├── firestore.rules

│   └── storage.rules

└── README.md
🏢 Company Information
Basic Details
Company Name: MH Construction
Tagline: "Your Trusted General Contractor"
Slogan: "Built Right The First Time"
Hero Message: "Building Great Projects With Great People"
Contact Information
Phone: (509) 308-6489
Email: office@mhc-gc.com
Address: 3111 N Capitol Ave, Pasco, WA, 99301
Service Area: Washington, Oregon, and Idaho
Core Values
Ethics - Small-town values, honesty, transparency, accountability
Experience - Over 150 years of combined commercial construction experience
Honesty - Open communication, transparent pricing, delivering on promises
Integrity - Highest standards, accountability, fairness, respect
Professionalism - Reliable, calm under pressure, client-focused
Trust - Earned through clear communication and follow-through
Services Offered
Master Planning - Detailed project planning from concept to finish
Procurement - Construction vendor management and material sourcing
Constructability - Collaboration with subcontractors for feasibility
Budget Control - Cost analysis and budget management
Modularization - Breaking projects into manageable subprojects
Construction Services - Full-service construction for various project types
Target Markets
Commercial Businesses
Medical Facilities
Religious Facilities
Wineries & Vineyards
Industrial Buildings
Tenant Improvements
Government Construction
🎨 Design Specifications
Color Palette
:root {

  --primary-green: #396851;

  --secondary-tan: #BD9264;

  --accent-red: #ff0000;

  --white: #ffffff;

  --light-gray: #f8f9fa;

  --medium-gray: #6c757d;

  --dark-gray: #343a40;

  --success-green: #28a745;

  --chatbot-primary: #396851;

  --chatbot-secondary: #BD9264;

  --chatbot-text: #333333;

  --chatbot-bg: #ffffff;

}
Typography
/* Primary Font Stack */

font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

/* Font Sizes */

--font-size-h1: 3.5rem;

--font-size-h2: 2.5rem;

--font-size-h3: 2rem;

--font-size-h4: 1.5rem;

--font-size-body: 1rem;

--font-size-small: 0.875rem;

--font-size-chatbot: 0.9rem;

/* Font Weights */

--font-weight-light: 300;

--font-weight-regular: 400;

--font-weight-medium: 500;

--font-weight-semibold: 600;

--font-weight-bold: 700;
Layout Guidelines
Container Max Width: 1200px
Grid System: CSS Grid and Flexbox
Spacing Scale: 8px base unit (8px, 16px, 24px, 32px, 48px, 64px)
Border Radius: 8px for cards, 4px for buttons, 12px for chatbot
Box Shadow: 0 4px 6px rgba(0, 0, 0, 0.1) for cards
Chatbot Shadow: 0 8px 32px rgba(0, 0, 0, 0.15)
🛠️ Technical Requirements
HTML Structure
Semantic HTML5 elements
Proper heading hierarchy (h1-h6)
Alt text for all images
ARIA labels for accessibility
Meta tags for SEO optimization
Chatbot accessibility compliance
CSS Requirements
Mobile-first responsive design
CSS Grid and Flexbox layouts
CSS custom properties (variables)
Smooth transitions and animations
Print-friendly styles
Chatbot responsive design
JavaScript Functionality
Smooth scrolling navigation
Mobile menu toggle
Form validation and submission
Image gallery/lightbox
Loading animations
Contact form processing
Firebase integration
Google APIs integration
AI Chatbot functionality
Firebase Functions Required
// Cloud Functions to implement

exports.sendContactEmail = functions.https.onCall(async (data, context) => {

  // Process contact form submissions

});

exports.processChatbotQuery = functions.https.onCall(async (data, context) => {

  // Handle chatbot AI processing

});

exports.saveProjectInquiry = functions.https.onCall(async (data, context) => {

  // Save project inquiries to Firestore

});
📱 Responsive Breakpoints
/* Mobile First Approach */

/* Small devices (landscape phones, 576px and up) */

@media (min-width: 576px) { 

  .chatbot-window { width: 350px; height: 500px; }

}

/* Medium devices (tablets, 768px and up) */

@media (min-width: 768px) { 

  .chatbot-window { width: 400px; height: 600px; }

}

/* Large devices (desktops, 992px and up) */

@media (min-width: 992px) { ... }

/* Extra large devices (large desktops, 1200px and up) */

@media (min-width: 1200px) { ... }
🏗️ Page Structure Requirements
Homepage (index.html)
Header Navigation

Logo
"Veteran Owned" button directed to About Page (Experience Section)
Main navigation will be a hamburger menu on all platform sizes

Hero Section

Large background video
Company tagline and hero message
Call-to-action button
Contact phone number

Awards Section

Grid layout of recent awards (3)
"Learn More" button present

Services Overview | About

Who We Serve brief description
Links to detailed service pages via dropdown menu - 6
"Learn More" button that directs to About page

Project Showcase

Featured project images - 6
Project categories filter - 6 total
Link to full portfolio

Core Values Section

Six core values with icons
Icons will flip with descriptions on the back
Brief descriptions for each value

Blog

Carousel with clickable links to article or page
Company logos of past clients

Footer

Company areas of operation
Quick links
Social media links
Copyright information

AI Chatbot (Always Present)

Fixed floating position
Prominent visual design
Instant project consultation
Lead capture functionality
About Page (about.html)
Company history and background
Leadership team profiles
Mission, vision, and values
Company achievements and certifications
Why choose MH Construction
Chatbot integration for company questions
Services Page (services.html)
Detailed service descriptions
Service process workflow
Industry expertise
Service area coverage
Request quote form
"Learn More" button directed to About Page
Chatbot for service-specific questions
Projects Page (projects.html)
Project portfolio gallery (Firebase Storage integration)
Filter by project type
Case studies with before/after images
Project details and specifications
Client testimonials
Chatbot for project consultation
Contact Page (contact.html)
Detailed contact form (Firebase integration)
Office location and hours
Service area map (Google Maps API)
Multiple contact methods
Request consultation form
Enhanced chatbot for immediate assistance
🎯 Key Features to Implement
Navigation
Sticky header navigation
Smooth scrolling to sections
Active page/section highlighting
Mobile-responsive hamburger menu
Breadcrumb navigation on sub-pages
Interactive Elements
Hover effects on buttons and cards
Animated counters for statistics
Image galleries with lightbox
Accordion FAQ sections
Tabbed content areas
AI Chatbot interactions
Forms (Firebase Integration)
Contact form with validation and Firebase processing
Quote request form with file upload to Firebase Storage
Newsletter signup with Firestore database
File upload for project documents
Success/error message handling
Chatbot lead capture forms
Performance Optimization
Optimized images (WebP format when possible)
Lazy loading for images
Minified CSS and JavaScript
Compressed file sizes
Fast loading times (<3 seconds)
Firebase CDN optimization
🤖 Chatbot Implementation Details
Required Chatbot Features
Always Visible: Fixed position, never hidden
Project Consultation: AI-powered construction advice
Cost Estimation: Preliminary project cost guidance
Service Matching: Recommend appropriate MH services
Lead Capture: Collect contact information seamlessly
Business Hours Integration: Handoff to human representatives
Conversation Logging: Save all interactions to Firebase
Mobile Optimized: Responsive design for all devices
Chatbot Conversation Flow
1. Welcome Message: "Hi! I'm MH Construction's AI assistant. How can I help with your construction project?"

2. Project Type Inquiry: "What type of project are you planning?"

3. Scope Assessment: "Can you tell me more about the scope and timeline?"

4. Preliminary Guidance: Provide relevant advice and cost estimates

5. Lead Capture: "Would you like to speak with our team? Let me get your contact information."

6. Handoff: "I've scheduled a consultation. Our team will contact you within 24 hours."
Integration Code Example
// chatbot.js

class MHConstructionChatbot {

  constructor() {

    this.firebase = firebase;

    this.isOpen = false;

    this.conversations = [];

    this.init();

  }

  init() {

    this.createChatbotUI();

    this.bindEvents();

    this.loadAIModel();

  }

  createChatbotUI() {

    // Create prominent floating chatbot interface

  }

  processUserMessage(message) {

    // AI processing with construction-specific responses

  }

  captureLeadInformation(userData) {

    // Save to Firebase Firestore

  }

}
🔧 Development Guidelines
Code Quality Standards
Clean, readable code with comments
Consistent naming conventions
Proper indentation and formatting
Cross-browser compatibility
W3C validation compliance
Firebase best practices
Chatbot accessibility compliance
SEO Requirements
Descriptive page titles and meta descriptions
Structured data markup (Schema.org)
Optimized URLs and heading structure
Image alt text and file names
Internal linking strategy
Firebase SEO optimization
Accessibility Standards
WCAG 2.1 AA compliance
Keyboard navigation support
Screen reader compatibility
Color contrast requirements
Focus indicators for interactive elements
Chatbot accessibility features
🚀 Deployment Instructions
Firebase Setup
Create Firebase project
Enable required services (Auth, Firestore, Storage, Functions)
Configure Google APIs
Deploy Cloud Functions
Set up Firebase Hosting
Local Development
Install Firebase CLI: npm install -g firebase-tools
Clone the repository
Run firebase login
Run firebase serve for local testing
Test chatbot functionality
Test on multiple devices and browsers
Production Deployment
# Firebase deployment commands

firebase deploy --only hosting

firebase deploy --only functions

firebase deploy --only firestore:rules

firebase deploy --only storage:rules
📊 Analytics and Tracking
Firebase Analytics Integration
User behavior tracking
Chatbot interaction analytics
Conversion tracking
Performance monitoring
Google APIs Tracking
Google Analytics 4 integration
Search Console monitoring
Maps API usage tracking
reCAPTCHA analytics
🔒 Security Considerations
Firebase Security
Firestore security rules
Storage security rules
Authentication requirements
API key protection
General Security
Form spam protection (reCAPTCHA v3)
Input sanitization and validation
HTTPS implementation
Regular security updates
Backup procedures
Chatbot data privacy compliance
📞 Support and Maintenance
Regular Updates Required
Content updates (projects, testimonials)
Security patches and updates
Performance monitoring
SEO optimization
Mobile compatibility testing
Chatbot AI model updates
Firebase service monitoring
Monitoring Requirements
Firebase performance monitoring
Chatbot conversation quality assessment
Google API usage monitoring
User experience analytics
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🙏 Acknowledgments
Design inspiration from industry-leading construction websites
Modern web development best practices
Accessibility guidelines from WCAG
Performance optimization techniques
Firebase and Google Cloud best practices
AI chatbot development standards



Built with precision and care for MH Construction - "Building Great Projects With Great People"

Key Focus: Prominent AI Chatbot + Firebase/Google API Integration

For questions or support, contact MH Construction at (509) 308-6489 or office@mhc-gc.com
