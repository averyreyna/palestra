# Palestra Backend - AI Question Generation Service

This backend service integrates with the Claude API to generate intelligent questions about codebases.

## Setup Instructions

### 1. Install Dependencies
```bash
cd src/backend
npm install
```

### 2. Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Claude API key
# Get your API key from: https://console.anthropic.com/
```

### 3. Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### POST /api/generate-questions
Generates questions based on a codebase structure.

**Request Body:**
```json
{
  "codebase": {
    "name": "Project Name",
    "description": "Project description",
    "files": [/* file structure */]
  },
  "numQuestions": 5
}
```

**Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "question": "What is the purpose of...",
      "category": "architecture",
      "difficulty": "intermediate",
      "relatedFiles": ["file1.tsx", "file2.ts"]
    }
  ]
}
```

### GET /api/health
Health check endpoint.

## Frontend Integration

The frontend can use the `QuestionService` class from `src/services/questionService.ts` to interact with this backend:

```typescript
import { QuestionService } from '../services/questionService';

// Generate questions for a codebase
const questions = await QuestionService.generateQuestions({
  codebase: mockCodebase,
  numQuestions: 5
});

// Check if backend is healthy
const isHealthy = await QuestionService.checkHealth();
```

## Environment Variables

- `CLAUDE_API_KEY`: Your Claude API key from Anthropic
- `PORT`: Server port (default: 3001)

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (missing codebase data)
- `500`: Server error (API key not configured, Claude API error, etc.)
