import { MockCodebase, CodeQuestion } from '../types';
import { CodeGenerationService } from '../services/codeGenerationService';

// Legacy mock codebases - these will be supplemented by Claude-generated ones
export const mockCodebases: MockCodebase[] = [];

// Helper function to add a generated codebase to the list
export const addGeneratedCodebase = (codebase: MockCodebase) => {
  mockCodebases.push(codebase);
};

export const codeQuestions: CodeQuestion[] = [
  {
    id: 1,
    question: "What HTTP method and endpoint does the Flask backend use to create a new todo item?",
    category: "functionality",
    difficulty: "beginner",
    relatedFiles: ["app.py"],
    context: "Looking at the Todo App backend API in app.py",
    expectedAnswer: "POST method to /api/todos endpoint, which accepts JSON data with a 'text' field and returns the created todo with a generated ID"
  },
  {
    id: 2,
    question: "How does the Todo model in models.py handle data conversion between Python objects and dictionaries?",
    category: "architecture",
    difficulty: "intermediate",
    relatedFiles: ["models.py"],
    context: "Examining the Todo dataclass in the backend models.py file",
    expectedAnswer: "It provides to_dict() method to convert Todo objects to dictionaries and from_dict() class method to create Todo objects from dictionary data"
  },
  {
    id: 3,
    question: "What FastAPI middleware is configured in the Weather Dashboard backend to handle cross-origin requests?",
    category: "architecture",
    difficulty: "intermediate",
    relatedFiles: ["app.py"],
    context: "Looking at the CORS configuration in the Weather API app.py",
    expectedAnswer: "CORSMiddleware is configured to allow requests from http://localhost:3000 with all methods and headers enabled"
  },
  {
    id: 4,
    question: "How does the Weather API generate mock weather data when a real external API isn't available?",
    category: "functionality",
    difficulty: "intermediate",
    relatedFiles: ["app.py"],
    context: "Examining the fetch_weather_data function in the Weather Dashboard backend",
    expectedAnswer: "It uses Python's random module to generate realistic weather data including random conditions, temperatures within realistic ranges, humidity, and wind speed"
  },
  {
    id: 5,
    question: "What validation does the WeatherRequest model enforce in the Weather Dashboard backend?",
    category: "best-practices",
    difficulty: "beginner",
    relatedFiles: ["models.py"],
    context: "Looking at the Pydantic models in the Weather API models.py",
    expectedAnswer: "It requires a city name with minimum length of 1 character and optionally accepts units parameter with default value 'metric'"
  },
  {
    id: 6,
    question: "How does the Todo App frontend and backend maintain data consistency when updating todo items?",
    category: "architecture",
    difficulty: "advanced",
    relatedFiles: ["App.tsx", "app.py"],
    context: "Comparing the React state management with the Flask API endpoints",
    expectedAnswer: "The frontend sends PUT requests to /api/todos/<id> with updated data, and the backend finds the matching todo by ID and updates only the provided fields"
  },
  {
    id: 7,
    question: "What Python frameworks are used for the Todo App and Weather Dashboard backends respectively?",
    category: "architecture",
    difficulty: "beginner",
    relatedFiles: ["requirements.txt", "app.py"],
    context: "Examining the backend requirements.txt files and import statements",
    expectedAnswer: "Todo App uses Flask with Flask-CORS for the REST API, while Weather Dashboard uses FastAPI with built-in CORS middleware"
  },
  {
    id: 8,
    question: "How do both applications handle error responses when API calls fail?",
    category: "edge-cases",
    difficulty: "intermediate",
    relatedFiles: ["app.py"],
    context: "Looking at error handling in both backend app.py files",
    expectedAnswer: "Flask returns JSON error messages with appropriate HTTP status codes (400, 404), while FastAPI raises HTTPException with status codes and detail messages"
  }
];
