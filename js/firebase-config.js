// firebase-config.js

// Firebase configuration object
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "mh-construction.firebaseapp.com",
  projectId: "mh-construction",
  storageBucket: "mh-construction.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const db = firebase.firestore();
const storage = firebase.storage();
const functions = firebase.functions();
const analytics = firebase.analytics();

// Firebase Cloud Functions
const sendContactEmail = functions.httpsCallable('sendContactEmail');
const processChatbotQuery = functions.httpsCallable('processChatbotQuery');
const saveProjectInquiry = functions.httpsCallable('saveProjectInquiry');
const uploadProjectDocument = functions.httpsCallable('uploadProjectDocument');

// Analytics configuration
analytics.config({
  page_title: 'MH Construction',
  page_location: window.location.href,
  custom_map: {
    'custom_parameter_1': 'construction_industry'
  }
});

// Database collections
const collections = {
  projects: 'projects',
  testimonials: 'testimonials',
  blogPosts: 'blog_posts',
  contactForms: 'contact_forms',
  chatbotConversations: 'chatbot_conversations',
  projectInquiries: 'project_inquiries',
  teamMembers: 'team_members',
  services: 'services',
  awards: 'awards',
  clientLogos: 'client_logos'
};

// Utility functions for Firebase operations
const FirebaseUtils = {
  // Get collection data with caching
  async getCollection(collectionName, useCache = true) {
    try {
      const query = db.collection(collectionName).orderBy('createdAt', 'desc');
      
      if (useCache) {
        query.get({ source: 'cache' }).then((snapshot) => {
          if (!snapshot.empty) {
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          }
        }).catch(() => {
          // Cache miss, fall back to server
        });
      }
      
      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      return [];
    }
  },

  // Save document to collection
  async saveDocument(collectionName, data) {
    try {
      const docRef = await db.collection(collectionName).add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Track analytics event
      analytics.logEvent('document_created', {
        collection: collectionName,
        document_id: docRef.id
      });
      
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error(`Error saving to ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },

  // Upload file to Firebase Storage
  async uploadFile(file, path) {
    try {
      const storageRef = storage.ref().child(path);
      const uploadTask = await storageRef.put(file);
      const downloadURL = await uploadTask.ref.getDownloadURL();
      
      analytics.logEvent('file_uploaded', {
        file_name: file.name,
        file_size: file.size,
        storage_path: path
      });
      
      return { success: true, url: downloadURL };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { success: false, error: error.message };
    }
  },

  // Send contact form
  async sendContactForm(formData) {
    try {
      const result = await sendContactEmail(formData);
      
      analytics.logEvent('contact_form_submitted', {
        form_type: formData.type || 'contact',
        source: formData.source || 'website'
      });
      
      return result.data;
    } catch (error) {
      console.error('Error sending contact form:', error);
      return { success: false, error: error.message };
    }
  }
};

// Global error handler for Firebase
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.code && event.reason.code.startsWith('firebase/')) {
    console.error('Firebase Error:', event.reason);
    analytics.logEvent('firebase_error', {
      error_code: event.reason.code,
      error_message: event.reason.message
    });
  }
});

// Export for use in other modules
window.FirebaseUtils = FirebaseUtils;
window.db = db;
window.storage = storage;
window.functions = functions;
window.analytics = analytics;
window.collections = collections;