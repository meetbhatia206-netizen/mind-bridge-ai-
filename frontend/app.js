/* ════════════════════════════════════════════════════════════════
   app.js  —  SmartGuide Frontend
   Changes:
     • Text-to-Speech (TTS) speaker button on every question bubble
     • Client-side input validation (name / numeric / date / aadhaar / mobile)
     • Auto-uppercase removed for general text; kept for name_required fields
   ════════════════════════════════════════════════════════════════ */

/* ── Constants & Globals ─────────────────────────────────────── */
const API_BASE = 'http://localhost:3000/api';

const UI_TEXT = {
  en: {
    welcome: 'Welcome!',
    dashboardTitle: 'How can I help you today?',
    historyTitle: 'Chat History',
    previewBtn: 'Generate Smart Guide',
    previewModalTitle: 'Smart Summary Guide',
    typePlaceholder: 'Type your answer...',
    loading: 'Loading...',
    error: 'An error occurred.',
    skipped: '(Skipped)',
    formCompleted: 'Form completed successfully! 🎉<br><br>Tap the <b>Preview</b> button to view your responses.',
    questionPrefix: 'Question',
    networkError: 'Network Error. Please try again.',
    backToDashboard: 'Go Back',
    noHistory: 'No past conversations'
  },
  hi: {
    welcome: 'स्वागत है!',
    dashboardTitle: 'मैं आपकी कैसे सहायता कर सकता हूँ?',
    historyTitle: 'चैट इतिहास',
    previewBtn: 'स्मार्ट गाइड बनाएं',
    previewModalTitle: 'स्मार्ट सारांश गाइड',
    typePlaceholder: 'अपना जवाब टाइप करें...',
    loading: 'लोड हो रहा है...',
    error: 'एक त्रुटि आई।',
    skipped: '(छोड़ दिया)',
    formCompleted: 'फॉर्म सफलतापूर्वक पूरा हुआ! 🎉<br><br>अपने जवाब देखने के लिए <b>फॉर्म प्रीव्यू</b> बटन दबाएं।',
    questionPrefix: 'प्रश्न',
    networkError: 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।',
    backToDashboard: 'वापस जाएं',
    noHistory: 'कोई पिछला संवाद नहीं'
  }
};

const ICONS = [
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'
];

// ── State ──────────────────────────────────────────────────────
let selectedLang   = null;
let currentSessionId = null;
let currentQuestion  = null;
let questionCount    = 1;
let formsData        = [];

