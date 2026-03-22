import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import "./ArticlePage.css";

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, showToast } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchArticleAndStatus = async () => {
      try {
        setLoading(true);
        // 1. Fetch the article
        const articleRes = await fetch(`http://localhost:5000/api/articles/${id}`);
        if (!articleRes.ok) throw new Error("Article not found");
        const articleData = await articleRes.json();
        setArticle(articleData);

        // 2. If logged in, fetch the user's bookmarks to see if THIS article is bookmarked
        if (token) {
          const profileRes = await fetch("http://localhost:5000/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (profileRes.ok) {
            const userData = await profileRes.json();
            const bookmarked = userData.bookmarks.some(b => b._id === id);
            setIsBookmarked(bookmarked);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleAndStatus();
  }, [id, token]);

  const toggleBookmark = async () => {
    if (!token) {
      showToast("Please login or register to bookmark articles.", "error");
      // Optional: Logic to open auth modal could go here if moved to context
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/bookmarks/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to update bookmark");

      const data = await response.json();
      setIsBookmarked(data.isBookmarked);
      showToast(data.message, "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="article-page-container">
        <NavBar />
        <div className="article-content-wrapper">
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-page-container">
        <NavBar />
        <div className="article-content-wrapper">
          <h2>Error</h2>
          <p>{error || "Article could not be loaded."}</p>
          <button onClick={() => navigate("/")} className="tag-pill" style={{ marginTop: "1rem", cursor: "pointer" }}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-page-container">
      <NavBar />

      <main className="article-content-wrapper">
        <button 
          className="bookmark-icon-large" 
          onClick={toggleBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {isBookmarked ? "★" : "☆"}
        </button>

        <header className="article-header">
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <span className="author-name">Author: {article.authors.join(", ")}</span>
            <span className="publish-date">
              {article.publishedDate 
                ? new Date(article.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : "Date Published"}
            </span>
          </div>
          <div className="article-tags">
            {article.category && article.category.map((tag, index) => (
              <span key={index} className="tag-pill">{tag}</span>
            ))}
            {article.region && <span className="tag-pill">{article.region}</span>}
          </div>
        </header>

        <section className="article-body">
          {/* Using dangerouslySetInnerHTML if content has HTML, otherwise map paragraphs */}
          {article.content.split('\n').map((paragraph, idx) => (
            paragraph.trim() && <p key={idx}>{paragraph}</p>
          ))}
        </section>
      </main>

      {/* Floating Chat Button */}
      <button className="floating-chat-btn" aria-label="Open chat">
        <svg viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      </button>
    </div>
  );
};

export default ArticlePage;
