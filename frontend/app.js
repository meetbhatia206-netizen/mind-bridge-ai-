/* Constants & Globals */
const API_BASE = 'http://localhost:3000/api';

const UI_TEXT = {
  en: {
    welcome: "Welcome!",
    dashboardTitle: "How can I help you today?",
    historyTitle: "Chat History",
    previewBtn: "Generate Smart Guide",
    previewModalTitle: "Smart Summary Guide",
    typePlaceholder: "Type your answer...",
    loading: "Loading...",
    error: "An error occurred.",
    skipped: "(Skipped)",
    formCompleted: "Form completed successfully! 🎉<br><br>Tap the <b>Preview</b> button to view your responses.",
    questionPrefix: "Question",
    networkError: "Network Error. Please try again.",
    backToDashboard: "Go Back",
    noHistory: "No past conversations"
  },
  hi: {
    welcome: "स्वागत है!",
    dashboardTitle: "मैं आपकी कैसे सहायता कर सकता हूँ?",
    historyTitle: "चैट इतिहास",
    previewBtn: "स्मार्ट गाइड बनाएं",
    previewModalTitle: "स्मार्ट सारांश गाइड",
    typePlaceholder: "अपना जवाब टाइप करें...",
    loading: "लोड हो रहा है...",
    error: "एक त्रुटि आई।",
    skipped: "(छोड़ दिया)",
    formCompleted: "फॉर्म सफलतापूर्वक पूरा हुआ! 🎉<br><br>अपने जवाब देखने के लिए <b>फॉर्म प्रीव्यू</b> बटन दबाएं।",
    questionPrefix: "प्रश्न",
    networkError: "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।",
    backToDashboard: "वापस जाएं",
    noHistory: "कोई पिछला संवाद नहीं"
  }
};

const ICONS = [
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'
];

// State
let selectedLang = null;
let currentSessionId = null;
let currentQuestion = null;
let questionCount = 1;
let formsData = [];

// Elements
const els = {
  screenLang: document.getElementById('screen-language'),
  screenDashboard: document.getElementById('screen-dashboard'),
  screenChat: document.getElementById('screen-chat'),
  
  langBtns: document.querySelectorAll('.btn-lang'),
  btnChangeLang: document.getElementById('btn-change-lang'),
  
  welcomeMsg: document.getElementById('welcome-msg'),
  dashboardTitle: document.getElementById('dashboard-title'),
  formGrid: document.getElementById('form-grid'),
  
  historyTitle: document.getElementById('history-title'),
  chatHistoryList: document.getElementById('chat-history-list'),
  sidebarName: document.getElementById('sidebar-name'),
  
  backBtn: document.getElementById('back-btn'),
  chatFormTitle: document.getElementById('chat-form-title'),
  previewBtn: document.getElementById('preview-btn'),
  previewBtnText: document.getElementById('preview-btn-text'),
  
  chatArea: document.getElementById('chat-area'),
  chatForm: document.getElementById('chat-form'),
  userInput: document.getElementById('user-input'),
  sendBtn: document.getElementById('send-btn'),
  
  previewModal: document.getElementById('preview-modal'),
  closeModal: document.getElementById('close-modal'),
  previewContent: document.getElementById('preview-content'),
  modalTitle: document.getElementById('modal-title')
};

/* Initialization */
function init() {
  // Bind Language Buttons
  els.langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.getAttribute('data-lang'));
    });
  });

  els.btnChangeLang.addEventListener('click', () => {
    showScreen(els.screenLang);
  });

  // Bind Chat
  els.chatForm.addEventListener('submit', handleChatSubmit);
  
  // Auto uppercase input
  els.userInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
  });

  // Bind Navigation
  els.backBtn.addEventListener('click', () => {
    showScreen(els.screenDashboard);
  });
  
  // Bind Preview
  els.previewBtn.addEventListener('click', showPreview);
  els.closeModal.addEventListener('click', () => {
    els.previewModal.classList.add('hidden');
  });
}

