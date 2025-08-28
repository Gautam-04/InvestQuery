import { useSearch } from "../../context/SearchContext";
import { RiArrowRightLine } from 'react-icons/ri';
import { IoClose } from "react-icons/io5"; // close (X) icon
import './result.css';
import { useState, useEffect } from "react";
import { data } from "../../utils/data";
import StockCard from "../../components/StockCard/StockCard";

function Result() {
  const { search, setSearch } = useSearch();
  const [tags, setTags] = useState(["₹10,000", "Low-Risk", "2 Years"]);

  const handleSubmit = () => {
    console.log("Search submitted:", search, "Tags:", tags);
  };

  // Run handleSubmit whenever tags change
  useEffect(() => {
    handleSubmit();
  }, [tags]);

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <section className="Results">
      <div className="hero-input-container font-pt-sans">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="I want to invest ₹10,000 in low-risk stocks for 2 years..."
        />
        <button
          className={search.length > 0 ? "hero-input-btn show" : "hero-input-btn hide"}
          onClick={handleSubmit}
        >
          <RiArrowRightLine className="icon" />
        </button>
      </div>

      {/* Tags Section */}
      <div className="tags-container">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <IoClose className="tag-close" onClick={() => removeTag(index)} />
          </span>
        ))}
      </div>

      <div className="stock-cards">
        {data.stocks.map((stock, i) => (
          <StockCard key={i} stock={stock} />
        ))}
      </div>
    </section>
  );
}

export default Result;
