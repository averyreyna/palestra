import React, { useState } from 'react';
import Modal from './Modal';
import './ExperimentInfo.css';

const ExperimentInfo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button className="experiment-info-button" onClick={openModal}>
        <span className="info-icon">ⓘ</span>
        More about this experiment
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="About Palestra">
        <p>
          Palestra is an experimental AI-powered IDE prototype that demonstrates interactive 
          code learning and exploration through AI-generated questions.
        </p>
        <p>
          This prototype showcases how AI can enhance the coding experience by:
        </p>
        <ul>
          <li>Generating contextual questions about code to improve understanding</li>
          <li>Providing an interactive chat interface for code exploration</li>
          <li>Creating mock codebases with realistic file structures and content</li>
          <li>Demonstrating modern IDE functionality with clean, professional styling</li>
        </ul>
        <p>
          Navigate through different projects, explore the code files, and click "New Question" 
          to generate AI-powered questions that help you understand the codebase better.
        </p>
      </Modal>
    </>
  );
};

export default ExperimentInfo;
