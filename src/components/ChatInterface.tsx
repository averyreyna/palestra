import React, { useState } from 'react';
import { ChatMessage, CodeQuestion } from '../types';
import './ChatInterface.css';

interface ChatInterfaceProps {
  currentQuestion: CodeQuestion | null;
  onAnswerSubmit: (answer: string) => void;
  onNewQuestion: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentQuestion,
  onAnswerSubmit,
  onNewQuestion
}) => {
  const [answer, setAnswer] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || !currentQuestion) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'answer',
      content: answer.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    onAnswerSubmit(answer.trim());
    setAnswer('');
  };

  const handleNewQuestion = () => {
    onNewQuestion();
    // Clear previous messages when getting a new question
    setMessages([]);
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>Code Questions</h3>
        <button 
          className="new-question-btn"
          onClick={handleNewQuestion}
        >
          New Question
        </button>
      </div>
      
      <div className="chat-content">
        {currentQuestion ? (
          <>
            <div className="question-section">
              <div className="question-bubble">
                <div className="question-label">Question:</div>
                <div className="question-text">{currentQuestion.question}</div>
                {currentQuestion.context && (
                  <div className="question-context">
                    <strong>Context:</strong> {currentQuestion.context}
                  </div>
                )}
              </div>
            </div>

            <div className="messages-section">
              {messages.map(message => (
                <div key={message.id} className={`message ${message.type}`}>
                  <div className="message-content">{message.content}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-question">
            <p>Click "New Question" to generate an AI question about the code!</p>
          </div>
        )}
      </div>

      {currentQuestion && (
        <div className="chat-input">
          <form onSubmit={handleSubmit}>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={3}
            />
            <button type="submit" disabled={!answer.trim()}>
              Submit Answer
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
