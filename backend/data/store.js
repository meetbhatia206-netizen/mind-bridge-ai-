// Simple in-memory store for session management
class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  createSession(sessionId, formId, totalSteps) {
    const session = {
      sessionId,
      formId,
      currentStepIndex: 0,
      totalSteps,
      answers: {},
      status: 'in_progress', // or 'completed'
      createdAt: new Date().toISOString()
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  updateSession(sessionId, updates) {
    const session = this.getSession(sessionId);
    if (!session) return null;
    
    // Merge new attributes
    for (const [key, value] of Object.entries(updates)) {
      session[key] = value;
    }
    
    this.sessions.set(sessionId, session);
    return session;
  }
}

// Export a singleton instance
module.exports = new SessionStore();
