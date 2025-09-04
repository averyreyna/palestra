import React, { useState } from 'react';
import '@fontsource/fira-code';
import '@fontsource/inter';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import ProjectDropdown from './components/ProjectDropdown';
import ExperimentInfo from './components/ExperimentInfo';
import { CodebaseGenerator } from './components/CodebaseGenerator';
import { mockCodebases, codeQuestions, addGeneratedCodebase } from './data/mockCodebases';
import { FileNode, MockCodebase, CodeQuestion } from './types';
import './App.css';

function App() {
  const [codebases, setCodebases] = useState<MockCodebase[]>(mockCodebases);
  const [selectedCodebase, setSelectedCodebase] = useState<MockCodebase | null>(mockCodebases[0] || null);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<CodeQuestion | null>(null);
  const [files, setFiles] = useState<FileNode[]>(mockCodebases[0]?.files || []);
  const [showGenerator, setShowGenerator] = useState(false);

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
      return q.context?.toLowerCase().includes(selectedCodebase.name.toLowerCase().split(' ')[0]) || false;
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

  const handleCodebaseGenerated = (newCodebase: MockCodebase) => {
    addGeneratedCodebase(newCodebase);
    setCodebases([...codebases, newCodebase]);
    setSelectedCodebase(newCodebase);
    setFiles(newCodebase.files);
    setSelectedFile(null);
    setCurrentQuestion(null);
    setShowGenerator(false);
  };

  const handleShowGenerator = () => {
    setShowGenerator(true);
  };

  const handleBackToProjects = () => {
    setShowGenerator(false);
  };

  if (showGenerator) {
    return (
      <div className="App">
        <Header 
          title="Palestra"
          showBackButton={true}
          onBackClick={handleBackToProjects}
        />
        <CodebaseGenerator onCodebaseGenerated={handleCodebaseGenerated} />
      </div>
    );
  }

  return (
    <div className="App">
      <Header title="Palestra">
        <ProjectDropdown 
          codebases={codebases}
          selectedCodebase={selectedCodebase}
          onCodebaseSelect={handleCodebaseSelect}
        />
      </Header>
      <div className="main-content">
        <FileExplorer 
          files={files}
          selectedFile={selectedFile?.name || null}
          onFileSelect={handleFileSelect}
          onFolderToggle={handleFolderToggle}
          onShowGenerator={handleShowGenerator}
        />
        <CodeEditor selectedFile={selectedFile} />
        <ChatInterface 
          currentQuestion={currentQuestion}
          onAnswerSubmit={handleAnswerSubmit}
          onNewQuestion={handleNewQuestion}
        />
      </div>
      <div className="experiment-info-container">
        <ExperimentInfo />
      </div>
    </div>
  );
}

export default App;
