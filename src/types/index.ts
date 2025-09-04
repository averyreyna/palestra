export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

export interface MockCodebase {
  name: string;
  description: string;
  files: FileNode[];
}

export interface CodeQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category?: 'architecture' | 'functionality' | 'best-practices' | 'edge-cases' | 'testing';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  relatedFiles?: string[];
  context?: string;
}

export interface ChatMessage {
  id: string;
  type: 'question' | 'answer';
  content: string;
  timestamp: Date;
}