function setLanguage(lang) {
  selectedLang = lang;
  updateUIText();
  showScreen(els.screenDashboard);
  if (formsData.length === 0) {
    fetchForms();
  } else {
    renderFormGrid(formsData);
  }
}

function updateUIText() {
  const t = UI_TEXT[selectedLang];
  els.welcomeMsg.textContent = t.welcome;
  els.dashboardTitle.textContent = t.dashboardTitle;
  els.historyTitle.textContent = t.historyTitle;
  els.previewBtnText.textContent = t.previewBtn;
  els.modalTitle.textContent = t.previewModalTitle;
  els.userInput.placeholder = t.typePlaceholder;
  
  if (els.chatHistoryList.children.length === 1 && els.chatHistoryList.children[0].classList.contains('empty-history')) {
    els.chatHistoryList.children[0].textContent = t.noHistory;
  }
}

function showScreen(screenEl) {
  [els.screenLang, els.screenDashboard, els.screenChat].forEach(s => s.classList.add('hidden'));
  screenEl.classList.remove('hidden');
}

/* Dashboard Functionality */
async function fetchForms() {
  els.formGrid.innerHTML = '<div class="loading-spinner"></div>';
  try {
    const res = await fetch(`${API_BASE}/forms`);
    const data = await res.json();
    formsData = data.forms || [];
    renderFormGrid(formsData);
  } catch (error) {
    els.formGrid.innerHTML = `<p style="color:var(--error); grid-column: 1/-1;">Error connecting to server. Is backend running?</p>`;
  }
}

function renderFormGrid(forms) {
  els.formGrid.innerHTML = '';
  forms.forEach((form, index) => {
    const card = document.createElement('div');
    card.className = 'form-card';
    card.onclick = () => startSession(form.id, form.name);
    
    // Choose an icon repeatedly based on index
    const icon = ICONS[index % ICONS.length];
    
    card.innerHTML = `
      <div class="form-card-icon">${icon}</div>
      <h3>${form.name}</h3>
      <p>${selectedLang === 'en' ? 'Click to start filling' : 'भरना शुरू करने के लिए क्लिक करें'}</p>
    `;
    els.formGrid.appendChild(card);
  });
}

/* Chat Session */
async function startSession(formId, formName) {
  els.chatFormTitle.textContent = formName;
  els.chatArea.innerHTML = '';
  els.previewBtn.classList.add('hidden');
  els.userInput.value = '';
  disableInput(true);
  
  // Add history item mock
  addHistoryItem(formName);
  
  questionCount = 1;
  showScreen(els.screenChat);
  
  addBotMessage(`Selected <b>${formName}</b>`, false, false);
  showTyping();

  try {
    const res = await fetch(`${API_BASE}/start-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formId })
    });
    const data = await res.json();
    
    hideTyping();
    if(data.error) throw new Error(data.error);
    
    currentSessionId = data.sessionId;
    els.previewBtn.classList.remove('hidden');
    
    handleNextQuestion(data.firstQuestion);
  } catch (error) {
    hideTyping();
    addBotMessage(`Error: ${error.message}`, true, false);
  }
}

function addHistoryItem(formName) {
  const empty = els.chatHistoryList.querySelector('.empty-history');
  if (empty) empty.remove();
  
  const li = document.createElement('li');
  li.className = 'history-item';
  const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  li.innerHTML = `<strong>${formName}</strong><br><span style="font-size:0.8em;opacity:0.7">${time}</span>`;
  els.chatHistoryList.prepend(li);
}

function handleNextQuestion(questionObj) {
  currentQuestion = questionObj;
  
  const explanation = selectedLang === 'en' ? questionObj.explanation_en : questionObj.explanation_hi;
  if (explanation) {
    addBotMessage(`<i>${explanation}</i>`, false, false);
  }

  const label = selectedLang === 'en' ? questionObj.label_en : questionObj.label_hi;
  addBotMessage(label, false, true);

  // Configure input
  if(questionObj.type === 'number') els.userInput.type = 'number';
  else if(questionObj.type === 'date') els.userInput.type = 'date';
  else els.userInput.type = 'text';

  disableInput(false);
  els.userInput.focus();
}

async function handleChatSubmit(e) {
  e.preventDefault();
  const answer = els.userInput.value.trim();
  
  if(!answer && currentQuestion.validation !== 'optional' && currentQuestion.validation !== 'aadhaar_optional') return;

  disableInput(true);
  
  const isNo = answer.toLowerCase() === 'no' || answer === 'नहीं';
  const isSkip = !answer;

  const displayAnswer = answer || UI_TEXT[selectedLang].skipped;
  addMessage(displayAnswer, true);
  els.userInput.value = '';
  
  // Personalized response
  if (isNo || isSkip) {
    const skipMsg = selectedLang === 'en' ? "No problem, we will skip this." : "कोई बात नहीं, हम इसे छोड़ देंगे।";
    addBotMessage(skipMsg, false, false);
  } else {
    const msgsEn = ["Got it 👍", "Understood.", "Noted, thanks!", "Perfect!"];
    const msgsHi = ["समझ गया 👍", "ठीक है।", "धन्यवाद!", "उत्तम!"];
    const arr = selectedLang === 'en' ? msgsEn : msgsHi;
    const randMsg = arr[Math.floor(Math.random() * arr.length)];
    addBotMessage(randMsg, false, false);
  }

  showTyping();
  
  try {
    const res = await fetch(`${API_BASE}/save-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: currentSessionId, answer })
    });
    const data = await res.json();
    
    hideTyping();
    if(data.error) {
      addBotMessage(data.error, true, false);
      disableInput(false);
      return;
    }
    
    if(data.completed) {
      addBotMessage(UI_TEXT[selectedLang].formCompleted, false, false);
      disableInput(true); // completely done
    } else {
      questionCount++;
      handleNextQuestion(data.nextQuestion);
    }
  } catch (error) {
    hideTyping();
    addBotMessage(UI_TEXT[selectedLang].networkError, true, false);
    disableInput(false);
  }
}

