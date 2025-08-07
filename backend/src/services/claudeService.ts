import Anthropic from '@anthropic-ai/sdk';

export interface CodeGenerationRequest {
  projectName: string;
  projectDescription: string;
  framework: 'react-typescript' | 'nextjs' | 'vue' | 'node-express' | 'python-flask' | 'python-fastapi';
  features: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  includeBackend: boolean;
}

export interface FileStructure {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileStructure[];
  isOpen?: boolean;
}

export interface GeneratedCodebase {
  name: string;
  description: string;
  files: FileStructure[];
}

class ClaudeService {
  private client: Anthropic;

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
    console.log('API Key loaded:', process.env.ANTHROPIC_API_KEY?.slice(0, 20) + '...');
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async generateCodebase(request: CodeGenerationRequest): Promise<GeneratedCodebase> {
    const prompt = this.buildCodeGenerationPrompt(request);

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return this.parseCodebaseResponse(content.text, request);
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to generate codebase with Claude');
    }
  }

  private buildCodeGenerationPrompt(request: CodeGenerationRequest): string {
    return `Generate a ${request.complexity} ${request.framework} project called "${request.projectName}".

Project Description: ${request.projectDescription}

Required Features:
${request.features.map(f => `- ${f}`).join('\n')}

Requirements:
- Generate production-ready, enterprise-quality code
- Include proper TypeScript types where applicable
- Follow modern best practices and patterns
- Include error handling and validation
- Add comprehensive comments and documentation
- ${request.includeBackend ? 'Include a backend API with appropriate endpoints' : 'Frontend only'}
- Make the code modular and maintainable
- Include package.json with necessary dependencies

Please structure your response as a JSON object with this exact format:
{
  "files": [
    {
      "name": "folder-name",
      "type": "folder",
      "isOpen": true,
      "children": [
        {
          "name": "file-name.tsx",
          "type": "file",
          "content": "// Complete file content here"
        }
      ]
    },
    {
      "name": "package.json",
      "type": "file",
      "content": "// Complete package.json content"
    }
  ]
}

Important: Return ONLY the JSON object, no additional text or formatting.`;
  }

  private parseCodebaseResponse(response: string, request: CodeGenerationRequest): GeneratedCodebase {
    try {
      // Clean the response to extract JSON
      let jsonStr = response.trim();
      
      // Remove any markdown code blocks
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```[json]*\n?/, '').replace(/\n?```$/, '');
      }

      const parsed = JSON.parse(jsonStr);
      
      return {
        name: request.projectName,
        description: request.projectDescription,
        files: parsed.files || []
      };
    } catch (error) {
      console.error('Failed to parse Claude response:', error);
      console.log('Raw response:', response);
      throw new Error('Invalid response format from Claude');
    }
  }

  async generateProjectIdeas(count: number = 5): Promise<Array<{ name: string; description: string; features: string[]; complexity: string }>> {
    const prompt = `Generate ${count} diverse, enterprise-level software project ideas. Each should be practical, modern, and suitable for demonstrating professional development skills.

Return as JSON array with this exact format:
[
  {
    "name": "Project Name",
    "description": "Brief description of what this project does",
    "features": ["Feature 1", "Feature 2", "Feature 3"],
    "complexity": "simple" | "moderate" | "complex"
  }
]

Focus on:
- Business applications (CRM, analytics, e-commerce)
- Developer tools and utilities
- Modern web applications with real-world use cases
- Projects that showcase different technical skills

Return ONLY the JSON array, no additional text.`;

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      let jsonStr = content.text.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```[json]*\n?/, '').replace(/\n?```$/, '');
      }

      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Failed to generate project ideas:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  }
}

export const claudeService = new ClaudeService();