import { MockCodebase } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface CodeGenerationRequest {
  projectName: string;
  projectDescription: string;
  framework: 'react-typescript' | 'nextjs' | 'vue' | 'node-express' | 'python-flask' | 'python-fastapi';
  features: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  includeBackend: boolean;
}

export interface ProjectIdea {
  name: string;
  description: string;
  features: string[];
  complexity: string;
}

export interface Framework {
  id: string;
  name: string;
  description: string;
}

export class CodeGenerationService {
  static async generateCodebase(request: CodeGenerationRequest): Promise<MockCodebase> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-codebase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error generating codebase:', error);
      throw error;
    }
  }

  static async getProjectIdeas(count: number = 5): Promise<ProjectIdea[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/project-ideas?count=${count}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching project ideas:', error);
      throw error;
    }
  }

  static async getAvailableFrameworks(): Promise<Framework[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/frameworks`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching frameworks:', error);
      throw error;
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}