// ── Domain Terms Dictionary ──────────────────────────────────────────────
const TERMS_DICTIONARY = [
  {
    regex: /Pre.?Enrolment ID|पूर्व.नामांकन आईडी/gi,
    term: "Pre-Enrolment ID",
    explain_en: "Pre-Enrolment ID is a 14-digit number you get when you start Aadhaar update online. If you haven't done that, you can leave it blank.",
    explain_hi: "प्री-एनरोलमेंट आईडी (Pre-Enrolment ID) एक 14 अंकों का नंबर है जो आपको ऑनलाइन आधार अपडेट शुरू करने पर मिलता है। यदि आपने ऐसा नहीं किया है, तो आप इसे खाली छोड़ सकते हैं।"
  },
  {
    regex: /\bC\/O \(Care of\)|\bC\/O\b/gi,
    term: "C/O (Care of)",
    explain_en: "C/O (Care of) means the name of a person (like father, husband, or guardian) associated with your address.",
    explain_hi: "C/O (Care of) का मतलब है आपके पते से जुड़े किसी व्यक्ति (जैसे पिता, पति, या अभिभावक) का नाम।"
  },
  {
    regex: /\bHOF\b|परिवार के मुखिया|HOF का रिश्ता/gi,
    term: "HOF",
    explain_en: "HOF (Head of Family) means a family member whose Aadhaar can be used to update your address or details.",
    explain_hi: "HOF (Head of Family) का मतलब परिवार का वह मुखिया होता है जिसके आधार का उपयोग आपके पते या विवरण को अपडेट करने के लिए किया जा सकता है।"
  },
  {
    regex: /Introducer.based|परिचयकर्ता/gi,
    term: "Introducer-based",
    explain_en: "Introducer-based means someone authorized by UIDAI will verify your identity, used when you don't have standard documents.",
    explain_hi: "Introducer-based (परिचयकर्ता आधारित) का मतलब है कि UIDAI द्वारा अधिकृत कोई व्यक्ति आपकी पहचान सत्यापित करेगा, इसका उपयोग तब किया जाता है जब आपके पास मानक दस्तावेज़ न हों।"
  },
  {
    regex: /Document.based|दस्तावेज़ आधारित/gi,
    term: "Document-based",
    explain_en: "Document-based means you will provide standard documents like PAN, Voter ID, etc., to prove your identity or address.",
    explain_hi: "Document-based (दस्तावेज़ आधारित) का मतलब है कि आप अपनी पहचान या पता साबित करने के लिए पैन, वोटर आईडी आदि जैसे मानक दस्तावेज़ प्रदान करेंगे।"
  },
  {
    regex: /\bPOI\b|Proof of Identity|पहचान का प्रमाण/gi,
    term: "POI (Proof of Identity)",
    explain_en: "Proof of Identity (POI) means a document that confirms who you are (like Aadhaar, PAN, etc.)",
    explain_hi: "पहचान प्रमाण (POI) का मतलब वह दस्तावेज होता है जो आपकी पहचान साबित करता है जैसे आधार कार्ड, पैन कार्ड आदि।"
  },
  {
    regex: /\bPOA\b|Proof of Address|पते का प्रमाण/gi,
    term: "POA (Proof of Address)",
    explain_en: "Proof of Address (POA) means a document that shows where you live (like Electricity Bill, Voter ID, etc.)",
    explain_hi: "पता प्रमाण (POA) का मतलब वह दस्तावेज होता है जो यह दिखाता है कि आप कहाँ रहते हैं (जैसे बिजली बिल, वोटर आईडी आदि)।"
  },
  {
    regex: /\bPOR\b|Proof of Relationship|रिश्ते का प्रमाण/gi,
    term: "POR (Proof of Relationship)",
    explain_en: "Proof of Relationship (POR) means a document showing how you are related to the Head of Family (like Ration Card, Birth Certificate).",
    explain_hi: "रिश्ते का प्रमाण (POR) का मतलब है वह दस्तावेज़ जो दिखाता है कि परिवार के मुखिया के साथ आपका क्या रिश्ता है (जैसे राशन कार्ड, जन्म प्रमाण पत्र)।"
  }
];

// ── Element Cache ──────────────────────────────────────────────
const els = {
  screenLang:      document.getElementById('screen-language'),
  screenDashboard: document.getElementById('screen-dashboard'),
  screenChat:      document.getElementById('screen-chat'),

  langBtns:       document.querySelectorAll('.btn-lang'),
  btnChangeLang:  document.getElementById('btn-change-lang'),

  welcomeMsg:     document.getElementById('welcome-msg'),
  dashboardTitle: document.getElementById('dashboard-title'),
  formGrid:       document.getElementById('form-grid'),

  historyTitle:    document.getElementById('history-title'),
  chatHistoryList: document.getElementById('chat-history-list'),
  sidebarName:     document.getElementById('sidebar-name'),

  backBtn:        document.getElementById('back-btn'),
  chatFormTitle:  document.getElementById('chat-form-title'),
  previewBtn:     document.getElementById('preview-btn'),
  previewBtnText: document.getElementById('preview-btn-text'),

  chatArea:  document.getElementById('chat-area'),
  chatForm:  document.getElementById('chat-form'),
  userInput: document.getElementById('user-input'),
  sendBtn:   document.getElementById('send-btn'),

  previewModal:  document.getElementById('preview-modal'),
  closeModal:    document.getElementById('close-modal'),
  previewContent: document.getElementById('preview-content'),
  modalTitle:    document.getElementById('modal-title'),

  formImageBtn:         document.getElementById('form-image-btn'),
  formImageModal:       document.getElementById('form-image-modal'),
  closeFormImageModal:  document.getElementById('close-form-image-modal')
};

/* ════════════════════════════════════════════════════════════════
   TEXT-TO-SPEECH (TTS)
   Uses the Web Speech API (SpeechSynthesis) — no external libs.
   ════════════════════════════════════════════════════════════════ */

/**
 * Speak text aloud using the browser SpeechSynthesis API.
 * @param {string} text  - The text to speak
 * @param {string} lang  - 'en' or 'hi'
 */
