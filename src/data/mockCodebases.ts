import { MockCodebase, CodeQuestion } from '../types';

export const mockCodebases: MockCodebase[] = [
  {
    name: "Todo App",
    description: "A simple React todo application with TypeScript",
    files: [
      {
        name: "src",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "App.tsx",
            type: "file",
            content: `import React, { useState } from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import './App.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      <AddTodo onAdd={addTodo} />
      <TodoList 
        todos={todos} 
        onToggle={toggleTodo} 
        onDelete={deleteTodo} 
      />
    </div>
  );
}

export default App;`
          },
          {
            name: "components",
            type: "folder",
            isOpen: true,
            children: [
              {
                name: "TodoList.tsx",
                type: "file",
                content: `import React from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete }) => {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <span>{todo.text}</span>
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;`
              },
              {
                name: "AddTodo.tsx",
                type: "file",
                content: `import React, { useState } from 'react';

interface AddTodoProps {
  onAdd: (text: string) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddTodo;`
              }
            ]
          },
          {
            name: "App.css",
            type: "file",
            content: `.App {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-list li.completed span {
  text-decoration: line-through;
  color: #888;
}

.add-todo {
  display: flex;
  margin-bottom: 20px;
}

.add-todo input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-todo button {
  padding: 10px 20px;
  margin-left: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`
          }
        ]
      },
      {
        name: "package.json",
        type: "file",
        content: `{
  "name": "todo-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^4.9.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}`
      },
      {
        name: "backend",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "app.py",
            type: "file",
            content: `from flask import Flask, request, jsonify
from flask_cors import CORS
from typing import List, Dict
import json
import os

app = Flask(__name__)
CORS(app)

# In-memory storage for todos
todos: List[Dict] = []
next_id = 1

@app.route('/api/todos', methods=['GET'])
def get_todos():
    """Get all todos"""
    return jsonify(todos)

@app.route('/api/todos', methods=['POST'])
def create_todo():
    """Create a new todo"""
    global next_id
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({'error': 'Text is required'}), 400
    
    todo = {
        'id': next_id,
        'text': data['text'],
        'completed': False
    }
    
    todos.append(todo)
    next_id += 1
    
    return jsonify(todo), 201

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id: int):
    """Update a todo"""
    data = request.get_json()
    
    for todo in todos:
        if todo['id'] == todo_id:
            if 'text' in data:
                todo['text'] = data['text']
            if 'completed' in data:
                todo['completed'] = data['completed']
            return jsonify(todo)
    
    return jsonify({'error': 'Todo not found'}), 404

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id: int):
    """Delete a todo"""
    global todos
    todos = [todo for todo in todos if todo['id'] != todo_id]
    return '', 204

if __name__ == '__main__':
    app.run(debug=True, port=5000)`
          },
          {
            name: "models.py",
            type: "file",
            content: `from dataclasses import dataclass
from typing import Optional

@dataclass
class Todo:
    """Todo model"""
    id: int
    text: str
    completed: bool = False
    
    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'text': self.text,
            'completed': self.completed
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Todo':
        return cls(
            id=data['id'],
            text=data['text'],
            completed=data.get('completed', False)
        )`
          },
          {
            name: "requirements.txt",
            type: "file",
            content: `Flask==2.3.3
Flask-CORS==4.0.0
requests==2.31.0`
          }
        ]
      }
    ]
  },
  {
    name: "Weather Dashboard",
    description: "A weather dashboard with API integration",
    files: [
      {
        name: "src",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "App.tsx",
            type: "file",
            content: `import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import { WeatherData } from './types/weather';
import './App.css';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: WeatherData = {
        city,
        temperature: Math.floor(Math.random() * 30) + 10,
        condition: 'Sunny',
        humidity: Math.floor(Math.random() * 50) + 30,
        windSpeed: Math.floor(Math.random() * 20) + 5,
      };
      
      setWeather(mockData);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather('New York');
  }, []);

  return (
    <div className="App">
      <h1>Weather Dashboard</h1>
      <SearchBar onSearch={fetchWeather} />
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {weather && <WeatherCard weather={weather} />}
    </div>
  );
}

export default App;`
          },
          {
            name: "components",
            type: "folder",
            isOpen: false,
            children: [
              {
                name: "WeatherCard.tsx",
                type: "file",
                content: `import React from 'react';
import { WeatherData } from '../types/weather';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <div className="weather-card">
      <h2>{weather.city}</h2>
      <div className="temperature">{weather.temperature}°C</div>
      <div className="condition">{weather.condition}</div>
      <div className="details">
        <div>Humidity: {weather.humidity}%</div>
        <div>Wind: {weather.windSpeed} km/h</div>
      </div>
    </div>
  );
};

export default WeatherCard;`
              }
            ]
          }
        ]
      },
      {
        name: "backend",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "app.py",
            type: "file",
            content: `from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from typing import Optional

app = FastAPI(title="Weather API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WeatherResponse(BaseModel):
    city: str
    temperature: float
    condition: str
    humidity: int
    wind_speed: float
    description: str

class WeatherRequest(BaseModel):
    city: str
    units: Optional[str] = "metric"

@app.get("/")
async def root():
    return {"message": "Weather API is running"}

@app.get("/api/weather/{city}")
async def get_weather(city: str, units: str = "metric"):
    """Get weather data for a specific city"""
    try:
        # In a real app, you'd call an external weather API
        # For demo purposes, we'll return mock data
        weather_data = await fetch_weather_data(city, units)
        return weather_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/weather")
async def get_weather_post(request: WeatherRequest):
    """Get weather data via POST request"""
    try:
        weather_data = await fetch_weather_data(request.city, request.units)
        return weather_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def fetch_weather_data(city: str, units: str) -> WeatherResponse:
    """Fetch weather data from external API or return mock data"""
    # Mock weather data for demo
    import random
    
    conditions = ["Sunny", "Cloudy", "Rainy", "Snowy", "Partly Cloudy"]
    descriptions = {
        "Sunny": "Clear skies with bright sunshine",
        "Cloudy": "Overcast with thick cloud cover",
        "Rainy": "Light to moderate rainfall",
        "Snowy": "Snow showers expected",
        "Partly Cloudy": "Mix of sun and clouds"
    }
    
    condition = random.choice(conditions)
    temp_range = (15, 30) if units == "metric" else (59, 86)
    
    return WeatherResponse(
        city=city.title(),
        temperature=round(random.uniform(*temp_range), 1),
        condition=condition,
        humidity=random.randint(30, 80),
        wind_speed=round(random.uniform(5, 25), 1),
        description=descriptions[condition]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`
          },
          {
            name: "models.py",
            type: "file",
            content: `from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class WeatherData(BaseModel):
    """Weather data model"""
    city: str = Field(..., description="City name")
    temperature: float = Field(..., description="Temperature in specified units")
    condition: str = Field(..., description="Weather condition")
    humidity: int = Field(..., ge=0, le=100, description="Humidity percentage")
    wind_speed: float = Field(..., ge=0, description="Wind speed")
    description: str = Field(..., description="Detailed weather description")
    timestamp: Optional[datetime] = Field(default_factory=datetime.now)
    units: str = Field(default="metric", description="Temperature units (metric/imperial)")

class WeatherRequest(BaseModel):
    """Weather request model"""
    city: str = Field(..., min_length=1, description="City name to get weather for")
    units: Optional[str] = Field(default="metric", description="Units for temperature")
    
class APIResponse(BaseModel):
    """Generic API response model"""
    success: bool
    message: str
    data: Optional[dict] = None`
          },
          {
            name: "requirements.txt",
            type: "file",
            content: `fastapi==0.104.1
uvicorn[standard]==0.24.0
httpx==0.25.2
pydantic==2.5.0
python-multipart==0.0.6`
          }
        ]
      }
    ]
  }
];

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
