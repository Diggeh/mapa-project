import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import ArticleCard from "../components/ArticleCard";
import mapaLogoSand from "../assets/Mapa-logo-sand.png";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import "./BookmarkPage.css";

const BookmarksPage = () => {
  const { user, loading, token } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!token) return;
      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setBookmarks(data.bookmarks || []);
        }
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      } finally {
        setLoadingBookmarks(false);
      }
    };

    if (token && !loading) {
      fetchBookmarks();
    } else if (!loading && !token) {
      setLoadingBookmarks(false);
    }
  }, [token, loading]);

  if (loading) return null; // Avoids flash of redirect
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="landing-container">
      <NavBar />

      <main className="bookmarks-page-content">
        <header className="bookmarks-header">
          <img src={mapaLogoSand} alt="MAPA Logo" className="bookmarks-logo" />

          <div className="bookmarks-search-container">
            <input
              type="text"
              className="bookmarks-search-input"
              placeholder="search text"
            />
            <button className="bookmarks-search-icon">🔍</button>
          </div>
        </header>

        {loadingBookmarks ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading bookmarks...</p>
        ) : bookmarks.length > 0 ? (
          <section className="bookmarks-grid">
            {bookmarks.map((articleData) => (
              <ArticleCard
                key={articleData._id}
                article={articleData}
                isBookmarked={true}
              />
            ))}
          </section>
        ) : (
          <p style={{ textAlign: "center", marginTop: "2rem", color: "#666", fontSize: "1.2rem" }}>
            No bookmarked articles.
          </p>
        )}
      </main>
    </div>
  );
};

export default BookmarksPage;
