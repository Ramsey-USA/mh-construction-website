// MH Construction - Firebase Database Functions

class FirebaseDataManager {
    constructor() {
        this.db = firebase.firestore();
        this.storage = firebase.storage();
    }

    // Project Management
    async createProject(projectData) {
        try {
            const docRef = await this.db.collection('projects').add({
                ...projectData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'draft'
            });
            console.log('Project created with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }

    async updateProject(projectId, updateData) {
        try {
            await this.db.collection('projects').doc(projectId).update({
                ...updateData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Project updated:', projectId);
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    }

    async getPublishedProjects() {
        try {
            const snapshot = await this.db.collection('projects')
                .where('status', '==', 'published')
                .orderBy('completedDate', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }

    // Blog Management
    async createBlogPost(postData) {
        try {
            const docRef = await this.db.collection('blog').add({
                ...postData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'draft'
            });
            console.log('Blog post created with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error creating blog post:', error);
            throw error;
        }
    }

    async getPublishedBlogPosts(limit = 10) {
        try {
            const snapshot = await this.db.collection('blog')
                .where('status', '==', 'published')
                .orderBy('publishedDate', 'desc')
                .limit(limit)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            throw error;
        }
    }

    // Contact Form Submission
    async submitContactForm(formData) {
        try {
            const docRef = await this.db.collection('inquiries').add({
                ...formData,
                submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'new'
            });
            
            // Trigger Cloud Function to send email notification
            const sendEmail = firebase.functions().httpsCallable('sendContactEmail');
            await sendEmail({ inquiryId: docRef.id, ...formData });
            
            console.log('Contact form submitted:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error submitting contact form:', error);
            throw error;
        }
    }

    // Chatbot Conversation Logging
    async logChatbotConversation(conversationData) {
        try {
            const docRef = await this.db.collection('conversations').add({
                ...conversationData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('Conversation logged:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error logging conversation:', error);
            throw error;
        }
    }

    // File Upload
    async uploadFile(file, path) {
        try {
            const storageRef = this.storage.ref().child(path);
            const snapshot = await storageRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            
            console.log('File uploaded successfully:', downloadURL);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
}

// Initialize Firebase Data Manager
window.firebaseDataManager = new FirebaseDataManager();
