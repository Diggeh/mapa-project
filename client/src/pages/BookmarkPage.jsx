import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import ArticleCard from "../components/ArticleCard";
import SearchPill from "../components/SearchPill";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import "./BookmarkPage.css";

const BookmarksPage = () => {
  const { user, loading, token, showToast } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const toggleBookmark = async (articleId) => {
    if (!token) {
      showToast("Please login or register to bookmark articles.", "error");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/users/bookmarks/${articleId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const isNowBookmarked = response.data.isBookmarked;
      if (!isNowBookmarked) {
        // Since we are on the bookmarks page, unbookmarking should remove the article from the list
        setBookmarks(prev => prev.filter(article => article._id !== articleId));
      }
      showToast(response.data.message, "success");
    } catch (err) {
      console.error("Bookmark toggle failed", err);
      showToast(err.response?.data?.message || "Failed to update bookmark", "error");
    }
  };

  if (loading) return null; // Avoids flash of redirect
  if (!user) return <Navigate to="/" replace />;

  const filteredBookmarks = bookmarks.filter((article) => {
    const titleMatch = article.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = article.category?.some(cat => 
      cat.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return titleMatch || categoryMatch;
  });

  return (
    <div className="landing-container">
      <NavBar />

      <main className="bookmarks-page-content">
        <header className="bookmarks-header">
          <SearchPill value={searchQuery} onChange={setSearchQuery} />
        </header>

        {loadingBookmarks ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading bookmarks...</p>
        ) : filteredBookmarks.length > 0 ? (
          <section className="bookmarks-grid">
            {filteredBookmarks.map((articleData) => (
              <ArticleCard
                key={articleData._id}
                article={articleData}
                isBookmarked={true}
                onBookmarkToggle={toggleBookmark}
              />
            ))}
          </section>
        ) : searchQuery ? (
          <p style={{ textAlign: "center", marginTop: "2rem", color: "#666", fontSize: "1.2rem" }}>
            No articles match your search.
          </p>
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
