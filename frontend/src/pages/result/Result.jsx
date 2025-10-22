import { useSearch } from "../../context/SearchContext";
import { RiArrowRightLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import "./result.css";
import { useEffect, useState } from "react";
import axios from "axios";
import StockCard from "../../components/StockCard/StockCard";

function Result() {
  const { search, setSearch } = useSearch();
  const [tags, setTags] = useState([]);
  const [stocks, setStocks] = useState([]); // 🔹 Combined stock info
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Handle Submit
  const handleSubmit = async () => {
    if (!search.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/nlpinput", {
        search,
      });

      console.log("✅ NLP API Response:", response.data);

      // 🔹 Extract and clean tags
      if (response.data.extracted_words) {
        const filteredTags = response.data.extracted_words.filter((word) => {
          if (!word) return false;

          const cleaned = word.trim().toLowerCase();

          // 🔹 Exclude "not specified" or empty
          if (cleaned === "" || cleaned === "not specified") return false;

          // 🔹 Exclude pure numbers (like "1", "2", "4", "20", "10000")
          // This regex removes any string that is only digits, commas, or spaces
          if (/^[\d,\s]+$/.test(cleaned)) return false;

          return true;
          ;});
        setTags(filteredTags);
      }

      // 🔹 Parse and align stock data
      if (response.data.ai_raw_response && response.data.structured_data) {
        const symbols = JSON.parse(response.data.ai_raw_response);
        const stockDetails = response.data.structured_data;

        // Combine symbol + data
        const combined = symbols.map((symbol, i) => ({
          symbol,
          ...stockDetails[i], // merge data object with symbol
        }));

        setStocks(combined);
      } else {
        setStocks([]);
      }
    } catch (err) {
      console.error("❌ Error fetching NLP data:", err);
      setError("Failed to fetch NLP results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-submit if there's a search query
    if (search.trim()) {
      handleSubmit();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 🔹 Remove tag
  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <section className="Results">
      {/* 🔹 Input box */}
      <div className="hero-input-container font-pt-sans">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          placeholder="I want to invest ₹10,000 in low-risk stocks for 2 years..."
        />
        <button
          className={search.length > 0 ? "hero-input-btn show" : "hero-input-btn hide"}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <span className="loader"></span> : <RiArrowRightLine className="icon" />}
        </button>
      </div>

      {/* 🔹 Error message */}
      {error && <p className="error-text">{error}</p>}

      {/* 🔹 Tags Section */}
      <div className="tags-container">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <IoClose className="tag-close" onClick={() => removeTag(index)} />
          </span>
        ))}
      </div>

      {/* 🔹 Stock Cards Section */}
      <div className="stock-cards">
        {loading ? (
          <p className="loading-text">Fetching recommendations...</p>
        ) : stocks.length > 0 ? (
          stocks.map((stock, i) => (
            <StockCard key={i} stock={stock} />
          ))
        ) : (
          <p className="no-results-text">No recommendations yet.</p>
        )}
      </div>
    </section>
  );
}

export default Result;
