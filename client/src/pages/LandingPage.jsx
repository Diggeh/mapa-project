import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import ArticleCard from "../components/ArticleCard";
import HeroCard from "../components/HeroCard";
import SearchPill from "../components/SearchPill";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";
import "./LandingPage.css";

const LandingPage = () => {
  const { token, showToast } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await apiFetch("/api/articles");
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchUserBookmarks = async () => {
      if (!token) {
        setBookmarkedIds([]);
        return;
      }
      try {
        const data = await apiFetch("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookmarkedIds(data.bookmarks.map(b => b._id));
      } catch (err) {
        console.error("Failed to fetch user bookmarks", err);
      }
    };
    fetchUserBookmarks();
  }, [token]);

  const toggleBookmark = async (articleId) => {
    if (!token) {
      showToast("Please login or register to bookmark articles.", "error");
      return;
    }
    try {
      const data = await apiFetch(`/api/users/bookmarks/${articleId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.isBookmarked) {
        setBookmarkedIds(prev => [...prev, articleId]);
      } else {
        setBookmarkedIds(prev => prev.filter(id => id !== articleId));
      }
      showToast(data.message, "success");
    } catch (err) {
      console.error("Bookmark toggle failed", err);
      showToast(err.message || "Failed to update bookmark", "error");
    }
  };

  // Filter articles based on search title or categories
  const filteredArticles = articles.filter(article => {
    const term = searchQuery.toLowerCase();
    const titleMatch = article.title.toLowerCase().includes(term);
    const categoryMatch = article.category?.some(cat => cat.toLowerCase().includes(term));
    return titleMatch || categoryMatch;
  });

  const isSearching = searchQuery.length > 0;

  // Use first 3 articles for the carousel (if not searching)
  const carouselArticles = isSearching ? [] : filteredArticles.slice(0, 3);
  // Grid shows everything if searching; otherwise the rest after slice
  const gridArticles = isSearching ? filteredArticles : filteredArticles.slice(3);

  // Auto-slide functionality
  useEffect(() => {
    if (carouselArticles.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselArticles.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselArticles.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselArticles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === carouselArticles.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="landing-container">
        <NavBar />
        <main className="main-content">
          <p>Loading articles...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="landing-container">
        <NavBar />
        <main className="main-content">
          <p>Error: {error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="landing-container">
      <NavBar />

      <main className="main-content">
        {/* Carousel Section Using HeroCard */}
        {carouselArticles.length > 0 && (
          <section className="hero-section hero-carousel">
            <button className="carousel-arrow left-arrow" onClick={handlePrev} aria-label="Previous slide">
              &#10094;
            </button>

            <div className="carousel-viewport">
              <div
                className="carousel-inner"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselArticles.map((articleData) => (
                  <div className="carousel-item" key={articleData._id}>
                    <HeroCard article={articleData} />
                  </div>
                ))}
              </div>
            </div>

            <button className="carousel-arrow right-arrow" onClick={handleNext} aria-label="Next slide">
              &#10095;
            </button>

            <div className="carousel-indicators">
              {carouselArticles.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-dot ${idx === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </section>
        )}

        <SearchPill value={searchQuery} onChange={setSearchQuery} />

        {/* 4. Map the rest of the articles to the grid */}
        {gridArticles.length > 0 ? (
          <section className="article-grid">
            {gridArticles.map((articleData) => (
              <ArticleCard
                key={articleData._id}
                article={articleData}
                isBookmarked={bookmarkedIds.includes(articleData._id)}
                onBookmarkToggle={toggleBookmark}
              />
            ))}
          </section>
        ) : (
          <p className="no-articles-text" style={{ textAlign: "center", marginTop: "2rem", width: "100%", fontSize: "1.2rem", color: "#6b6375" }}>
            {isSearching ? "No articles match your search." : (articles.length === 0 ? "No articles found." : "")}
          </p>
        )}
      </main>
    </div>
  );
};

export default LandingPage;
