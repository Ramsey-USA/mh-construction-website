// MH Construction AI Chatbot Implementation

class MHConstructionChatbot {
  constructor() {
    this.isOpen = false;
    this.conversations = [];
    this.currentConversationId = null;
    this.isTyping = false;
    this.leadCaptured = false;
    this.businessHours = {
      start: 8, // 8 AM
      end: 17,  // 5 PM
      timezone: 'America/Los_Angeles'
    };
    
    this.init();
  }

  init() {
    this.createChatbotUI();
    this.bindEvents();
    this.loadWelcomeMessage();
    this.initializeConversation();
  }

  createChatbotUI() {
    const chatbotHTML = `
      <div class="chatbot-container" id="chatbot-container">
        <button class="chatbot-button" id="chatbot-button" aria-label="Open AI Construction Assistant">
          <i class="icon-chat">💬</i>
        </button>
        
        <div class="chatbot-window" id="chatbot-window">
          <div class="chatbot-header">
            <div class="chatbot-avatar">
              <img src="images/chatbot/mh-avatar.png" alt="MH Assistant" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzM5Njg1MSIvPjx0ZXh0IHg9IjIwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TUg8L3RleHQ+PC9zdmc+'">
            </div>
            <div class="chatbot-title">
              <h3>MH Construction AI</h3>
              <span class="chatbot-status">Online</span>
            </div>
            <button class="chatbot-close" id="chatbot-close" aria-label="Close Chat">
              <i class="icon-close">✕</i>
            </button>
          </div>
          
          <div class="chatbot-messages" id="chatbot-messages">
            <!-- Messages will be added dynamically -->
          </div>
          
          <div class="chatbot-input">
            <input type="text" id="chatbot-input" placeholder="Type your question..." autocomplete="off" maxlength="500">
            <button id="chatbot-send" aria-label="Send Message">
              <i class="icon-send">➤</i>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  bindEvents() {
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');

    chatbotButton.addEventListener('click', () => this.toggleChatbot());
    chatbotClose.addEventListener('click', () => this.closeChatbot());
    chatbotSend.addEventListener('click', () => this.sendMessage());
    
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    chatbotInput.addEventListener('input', () => {
      this.handleTypingIndicator();
    });

    // Track chatbot interactions
    chatbotButton.addEventListener('click', () => {
      analytics.logEvent('chatbot_opened', {
        timestamp: new Date().toISOString()
      });
    });
  }

  toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotButton = document.getElementById('chatbot-button');
    
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      chatbotWindow.classList.add('open');
      chatbotButton.style.transform = 'scale(0.9)';
      document.getElementById('chatbot-input').focus();
      
      // Mark as viewed
      if (!this.hasBeenOpened) {
        this.hasBeenOpened = true;
        analytics.logEvent('chatbot_first_open', {
          timestamp: new Date().toISOString()
        });
      }
    } else {
      chatbotWindow.classList.remove('open');
      chatbotButton.style.transform = 'scale(1)';
    }
  }

  closeChatbot() {
    this.isOpen = false;
    document.getElementById('chatbot-window').classList.remove('open');
    document.getElementById('chatbot-button').style.transform = 'scale(1)';
  }

  async sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message || this.isTyping) return;
    
    // Clear input and disable send button
    input.value = '';
    this.setSendButtonState(false);
    
    // Add user message
    this.addMessage(message, 'user');
    
    // Show typing indicator
    this.showTypingIndicator();
    
    try {
      // Process message with AI
      const response = await this.processMessage(message);
      
      // Remove typing indicator
      this.hideTypingIndicator();
      
      // Add bot response
      this.addMessage(response.message, 'bot');
      
      // Handle special actions
      if (response.action) {
        await this.handleBotAction(response.action);
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      this.hideTypingIndicator();
      this.addMessage(
        'I apologize, but I\'m experiencing technical difficulties. Please call us at (509) 308-6489 for immediate assistance.',
        'bot'
      );
    }
    
    this.setSendButtonState(true);
  }

  async processMessage(message) {
    try {
      // Call Firebase Cloud Function for AI processing
      const result = await processChatbotQuery({
        message: message,
        conversationId: this.currentConversationId,
        context: this.getConversationContext(),
        timestamp: new Date().toISOString()
      });
      
      // Log the interaction
      analytics.logEvent('chatbot_message_sent', {
        conversation_id: this.currentConversationId,
        message_length: message.length,
        response_type: result.data.type || 'general'
      });
      
      return result.data;
      
    } catch (error) {
      console.error('AI processing error:', error);
      
      // Fallback to local processing
      return this.processMessageLocally(message);
    }
  }

  processMessageLocally(message) {
    const lowerMessage = message.toLowerCase();
    
    // Construction project types
    if (lowerMessage.includes('commercial') || lowerMessage.includes('office')) {
      return {
        message: "Commercial construction is one of our specialties! We handle office buildings, retail spaces, and mixed-use developments. What type of commercial project are you planning?",
        action: { type: 'show_services', category: 'commercial' }
      };
    }
    
    if (lowerMessage.includes('medical') || lowerMessage.includes('healthcare')) {
      return {
        message: "We have extensive experience with medical facilities, including clinics, medical offices, and specialized healthcare buildings. These projects require specific compliance with healthcare regulations. What's your project scope?",
        action: { type: 'show_services', category: 'medical' }
      };
    }
    
    if (lowerMessage.includes('church') || lowerMessage.includes('religious')) {
      return {
        message: "Religious facilities are close to our hearts. We've built churches, community centers, and worship spaces with careful attention to acoustics and spiritual atmosphere. Tell me about your vision.",
        action: { type: 'show_services', category: 'religious' }
      };
    }
    
    if (lowerMessage.includes('winery') || lowerMessage.includes('wine') || lowerMessage.includes('vineyard')) {
      return {
        message: "Winery construction requires specialized knowledge of production workflows and climate control. We're experienced with tasting rooms, production facilities, and barrel storage. What's your winery project?",
        action: { type: 'show_services', category: 'winery' }
      };
    }
    
    if (lowerMessage.includes('industrial') || lowerMessage.includes('warehouse') || lowerMessage.includes('manufacturing')) {
      return {
        message: "Industrial construction demands precision and efficiency. We build warehouses, manufacturing facilities, and distribution centers. What type of industrial facility do you need?",
        action: { type: 'show_services', category: 'industrial' }
      };
    }
    
    if (lowerMessage.includes('tenant improvement') || lowerMessage.includes('renovation') || lowerMessage.includes('remodel')) {
      return {
        message: "Tenant improvements are perfect for updating existing spaces. We can transform offices, retail spaces, and other commercial interiors while minimizing business disruption. What space needs updating?",
        action: { type: 'show_services', category: 'tenant' }
      };
    }
    
    // Cost and pricing questions
    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('budget') || lowerMessage.includes('estimate')) {
      return {
        message: "Construction costs vary significantly based on project type, size, location, and complexity. To provide an accurate estimate, I'd need to know more about your project. Would you like to schedule a consultation for a detailed quote?",
        action: { type: 'capture_lead', reason: 'cost_estimate' }
      };
    }
    
    // Timeline questions
    if (lowerMessage.includes('timeline') || lowerMessage.includes('schedule') || lowerMessage.includes('how long')) {
      return {
        message: "Project timelines depend on scope, permits, and complexity. Commercial projects typically range from 3-18 months. Would you like to discuss your specific timeline requirements?",
        action: { type: 'capture_lead', reason: 'timeline_discussion' }
      };
    }
    
    // Permits and regulatory
    if (lowerMessage.includes('permit') || lowerMessage.includes('license') || lowerMessage.includes('regulation')) {
      return {
        message: "We handle all permitting and regulatory compliance for Washington, Oregon, and Idaho. Our team ensures your project meets all local building codes and requirements. What location is your project in?",
        action: { type: 'show_service_areas' }
      };
    }
    
    // Contact and consultation
    if (lowerMessage.includes('contact') || lowerMessage.includes('call') || lowerMessage.includes('speak') || lowerMessage.includes('consultation')) {
      return {
        message: "I'd be happy to connect you with our team! We offer free consultations to discuss your project needs. What's the best way to reach you?",
        action: { type: 'capture_lead', reason: 'consultation_request' }
      };
    }
    
    // Experience and credentials
    if (lowerMessage.includes('experience') || lowerMessage.includes('credential') || lowerMessage.includes('licensed')) {
      return {
        message: "MH Construction has over 150 years of combined commercial construction experience. We're a veteran-owned company with all necessary licenses and insurance. Would you like to see examples of our recent projects?",
        action: { type: 'show_projects' }
      };
    }
    
    // Service areas
    if (lowerMessage.includes('washington') || lowerMessage.includes('oregon') || lowerMessage.includes('idaho') || lowerMessage.includes('service area')) {
      return {
        message: "We serve Washington, Oregon, and Idaho. Our main office is in Pasco, WA, but we travel throughout the Pacific Northwest for projects. Where is your project located?",
        action: { type: 'show_service_areas' }
      };
    }
    
    // Default response
    return {
      message: "I'm here to help with your construction project questions! I can provide information about our services, project costs, timelines, and more. What would you like to know about MH Construction?",
      action: { type: 'show_quick_replies' }
    };
  }

  async handleBotAction(action) {
    switch (action.type) {
      case 'capture_lead':
        if (!this.leadCaptured) {
          setTimeout(() => {
            this.showLeadCaptureForm(action.reason);
          }, 1000);
        }
        break;
        
      case 'show_services':
        this.showQuickReplies([
          'Tell me about commercial projects',
          'Medical facility construction',
          'Religious building experience',
          'Industrial construction',
          'Get a quote'
        ]);
        break;
        
      case 'show_projects':
        this.addMessage(
          'You can view our portfolio at mhc-gc.com/projects. Would you like me to connect you with our team to discuss a similar project?',
          'bot'
        );
        break;
        
      case 'show_service_areas':
        this.addMessage(
          'We proudly serve:\n• Washington State\n• Oregon\n• Idaho\n\nOur team travels throughout the Pacific Northwest for quality construction projects.',
          'bot'
        );
        break;
        
      case 'show_quick_replies':
        this.showQuickReplies([
          'What services do you offer?',
          'How much will my project cost?',
          'How long does construction take?',
          'Do you handle permits?',
          'Schedule a consultation'
        ]);
        break;
    }
  }

  addMessage(message, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageHTML = `
      <div class="message ${sender}-message">
        <div class="message-content">
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="message-time">${messageTime}</div>
      </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Save to conversation history
    this.conversations.push({
      message,
      sender,
      timestamp: new Date().toISOString()
    });
    
    // Save to Firebase
    this.saveConversationToFirebase();
  }

