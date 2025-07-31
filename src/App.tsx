import React, { useState } from 'react';
import '@fontsource/fira-code';
import '@fontsource/inter';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import ChatInterface from './components/ChatInterface';
import ProjectSelector from './components/ProjectSelector';
import { mockCodebases, codeQuestions } from './data/mockCodebases';
import { FileNode, MockCodebase, CodeQuestion } from './types';
import './App.css';

function App() {
  const [selectedCodebase, setSelectedCodebase] = useState<MockCodebase | null>(mockCodebases[0]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<CodeQuestion | null>(null);
  const [files, setFiles] = useState<FileNode[]>(mockCodebases[0]?.files || []);

  const handleCodebaseSelect = (codebase: MockCodebase) => {
    setSelectedCodebase(codebase);
    setFiles(codebase.files);
    setSelectedFile(null);
    setCurrentQuestion(null);
  };

  const handleFileSelect = (file: FileNode) => {
    setSelectedFile(file);
  };

  const handleFolderToggle = (folderName: string) => {
    const toggleFolder = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.name === folderName && node.type === 'folder') {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: toggleFolder(node.children) };
        }
        return node;
      });
    };
    setFiles(toggleFolder(files));
  };

  const handleNewQuestion = () => {
    // Get a random question related to the current codebase
    const availableQuestions = codeQuestions.filter(q => {
      if (!selectedCodebase) return true;
      // Simple matching based on codebase name
      return q.context.toLowerCase().includes(selectedCodebase.name.toLowerCase().split(' ')[0]);
    });
    
    const randomQuestion = availableQuestions.length > 0 
      ? availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
      : codeQuestions[Math.floor(Math.random() * codeQuestions.length)];
    
    setCurrentQuestion(randomQuestion);
  };

  const handleAnswerSubmit = (answer: string) => {
    console.log('Answer submitted:', answer);
    // Here you could implement answer validation, scoring, etc.
  };

  return (
    <div className="App">
      <ProjectSelector 
        codebases={mockCodebases}
        selectedCodebase={selectedCodebase}
        onCodebaseSelect={handleCodebaseSelect}
      />
      <div className="main-content">
        <FileExplorer 
          files={files}
          selectedFile={selectedFile?.name || null}
          onFileSelect={handleFileSelect}
          onFolderToggle={handleFolderToggle}
        />
        <CodeEditor selectedFile={selectedFile} />
        <ChatInterface 
          currentQuestion={currentQuestion}
          onAnswerSubmit={handleAnswerSubmit}
          onNewQuestion={handleNewQuestion}
        />
      </div>
    </div>
  );
}

export default App;
