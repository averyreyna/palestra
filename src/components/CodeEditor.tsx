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

  const renderMarkdown = (content: string) => {
    // Simple markdown renderer for basic formatting
    let html = content
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```[\s\S]*?```/g, (match) => {
        const code = match.replace(/```/g, '').trim();
        return `<pre><code>${code}</code></pre>`;
      })
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Lists
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // Wrap consecutive list items in ul tags
    html = html.replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/g, '<ul>$&</ul>');
    
    // Wrap in paragraphs
    html = `<p>${html}</p>`;
    
    return html;
  };

  const isMarkdownFile = (fileName: string) => {
    return fileName.toLowerCase().endsWith('.md') || fileName.toLowerCase() === 'readme';
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
  const isMarkdown = isMarkdownFile(selectedFile.name);

  return (
    <div className="code-editor">
      <div className="editor-header">
        <div className="tab">
          <span className="tab-icon">📄</span>
          <span className="tab-name">{selectedFile.name}</span>
        </div>
      </div>
      <div className="editor-content">
        {!isMarkdown && (
          <div className="line-numbers">
            {renderLineNumbers(content)}
          </div>
        )}
        <div className={`code-content ${isMarkdown ? 'markdown-content' : ''}`}>
          {isMarkdown ? (
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
          ) : (
            <pre>
              <code>
                {renderCodeContent(content)}
              </code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
