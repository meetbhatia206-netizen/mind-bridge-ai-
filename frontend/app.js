/**
 * app.js — Frontend logic for Serenity AI Wellness Mentor
 */

const API_BASE = 'http://localhost:3000/api';

// Globals
let currentSessionId = null;
let currentQuestion = null;

// DOM Elements
const chatWidget = document.getElementById('chat-widget');
const chatArea = document.getElementById('chat-area');
const chatInput = document.getElementById('chat-input');
const btnSend = document.getElementById('btn-send');
const modalSummary = document.getElementById('modal-summary');
const summaryBody = document.getElementById('summary-body');

// Empathetic phrases for human-like responses
const empatheticPhrases = [
  "You're not alone in feeling this way.",
  "It's okay to feel overwhelmed.",
  "I hear you. Let's work through this together.",
  "Small steps can make a difference.",
  "Thank you for sharing that with me.",
  "I understand. Take a deep breath."
];

function getRandomEmpathy() {
  return empatheticPhrases[Math.floor(Math.random() * empatheticPhrases.length)];
}

// Open Chat Widget and start specific flow
async function openChat(formId) {
  chatWidget.classList.add('active');
  chatArea.innerHTML = '';
  currentSessionId = null;
  currentQuestion = null;
  
  chatInput.disabled = true;
  btnSend.disabled = true;
  
  appendMessage('bot', 'Connecting to your AI Wellness Mentor...', true);

  try {
    const res = await fetch(`${API_BASE}/start-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formId: formId, lang: 'en' })
    });
    const data = await res.json();
    currentSessionId = data.sessionId;
    
    // Clear connecting message
    chatArea.innerHTML = '';
    
    appendMessage('bot', "Hi there. I'm your AI Wellness Mentor. I'm here to listen and support you. Take your time.");
    
    fetchNextQuestion();
  } catch (err) {
    appendMessage('bot', 'Sorry, I am having trouble connecting right now.');
  }
}

function closeChat() {
  chatWidget.classList.remove('active');
}

// Fetch next question from backend
async function fetchNextQuestion() {
  if (!currentSessionId) return;

  try {
    const res = await fetch(`${API_BASE}/next-question?sessionId=${currentSessionId}`);
    const data = await res.json();

    if (data.status === 'completed') {
      appendMessage('bot', "Thank you for sharing all of that with me. Please give me a moment while I generate a personalized wellness guide for you...", true);
      generateWellnessGuide();
      return;
    }

    currentQuestion = data.question;

    // Check if we need to explain a complex term first
    if (currentQuestion.explanation_term && currentQuestion.explanation_en) {
      appendMessage('bot', `Before we continue, let's talk about **${currentQuestion.explanation_term}**.<br><br>${currentQuestion.explanation_en}`);
      // Wait a moment for them to read it
      setTimeout(() => {
        appendMessage('bot', currentQuestion.label);
        enableInput();
      }, 1500);
    } else {
      appendMessage('bot', currentQuestion.label);
      enableInput();
    }
    
  } catch (err) {
    appendMessage('bot', 'Network error. Please try again.');
  }
}

// Handle User Input Submit
async function submitAnswer() {
  const text = chatInput.value.trim();
  if (!text || !currentSessionId || !currentQuestion) return;

  chatInput.value = '';
  chatInput.disabled = true;
  btnSend.disabled = true;

  appendMessage('user', text);

  // Validate answer locally before sending
  if (currentQuestion.type === 'number' && !/^\d+$/.test(text)) {
    appendMessage('bot', 'Please enter a number.');
    enableInput();
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/save-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: currentSessionId,
        fieldId: currentQuestion.id,
        value: text
      })
    });
    
    const data = await res.json();
    
    if (data.error) {
      appendMessage('bot', data.error);
      enableInput();
      return;
    }

    // Add empathetic response before the next question
    if (Math.random() > 0.3) {
      appendMessage('bot', getRandomEmpathy());
      setTimeout(() => fetchNextQuestion(), 1000);
    } else {
      fetchNextQuestion();
    }
    
  } catch (err) {
    appendMessage('bot', 'Failed to save answer. Try again.');
    enableInput();
  }
}

// Generate the final Gemini guide
async function generateWellnessGuide() {
  try {
    const res = await fetch(`${API_BASE}/smart-summary?sessionId=${currentSessionId}&lang=en`);
    const data = await res.json();
    
    summaryBody.innerHTML = data.html;
    chatWidget.classList.remove('active');
    modalSummary.classList.add('active');
    
  } catch (err) {
    appendMessage('bot', 'Sorry, I failed to generate your guide.');
  }
}

function closeModal() {
  modalSummary.classList.remove('active');
}

// UI Helpers
function appendMessage(sender, text, isTyping = false) {
  const row = document.createElement('div');
  row.className = `msg-row ${sender}`;
  
  if (isTyping) {
    row.innerHTML = `
      <div class="bubble">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    row.id = 'typing-indicator-row';
  } else {
    // Remove typing indicator if it exists
    const typingRow = document.getElementById('typing-indicator-row');
    if (typingRow) typingRow.remove();

    row.innerHTML = `<div class="bubble">${text}</div>`;
  }
  
  chatArea.appendChild(row);
  chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
}

function enableInput() {
  chatInput.disabled = false;
  btnSend.disabled = false;
  chatInput.focus();
}

// Event Listeners
btnSend.addEventListener('click', submitAnswer);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') submitAnswer();
});