const API_BASE = 'http://localhost:3000/api';

const els = {
  chatArea: document.getElementById('chat-area'),
  formList: document.getElementById('form-list'),
  formSelectionPanel: document.getElementById('form-selection-panel'),
  inputArea: document.getElementById('input-area'),
  chatForm: document.getElementById('chat-form'),
  userInput: document.getElementById('user-input'),
  previewBtn: document.getElementById('preview-btn'),
  previewModal: document.getElementById('preview-modal'),
  closeModal: document.getElementById('close-modal'),
  previewContent: document.getElementById('preview-content')
};

let currentSessionId = null;
let currentQuestion = null;

// Initialize
async function init() {
  try {
    const res = await fetch(`${API_BASE}/forms`);
    const data = await res.json();
    renderFormList(data.forms);
  } catch (error) {
    els.formList.innerHTML = `<p style="color:var(--error)">Error connecting to server. Please ensure backend is running.</p>`;
  }
}

function renderFormList(forms) {
  els.formList.innerHTML = '';
  forms.forEach(form => {
    const btn = document.createElement('div');
    btn.className = 'form-option';
    btn.textContent = form.name;
    btn.onclick = () => startSession(form.id, form.name);
    els.formList.appendChild(btn);
  });
}

async function startSession(formId, formName) {
  els.formSelectionPanel.style.display = 'none';
  els.inputArea.classList.remove('hidden');
  
  // Show "started" text
  addMessage(`Selected <b>${formName}</b>`, true);
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
    
  } catch(error) {
    hideTyping();
    addBotMessage(`Error: ${error.message}`, true);
  }
}

function handleNextQuestion(questionObj) {
  currentQuestion = questionObj;
  const content = `
    <span class="label-en">${questionObj.label_en}</span>
    <span class="label-hi">${questionObj.label_hi}</span>
  `;
  addBotMessage(content, false);

  // Configure input
  if(questionObj.type === 'number') els.userInput.type = 'number';
  else if(questionObj.type === 'date') els.userInput.type = 'date';
  else els.userInput.type = 'text';

  els.userInput.focus();
}

els.chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const answer = els.userInput.value.trim();
  if(!answer && currentQuestion.validation !== 'optional' && currentQuestion.validation !== 'aadhaar_optional') return;

  // Add user msg
  addMessage(answer || '(Skipped)', true);
  els.userInput.value = '';
  
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
      addBotMessage(data.error, true); // show error
      // ask again
      setTimeout(() => handleNextQuestion(currentQuestion), 500);
      return;
    }
    
    if(data.completed) {
      els.inputArea.classList.add('hidden');
      addBotMessage(`Form completed successfully! 🎉<br><br>Tap the <b>Preview</b> button to view your responses.`, false);
    } else {
      handleNextQuestion(data.nextQuestion);
    }

  } catch (error) {
    hideTyping();
    addBotMessage(`Network Error. Please try again.`, true);
  }
});

// UI Helpers
function addBotMessage(content, isError = false) {
  const row = document.createElement('div');
  row.className = 'msg-row bot';
  const bubble = document.createElement('div');
  bubble.className = `bubble ${isError ? 'error' : ''}`;
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
  bubble.innerHTML = text; // Safe here for basic prototype since it's controlled
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


// Preview Logic
els.previewBtn.addEventListener('click', async () => {
  els.previewModal.classList.remove('hidden');
  els.previewContent.innerHTML = `<div class="loading-spinner"></div>`;
  
  try {
    const res = await fetch(`${API_BASE}/preview?sessionId=${currentSessionId}`);
    const data = await res.json();
    
    if(data.error) throw new Error(data.error);
    
    let html = `<h3>${data.formName}</h3><hr style="border-color:var(--glass-border);margin:10px 0;"><br>`;
    
    data.fields.forEach(f => {
      const resp = data.answers[f.id] || '<span style="color:var(--text-secondary)">Not filled</span>';
      html += `
        <div class="preview-field">
          <div class="q">${f.label_en} / ${f.label_hi}</div>
          <div class="a">${resp}</div>
        </div>
      `;
    });
    
    els.previewContent.innerHTML = html;
  } catch (error) {
    els.previewContent.innerHTML = `<p style="color:var(--error)">Failed to load preview.</p>`;
  }
});

els.closeModal.addEventListener('click', () => {
  els.previewModal.classList.add('hidden');
});

// Start
init();