function speakText(text, lang) {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    return;
  }
  // Cancel any ongoing speech before starting new
  window.speechSynthesis.cancel();

  // Strip HTML tags so only plain text is spoken
  const plainText = text.replace(/<[^>]*>/g, '');

  const utterance = new SpeechSynthesisUtterance(plainText);
  utterance.lang  = lang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate  = 0.92;   // slightly slower for clarity
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

/**
 * Build the SVG speaker icon used on TTS buttons.
 */
function speakerIconSVG() {
  return `<svg class="tts-icon" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>`;
}

/* ════════════════════════════════════════════════════════════════
   CLIENT-SIDE VALIDATION
   Mirrors the backend validators.js rules for instant feedback.
   ════════════════════════════════════════════════════════════════ */

/**
 * Validate user input against field validation type.
 * @param {string} validationType - From currentQuestion.validation
 * @param {string} value          - Raw input string
 * @returns {{ isValid: boolean, message: string }}
 */
function validateClientSide(validationType, value) {
  const v = (value || '').trim();

  // Optional fields always pass if empty
  if (!v) {
    if (validationType === 'optional' || validationType === 'aadhaar_optional') {
      return { isValid: true, message: '' };
    }
    return { isValid: false, message: selectedLang === 'hi'
      ? 'यह फ़ील्ड खाली नहीं छोड़ सकते।'
      : 'This field cannot be empty.' };
  }

  switch (validationType) {
    /* 12-digit Aadhaar */
    case 'aadhaar':
    case 'aadhaar_optional':
      if (!/^\d{12}$/.test(v)) {
        return { isValid: false, message: selectedLang === 'hi'
          ? 'आधार नंबर ठीक 12 अंकों का होना चाहिए।'
          : 'Aadhaar must be exactly 12 digits.' };
      }
      break;

    /* 10-digit mobile */
    case 'mobile':
      if (!/^\d{10}$/.test(v)) {
        return { isValid: false, message: selectedLang === 'hi'
          ? 'मोबाइल नंबर ठीक 10 अंकों का होना चाहिए।'
          : 'Mobile number must be exactly 10 digits.' };
      }
      break;

    /* Name — only letters and spaces */
    case 'name_required':
      if (!/^[A-Za-z\s]+$/.test(v)) {
        return { isValid: false, message: selectedLang === 'hi'
          ? 'नाम में केवल अक्षर और स्पेस होने चाहिए।'
          : 'Name must contain only alphabets and spaces.' };
      }
      break;

    /* 6-digit PIN */
    case 'pincode':
      if (!/^\d{6}$/.test(v)) {
        return { isValid: false, message: selectedLang === 'hi'
          ? 'पिन कोड ठीक 6 अंकों का होना चाहिए।'
          : 'PIN Code must be exactly 6 digits.' };
      }
      break;

    /* Generic required */
    case 'required':
      if (v.length === 0) {
        return { isValid: false, message: selectedLang === 'hi'
          ? 'यह फ़ील्ड आवश्यक है।'
          : 'This field is required.' };
      }
      break;

    default:
      break;
  }

  // Additional type-based check: number fields must be numeric
  if (currentQuestion && currentQuestion.type === 'number' && v && !/^\d+$/.test(v)) {
    return { isValid: false, message: selectedLang === 'hi'
      ? 'केवल संख्याएं दर्ज करें।'
      : 'Please enter numbers only.' };
  }

  return { isValid: true, message: '' };
}

/**
 * Show / hide an inline validation error beneath the input.
 */
function showInputError(message) {
  let errEl = document.getElementById('input-error-msg');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.id = 'input-error-msg';
    errEl.className = 'input-error-msg';
    els.userInput.parentNode.insertAdjacentElement('afterend', errEl);
  }
  errEl.textContent = message;
  errEl.style.display = message ? 'block' : 'none';
}

function clearInputError() {
  const errEl = document.getElementById('input-error-msg');
  if (errEl) errEl.style.display = 'none';
}

/* ════════════════════════════════════════════════════════════════
   INITIALIZATION
   ════════════════════════════════════════════════════════════════ */
