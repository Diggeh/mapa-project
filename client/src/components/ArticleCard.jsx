import React from "react";
import { useNavigate } from "react-router-dom";
import "./ArticleCard.css";

const ArticleCard = ({ article, isBookmarked }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/article/${article._id}`);
  };

  // We add the onClick handler to the main card container so the whole thing is clickable
  return (
    <div
      className="article-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="card-header">
        <div className="tags">
          {article.category.map((cat, index) => (
            <span key={index} className="tag-pill">
              {cat}
            </span>
          ))}
        </div>
        {/* We use e.stopPropagation() so clicking the bookmark doesn't trigger the card click */}
        <button
          className="bookmark-btn"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Bookmarked status toggled!");
          }}
        >
          {isBookmarked ? "★" : "☆"}
        </button>
      </div>

      <div className="card-body">
        <h3 className="card-title">{article.title}</h3>
        <p className="card-author">By {article.authors.join(", ")}</p>

        <p className="card-summary">
          {article.summary.length > 120
            ? `${article.summary.substring(0, 120)}...`
            : article.summary}
        </p>
      </div>

      <div className="card-footer">
        <button className="read-more-btn">Read More</button>
      </div>
    </div>
  );
};

export default ArticleCard;
