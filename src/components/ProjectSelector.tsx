import React from 'react';
import { MockCodebase } from '../types';
import './ProjectSelector.css';

interface ProjectSelectorProps {
  codebases: MockCodebase[];
  selectedCodebase: MockCodebase | null;
  onCodebaseSelect: (codebase: MockCodebase) => void;
  onShowGenerator: () => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  codebases,
  selectedCodebase,
  onCodebaseSelect,
  onShowGenerator
}) => {
  return (
    <div className="project-selector">
      <div className="selector-header">
        <div className="prototype-name">Palestra</div>
        {codebases.length > 0 && (
          <button className="generate-btn" onClick={onShowGenerator}>
            + Generate New
          </button>
        )}
      </div>
      {codebases.length === 0 ? (
        <div className="empty-state">
          <button className="generate-btn-centered" onClick={onShowGenerator}>
            + Generate New
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ProjectSelector;
