const https = require('https');

/**
 * summaryGenerator.js
 * Generates a personalized wellness guide using the Google Gemini API.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGeminiAPI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(body);
            const text = parsed.candidates[0].content.parts[0].text;
            resolve(text);
          } catch (e) {
            reject(new Error("Failed to parse Gemini response: " + body));
          }
        } else {
          reject(new Error(`Gemini API Error (${res.statusCode}): ${body}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function generateSummary(formId, answers, lang) {
  const isHi = lang === 'hi';
  
  // Format the user's answers into a clear context string
  let answersContext = Object.entries(answers)
    .map(([key, val]) => `- ${key}: ${val}`)
    .join('\\n');

  // Construct the prompt for Gemini
  const prompt = `
You are MindBridge AI, an empathetic and supportive mental wellness mentor.
A user has just completed a check-in about "${formId}".
Here are their responses:
${answersContext}

Based on these answers, generate a "Personalized Wellness Guide" for them.
The guide should be formatted in clean HTML (DO NOT USE markdown block formatting like \`\`\`html, just output raw HTML).
It must be extremely caring and non-judgmental.

Include EXACTLY these sections in the HTML using <h3> tags:
1. "Stress Management"
2. "Sleep Improvement"
3. "Emotional Wellness Tips"
4. "Healthy Daily Habits"
5. "Motivation Guidance"
6. "When to Seek Professional Help"

Under each section, provide 2-3 personalized bullet points (<ul><li>) based on their answers.

End the guide with a closing "Daily Affirmation" inside a styled div block.

Use inline CSS for styling to match a calm, dark-themed glassmorphism aesthetic.
Example styles:
- Text color: #42474f
- Headings: color: #2e6194; margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; font-size: 1.2rem;
- Lists: margin-bottom: 8px; padding-left: 20px;
- Affirmation box: background: rgba(46,97,148,0.1); border: 1px solid rgba(46,97,148,0.2); padding: 20px; border-radius: 12px; margin-top: 20px; text-align: center; font-style: italic; color: #2e6194;

Please write the output in ${isHi ? 'Hindi' : 'English'}.
  `;

  try {
    const aiHtmlResponse = await callGeminiAPI(prompt);
    
    // Clean up potential markdown formatting if the model still includes it
    let cleanHtml = aiHtmlResponse.trim();
    if (cleanHtml.startsWith('\`\`\`html')) {
      cleanHtml = cleanHtml.substring(7);
      if (cleanHtml.endsWith('\`\`\`')) {
        cleanHtml = cleanHtml.substring(0, cleanHtml.length - 3);
      }
    } else if (cleanHtml.startsWith('\`\`\`')) {
       cleanHtml = cleanHtml.substring(3);
       if (cleanHtml.endsWith('\`\`\`')) {
         cleanHtml = cleanHtml.substring(0, cleanHtml.length - 3);
       }
    }

    return cleanHtml;
  } catch (error) {
    console.error("Error generating dynamic summary:", error);
    // Fallback if API fails
    return `
      <div style="font-family: inherit; line-height: 1.6; color: #e2e8f0;">
        <h2 style="border-bottom: 2px solid #818cf8; padding-bottom: 8px; margin-bottom: 20px;">Your Personalized Wellness Guide</h2>
        <p>We are currently experiencing high traffic and couldn't generate your personalized guide dynamically. Please remember to take deep breaths and be kind to yourself today.</p>
      </div>
    `;
  }
}

module.exports = { generateSummary };
