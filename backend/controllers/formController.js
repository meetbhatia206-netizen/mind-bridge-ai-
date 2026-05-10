const { v4: uuidv4 } = require('uuid');
const forms = require('../data/forms');
const store = require('../data/store');
const { validateAnswer, processAnswer } = require('../utils/validators');
const summaryGenerator = require('../utils/summaryGenerator');

// Helper to evaluate dynamic fields safely before JSON response
function prepareQuestion(question, answers) {
  const q = { ...question };
  if (typeof q.explanation_en === 'function') q.explanation_en = q.explanation_en(answers);
  if (typeof q.explanation_hi === 'function') q.explanation_hi = q.explanation_hi(answers);
  delete q.condition;
  return q;
}

const getForms = (req, res) => {
  const formList = Object.values(forms).map(form => ({
    id: form.id,
    name: form.name
  }));
  res.json({ forms: formList });
};

const startSession = (req, res) => {
  const { formId } = req.body;
  if (!formId || !forms[formId]) {
    return res.status(400).json({ error: 'Invalid or missing formId' });
  }

  const sessionId = uuidv4();
  const form = forms[formId];
  const session = store.createSession(sessionId, formId, form.fields.length);

  res.json({
    sessionId: session.sessionId,
    message: 'Session started successfully',
    firstQuestion: form.fields[0],
    totalSteps: session.totalSteps
  });
};

const getNextQuestion = (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });

  const session = store.getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const form = forms[session.formId];

  // Advance if current question has a condition that fails
  while (session.currentStepIndex < session.totalSteps) {
    const nextQuestion = form.fields[session.currentStepIndex];
    if (nextQuestion && nextQuestion.condition) {
      try {
        if (!nextQuestion.condition(session.answers)) {
          session.currentStepIndex += 1;
          continue;
        }
      } catch (e) { console.error('Condition err:', e) }
    }
    break;
  }

  if (session.status === 'completed' || session.currentStepIndex >= session.totalSteps) {
    return res.json({ completed: true, message: 'All questions answered.' });
  }

  const nextQuestion = form.fields[session.currentStepIndex];

  res.json({ completed: false, question: prepareQuestion(nextQuestion, session.answers), currentStep: session.currentStepIndex + 1, totalSteps: session.totalSteps });
};

const validateAnswerEndpoint = (req, res) => {
  const { sessionId, answer } = req.body;
  
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
  
  const session = store.getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  
  const form = forms[session.formId];
  const currentField = form.fields[session.currentStepIndex];

  const validationResult = validateAnswer(currentField.validation, answer);
  
  if (!validationResult.isValid) {
    return res.json({ valid: false, error: validationResult.message });
  }
  
  res.json({ valid: true });
};

const saveAnswer = (req, res) => {
  const { sessionId, answer } = req.body;
  
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
  
  const session = store.getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  
  if (session.status === 'completed') {
    return res.status(400).json({ error: 'Form already completed' });
  }

  const form = forms[session.formId];
  const currentField = form.fields[session.currentStepIndex];

  const validationResult = validateAnswer(currentField.validation, answer);
  if (!validationResult.isValid) {
    return res.status(400).json({ error: validationResult.message });
  }

  // Process and save answer
  const processedAnswer = processAnswer(currentField.validation, answer);
  session.answers[currentField.id] = processedAnswer;
  
  // Increment step and check conditions for next steps
  session.currentStepIndex += 1;
  while (session.currentStepIndex < session.totalSteps) {
    const nextQ = form.fields[session.currentStepIndex];
    if (nextQ && nextQ.condition) {
      try {
        if (!nextQ.condition(session.answers)) {
          session.currentStepIndex += 1;
          continue;
        }
      } catch (e) {}
    }
    break;
  }

  const isCompleted = session.currentStepIndex >= session.totalSteps;
  
  if (isCompleted) {
    session.status = 'completed';
  }
  
  store.updateSession(sessionId, session);

  if (isCompleted) {
    res.json({ completed: true, message: 'Form completed successfully', answers: session.answers });
  } else {
    const nextQuestion = form.fields[session.currentStepIndex];
    res.json({ completed: false, nextQuestion: prepareQuestion(nextQuestion, session.answers), currentStep: session.currentStepIndex + 1, totalSteps: session.totalSteps });
  }
};

const getPreview = (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
  
  const session = store.getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const form = forms[session.formId];
  
  res.json({
    form: session.formId,
    formName: form.name,
    sessionId: session.sessionId,
    status: session.status,
    answers: session.answers,
    fields: form.fields // Include fields so frontend can render labels properly
  });
};

const generateQr = (req, res) => {
  // A mock QR code generator endpoint
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
  
  const datalink = `smartguide://form/${sessionId}`;
  // For a prototype, just returning a dummy image or the link
  res.json({
    qrCodeDataUri: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDIwMCAyMDAiPgo8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZmZmZiIvPgo8dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDAwMDAwIj5RdU1vY2sgUVIgQ29kZTwvdGV4dD4KPC9zdmc+Cg==',
    link: datalink
  });
};

const getSmartSummary = async (req, res) => {
  const { sessionId, lang } = req.query;
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
  
  const session = store.getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  
  const form = forms[session.formId];
  if (!form) return res.status(404).json({ error: 'Form layout not found' });
  
  try {
    const htmlSummary = await summaryGenerator.generateSummary(session.formId, session.answers, lang || 'en');
    res.send({ html: htmlSummary });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: 'Failed to generate guide.' });
  }
};

module.exports = {
  getForms,
  startSession,
  getNextQuestion,
  validateAnswerEndpoint,
  saveAnswer,
  getPreview,
  generateQr,
  getSmartSummary
};