/* Chat UI Helpers */
function disableInput(disabled) {
  els.userInput.disabled = disabled;
  els.sendBtn.disabled = disabled;
}

function addBotMessage(text, isError = false, isQuestion = false) {
  const row = document.createElement('div');
  row.className = 'msg-row bot';
  
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  if (isError) bubble.style.borderLeft = '4px solid var(--error)';
  
  let content = '';
  if (isQuestion) {
    const prefix = UI_TEXT[selectedLang].questionPrefix;
    content += `<span class="question-number">${prefix} ${questionCount}</span>`;
  }
  content += text;
  
  bubble.innerHTML = content;
  row.appendChild(bubble);
  els.chatArea.appendChild(row);
  scrollToBottom();
}

function addMessage(text, isUser) {
  const row = document.createElement('div');
  row.className = `msg-row ${isUser ? 'user' : 'bot'}`;
  
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  
  row.appendChild(bubble);
  els.chatArea.appendChild(row);
  scrollToBottom();
}

function scrollToBottom() {
  els.chatArea.scrollTop = els.chatArea.scrollHeight;
}

const typingNode = document.createElement('div');
typingNode.className = 'msg-row bot typing-wrapper';
typingNode.innerHTML = `<div class="bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;

function showTyping() {
  els.chatArea.appendChild(typingNode);
  scrollToBottom();
}
function hideTyping() {
  if(typingNode.parentNode) typingNode.parentNode.removeChild(typingNode);
}

/* Preview Flow */
async function showPreview() {
  els.previewModal.classList.remove('hidden');
  els.previewContent.innerHTML = '<div class="loading-spinner"></div>';
  
  try {
    const res = await fetch(`${API_BASE}/smart-summary?sessionId=${currentSessionId}&lang=${selectedLang}`);
    const data = await res.json();
    
    if(data.error) throw new Error(data.error);
    
    if (data.html) {
      els.previewContent.innerHTML = data.html;
    } else {
      els.previewContent.innerHTML = `<p style="color:var(--error)">No guide generated.</p>`;
    }
  } catch (error) {
    els.previewContent.innerHTML = `<p style="color:var(--error)">Failed to load smart guide.</p>`;
  }
}

// Start
init();
