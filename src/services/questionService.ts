import { CodeQuestion } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface GenerateQuestionsRequest {
  codebase: {
    name: string;
    description: string;
    files: any[];
  };
  numQuestions?: number;
}

export interface GenerateQuestionsResponse {
  questions: CodeQuestion[];
}

export class QuestionService {
  static async generateQuestions(request: GenerateQuestionsRequest): Promise<CodeQuestion[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-questions`, {
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

      const data: GenerateQuestionsResponse = await response.json();
      return data.questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      throw error;
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}