function init() {
  // Language buttons
  els.langBtns.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
  });

  els.btnChangeLang.addEventListener('click', () => showScreen(els.screenLang));

  // Chat form submit
  els.chatForm.addEventListener('submit', handleChatSubmit);

  // Clear validation error while typing
  els.userInput.addEventListener('input', () => {
    clearInputError();

    // Auto-uppercase ONLY for name_required fields
    if (currentQuestion && currentQuestion.validation === 'name_required') {
      els.userInput.value = els.userInput.value.toUpperCase();
    }
  });

  // Navigation
  els.backBtn.addEventListener('click', () => {
    window.speechSynthesis && window.speechSynthesis.cancel();
    showScreen(els.screenDashboard);
  });

  // Preview modal (Smart Guide)
  els.previewBtn.addEventListener('click', showPreview);
  els.closeModal.addEventListener('click', () => {
    els.previewModal.classList.add('hidden');
  });

  // Form Image Preview modal
  els.formImageBtn.addEventListener('click', () => {
    els.formImageModal.classList.remove('hidden');
  });
  els.closeFormImageModal.addEventListener('click', () => {
    els.formImageModal.classList.add('hidden');
  });
  // Close image modal on overlay click
  els.formImageModal.addEventListener('click', (e) => {
    if (e.target === els.formImageModal) els.formImageModal.classList.add('hidden');
  });
  // Close smart guide modal on overlay click
  els.previewModal.addEventListener('click', (e) => {
    if (e.target === els.previewModal) els.previewModal.classList.add('hidden');
  });
}

/* ── Language & UI ───────────────────────────────────────────── */
function setLanguage(lang) {
  selectedLang = lang;
  updateUIText();
  showScreen(els.screenDashboard);
  if (formsData.length === 0) fetchForms();
  else renderFormGrid(formsData);
}

function updateUIText() {
  const t = UI_TEXT[selectedLang];
  els.welcomeMsg.textContent      = t.welcome;
  els.dashboardTitle.textContent  = t.dashboardTitle;
  els.historyTitle.textContent    = t.historyTitle;
  els.previewBtnText.textContent  = t.previewBtn;
  els.modalTitle.textContent      = t.previewModalTitle;
  els.userInput.placeholder       = t.typePlaceholder;

  if (
    els.chatHistoryList.children.length === 1 &&
    els.chatHistoryList.children[0].classList.contains('empty-history')
  ) {
    els.chatHistoryList.children[0].textContent = t.noHistory;
  }
}

function showScreen(screenEl) {
  [els.screenLang, els.screenDashboard, els.screenChat].forEach(s => s.classList.add('hidden'));
  screenEl.classList.remove('hidden');
}

/* ════════════════════════════════════════════════════════════════
   DASHBOARD
   ════════════════════════════════════════════════════════════════ */
async function fetchForms() {
  els.formGrid.innerHTML = '<div class="loading-spinner"></div>';
  try {
    const res  = await fetch(`${API_BASE}/forms`);
    const data = await res.json();
    formsData  = data.forms || [];
    renderFormGrid(formsData);
  } catch {
    els.formGrid.innerHTML = `<p style="color:var(--error); grid-column: 1/-1;">Error connecting to server. Is backend running?</p>`;
  }
}

function renderFormGrid(forms) {
  els.formGrid.innerHTML = '';
  forms.forEach((form, index) => {
    const card    = document.createElement('div');
    card.className = 'form-card';
    card.onclick   = () => startSession(form.id, form.name);

    const icon = ICONS[index % ICONS.length];
    card.innerHTML = `
      <div class="form-card-icon">${icon}</div>
      <h3>${form.name}</h3>
      <p>${selectedLang === 'en' ? 'Click to start filling' : 'भरना शुरू करने के लिए क्लिक करें'}</p>
    `;
    els.formGrid.appendChild(card);
  });

  // ── Coming Soon placeholder cards ──────────────────────────
  const comingSoonTitles = [
    { en: 'PAN Card', hi: 'पैन कार्ड' },
    { en: 'Passport Application', hi: 'पासपोर्ट आवेदन' },
    { en: 'Voter ID', hi: 'वोटर आईडी' },
  ];
  comingSoonTitles.forEach(() => {
    const card = document.createElement('div');
    card.className = 'form-card coming-soon';
    card.innerHTML = `
      <div class="form-card-icon">?</div>
      <h3>${selectedLang === 'en' ? 'Coming Soon' : 'जल्द आ रहा है'}</h3>
      <p>${selectedLang === 'en' ? 'Service not yet available' : 'सेवा अभी उपलब्ध नहीं है'}</p>
      <span class="coming-soon-badge">${selectedLang === 'en' ? 'Coming Soon' : 'जल्द आ रहा है'}</span>
    `;
    els.formGrid.appendChild(card);
  });
}

