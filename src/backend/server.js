const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Claude API configuration
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

if (!CLAUDE_API_KEY) {
  console.warn('Warning: CLAUDE_API_KEY not found in environment variables');
}

// Generate questions based on codebase
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { codebase, numQuestions = 5 } = req.body;

    if (!codebase) {
      return res.status(400).json({ error: 'Codebase data is required' });
    }

    if (!CLAUDE_API_KEY) {
      return res.status(500).json({ error: 'Claude API key not configured' });
    }

    // Prepare the codebase content for Claude
    const codebaseContent = extractCodebaseContent(codebase);
    
    const prompt = `You are an expert code reviewer and educator. Based on the following codebase, generate ${numQuestions} thoughtful questions that would help someone understand the code better. The questions should cover:

1. Code structure and architecture
2. Functionality and purpose
3. Best practices and potential improvements
4. Edge cases and error handling
5. Testing and maintainability

Codebase:
${codebaseContent}

Please return the questions as a JSON array of objects with the following structure:
[
  {
    "id": 1,
    "question": "What is the purpose of...",
    "category": "architecture|functionality|best-practices|edge-cases|testing",
    "difficulty": "beginner|intermediate|advanced",
    "relatedFiles": ["filename1.tsx", "filename2.ts"]
  }
]

Only return the JSON array, no additional text.`;

    const response = await axios.post(CLAUDE_API_URL, {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });

    let questions;
    try {
      questions = JSON.parse(response.data.content[0].text);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', response.data.content[0].text);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    res.json({ questions });

  } catch (error) {
    console.error('Error generating questions:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to generate questions',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Extract code content from codebase structure
function extractCodebaseContent(codebase) {
  let content = `Project: ${codebase.name}\nDescription: ${codebase.description}\n\n`;
  
  function processFiles(files, path = '') {
    files.forEach(file => {
      if (file.type === 'folder' && file.children) {
        content += `\n--- Folder: ${path}${file.name} ---\n`;
        processFiles(file.children, `${path}${file.name}/`);
      } else if (file.type === 'file' && file.content) {
        content += `\n--- File: ${path}${file.name} ---\n`;
        content += file.content + '\n';
      }
    });
  }
  
  processFiles(codebase.files);
  return content;
}

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
