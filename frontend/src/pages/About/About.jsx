import React from "react";
import "./About.css";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>Invest Smarter with InvestQuery</h1>
        <p>
          An intelligent platform that decodes your investment goals through 
          natural language and transforms them into actionable stock recommendations.
        </p>
      </section>

      <hr className="section-divider" />

      {/* Mission Section */}
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          To simplify stock market investing for retail investors by empowering them 
          with a conversational interface that translates their financial goals into 
          reliable, data-driven suggestions.
        </p>
      </section>

      <hr className="section-divider" />

      {/* Vision Section */}
      <section className="about-section">
        <h2>Our Vision</h2>
        <p>
          A future where anyone can simply say “Invest ₹10,000 for 1 year with medium risk” 
          and instantly receive trustworthy stock recommendations backed by strong fundamentals.
        </p>
      </section>

      <hr className="section-divider" />

      {/* Why InvestQuery Section */}
      <section className="about-section">
        <h2>Why InvestQuery?</h2>
        <p>
          Traditional platforms require navigating complex filters or selecting from 
          predefined categories. InvestQuery eliminates friction by allowing users to 
          express their needs naturally.
        </p>
        <p>
          Our NLP engine extracts key parameters such as investment amount, duration, 
          sector interest, and risk level. These are fed into our analytics model, which scores 
          stocks across metrics like P/E ratio, ROE, beta stability, and dividend yield.
        </p>
      </section>

      <hr className="section-divider" />

      {/* CTA Section */}
      <section className="about-cta">
        <h2>Ready to explore your next investment idea?</h2>
        <button onClick={() => navigate("/")}>Try it Yourself</button>
      </section>
    </div>
  );
}

export default About;
