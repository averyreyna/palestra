import React from 'react';
import { FileNode } from '../types';
import './CodeEditor.css';

interface CodeEditorProps {
  selectedFile: FileNode | null;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ selectedFile }) => {
  const renderLineNumbers = (content: string) => {
    const lines = content.split('\n');
    return lines.map((_, index) => (
      <div key={index} className="line-number">
        {index + 1}
      </div>
    ));
  };

  const renderCodeContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => (
      <div key={index} className="code-line">
        {line || ' '}
      </div>
    ));
  };

  if (!selectedFile || selectedFile.type === 'folder') {
    return (
      <div className="code-editor">
        <div className="editor-placeholder">
          <div className="placeholder-content">
            <h2>Welcome to Palestra</h2>
            <p>Go ahead and look around the codebases</p>
          </div>
        </div>
      </div>
    );
  }

  const content = selectedFile.content || '';

  return (
    <div className="code-editor">
      <div className="editor-header">
        <div className="tab">
          <span className="tab-icon">📄</span>
          <span className="tab-name">{selectedFile.name}</span>
        </div>
      </div>
      <div className="editor-content">
        <div className="line-numbers">
          {renderLineNumbers(content)}
        </div>
        <div className="code-content">
          <pre>
            <code>
              {renderCodeContent(content)}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
