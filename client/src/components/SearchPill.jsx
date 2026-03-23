import React from "react";
import "./SearchPill.css";

const SearchPill = ({ value, onChange }) => {
  return (
    <div className="search-pill-container">
      <input
        type="text"
        className="search-pill"
        placeholder="Search articles by title or category..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchPill;
