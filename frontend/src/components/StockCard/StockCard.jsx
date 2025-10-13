import { useState } from "react";
import {
  FaChevronUp,
  FaChevronDown,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import "./stockcard.css";

function StockCard({ stock }) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);

  const {
    longName,
    symbol,
    regularMarketPrice,
    targetMeanPrice,
    averageAnalystRating,
    sector,
    marketCap,
    trailingPE,
    forwardPE,
    dividendYield,
    beta,
    returnOnEquity,
    earningsPerShare,
    profitMargins,
    fiftyTwoWeekHigh,
    fiftyTwoWeekLow,
    fiftyTwoWeekChange,
    sandP52WeekChange,
    averageDailyVolume3Month,
    averageDailyVolume10Day,
    allTimeHigh,
    allTimeLow,
    bookValue,
    priceToBook,
    trailingAnnualDividendRate,
    trailingAnnualDividendYield,
    pegRatio,
    trailingPegRatio,
    longBusinessSummary,
    website,
  } = stock;

  const upside =
    targetMeanPrice && regularMarketPrice
      ? (((targetMeanPrice - regularMarketPrice) / regularMarketPrice) * 100).toFixed(2)
      : null;

  // 🔹 Helper for color-coded values
  const getColorClass = (value, positiveGood = true) => {
    if (value == null || isNaN(value)) return "";
    if (positiveGood) return value > 0 ? "good" : "bad";
    return value < 0 ? "good" : "bad";
  };

  return (
    <div className="stock-card">
      {/* 🔹 Top Section */}
      <div className="stock-header" onClick={toggleExpand}>
        <div className="stock-title">
          <h2 title="Company Name">{longName || symbol}</h2>
          <p className="sector" title="Sector / Industry">
            {sector || "—"}
          </p>
        </div>

        {/* 🔹 Price & Upside */}
        <div className="stock-metrics">
          <div className="metric" title="Current Market Price">
            <span className="metric-label">Current</span>
            <span className="metric-value price">
              ₹{regularMarketPrice?.toLocaleString() || "—"}
            </span>
          </div>

          <div className="metric" title="Projected Target Price (as per analysts)">
            <span className="metric-label">Target</span>
            <span className="metric-value target">
              ₹{targetMeanPrice?.toLocaleString() || "—"}
            </span>
          </div>

          <div
            className={`metric ${upside > 0 ? "up" : "down"}`}
            title="Potential gain or loss compared to current price"
          >
            <span className="metric-label">Upside</span>
            <span className="metric-value upside">
              {upside ? (
                <>
                  {upside > 0 ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(upside)}%
                </>
              ) : (
                "—"
              )}
            </span>
          </div>

          <div className="chevron">
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
      </div>

      {/* 🔹 Expandable Details */}
      {expanded && (
        <div className="stock-details two-column">
          <ul>
            {/* 🔹 Core Financials */}
            <li title="Market capitalization — total value of all shares">
              <strong>Market Cap:</strong> ₹{(marketCap / 1e9).toFixed(2)} B
            </li>
            <li title="Price-to-Earnings Ratio — valuation metric">
              <strong>P/E Ratio:</strong> {trailingPE || forwardPE || "—"}
            </li>
            <li
              title="Return on Equity — profitability based on shareholders' equity"
              className={getColorClass(returnOnEquity)}
            >
              <strong>ROE:</strong> {returnOnEquity ? `${returnOnEquity}%` : "—"}
            </li>
            <li
              title="Earnings Per Share — profit per outstanding share"
              className={getColorClass(earningsPerShare)}
            >
              <strong>EPS:</strong> {earningsPerShare || "—"}
            </li>
            <li title="Annual dividend yield — return from dividends">
              <strong>Dividend Yield:</strong>{" "}
              {dividendYield || trailingAnnualDividendYield
                ? `${(dividendYield || trailingAnnualDividendYield).toFixed(2)}%`
                : "—"}
            </li>
            <li title="Trailing annual dividend rate">
              <strong>Dividend Rate:</strong>{" "}
              {trailingAnnualDividendRate ? `₹${trailingAnnualDividendRate}` : "—"}
            </li>
            <li title="Price-to-Book Ratio — compares market value to book value">
              <strong>P/B Ratio:</strong> {priceToBook || "—"}
            </li>
            <li title="Book Value — per share value of equity">
              <strong>Book Value:</strong> ₹{bookValue || "—"}
            </li>

            {/* 🔹 Performance & Volatility */}
            <li
              title="Profit margin — how much profit per ₹ of revenue"
              className={getColorClass(profitMargins)}
            >
              <strong>Profit Margin:</strong>{" "}
              {profitMargins ? `${(profitMargins * 100).toFixed(2)}%` : "—"}
            </li>
            <li
              title="Volatility compared to market (Beta < 1 = stable, > 1 = volatile)"
              className={getColorClass(1 - beta, false)}
            >
              <strong>Beta:</strong> {beta || "—"}
            </li>
            <li title="PEG Ratio — valuation relative to growth rate">
              <strong>PEG Ratio:</strong> {pegRatio || trailingPegRatio || "—"}
            </li>
            <li title="Change in price over the past 52 weeks">
              <strong>52W Change:</strong>{" "}
              <span className={getColorClass(fiftyTwoWeekChange)}>
                {fiftyTwoWeekChange
                  ? `${(fiftyTwoWeekChange * 100).toFixed(2)}%`
                  : "—"}
              </span>
            </li>
            <li title="S&P 500 comparison over same 52 weeks">
              <strong>S&P 52W Change:</strong>{" "}
              <span className={getColorClass(sandP52WeekChange)}>
                {sandP52WeekChange
                  ? `${(sandP52WeekChange * 100).toFixed(2)}%`
                  : "—"}
              </span>
            </li>

            {/* 🔹 Highs, Lows & Volume */}
            <li title="Highest price in the last 52 weeks">
              <strong>52W High:</strong> ₹{fiftyTwoWeekHigh || "—"}
            </li>
            <li title="Lowest price in the last 52 weeks">
              <strong>52W Low:</strong> ₹{fiftyTwoWeekLow || "—"}
            </li>
            <li title="All-time highest recorded stock price">
              <strong>All-Time High:</strong> ₹{allTimeHigh || "—"}
            </li>
            <li title="All-time lowest recorded stock price">
              <strong>All-Time Low:</strong> ₹{allTimeLow || "—"}
            </li>
            <li title="Average daily traded volume over 3 months">
              <strong>Avg Vol (3M):</strong>{" "}
              {averageDailyVolume3Month
                ? averageDailyVolume3Month.toLocaleString()
                : "—"}
            </li>
            <li title="Average daily traded volume over 10 days">
              <strong>Avg Vol (10D):</strong>{" "}
              {averageDailyVolume10Day
                ? averageDailyVolume10Day.toLocaleString()
                : "—"}
            </li>

            {/* 🔹 Analyst Insights */}
            <li title="Analyst consensus rating (1=Strong Buy, 5=Sell)">
              <strong>Analyst Rating:</strong> {averageAnalystRating || "—"}
            </li>
            <li title="Target Mean Price set by analysts">
              <strong>Target Mean Price:</strong> ₹{targetMeanPrice || "—"}
            </li>
          </ul>

          {/* 🔹 Summary */}
          <p className="summary">
            {longBusinessSummary
              ? `${longBusinessSummary.slice(0, 300)}...`
              : "No company description available."}
          </p>

          {website && (
            <a href={website} target="_blank" rel="noreferrer" className="visit-btn">
              Visit Company Site
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default StockCard;
