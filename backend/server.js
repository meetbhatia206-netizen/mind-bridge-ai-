const express = require('express');
const cors = require('cors');
const formController = require('./controllers/formController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger mapping
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.get('/api/forms', formController.getForms);
app.post('/api/start-session', formController.startSession);
app.get('/api/next-question', formController.getNextQuestion);
app.post('/api/validate', formController.validateAnswerEndpoint);
app.post('/api/save-answer', formController.saveAnswer);
app.get('/api/preview', formController.getPreview);
app.get('/api/generate-qr', formController.generateQr);
app.get('/api/smart-summary', formController.getSmartSummary);

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SmartGuide Backend running on http://localhost:${PORT}`);
});
