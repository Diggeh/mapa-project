import React from "react";
import { useNavigate } from "react-router-dom";
import "./ArticleCard.css";

const ArticleCard = ({ article, isBookmarked, onBookmarkToggle }) => {
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
            if (onBookmarkToggle) {
              onBookmarkToggle(article._id);
            }
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
          {(() => {
            const stripHtml = (html) => {
              const doc = new DOMParser().parseFromString(html, 'text/html');
              return doc.body.textContent || '';
            };
            const raw = article.summary || article.content || '';
            const text = stripHtml(raw);
            return text.length > 100 ? `${text.substring(0, 100)}...` : text || "No summary available.";
          })()}
        </p>
      </div>

      <div className="card-footer">
        <button className="read-more-btn">Read More</button>
      </div>
    </div>
  );
};

export default ArticleCard;
