import React, { useState, useEffect, useRef } from 'react';
import { MockCodebase } from '../types';
import './ProjectDropdown.css';

interface ProjectDropdownProps {
  codebases: MockCodebase[];
  selectedCodebase: MockCodebase | null;
  onCodebaseSelect: (codebase: MockCodebase) => void;
}

const ProjectDropdown: React.FC<ProjectDropdownProps> = ({
  codebases,
  selectedCodebase,
  onCodebaseSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (codebase: MockCodebase) => {
    onCodebaseSelect(codebase);
    setIsOpen(false);
  };

  return (
    <div className="project-dropdown" ref={dropdownRef}>
      <button 
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="project-label">Project:</span>
        <span className="selected-project">
          {selectedCodebase?.name || 'Select Project'}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          {codebases.map((codebase, index) => (
            <div
              key={index}
              className={`dropdown-item ${selectedCodebase?.name === codebase.name ? 'selected' : ''}`}
              onClick={() => handleSelect(codebase)}
            >
              <div className="dropdown-project-name">{codebase.name}</div>
              <div className="dropdown-project-description">{codebase.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDropdown;
