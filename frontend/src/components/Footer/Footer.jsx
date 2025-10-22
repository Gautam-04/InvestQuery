import React from 'react';
import { AiFillGithub, AiFillGoogleCircle, AiFillFacebook } from "react-icons/ai";
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left Section - Brand */}
        <div className="footer-brand">
          <h3 className="footer-title">InvestQuery</h3>
          <p className="footer-description">
            Your intelligent companion for financial analysis and investment insights.
          </p>
        </div>

        {/* Middle Section - Quick Links */}
        <div className="footer-links">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-list">
            <li><a href="/about">About Us</a></li>
            <li><a href="/result">Analytics</a></li>
            <li><a href="/document">Document Analysis</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Right Section - Social Media */}
        <div className="footer-social">
          <h4 className="footer-heading">Connect With Us</h4>
          <div className="social-icons">
            <a href="#" rel="noopener noreferrer" className="social-link">
              <AiFillFacebook className="social-icon" />
            </a>
            <a href="#"  rel="noopener noreferrer" className="social-link">
              <AiFillGithub className="social-icon" />
            </a>
            <a href="#" rel="noopener noreferrer" className="social-link">
              <AiFillGoogleCircle className="social-icon" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} InvestQuery. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;