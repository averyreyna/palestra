import { Router } from 'express';
import { claudeService, CodeGenerationRequest } from '../services/claudeService';

export const codeGenerationRouter = Router();

codeGenerationRouter.post('/generate-codebase', async (req, res) => {
  try {
    const request: CodeGenerationRequest = req.body;
    
    // Validate request
    if (!request.projectName || !request.projectDescription || !request.framework) {
      return res.status(400).json({ 
        error: 'Missing required fields: projectName, projectDescription, framework' 
      });
    }

    if (!request.features || !Array.isArray(request.features)) {
      return res.status(400).json({ 
        error: 'Features must be provided as an array' 
      });
    }

    const codebase = await claudeService.generateCodebase(request);
    
    res.json({
      success: true,
      data: codebase
    });
  } catch (error) {
    console.error('Code generation error:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

codeGenerationRouter.get('/project-ideas', async (req, res) => {
  try {
    const count = parseInt(req.query.count as string) || 5;
    const ideas = await claudeService.generateProjectIdeas(count);
    
    res.json({
      success: true,
      data: ideas
    });
  } catch (error) {
    console.error('Project ideas generation error:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

codeGenerationRouter.get('/frameworks', (req, res) => {
  const frameworks = [
    { id: 'react-typescript', name: 'React + TypeScript', description: 'Modern React with TypeScript' },
    { id: 'nextjs', name: 'Next.js', description: 'Full-stack React framework' },
    { id: 'vue', name: 'Vue 3', description: 'Progressive Vue.js framework' },
    { id: 'node-express', name: 'Node + Express', description: 'Backend API with Express.js' },
    { id: 'python-flask', name: 'Python Flask', description: 'Lightweight Python web framework' },
    { id: 'python-fastapi', name: 'Python FastAPI', description: 'Modern Python API framework' }
  ];

  res.json({
    success: true,
    data: frameworks
  });
});