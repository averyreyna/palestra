import React from 'react';
import { FileNode } from '../types';
import './FileExplorer.css';

interface FileExplorerProps {
  files: FileNode[];
  selectedFile: string | null;
  onFileSelect: (file: FileNode) => void;
  onFolderToggle: (folderName: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  selectedFile,
  onFileSelect,
  onFolderToggle
}) => {
  const renderFileNode = (node: FileNode, depth: number = 0) => {
    const isSelected = selectedFile === node.name;
    
    return (
      <div key={node.name} className="file-node">
        <div
          className={`file-item ${isSelected ? 'selected' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              onFolderToggle(node.name);
            } else {
              onFileSelect(node);
            }
          }}
        >
          <span className="file-icon">
            {node.type === 'folder' ? (node.isOpen ? '📂' : '📁') : '📄'}
          </span>
          <span className="file-name">{node.name}</span>
        </div>
        {node.type === 'folder' && node.isOpen && node.children && (
          <div className="folder-children">
            {node.children.map(child => renderFileNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <h3>Explorer</h3>
      </div>
      <div className="file-tree">
        {files.map(file => renderFileNode(file))}
      </div>
    </div>
  );
};

export default FileExplorer;
