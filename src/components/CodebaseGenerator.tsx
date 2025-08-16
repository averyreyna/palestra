import React, { useState, useEffect } from 'react';
import { CodeGenerationService, CodeGenerationRequest, ProjectIdea, Framework } from '../services/codeGenerationService';
import { MockCodebase } from '../types';
import './CodebaseGenerator.css';

interface CodebaseGeneratorProps {
  onCodebaseGenerated: (codebase: MockCodebase) => void;
}

export const CodebaseGenerator: React.FC<CodebaseGeneratorProps> = ({ onCodebaseGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CodeGenerationRequest>({
    projectName: '',
    projectDescription: '',
    framework: 'react-typescript',
    features: [''],
    complexity: 'moderate',
    includeBackend: false
  });

  useEffect(() => {
    loadFrameworks();
  }, []);

  const loadFrameworks = async () => {
    try {
      const data = await CodeGenerationService.getAvailableFrameworks();
      setFrameworks(data);
    } catch (err) {
      console.error('Failed to load frameworks:', err);
    }
  };

  const loadProjectIdeas = async () => {
    setLoadingIdeas(true);
    try {
      const ideas = await CodeGenerationService.getProjectIdeas();
      setProjectIdeas(ideas);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project ideas');
    } finally {
      setLoadingIdeas(false);
    }
  };

  const handleInputChange = (field: keyof CodeGenerationRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const applyProjectIdea = (idea: ProjectIdea) => {
    setFormData(prev => ({
      ...prev,
      projectName: idea.name,
      projectDescription: idea.description,
      features: idea.features,
      complexity: idea.complexity as any
    }));
  };

  const generateCodebase = async () => {
    if (!formData.projectName.trim() || !formData.projectDescription.trim()) {
      setError('Project name and description are required');
      return;
    }

    const validFeatures = formData.features.filter(f => f.trim() !== '');
    if (validFeatures.length === 0) {
      setError('At least one feature is required');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const requestData = {
        ...formData,
        features: validFeatures
      };

      const codebase = await CodeGenerationService.generateCodebase(requestData);
      onCodebaseGenerated(codebase);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate codebase');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="codebase-generator">
      <div className="generator-content">
        <div className="form-section">
          <h3>Project Details</h3>
          
          <div className="form-group">
            <label>Project Name</label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => handleInputChange('projectName', e.target.value)}
              placeholder="e.g., Task Manager Pro"
            />
          </div>

          <div className="form-group">
            <label>Project Description</label>
            <textarea
              value={formData.projectDescription}
              onChange={(e) => handleInputChange('projectDescription', e.target.value)}
              placeholder="Describe what your project should do..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Framework</label>
              <select
                value={formData.framework}
                onChange={(e) => handleInputChange('framework', e.target.value)}
              >
                {frameworks.map(fw => (
                  <option key={fw.id} value={fw.id}>
                    {fw.name} - {fw.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Complexity</label>
              <select
                value={formData.complexity}
                onChange={(e) => handleInputChange('complexity', e.target.value)}
              >
                <option value="simple">Simple</option>
                <option value="moderate">Moderate</option>
                <option value="complex">Complex</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Include Backend</label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.includeBackend}
                onChange={(e) => handleInputChange('includeBackend', e.target.checked)}
              />
              Generate backend API along with frontend
            </label>
          </div>

          <div className="form-group">
            <label>Features</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="feature-input">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="remove-feature"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addFeature} className="add-feature">
              Add Feature
            </button>
          </div>

          <div className="form-actions">
            <button
              onClick={generateCodebase}
              disabled={isGenerating}
              className="generate-btn"
            >
              {isGenerating ? 'Generating...' : 'Generate Codebase'}
            </button>
          </div>
        </div>

        <div className="ideas-section">
          <div className="ideas-header">
            <h3>Need Ideas?</h3>
            <button onClick={loadProjectIdeas} disabled={loadingIdeas} className="load-ideas-btn">
              {loadingIdeas ? 'Loading...' : 'Get Project Ideas'}
            </button>
          </div>

          {projectIdeas.length > 0 && (
            <div className="project-ideas">
              {projectIdeas.map((idea, index) => (
                <div key={index} className="project-idea">
                  <div className="idea-header">
                    <h4>{idea.name}</h4>
                    <span className={`complexity-badge ${idea.complexity}`}>
                      {idea.complexity}
                    </span>
                  </div>
                  <p>{idea.description}</p>
                  <div className="idea-features">
                    {idea.features.slice(0, 3).map((feature, fi) => (
                      <span key={fi} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => applyProjectIdea(idea)}
                    className="use-idea-btn"
                  >
                    Use This Idea
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};