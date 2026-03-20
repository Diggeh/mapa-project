import React from "react";
// Use ../ to step out of the 'pages' folder and into the 'components' folder
import NavBar from "../components/navBar";
import ArticleCard from "../components/ArticleCard";
import HeroCard from "../components/HeroCard";
import "./LandingPage.css";

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
];

const LandingPage = () => {
  // 2. Separate the data: First item for Hero, the rest for the Grid
  const featuredArticle = mockDatabaseResponse[0];
  const gridArticles = mockDatabaseResponse.slice(1);

  return (
    <div className="landing-container">
      <NavBar />

      <main className="main-content">
        {/* 3. Drop in the HeroCard and pass it the data */}
        <section className="hero-section">
          <HeroCard article={featuredArticle} />
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
