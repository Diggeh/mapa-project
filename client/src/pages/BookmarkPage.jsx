import React from "react";
import NavBar from "../components/navBar";
import ArticleCard from "../components/ArticleCard";
import mapaLogoSand from "../assets/Mapa-logo-sand.png";
import "./BookmarkPage.css";

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
];

const BookmarksPage = () => {
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

        <section className="bookmarks-grid">
          {mockDatabaseResponse.map((articleData) => (
            <ArticleCard 
              key={articleData._id} 
              article={articleData} 
              isBookmarked={true} 
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default BookmarksPage;
