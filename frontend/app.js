/**
 * app.js — Frontend logic for Serenity AI Wellness Mentor
 */

const API_BASE = 'http://localhost:3000/api';

// Globals
let currentSessionId = null;
let currentQuestion = null;
let currentLang = 'en'; // Defaults to English

// DOM Elements
const chatWidget = document.getElementById('chat-widget');
const chatArea = document.getElementById('chat-area');
const chatInput = document.getElementById('chat-input');
const btnSend = document.getElementById('btn-send');
const modalSummary = document.getElementById('modal-summary');
const summaryBody = document.getElementById('summary-body');

// Empathetic phrases for human-like responses
const empatheticPhrases = {
  en: [
    "You're not alone in feeling this way.",
    "It's okay to feel overwhelmed.",
    "I hear you. Let's work through this together.",
    "Small steps can make a difference.",
    "Thank you for sharing that with me.",
    "I understand. Take a deep breath."
  ],
  hi: [
    "ऐसा महसूस करने वाले आप अकेले नहीं हैं।",
    "अभिभूत महसूस करना ठीक है।",
    "मैं आपको सुन रहा हूं। आइए मिलकर इसका समाधान करें।",
    "छोटे कदम बड़ा बदलाव ला सकते हैं।",
    "यह मेरे साथ साझा करने के लिए धन्यवाद।",
    "मैं समझता हूँ। एक गहरी सांस लें।"
  ]
};

function getRandomEmpathy() {
  const phrases = empatheticPhrases[currentLang] || empatheticPhrases['en'];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  // Update toggle button text if it exists
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.textContent = currentLang === 'en' ? 'EN' : 'HI';
  }
}

