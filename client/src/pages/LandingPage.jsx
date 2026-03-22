import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar"; // 1. Import the NavBar component
import ArticleCard from "../components/ArticleCard"; // 2. Import the ArticleCard component
import HeroCard from "../components/HeroCard"; // 3. Import the HeroCard component
import "./LandingPage.css"; // 4. Import the CSS for styling

const LandingPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/articles");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Use first 3 articles for the carousel, and the rest for the grid
  const carouselArticles = articles.slice(0, 3);
  const gridArticles = articles.slice(3);

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

        {/* Search Bar / Filter Pill */}
        <div className="search-pill-container">
          <input
            type="text"
            className="search-pill"
            placeholder="Search articles by title or category..."
            disabled // We will activate this later!
          />
        </div>

        {/* 4. Map the rest of the articles to the grid */}
        {gridArticles.length > 0 ? (
          <section className="article-grid">
            {gridArticles.map((articleData) => (
              <ArticleCard key={articleData._id} article={articleData} />
            ))}
          </section>
        ) : (
          <p className="no-articles-text" style={{ textAlign: "center", marginTop: "2rem" }}>
            {articles.length === 0 ? "No articles found." : ""}
          </p>
        )}
      </main>
    </div>
  );
};

export default LandingPage;