/* ════════════════════════════════════════════════════════════════
   CHAT SESSION
   ════════════════════════════════════════════════════════════════ */
async function startSession(formId, formName) {
  els.chatFormTitle.textContent = formName;
  els.chatArea.innerHTML        = '';
  els.previewBtn.classList.add('hidden');
  els.formImageBtn.classList.add('hidden');
  els.userInput.value = '';
  clearInputError();
  disableInput(true);

  addHistoryItem(formName);

  questionCount = 1;
  showScreen(els.screenChat);

  addBotMessage(`Selected <b>${formName}</b>`, false, false);
  showTyping();

  try {
    const res  = await fetch(`${API_BASE}/start-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formId })
    });
    const data = await res.json();

    hideTyping();
    if (data.error) throw new Error(data.error);

    currentSessionId = data.sessionId;
    els.previewBtn.classList.remove('hidden');
    els.formImageBtn.classList.remove('hidden');

    handleNextQuestion(data.firstQuestion);
  } catch (error) {
    hideTyping();
    addBotMessage(`Error: ${error.message}`, true, false);
  }
}

function addHistoryItem(formName) {
  const empty = els.chatHistoryList.querySelector('.empty-history');
  if (empty) empty.remove();

  const li   = document.createElement('li');
  li.className = 'history-item';
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  li.innerHTML = `<strong>${formName}</strong><br><span style="font-size:0.8em;opacity:0.7">${time}</span>`;
  els.chatHistoryList.prepend(li);
}

/* ── Render next question with TTS button ────────────────────── */
function handleNextQuestion(questionObj) {
  currentQuestion = questionObj;
  clearInputError();

  let label = selectedLang === 'en' ? questionObj.label_en : questionObj.label_hi;
  const originalLabelText = label; // Keep clean text for TTS
  
  // 1. Highlight terminology in the question label
  TERMS_DICTIONARY.forEach(termObj => {
    label = label.replace(termObj.regex, (match) => {
      return `<span class="term-highlight">${match}</span>`;
    });
  });

  // 2. Display field-specific explanation
  // We resolve it if it's a function (done on backend usually, but just in case)
  let explanationText = selectedLang === 'en' ? questionObj.explanation_en : questionObj.explanation_hi;
  if (explanationText) {
    addBotMessage(`<i>${explanationText}</i>`, false, false);
  }

  // Pass label text for TTS injection (TTS should read plain text)
  addBotMessage(label, false, true, originalLabelText);

  // Configure input type
  if (questionObj.type === 'number') els.userInput.type = 'number';
  else if (questionObj.type === 'date') els.userInput.type = 'date';
  else els.userInput.type = 'text';

  disableInput(false);
  els.userInput.focus();
}

/* ── Handle answer submission ────────────────────────────────── */
async function handleChatSubmit(e) {
  e.preventDefault();
  const answer = els.userInput.value.trim();

  // ── Client-side validation ─────────────────────────────────
  if (currentQuestion) {
    const result = validateClientSide(currentQuestion.validation, answer);
    if (!result.isValid) {
      showInputError(result.message);
      return;
    }
  }

  // Skip check (empty allowed for optional)
  const isOptional = currentQuestion &&
    (currentQuestion.validation === 'optional' || currentQuestion.validation === 'aadhaar_optional');
  if (!answer && !isOptional) return;

  disableInput(true);
  clearInputError();

  const isNo   = answer.toLowerCase() === 'no' || answer === 'नहीं';
  const isSkip = !answer;

  addMessage(answer || UI_TEXT[selectedLang].skipped, true);
  els.userInput.value = '';

  // Friendly acknowledgement
  if (isNo || isSkip) {
    const skipMsg = selectedLang === 'en'
      ? 'No problem, we will skip this.'
      : 'कोई बात नहीं, हम इसे छोड़ देंगे।';
    addBotMessage(skipMsg, false, false);
  } else {
    const msgsEn = ['Got it 👍', 'Understood.', 'Noted, thanks!', 'Perfect!'];
    const msgsHi = ['समझ गया 👍', 'ठीक है।', 'धन्यवाद!', 'उत्तम!'];
    const arr    = selectedLang === 'en' ? msgsEn : msgsHi;
    addBotMessage(arr[Math.floor(Math.random() * arr.length)], false, false);
  }

  showTyping();

  try {
    const res  = await fetch(`${API_BASE}/save-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: currentSessionId, answer })
    });
    const data = await res.json();

    hideTyping();

    if (data.error) {
      addBotMessage(data.error, true, false);
      disableInput(false);
      return;
    }

    if (data.completed) {
      addBotMessage(UI_TEXT[selectedLang].formCompleted, false, false);
      disableInput(true);
    } else {
      questionCount++;
      handleNextQuestion(data.nextQuestion);
    }
  } catch {
    hideTyping();
    addBotMessage(UI_TEXT[selectedLang].networkError, true, false);
    disableInput(false);
  }
}

