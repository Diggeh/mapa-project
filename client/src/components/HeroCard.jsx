import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroCard.css";

const HeroCard = ({ article }) => {
  const navigate = useNavigate();

  // If there is no article loaded yet, don't crash the app
  if (!article)
    return <div className="hero-placeholder">Loading featured...</div>;

  const handleCardClick = () => {
    navigate(`/article/${article._id}`);
  };

  return (
    <div className="hero-card-container" onClick={handleCardClick}>
      <div className="hero-content">
        <div className="hero-tags">
          <span className="hero-tag-pill">FEATURED</span>
          {article.category.map((cat, index) => (
            <span key={index} className="tag-pill">
              {cat}
            </span>
          ))}
        </div>

        <h1 className="hero-title">{article.title}</h1>
        <p className="hero-author">Curated by {article.authors.join(", ")}</p>
        <p className="hero-summary">{article.summary}</p>

        <button className="hero-read-btn">Read Full Summary</button>
      </div>

      {/* This empty div acts as a placeholder for a future illustration or image */}
      <div className="hero-visual-placeholder">
        <span className="visual-icon">📄</span>
      </div>
    </div>
  );
};

export default HeroCard;