  showQuickReplies(replies) {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    const quickRepliesHTML = `
      <div class="message bot-message">
        <div class="message-content">
          <p>Here are some things I can help you with:</p>
          <div class="quick-replies">
            ${replies.map(reply => `
              <button class="quick-reply-btn" onclick="chatbot.handleQuickReply('${reply}')">
                ${reply}
              </button>
            `).join('')}
          </div>
        </div>
        <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', quickRepliesHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  handleQuickReply(reply) {
    document.getElementById('chatbot-input').value = reply;
    this.sendMessage();
  }

  showLeadCaptureForm(reason) {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    const formHTML = `
      <div class="message bot-message">
        <div class="message-content">
          <div class="lead-form">
            <h4>Let's Connect!</h4>
            <p>I'd love to have our team reach out to discuss your project.</p>
            <form id="chatbot-lead-form">
              <div class="form-group">
                <label for="lead-name">Name *</label>
                <input type="text" id="lead-name" required>
              </div>
              <div class="form-group">
                <label for="lead-phone">Phone *</label>
                <input type="tel" id="lead-phone" required>
              </div>
              <div class="form-group">
                <label for="lead-email">Email *</label>
                <input type="email" id="lead-email" required>
              </div>
              <div class="form-group">
                <label for="lead-project">Project Type</label>
                <select id="lead-project">
                  <option value="">Select...</option>
                  <option value="commercial">Commercial</option>
                  <option value="medical">Medical Facility</option>
                  <option value="religious">Religious Facility</option>
                  <option value="winery">Winery</option>
                  <option value="industrial">Industrial</option>
                  <option value="tenant">Tenant Improvement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label for="lead-timeline">Preferred Timeline</label>
                <select id="lead-timeline">
                  <option value="">Select...</option>
                  <option value="immediate">ASAP</option>
                  <option value="1-3months">1-3 months</option>
                  <option value="3-6months">3-6 months</option>
                  <option value="6-12months">6-12 months</option>
                  <option value="planning">Still planning</option>
                </select>
              </div>
              <button type="submit" class="form-submit">Send Information</button>
            </form>
          </div>
        </div>
        <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', formHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Bind form submission
    document.getElementById('chatbot-lead-form').addEventListener('submit', (e) => {
      this.handleLeadFormSubmission(e, reason);
    });
  }