/* ════════════════════════════════════════════════════════════════
   CHAT UI HELPERS
   ════════════════════════════════════════════════════════════════ */
function disableInput(disabled) {
  els.userInput.disabled = disabled;
  els.sendBtn.disabled   = disabled;
}

/**
 * Append a bot message bubble to the chat area.
 *
 * The TTS button is built with DOM APIs (NOT innerHTML onclick) to avoid
 * HTML-attribute quoting conflicts when label text contains quotes or
 * special characters (e.g. Hindi script, apostrophes).
 *
 * @param {string}  text       - HTML content of the message
 * @param {boolean} isError    - Highlight as error if true
 * @param {boolean} isQuestion - Shows question number badge + TTS button
 * @param {string}  [ttsText]  - Plain label text read aloud (for questions)
 */
function addBotMessage(text, isError = false, isQuestion = false, ttsText = '') {
  const row = document.createElement('div');
  row.className = 'msg-row bot';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  if (isError) bubble.style.borderLeft = '4px solid var(--error)';

  // ── Question header: badge + TTS speaker button ─────────────
  if (isQuestion) {
    const prefix = UI_TEXT[selectedLang].questionPrefix;

    // Wrapper row
    const header = document.createElement('div');
    header.className = 'question-header';

    // Question-number badge
    const badge = document.createElement('span');
    badge.className = 'question-number';
    badge.textContent = `${prefix} ${questionCount}`;

    // TTS button — built via DOM so text is stored as a JS value,
    // never serialised inside an HTML attribute string.
    const ttsBtn = document.createElement('button');
    ttsBtn.className = 'tts-btn';
    ttsBtn.title = 'Read aloud';
    ttsBtn.setAttribute('aria-label', 'Read question aloud');
    ttsBtn.innerHTML = speakerIconSVG();

    // Capture the plain label text in closure — safe for any characters
    const speakLabel = (ttsText || text).replace(/<[^>]*>/g, '');
    const speakLang  = selectedLang;           // snapshot at creation time
    ttsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      speakText(speakLabel, speakLang);
    });

    header.appendChild(badge);
    header.appendChild(ttsBtn);
    bubble.appendChild(header);
  }

  // ── Message body ─────────────────────────────────────────────
  const body = document.createElement('div');
  body.innerHTML = text;
  bubble.appendChild(body);

  row.appendChild(bubble);
  els.chatArea.appendChild(row);
  scrollToBottom();
}

function addMessage(text, isUser) {
  const row    = document.createElement('div');
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

/* Typing indicator node (reused) */
const typingNode = document.createElement('div');
typingNode.className = 'msg-row bot typing-wrapper';
typingNode.innerHTML = `<div class="bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;

function showTyping() {
  els.chatArea.appendChild(typingNode);
  scrollToBottom();
}
function hideTyping() {
  if (typingNode.parentNode) typingNode.parentNode.removeChild(typingNode);
}

/* ════════════════════════════════════════════════════════════════
   PREVIEW / SMART SUMMARY
   ════════════════════════════════════════════════════════════════ */
async function showPreview() {
  els.previewModal.classList.remove('hidden');
  els.previewContent.innerHTML = '<div class="loading-spinner"></div>';

  try {
    const res  = await fetch(`${API_BASE}/smart-summary?sessionId=${currentSessionId}&lang=${selectedLang}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    els.previewContent.innerHTML = data.html
      || `<p style="color:var(--error)">No guide generated.</p>`;
  } catch {
    els.previewContent.innerHTML = `<p style="color:var(--error)">Failed to load smart guide.</p>`;
  }
}
/* ── Start ───────────────────────────────────────────────────── */
init();