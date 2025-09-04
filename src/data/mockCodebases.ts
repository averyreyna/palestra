import { MockCodebase, CodeQuestion } from '../types';

export const mockCodebases: MockCodebase[] = [
  {
    name: "CollabSpace",
    description: "Enterprise collaboration platform with real-time editing, WebSocket connections, microservices architecture, and advanced permission systems",
    files: [
      {
        name: "frontend",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "src",
            type: "folder",
            isOpen: true,
            children: [
              {
                name: "components",
                type: "folder",
                isOpen: false,
                children: [
                  {
                    name: "workspace",
                    type: "folder",
                    isOpen: false,
                    children: [
                      {
                        name: "Canvas.tsx",
                        type: "file",
                        content: `import React, { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useCollaboration } from '../../hooks/useCollaboration';
import { CanvasElement, User, CursorPosition } from '../../types';
import './Canvas.css';

interface CanvasProps {
  workspaceId: string;
  userId: string;
}

export const Canvas: React.FC<CanvasProps> = ({ workspaceId, userId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedTool, setSelectedTool] = useState<'select' | 'rectangle' | 'text'>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  
  const { socket, isConnected } = useWebSocket(\`ws://localhost:3001/workspace/\${workspaceId}\`);
  const { 
    collaborators, 
    cursors, 
    broadcastCursor, 
    broadcastElementUpdate 
  } = useCollaboration(socket, userId);

  useEffect(() => {
    if (!socket) return;

    socket.on('element:created', (element: CanvasElement) => {
      setElements(prev => [...prev, element]);
    });

    socket.on('element:updated', (element: CanvasElement) => {
      setElements(prev => prev.map(el => el.id === element.id ? element : el));
    });

    socket.on('element:deleted', (elementId: string) => {
      setElements(prev => prev.filter(el => el.id !== elementId));
    });

    return () => {
      socket.off('element:created');
      socket.off('element:updated');
      socket.off('element:deleted');
    };
  }, [socket]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const position: CursorPosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      userId,
      timestamp: Date.now()
    };

    broadcastCursor(position);
  };

  const createElement = (x: number, y: number, width: number, height: number) => {
    const element: CanvasElement = {
      id: \`element_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`,
      type: selectedTool === 'rectangle' ? 'rectangle' : 'text',
      x, y, width, height,
      properties: {
        fill: selectedTool === 'rectangle' ? '#3b82f6' : 'transparent',
        stroke: '#1f2937',
        strokeWidth: 2,
        text: selectedTool === 'text' ? 'Double click to edit' : undefined
      },
      createdBy: userId,
      createdAt: new Date().toISOString(),
      version: 1
    };

    broadcastElementUpdate('create', element);
    return element;
  };

  return (
    <div className="canvas-container">
      <div className="canvas-toolbar">
        <button 
          className={\`tool-btn \${selectedTool === 'select' ? 'active' : ''}\`}
          onClick={() => setSelectedTool('select')}
        >
          Select
        </button>
        <button 
          className={\`tool-btn \${selectedTool === 'rectangle' ? 'active' : ''}\`}
          onClick={() => setSelectedTool('rectangle')}
        >
          Rectangle
        </button>
        <button 
          className={\`tool-btn \${selectedTool === 'text' ? 'active' : ''}\`}
          onClick={() => setSelectedTool('text')}
        >
          Text
        </button>
        <div className="connection-status">
          <span className={\`status-indicator \${isConnected ? 'connected' : 'disconnected'}\`}></span>
          {collaborators.length} online
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="workspace-canvas"
        width={1200}
        height={800}
        onMouseMove={handleMouseMove}
      />
      
      <div className="collaborator-cursors">
        {Object.entries(cursors).map(([userId, cursor]) => (
          <div
            key={userId}
            className="collaborator-cursor"
            style={{
              left: cursor.x,
              top: cursor.y,
              borderColor: collaborators.find(c => c.id === userId)?.color || '#666'
            }}
          >
            <span className="cursor-label">
              {collaborators.find(c => c.id === userId)?.name || 'Anonymous'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};`
                      }
                    ]
                  },
                  {
                    name: "auth",
                    type: "folder",
                    isOpen: false,
                    children: [
                      {
                        name: "AuthProvider.tsx",
                        type: "file",
                        content: `import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState } from '../../types';
import { authService } from '../../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const user = await authService.validateToken(token);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          localStorage.removeItem('auth_token');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await authService.login(email, password);
      localStorage.setItem('auth_token', token);
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const refreshToken = async () => {
    try {
      const newToken = await authService.refreshToken();
      localStorage.setItem('auth_token', newToken);
      setAuthState(prev => ({ ...prev, token: newToken }));
    } catch (error) {
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};`
                      }
                    ]
                  }
                ]
              },
              {
                name: "hooks",
                type: "folder",
                isOpen: false,
                children: [
                  {
                    name: "useWebSocket.ts",
                    type: "file",
                    content: `import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const newSocket = io(url, {
      transports: ['websocket'],
      upgrade: false,
      rememberUpgrade: false
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        setTimeout(() => {
          newSocket.connect();
        }, Math.pow(2, reconnectAttempts.current) * 1000);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [url]);

  return { socket, isConnected };
};`
                  }
                ]
              },
              {
                name: "services",
                type: "folder",
                isOpen: false,
                children: [
                  {
                    name: "apiClient.ts",
                    type: "file",
                    content: `import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:3001') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = \`Bearer \${token}\`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();`
                  }
                ]
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
            name: "src",
            type: "folder",
            isOpen: true,
            children: [
              {
                name: "controllers",
                type: "folder",
                isOpen: false,
                children: [
                  {
                    name: "workspaceController.ts",
                    type: "file",
                    content: `import { Request, Response } from 'express';
import { WorkspaceService } from '../services/WorkspaceService';
import { AuthenticatedRequest } from '../middleware/auth';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '../dto/workspace.dto';
import { validateDto } from '../utils/validation';

export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  async createWorkspace(req: AuthenticatedRequest, res: Response) {
    try {
      const createDto = await validateDto(CreateWorkspaceDto, req.body);
      const workspace = await this.workspaceService.createWorkspace(
        createDto,
        req.user!.id
      );
      
      res.status(201).json({
        success: true,
        data: workspace,
        message: 'Workspace created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getWorkspaces(req: AuthenticatedRequest, res: Response) {
    try {
      const workspaces = await this.workspaceService.getUserWorkspaces(req.user!.id);
      
      res.json({
        success: true,
        data: workspaces
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getWorkspace(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const workspace = await this.workspaceService.getWorkspaceById(
        id,
        req.user!.id
      );
      
      if (!workspace) {
        return res.status(404).json({
          success: false,
          error: 'Workspace not found'
        });
      }

      res.json({
        success: true,
        data: workspace
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateWorkspace(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateDto = await validateDto(UpdateWorkspaceDto, req.body);
      
      const workspace = await this.workspaceService.updateWorkspace(
        id,
        updateDto,
        req.user!.id
      );
      
      res.json({
        success: true,
        data: workspace,
        message: 'Workspace updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}`
                  }
                ]
              },
              {
                name: "services",
                type: "folder",
                isOpen: false,
                children: [
                  {
                    name: "WebSocketService.ts",
                    type: "file",
                    content: `import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { RedisAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { CollaborationEvent, CursorPosition, CanvasElement } from '../types';

export class WebSocketService {
  private io: SocketIOServer;
  private redisClient: any;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.setupRedis();
    this.setupEventHandlers();
  }

  private async setupRedis() {
    if (process.env.REDIS_URL) {
      const pubClient = createClient({ url: process.env.REDIS_URL });
      const subClient = pubClient.duplicate();
      
      await Promise.all([pubClient.connect(), subClient.connect()]);
      
      this.io.adapter(new RedisAdapter(pubClient, subClient));
      this.redisClient = pubClient;
    }
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log(\`User connected: \${socket.id}\`);

      socket.on('join:workspace', async (workspaceId: string, userId: string) => {
        await socket.join(workspaceId);
        
        // Notify others in the workspace
        socket.to(workspaceId).emit('user:joined', {
          userId,
          socketId: socket.id,
          timestamp: new Date().toISOString()
        });

        // Send current workspace state to the new user
        const workspaceState = await this.getWorkspaceState(workspaceId);
        socket.emit('workspace:state', workspaceState);
      });

      socket.on('cursor:move', (data: CursorPosition & { workspaceId: string }) => {
        socket.to(data.workspaceId).emit('cursor:update', {
          userId: data.userId,
          x: data.x,
          y: data.y,
          timestamp: data.timestamp
        });
      });

      socket.on('element:create', async (data: CanvasElement & { workspaceId: string }) => {
        // Save to database
        await this.saveElement(data.workspaceId, data);
        
        // Broadcast to all users in workspace
        socket.to(data.workspaceId).emit('element:created', data);
      });

      socket.on('element:update', async (data: CanvasElement & { workspaceId: string }) => {
        // Optimistic concurrency control
        const currentElement = await this.getElement(data.workspaceId, data.id);
        if (currentElement && currentElement.version !== data.version - 1) {
          socket.emit('element:conflict', {
            elementId: data.id,
            currentVersion: currentElement.version,
            conflictingUpdate: data
          });
          return;
        }

        await this.updateElement(data.workspaceId, data);
        socket.to(data.workspaceId).emit('element:updated', data);
      });

      socket.on('disconnect', () => {
        console.log(\`User disconnected: \${socket.id}\`);
      });
    });
  }

  private async getWorkspaceState(workspaceId: string) {
    // Implementation would fetch from database
    return {
      elements: [],
      collaborators: []
    };
  }

  private async saveElement(workspaceId: string, element: CanvasElement) {
    // Implementation would save to database
    console.log(\`Saving element \${element.id} to workspace \${workspaceId}\`);
  }

  private async getElement(workspaceId: string, elementId: string) {
    // Implementation would fetch from database
    return null;
  }

  private async updateElement(workspaceId: string, element: CanvasElement) {
    // Implementation would update in database
    console.log(\`Updating element \${element.id} in workspace \${workspaceId}\`);
  }
}`
                  }
                ]
              },
              {
                name: "models",
                type: "folder",
                isOpen: false,
                children: [
                  {
                    name: "Workspace.ts",
                    type: "file",
                    content: `import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './User';
import { WorkspaceElement } from './WorkspaceElement';
import { WorkspaceMember } from './WorkspaceMember';

export enum WorkspaceVisibility {
  PRIVATE = 'private',
  TEAM = 'team',
  PUBLIC = 'public'
}

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: WorkspaceVisibility,
    default: WorkspaceVisibility.PRIVATE
  })
  visibility: WorkspaceVisibility;

  @Column({ type: 'json', nullable: true })
  settings: {
    allowComments: boolean;
    allowExport: boolean;
    autoSave: boolean;
    gridEnabled: boolean;
    snapToGrid: boolean;
  };

  @Column({ name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => User, user => user.ownedWorkspaces)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => WorkspaceElement, element => element.workspace)
  elements: WorkspaceElement[];

  @OneToMany(() => WorkspaceMember, member => member.workspace)
  members: WorkspaceMember[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_accessed_at', nullable: true })
  lastAccessedAt: Date;

  // Virtual properties
  get memberCount(): number {
    return this.members?.length || 0;
  }

  get elementCount(): number {
    return this.elements?.length || 0;
  }
}`
                  }
                ]
              }
            ]
          },
          {
            name: "package.json",
            type: "file",
            content: `{
  "name": "collabspace-backend",
  "version": "1.0.0",
  "description": "Real-time collaborative workspace platform backend",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "migrate": "typeorm migration:run",
    "migrate:revert": "typeorm migration:revert"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "@socket.io/redis-adapter": "^8.2.1",
    "typeorm": "^0.3.17",
    "pg": "^8.11.3",
    "redis": "^4.6.7",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "rate-limiter-flexible": "^2.4.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.4.5",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/bcryptjs": "^2.4.2",
    "typescript": "^5.1.6",
    "nodemon": "^3.0.1",
    "ts-node": "^10.9.1",
    "jest": "^29.6.2",
    "@types/jest": "^29.5.3"
  }
}`
          }
        ]
      },
      {
        name: "docker-compose.yml",
        type: "file",
        content: `version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:3001
      - REACT_APP_WS_URL=ws://localhost:3001
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/collabspace
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-super-secret-jwt-key
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=collabspace
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:`
      },
      {
        name: "README.md",
        type: "file",
        content: `# CollabSpace - Real-time Collaborative Workspace Platform

A modern, enterprise-grade collaborative workspace platform similar to Figma or Miro, built with React, Node.js, WebSockets, and PostgreSQL.

## 🚀 Features

### Real-time Collaboration
- **Live Cursors**: See where team members are working in real-time
- **Simultaneous Editing**: Multiple users can edit the same workspace simultaneously
- **Conflict Resolution**: Optimistic concurrency control with automatic conflict resolution
- **Presence Indicators**: Know who's online and active in each workspace

### Advanced Canvas System
- **Vector Graphics**: Create and manipulate shapes, text, and complex elements
- **Layering System**: Advanced z-index management with layer controls
- **Smart Snapping**: Grid and object snapping for precise alignment
- **Infinite Canvas**: Zoom and pan across unlimited workspace area

### Enterprise Security
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Owner, Editor, Viewer permissions
- **Workspace Privacy**: Private, Team, and Public workspace visibility
- **Rate Limiting**: API protection against abuse

### Scalable Architecture
- **Microservices Ready**: Modular backend architecture
- **Redis Clustering**: Horizontal scaling for WebSocket connections
- **Database Optimization**: Efficient queries with proper indexing
- **Docker Containerization**: Easy deployment and scaling

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Component Architecture**: Reusable, typed components
- **State Management**: Context API with custom hooks
- **Real-time Updates**: Socket.io client integration
- **Performance Optimized**: Canvas rendering with RAF optimization

### Backend (Node.js + Express)
- **RESTful API**: Clean, documented API endpoints
- **WebSocket Server**: Real-time communication layer
- **Database Layer**: TypeORM with PostgreSQL
- **Caching Layer**: Redis for session and real-time data

### Infrastructure
- **PostgreSQL**: Primary database for persistent data
- **Redis**: Session storage and WebSocket scaling
- **Docker**: Containerized development and deployment
- **Load Balancing**: Ready for horizontal scaling

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Socket.io Client
- Canvas API for rendering
- CSS3 with CSS Variables

**Backend:**
- Node.js with Express
- Socket.io Server
- TypeORM with PostgreSQL
- Redis for caching and sessions
- JWT for authentication

**DevOps:**
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7
- Nginx (production)

## 🚦 Getting Started

1. **Clone and Setup**
   \`\`\`bash
   git clone <repository>
   cd collabspace
   \`\`\`

2. **Start with Docker**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

## 📊 Performance Features

- **Optimistic Updates**: Immediate UI feedback
- **Debounced Operations**: Efficient real-time synchronization
- **Canvas Virtualization**: Render only visible elements
- **Connection Resilience**: Automatic reconnection with exponential backoff

This platform demonstrates enterprise-level patterns used by companies like Figma, Discord, and Slack for building scalable, real-time collaborative applications.`
      }
    ]
  }
];

