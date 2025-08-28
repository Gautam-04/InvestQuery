import { useState } from "react";
import { FaChevronUp, FaChevronDown  } from "react-icons/fa"; // for expand/collapse icons
import "./stockcard.css";

function StockCard({ stock }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  // Calculate potential upside
  const latestPrediction =
    stock.future_growth.predicted_values[stock.future_growth.predicted_values.length - 1];
  const upside =
    (((latestPrediction.expected_price - stock.current_price.value) /
      stock.current_price.value) *
      100).toFixed(2);

  return (
    <div className="stock-card">
      {/* Basic Info */}
      <div className="stock-basic" onClick={toggleExpand}>
        <h2>{stock.name} ({stock.symbol})</h2>
        <p className="price">₹{stock.current_price.value}</p>
        <p className="upside">Potential Upside: {upside}%</p>
        {expanded ? <FaChevronUp /> : <FaChevronDown  />}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="stock-details">
          <h3>Details</h3>
          <ul>
            <li><strong>Sector:</strong> {stock.sector}</li>
            <li><strong>Market Cap:</strong> {stock.details.market_cap}</li>
            <li><strong>P/E Ratio:</strong> {stock.details.pe_ratio}</li>
            <li><strong>Dividend Yield:</strong> {stock.details.dividend_yield}</li>
            <li><strong>52W High:</strong> {stock.details["52_week_high"]}</li>
            <li><strong>52W Low:</strong> {stock.details["52_week_low"]}</li>
          </ul>

          <h3>Growth Predictions</h3>
          <ul>
            {stock.future_growth.predicted_values.map((p, i) => (
              <li key={i}>
                {p.year}: ₹{p.expected_price}
              </li>
            ))}
          </ul>

          <h3>News</h3>
          <ul>
            {stock.news.map((n, i) => (
              <li key={i}>
                <a href={n.url} target="_blank" rel="noreferrer">
                  {n.title}
                </a> ({n.source})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StockCard;
