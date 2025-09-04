# mh-construction-website
# MH Construction Website Development - GitHub Project

## AI Development Instructions

This repository contains instructions for developing a professional website for MH Construction using HTML, CSS, and JavaScript. Follow these detailed specifications to create a modern, responsive, and user-friendly website.

## 🎯 Project Objectives

Create a professional construction company website that:
- Showcases MH Construction's services and expertise
- Provides excellent user experience across all devices
- Implements modern web development best practices
- Maintains fast loading times and accessibility standards
- Reflects the company's core values and professional image

## 📁 Required File Structure

Create the following directory structure in your GitHub repository:

```
mh-construction-website/
├── index.html
├── about.html
├── services.html
├── projects.html
├── contact.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── components.css
├── js/
│   ├── main.js
│   ├── navigation.js
│   ├── contact-form.js
│   └── gallery.js
├── images/
│   ├── hero/
│   ├── projects/
│   ├── team/
│   └── icons/
├── assets/
│   ├── fonts/
│   └── documents/
└── README.md
```

## 🏢 Company Information

### Basic Details
- **Company Name**: MH Construction
- **Tagline**: "Your Trusted General Contractor"
- **Slogan**: "Built Right The First Time"
- **Hero Message**: "Building Great Projects With Great People"

### Contact Information
- **Phone**: (509) 308-6489
- **Email**: office@mhc-gc.com
- **Address**: 3111 N Capitol Ave, Pasco, WA, 99301
- **Service Area**: Washington, Oregon, and Idaho

### Core Values
1. **Ethics** - Small-town values, honesty, transparency, accountability
2. **Experience** - Over 150 years of combined commercial construction experience
3. **Honesty** - Open communication, transparent pricing, delivering on promises
4. **Integrity** - Highest standards, accountability, fairness, respect
5. **Professionalism** - Reliable, calm under pressure, client-focused
6. **Trust** - Earned through clear communication and follow-through

### Services Offered
1. **Master Planning** - Detailed project planning from concept to finish
2. **Procurement** - Construction vendor management and material sourcing
3. **Constructability** - Collaboration with subcontractors for feasibility
4. **Budget Control** - Cost analysis and budget management
5. **Modularization** - Breaking projects into manageable subprojects
6. **Construction Services** - Full-service construction for various project types

### Target Markets
- Commercial Businesses
- Medical Facilities
- Religious Facilities
- Wineries & Vineyards
- Industrial Buildings
- Tenant Improvements
- Government Construction

## 🎨 Design Specifications

### Color Palette
```css
:root {
  --primary-blue: #2c5aa0;
  --secondary-blue: #1e3d6f;
  --accent-blue: #4a90e2;
  --white: #ffffff;
  --light-gray: #f8f9fa;
  --medium-gray: #6c757d;
  --dark-gray: #343a40;
  --success-green: #28a745;
}
```

### Typography
- **Primary Font**: 'Roboto', sans-serif
- **Secondary Font**: 'Open Sans', sans-serif
- **Heading Font**: 'Montserrat', sans-serif

### Responsive Breakpoints
```css
/* Mobile First Approach */
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--large-desktop: 1200px;
```

## 📄 Page-by-Page Development Instructions

### 1. Homepage (index.html)

#### Required Sections:
1. **Header/Navigation**
   - Logo (MH Construction with tagline)
   - Navigation menu: Home, About, Services, Projects, Contact
   - Mobile hamburger menu
   - Phone number prominently displayed

2. **Hero Section**
   - Full-width background image of construction site
   - Overlay with company name and "Building Great Projects With Great People"
   - Two CTA buttons: "Learn More" and "Contact Us"
   - Scroll indicator

3. **Company Introduction**
   - Headline: "Welcome to MH Construction - Built Right The First Time"
   - Brief description emphasizing client focus and quality
   - Key differentiators in bullet points or cards

4. **Services Overview**
   - Grid layout with 6 service cards
   - Icons for each service
   - Brief description and "Learn More" links

5. **Featured Projects**
   - 3-4 project showcases with images
   - Project categories and brief descriptions
   - "View All Projects" CTA

6. **Client Testimonials**
   - Rotating testimonial carousel
   - Include provided testimonials from Selah School District, NAC Architecture, Windermere

7. **Contact Section**
   - Contact form
   - Contact information
   - Service area map

8. **Footer**
   - Company information
   - Quick links
   - Social media links (if applicable)
   - Copyright notice

#### HTML Structure Example:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MH Construction - Your Trusted General Contractor</title>
    <meta name="description" content="MH Construction provides professional commercial and industrial construction services throughout Washington, Oregon, and Idaho. Built Right The First Time.">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
    <header class="header">
        <nav class="navbar">
            <!-- Navigation implementation -->
        </nav>
    </header>
    
    <main>
        <section class="hero">
            <!-- Hero section implementation -->
        </section>
        
        <section class="introduction">
            <!-- Company introduction -->
        </section>
        
        <!-- Additional sections -->
    </main>
    
    <footer class="footer">
        <!-- Footer implementation -->
    </footer>
    
    <script src="js/main.js"></script>