export const addGeneratedCodebase = (codebase: MockCodebase) => {
  mockCodebases.push(codebase);
};

export const codeQuestions: CodeQuestion[] = [
  {
    id: 1,
    question: "In the Canvas component's real-time collaboration system, what happens when a user's cursor position update fails to broadcast due to a temporary WebSocket disconnection, and how does the system handle cursor state reconciliation upon reconnection?",
    options: [
      "Cursor positions are lost permanently and other users see stale cursor data until manual refresh",
      "The useWebSocket hook implements exponential backoff reconnection, and cursor state is reconciled by re-emitting the last known position with a timestamp check",
      "The system queues all cursor updates in localStorage and replays them sequentially upon reconnection",
      "Cursor broadcasting switches to HTTP polling as a fallback mechanism during WebSocket outages"
    ],
    correctAnswer: 1,
    explanation: "The useWebSocket hook implements exponential backoff reconnection (up to 5 attempts with Math.pow(2, attempts) * 1000ms delays). Upon reconnection, the Canvas component re-emits the current cursor position, and the collaboration system uses timestamps to prevent stale cursor updates from overriding newer positions.",
    category: "functionality",
    difficulty: "advanced",
    relatedFiles: ["frontend/src/components/workspace/Canvas.tsx", "frontend/src/hooks/useWebSocket.ts"],
    context: "Analyzing edge cases in real-time collaboration and network resilience patterns"
  },
  {
    id: 2,
    question: "When the AuthProvider's JWT token refresh fails due to network issues during an active user session, what cascade of events occurs to maintain security while preserving user experience, and how does it handle race conditions between multiple concurrent API requests?",
    options: [
      "All API requests immediately fail with 401 errors and the user is logged out without warning",
      "The system retries token refresh indefinitely while blocking all API requests until success",
      "Failed refresh triggers logout, but axios interceptors handle 401s by queuing requests, attempting one refresh, and either resolving queued requests or redirecting to login",
      "Token refresh failures are ignored and the system continues using expired tokens until the next manual refresh"
    ],
    correctAnswer: 2,
    explanation: "The AuthProvider's refreshToken method throws on failure, triggering the logout flow. However, the axios response interceptor creates a more sophisticated flow: it detects 401s, removes invalid tokens, and redirects to login. The interceptor pattern prevents race conditions by handling token validation at the HTTP layer rather than component level.",
    category: "architecture",
    difficulty: "advanced",
    relatedFiles: ["frontend/src/components/auth/AuthProvider.tsx", "frontend/src/services/apiClient.ts"],
    context: "Examining authentication edge cases, error handling, and concurrent request management"
  },
  {
    id: 3,
    question: "In the WebSocketService's optimistic concurrency control, if two users simultaneously update the same canvas element and both have version 5, but User A's update reaches the server 10ms before User B's, what specific conflict resolution strategy is employed and how does it prevent data corruption in high-frequency collaborative scenarios?",
    options: [
      "Last-write-wins: User B's update overwrites User A's changes without conflict detection",
      "The server accepts User A's update (version 6), then emits 'element:conflict' to User B with currentVersion: 6 and conflictingUpdate containing User B's attempted changes",
      "Both updates are merged automatically using operational transformation algorithms",
      "The server creates a branched version tree and requires manual conflict resolution from both users"
    ],
    correctAnswer: 1,
    explanation: "The WebSocketService implements vector clock-based optimistic concurrency control. When User A's update arrives first, it increments the version to 6. User B's update fails the version check (currentVersion.version !== data.version - 1), triggering an 'element:conflict' event with the current state and User B's conflicting changes. This prevents data corruption while enabling client-side conflict resolution strategies like operational transformation or user-guided merging.",
    category: "architecture",
    difficulty: "advanced",
    relatedFiles: ["backend/src/services/WebSocketService.ts"],
    context: "Deep-diving into distributed systems conflict resolution and data consistency patterns"
  },
  {
    id: 4,
    question: "Given the Workspace model's TypeORM relationships, what database-level constraints and cascading behaviors occur when a workspace owner transfers ownership to another user who is currently only a WorkspaceMember, and how does this affect foreign key integrity across the relationship graph?",
    options: [
      "The transfer fails due to foreign key constraints preventing ownership changes",
      "The new owner is automatically removed from WorkspaceMember table, ownerId updates, and cascade rules ensure referential integrity while preserving WorkspaceElement ownership history",
      "Both users become co-owners through a many-to-many relationship modification",
      "The workspace is duplicated with separate ownership to avoid constraint violations"
    ],
    correctAnswer: 1,
    explanation: "The ownership transfer involves: 1) Updating the ownerId foreign key to the new user, 2) Removing the new owner from WorkspaceMember table to prevent duplicate relationships, 3) TypeORM's cascade rules ensure WorkspaceElement records maintain their createdBy history while the workspace ownership changes. The @JoinColumn and relationship decorators ensure referential integrity throughout the transfer process.",
    category: "architecture",
    difficulty: "advanced",
    relatedFiles: ["backend/src/models/Workspace.ts", "backend/src/models/WorkspaceMember.ts"],
    context: "Analyzing complex database relationship management and referential integrity in ownership transfer scenarios"
  },
  {
    id: 5,
    question: "In the ApiClient's interceptor architecture, when multiple API requests are made simultaneously and the first request triggers a 401 response during token validation, how does the system prevent a cascade of redundant login redirects while ensuring all pending requests are handled appropriately?",
    options: [
      "Each 401 response triggers an immediate redirect, potentially causing multiple login page navigations",
      "The response interceptor uses a singleton pattern with request queuing: first 401 removes token and redirects, subsequent 401s are ignored until page reload",
      "All requests are cancelled immediately upon any 401 response to prevent data inconsistency",
      "The system implements a token refresh queue where all requests wait for a single refresh attempt before proceeding"
    ],
    correctAnswer: 1,
    explanation: "The axios response interceptor implements a race condition prevention pattern: when a 401 occurs, it immediately removes the token from localStorage and calls window.location.href = '/login'. Subsequent 401s from concurrent requests will find no token in localStorage, preventing multiple redirects. The interceptor's synchronous token removal ensures all pending requests fail fast rather than attempting redundant authentication flows.",
    category: "functionality",
    difficulty: "advanced",
    relatedFiles: ["frontend/src/services/apiClient.ts"],
    context: "Examining HTTP interceptor patterns, race condition prevention, and concurrent request handling in authentication systems"
  },
  {
    id: 6,
    question: "When analyzing the Docker Compose configuration's service dependencies and network topology, what potential bottlenecks could emerge during horizontal scaling, and how do the Redis adapter and PostgreSQL connection pooling strategies address concurrent WebSocket session management?",
    options: [
      "Redis becomes a single point of failure, and PostgreSQL connections are unlimited leading to resource exhaustion",
      "The Redis adapter enables WebSocket session distribution across multiple backend instances, while PostgreSQL connection pooling prevents connection exhaustion during concurrent workspace operations",
      "Docker Compose networking creates latency issues that prevent real-time collaboration features from functioning",
      "All services must scale together proportionally, making independent scaling impossible"
    ],
    correctAnswer: 1,
    explanation: "The RedisAdapter enables horizontal scaling by allowing multiple backend instances to share WebSocket session state. When users connect to different backend instances, Redis pub/sub ensures real-time events are broadcast across all instances. PostgreSQL connection pooling (configured via DATABASE_URL) prevents connection exhaustion during high-concurrency workspace operations. The Docker network topology allows independent scaling of frontend, backend, and database layers.",
    category: "architecture",
    difficulty: "advanced",
    relatedFiles: ["docker-compose.yml", "backend/src/services/WebSocketService.ts"],
    context: "Evaluating scalability patterns, distributed system architecture, and infrastructure bottleneck analysis"
  }
];
