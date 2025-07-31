import React from 'react';
import { MockCodebase } from '../types';
import './ProjectSelector.css';

interface ProjectSelectorProps {
  codebases: MockCodebase[];
  selectedCodebase: MockCodebase | null;
  onCodebaseSelect: (codebase: MockCodebase) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  codebases,
  selectedCodebase,
  onCodebaseSelect
}) => {
  return (
    <div className="project-selector">
      <div className="selector-header">
        <h3>AI Generated Projects</h3>
      </div>
      <div className="project-list">
        {codebases.map((codebase, index) => (
          <div
            key={index}
            className={`project-item ${selectedCodebase?.name === codebase.name ? 'selected' : ''}`}
            onClick={() => onCodebaseSelect(codebase)}
          >
            <div className="project-name">{codebase.name}</div>
            <div className="project-description">{codebase.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSelector;
