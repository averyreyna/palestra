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
      }
    ]
  }
];

export const codeQuestions: CodeQuestion[] = [
  {
    id: "1",
    question: "What TypeScript interface is used to define the structure of a todo item in this application?",
    context: "Looking at the Todo App codebase, specifically the App.tsx file.",
    expectedAnswer: "The Todo interface with properties: id (number), text (string), and completed (boolean)"
  },
  {
    id: "2",
    question: "How does the toggleTodo function work in the main App component?",
    context: "Examining the state management logic in App.tsx",
    expectedAnswer: "It uses the map method to create a new array, toggling the completed property of the todo with the matching id while keeping others unchanged"
  },
  {
    id: "3",
    question: "What React hook is used for managing the weather data state in the Weather Dashboard?",
    context: "Looking at the state management in the Weather Dashboard App.tsx",
    expectedAnswer: "useState hook is used to manage weather data, loading state, and error state"
  },
  {
    id: "4",
    question: "What CSS class is applied to completed todo items to show they're done?",
    context: "Examining the styling logic in TodoList.tsx and App.css",
    expectedAnswer: "The 'completed' class, which applies text-decoration: line-through and color: #888"
  }
];