// Open Chat Widget and start specific flow
async function openChat(formId) {
  if (!chatWidget) return;
  chatWidget.classList.add('active');
  if (chatArea) chatArea.innerHTML = '';
  currentSessionId = null;
  currentQuestion = null;
  
  if (chatInput) chatInput.disabled = true;
  if (btnSend) btnSend.disabled = true;
  
  appendMessage('bot', currentLang === 'hi' ? 'आपके AI वेलनेस मेंटर से कनेक्ट हो रहा है...' : 'Connecting to your AI Wellness Mentor...', true);

  try {
    const res = await fetch(`${API_BASE}/start-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formId: formId, lang: currentLang })
    });
    
    if (!res.ok) throw new Error('Failed to start session');
    
    const data = await res.json();
    currentSessionId = data.sessionId || null;
    
    if (chatArea) chatArea.innerHTML = '';
    
    const welcomeMsg = currentLang === 'hi' 
      ? "नमस्ते। मैं आपका AI वेलनेस मेंटर हूं। मैं यहां आपकी बात सुनने और आपका समर्थन करने के लिए हूं। अपना समय लें।" 
      : "Hi there. I'm your AI Wellness Mentor. I'm here to listen and support you. Take your time.";
      
    appendMessage('bot', welcomeMsg);
    
    fetchNextQuestion();
  } catch (err) {
    appendMessage('bot', currentLang === 'hi' ? 'क्षमा करें, अभी कनेक्ट होने में समस्या आ रही है।' : 'Sorry, I am having trouble connecting right now.');
  }
}

function closeChat() {
  if (chatWidget) chatWidget.classList.remove('active');
}

// Fetch next question from backend
async function fetchNextQuestion() {
  if (!currentSessionId) return;

  try {
    const res = await fetch(`${API_BASE}/next-question?sessionId=${currentSessionId}`);
    if (!res.ok) throw new Error('Failed to fetch question');
    
    const data = await res.json();

    if (data.status === 'completed') {
      const waitMsg = currentLang === 'hi'
        ? "यह सब मेरे साथ साझा करने के लिए धन्यवाद। कृपया मुझे कुछ समय दें जब तक मैं आपके लिए एक व्यक्तिगत वेलनेस गाइड तैयार करूँ..."
        : "Thank you for sharing all of that with me. Please give me a moment while I generate a personalized wellness guide for you...";
      appendMessage('bot', waitMsg, true);
      generateWellnessGuide();
      return;
    }

    currentQuestion = data.question;
    
    if (!currentQuestion) {
      throw new Error('Question data is missing');
    }

    // Determine the correct label based on language fallback
    let questionText = currentQuestion[`label_${currentLang}`] || currentQuestion.label_en || currentQuestion.label || "I'm here to support you.";

    // Check if we need to explain a complex term first
    const explanationTerm = currentQuestion.explanation_term;
    const explanationText = currentQuestion[`explanation_${currentLang}`] || currentQuestion.explanation_en;

    if (explanationTerm && explanationText) {
      const prefix = currentLang === 'hi' ? "आगे बढ़ने से पहले, आइए बात करते हैं" : "Before we continue, let's talk about";
      appendMessage('bot', `${prefix} **${explanationTerm}**.<br><br>${explanationText}`);
      
      // Wait a moment for them to read it before showing the actual question
      setTimeout(() => {
        appendMessage('bot', questionText);
        enableInput();
      }, 1500);
    } else {
      appendMessage('bot', questionText);
      enableInput();
    }
    
  } catch (err) {
    const errorMsg = currentLang === 'hi' ? 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।' : 'Network error. Please try again.';
    appendMessage('bot', errorMsg);
    enableInput();
  }
}

// Handle User Input Submit
async function submitAnswer() {
  if (!chatInput) return;
  const text = chatInput.value.trim();
  if (!text || !currentSessionId || !currentQuestion) return;

  chatInput.value = '';
  chatInput.disabled = true;
  if (btnSend) btnSend.disabled = true;

  appendMessage('user', text);

  // Validate answer locally before sending
  if (currentQuestion.type === 'number' && !/^\\d+$/.test(text)) {
    appendMessage('bot', currentLang === 'hi' ? 'कृपया एक संख्या दर्ज करें।' : 'Please enter a number.');
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
    
    if (!res.ok) throw new Error('Failed to save answer');
    const data = await res.json();
    
    if (data.error) {
      appendMessage('bot', data.error || 'An error occurred.');
      enableInput();
      return;
    }

    // Add empathetic response before the next question sometimes
    if (Math.random() > 0.3) {
      appendMessage('bot', getRandomEmpathy());
      setTimeout(() => fetchNextQuestion(), 1000);
    } else {
      fetchNextQuestion();
    }
    
  } catch (err) {
    appendMessage('bot', currentLang === 'hi' ? 'उत्तर सहेजने में विफल। पुनः प्रयास करें।' : 'Failed to save answer. Try again.');
    enableInput();
  }
}

// Generate the final Gemini guide
async function generateWellnessGuide() {
  try {
    const res = await fetch(`${API_BASE}/smart-summary?sessionId=${currentSessionId}&lang=${currentLang}`);
    if (!res.ok) throw new Error('Failed to generate summary');
    const data = await res.json();
    
    if (summaryBody) {
      summaryBody.innerHTML = data.html || "<p>Guide could not be generated.</p>";
    }
    closeChat();
    if (modalSummary) modalSummary.classList.add('active');
    
  } catch (err) {
    appendMessage('bot', currentLang === 'hi' ? 'क्षमा करें, मैं आपका गाइड तैयार करने में विफल रहा।' : 'Sorry, I failed to generate your guide.');
    enableInput(); // Let them try again or something
  }
}

function closeModal() {
  if (modalSummary) modalSummary.classList.remove('active');
}

// UI Helpers
function appendMessage(sender, text, isTyping = false) {
  if (!chatArea) return;
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

    // Prevent undefined text
    const safeText = text || (currentLang === 'hi' ? 'एक त्रुटि हुई।' : 'An error occurred.');
    row.innerHTML = `<div class="bubble">${safeText}</div>`;
  }
  
  chatArea.appendChild(row);
  chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
}

function enableInput() {
  if (chatInput) {
    chatInput.disabled = false;
    chatInput.focus();
  }
  if (btnSend) btnSend.disabled = false;
}

// Event Listeners
if (btnSend) {
  btnSend.addEventListener('click', submitAnswer);
}

if (chatInput) {
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitAnswer();
  });
}