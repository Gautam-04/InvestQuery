import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiStockLine } from "react-icons/ri";
import './Header.css';

function Header() {
  const navigate = useNavigate();
  
  return (
    <header className="header">
      {/* Logo Section */}
      <div className="logo-container" onClick={() => navigate("/")}>
        <div className="logo-div">
          <RiStockLine className="logo-icon" />
        </div>
        <div className="logo-title">
          <h1 className="project-name font-ubuntu">InvestQuery</h1>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="nav-links">
        <button onClick={() => navigate("/about")} className="nav-link">
          About
        </button>
        
        <button onClick={() => navigate("/result")} className="nav-link">
          Invest With Us
        </button>
        
        <button onClick={() => navigate("/document")} className="nav-link">
          Document Analysis
        </button>
      </nav>
    </header>
  );
}

export default Header;