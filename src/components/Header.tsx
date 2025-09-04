import React from 'react';
import './Header.css';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title = "Palestra",
  showBackButton = false,
  onBackClick,
  children
}) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="app-title">{title}</div>
        {showBackButton && (
          <button className="back-btn" onClick={onBackClick}>
            ← Back to Projects
          </button>
        )}
      </div>
      <div className="header-right">
        {children}
      </div>
    </header>
  );
};

export default Header;