  async handleLeadFormSubmission(e, reason) {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('lead-name').value,
      phone: document.getElementById('lead-phone').value,
      email: document.getElementById('lead-email').value,
      projectType: document.getElementById('lead-project').value,
      timeline: document.getElementById('lead-timeline').value,
      source: 'chatbot',
      reason: reason,
      conversationId: this.currentConversationId,
      timestamp: new Date().toISOString()
    };
    
    try {
      const result = await FirebaseUtils.saveDocument(collections.projectInquiries, formData);
      
      if (result.success) {
        this.leadCaptured = true;
        this.addMessage(
          `Thank you, ${formData.name}! I've saved your information and our team will contact you within 24 hours. Is there anything else I can help you with about your ${formData.projectType} project?`,
          'bot'
        );
        
        // Send email notification
        await FirebaseUtils.sendContactForm({
          ...formData,
          type: 'chatbot_lead',
          subject: `New Chatbot Lead: ${formData.name} - ${formData.projectType}`
        });
        
        analytics.logEvent('chatbot_lead_captured', {
          project_type: formData.projectType,
          timeline: formData.timeline,
          source: 'chatbot'
        });
        
      } else {
        throw new Error('Failed to save lead information');
      }
      
    } catch (error) {
      console.error('Error saving lead:', error);
      this.addMessage(
        'I apologize, but there was an issue saving your information. Please call us directly at (509) 308-6489 and we\'ll be happy to help!',
        'bot'
      );
    }
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingHTML = `
      <div class="typing-indicator" id="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    this.isTyping = true;
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
    this.isTyping = false;
  }

  setSendButtonState(enabled) {
    const sendButton = document.getElementById('chatbot-send');
    sendButton.disabled = !enabled;
    sendButton.style.opacity = enabled ? '1' : '0.5';
  }

  handleTypingIndicator() {
    // Could implement "user is typing" indicator for human handoff
  }

  loadWelcomeMessage() {
    const businessHours = this.isBusinessHours();
    const welcomeMessage = businessHours 
      ? "Hi! I'm MH Construction's AI assistant. How can I help with your construction project?"
      : "Hi! I'm MH Construction's AI assistant. Our team is currently offline, but I'm here 24/7 to help with your construction questions!";
    
    setTimeout(() => {
      this.addMessage(welcomeMessage, 'bot');
      
      if (!businessHours) {
        setTimeout(() => {
          this.addMessage(
            "I can provide project information, cost estimates, and schedule a consultation for you. What type of construction project are you planning?",
            'bot'
          );
        }, 1500);
      }
    }, 500);
  }

  isBusinessHours() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Monday-Friday, 8 AM - 5 PM PST
    return day >= 1 && day <= 5 && hour >= this.businessHours.start && hour < this.businessHours.end;
  }

  initializeConversation() {
    this.currentConversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async saveConversationToFirebase() {
    try {
      await FirebaseUtils.saveDocument(collections.chatbotConversations, {
        conversationId: this.currentConversationId,
        messages: this.conversations,
        leadCaptured: this.leadCaptured,
        userAgent: navigator.userAgent,
        pageUrl: window.location.href
      });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  getConversationContext() {
    return {
      messageCount: this.conversations.length,
      leadCaptured: this.leadCaptured,
      businessHours: this.isBusinessHours(),
      pageUrl: window.location.href,
      userAgent: navigator.userAgent
    };
  }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.chatbot = new MHConstructionChatbot();
});

// Export for global access
window.MHConstructionChatbot = MHConstructionChatbot;
