import React from "react";
import "./CategoryCard.css";

const CategoryCard = ({ category, onClick }) => {
  return (
    <div className="category-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <h3 className="category-card-title">{category ? category.name : "Placeholder"}</h3>
    </div>
  );
};

export default CategoryCard;


