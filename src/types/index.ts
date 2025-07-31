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
  id: string;
  question: string;
  context: string;
  expectedAnswer?: string;
}

export interface ChatMessage {
  id: string;
  type: 'question' | 'answer';
  content: string;
  timestamp: Date;
}