</body>
</html>
```

### 2. About Page (about.html)

#### Required Content:
1. **Page Header**
   - Hero image with "About MH Construction" overlay
   - Breadcrumb navigation

2. **Company Story**
   - "Building Lasting Relationships With Our Clients" headline
   - Detailed company description
   - Mission statement

3. **Core Values Section**
   - Six core values with detailed explanations
   - Visual icons or graphics for each value

4. **Team Section**
   - "Meet the MH Construction Team" headline
   - Placeholder for team member profiles
   - Include mention of "Trigger" the office dog

5. **Service Area**
   - Map showing Washington, Oregon, and Idaho
   - Description of service coverage

6. **Company Culture**
   - "Life at MH Construction" section
   - Focus on employee well-being and relationships

### 3. Services Page (services.html)

#### Required Content:
1. **Services Overview**
   - "What We Do" headline
   - Introduction paragraph

2. **Detailed Service Sections**
   - Six main services with detailed descriptions
   - Process explanations for each service
   - Benefits and outcomes

3. **Target Markets**
   - Visual grid of market sectors served
   - Brief descriptions of each market

4. **Process Overview**
   - Step-by-step construction process
   - Timeline expectations
   - Quality assurance measures

### 4. Projects Page (projects.html)

#### Required Content:
1. **Project Gallery**
   - Filterable project grid by category
   - High-quality project images
   - Project details on hover/click

2. **Project Categories**
   - Commercial Businesses
   - Medical Facilities
   - Religious Facilities
   - Wineries & Vineyards
   - Industrial Buildings
   - Government Projects

3. **Case Studies**
   - Detailed project showcases
   - Before/after photos
   - Project specifications and challenges

### 5. Contact Page (contact.html)

#### Required Content:
1. **Contact Information**
   - Phone: (509) 308-6489
   - Email: office@mhc-gc.com
   - Address: 3111 N Capitol Ave, Pasco, WA, 99301

2. **Contact Form**
   - Name, Company, Email, Phone fields
   - Service interest checkboxes
   - Message textarea
   - Form validation

3. **Location Map**
   - Embedded Google Maps
   - Office location marker

4. **Subcontractor Information**
   - Separate section for subcontractor inquiries
   - Link to subcontractor resources

## 💻 Technical Implementation Requirements

### HTML Requirements
- Use semantic HTML5 elements
- Implement proper heading hierarchy (h1, h2, h3)
- Include meta tags for SEO
- Add Open Graph tags for social media
- Ensure accessibility with ARIA labels
- Implement structured data markup

### CSS Requirements
- Mobile-first responsive design
- CSS Grid and Flexbox layouts
- CSS custom properties for theming
- Smooth transitions and animations
- Print stylesheet considerations
- Cross-browser compatibility

### JavaScript Requirements
- Vanilla JavaScript (no frameworks)
- Mobile navigation toggle
- Contact form validation
- Image gallery/lightbox
- Smooth scrolling
- Loading animations
- Performance optimization

### Performance Requirements
- Page load time under 3 seconds
- Optimized images (WebP format preferred)
- Minified CSS and JavaScript
- Lazy loading for images
- Efficient caching strategies

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios
- Alt text for all images
- Focus indicators

## 🔧 Development Guidelines

### Code Quality Standards
- Use consistent indentation (2 spaces)
- Follow semantic naming conventions
- Comment complex code sections
- Validate HTML and CSS
- Test across multiple browsers
- Optimize for search engines

### Git Workflow
- Create feature branches for each page/component
- Use descriptive commit messages
- Include README updates with changes
- Tag releases appropriately

### Testing Checklist
- [ ] Mobile responsiveness (320px to 1920px)
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Form functionality and validation
- [ ] Image optimization and loading
- [ ] Navigation functionality
- [ ] Accessibility compliance
- [ ] SEO optimization
- [ ] Performance metrics

## 📝 Content Guidelines

### Writing Style
- Professional yet approachable tone
- Client-focused messaging
- Clear and concise language
- Action-oriented calls-to-action
- Local SEO optimization

### Image Requirements
- High-resolution construction project photos
- Professional team headshots (when available)
- Local Tri-Cities area imagery
- Consistent image sizing and quality
- Proper alt text descriptions

### SEO Keywords
- General contractor Tri-Cities
- Commercial construction Washington
- Industrial construction Oregon Idaho
- Construction services Pasco WA
- Tenant improvements
- Medical facility construction
- Religious facility construction

## 🚀 Deployment Instructions

### GitHub Pages Setup
1. Enable GitHub Pages in repository settings
2. Set source to main branch
3. Configure custom domain if needed
4. Test deployment thoroughly

### File Optimization
- Compress images before upload
- Minify CSS and JavaScript files
- Optimize file sizes for web delivery
- Implement proper caching headers

## 📞 Client Testimonials to Include

**Shane Backlund, Superintendent - Selah School District:**
"I have had the privilege of working with a number of general contractors in my years as a superintendent. I can say, without reservation, that MH is amongst the best. I have been impressed with their ability to maintain momentum in the face of adversity and with their company's communication throughout. I would enjoy the opportunity to work with MH again and would welcome their participation on any future projects in Selah."

**Brent Harding, Principal Architect - NAC Architecture:**
"MH Construction's performance on the Lince Kindergarten project for Selah School District has been excellent. MH staff have been professional, and communication and timely processing of necessary construction correspondence has been consistent throughout the project. NAC Architecture would welcome MH on any of our projects."

**Keith Bjella, Windermere Tri-Cities:**
"MH did a tenant improvement for us last year and we couldn't be happier. They helped facilitate the process from initial design, permitting, and construction. Even with the large number of stakeholders at our company, MH handled everything in stride."

## ✅ Final Deliverables

Upon completion, the repository should contain:
- [ ] Fully functional 5-page website
- [ ] Responsive design across all devices
- [ ] Optimized images and assets
- [ ] Clean, validated code
- [ ] Comprehensive documentation
- [ ] Deployment-ready files
- [ ] Performance optimization
- [ ] Accessibility compliance

## 📋 Additional Notes

- Maintain consistency with MH Construction's brand identity
- Focus on user experience and conversion optimization
- Implement analytics tracking (Google Analytics)
- Consider future scalability and maintenance
- Document any custom functionality for future updates

This comprehensive guide provides all necessary information to develop a professional, effective website for MH Construction that meets modern web standards and business objectives.
