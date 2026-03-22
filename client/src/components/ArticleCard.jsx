import React from "react";
import { useNavigate } from "react-router-dom";
import "./ArticleCard.css";

const ArticleCard = ({ article, isBookmarked }) => {
  const navigate = useNavigate();

  if (!article) return null; // Defensive check for deleted/missing articles

  const handleCardClick = () => {
    navigate(`/article/${article._id}`);
  };

  const formattedDate = article.publishedDate
    ? new Date(article.publishedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  // We add the onClick handler to the main card container so the whole thing is clickable
  return (
    <div
      className="article-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="card-header">
        <div className="card-info">
          <h3 className="card-title">{article.title}</h3>
          <p className="card-author">By {article.authors?.join(", ")}</p>
          {formattedDate && <p className="card-date">{formattedDate}</p>}
        </div>
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
        <div className="tags" style={{ marginBottom: "10px" }}>
          {article.category?.slice(0, 3).map((cat, index) => (
            <span key={index} className="tag-pill">
              {cat}
            </span>
          ))}
          {article.category?.length > 3 && <span className="tag-pill">...</span>}
        </div>

        <p className="card-summary">
          {article.summary
            ? article.summary.length > 100
              ? `${article.summary.substring(0, 100)}...`
              : article.summary
            : article.content
            ? `${article.content.substring(0, 100)}...`
            : "No summary available."}
        </p>
      </div>

      <div className="card-footer">
        <button className="read-more-btn">Read More</button>
      </div>
    </div>
  );
};

export default ArticleCard;
