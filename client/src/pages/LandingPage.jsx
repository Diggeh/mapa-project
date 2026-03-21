import React, { useState, useEffect } from "react";
import NavBar from "../components/navBar"; // 1. Import the NavBar component
import ArticleCard from "../components/ArticleCard"; // 2. Import the ArticleCard component
import HeroCard from "../components/HeroCard"; // 3. Import the HeroCard component
import "./LandingPage.css"; // 4. Import the CSS for styling

const mockDatabaseResponse = [
  {
    _id: "1",
    title: "Understanding Toddler Meltdowns",
    authors: ["Dr. Jane Smith"],
    category: ["Behavior", "Toddlers"],
    summary:
      "A comprehensive guide to why toddlers experience emotional dysregulation and actionable steps parents can take to co-regulate.",
  },
  {
    _id: "2",
    title: "The Science of Sleep Training",
    authors: ["Dr. Allen Green"],
    category: ["Sleep", "Infants"],
    summary:
      "Exploring the evidence behind various sleep training methods and their long-term effects on child psychology and attachment.",
  },
  {
    _id: "3",
    title: "Screen Time and Brain Development",
    authors: ["Researcher Alex Doe"],
    category: ["Technology", "Development"],
    summary:
      "Recent findings on how early exposure to screens impacts attention spans and cognitive milestones in children under five.",
  },
  {
    _id: "4",
    title: "Picky Eating: A Sensory Perspective",
    authors: ["Sarah Lee, OT"],
    category: ["Nutrition", "Sensory"],
    summary:
      "Understanding the difference between behavioral picky eating and sensory processing challenges at the dinner table.",
  },
  {
    _id: "5",
    title: "Building Secure Attachments",
    authors: ["Dr. Emily Chen"],
    category: ["Attachment", "Infants"],
    summary:
      "How responsive parenting in the first year of life wires the brain for lifelong emotional resilience.",
  },
  {
    _id: "6",
    title: "Building Secure Attachments",
    authors: ["Dr. Emily Chen"],
    category: ["Attachment", "Infants"],
    summary:
      "How responsive parenting in the first year of life wires the brain for lifelong emotional resilience.",
  },
  {
    _id: "7",
    title: "Building Secure Attachments",
    authors: ["Dr. Emily Chen"],
    category: ["Attachment", "Infants"],
    summary:
      "How responsive parenting in the first year of life wires the brain for lifelong emotional resilience.",
  },
  {
    _id: "8",
    title: "Building Secure Attachments",
    authors: ["Dr. Emily Chen"],
    category: ["Attachment", "Infants"],
    summary:
      "How responsive parenting in the first year of life wires the brain for lifelong emotional resilience.",
  },
  {
    _id: "9",
    title: "Building Secure Attachments",
    authors: ["Dr. Emily Chen"],
    category: ["Attachment", "Infants"],
    summary:
      "How responsive parenting in the first year of life wires the brain for lifelong emotional resilience.",
  },
];

const LandingPage = () => {
  // Use first 3 articles for the carousel, and the rest for the grid
  const carouselArticles = mockDatabaseResponse.slice(0, 3);
  const gridArticles = mockDatabaseResponse.slice(3);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselArticles.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselArticles.length]);

  return (
    <div className="landing-container">
      <NavBar />

      <main className="main-content">
        {/* Carousel Section Using HeroCard */}
        <section className="hero-section hero-carousel">
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
        <section className="article-grid">
          {gridArticles.map((articleData) => (
            <ArticleCard key={articleData._id} article={articleData} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
