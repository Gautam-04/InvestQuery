import './Document.css'
import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function Document() {
const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult("");

    if (!file) {
      setError("Please upload a document first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (question.trim()) formData.append("question", question);

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/uploadDoc", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.result) {
        setResult(res.data.result);
      } else {
        setError("No result returned. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to process document. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card">
  <form onSubmit={handleSubmit} className="upload-form">
    <h2 className="form-title">Upload Financial Document</h2>
    <p className="form-subtitle">
      Upload your document and optionally ask a question for AI-based analysis.
    </p>

    <div className="form-group">
      <label className="file-label">Select document</label>
      <input
        type="file"
        accept=".pdf,.docx,.txt,.csv,.xlsx"
        onChange={handleFileChange}
        className="file-input"
      />
    </div>

    <div className="form-group">
      <label className="question-label">Your question (optional)</label>
      <textarea
        placeholder="E.g. What is the company's Q4 net profit?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="question-box"
      />
    </div>

    <button type="submit" className="upload-btn" disabled={loading}>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
           Upload & Analyze
        </>
      )}
    </button>
  </form>

  {error && <div className="error-box">{error}</div>}

  {result && (
    <div className="result-box fade-in">
      <h2>AI Analysis Result</h2>
      
      {/* Convert result into bullet list by splitting on newlines */}
      <ul className="analysis-list">
        {result.split('\n').filter(line => line.trim() !== '').map((line, index) => (
          <li key={index}>
            <ReactMarkdown>{line}</ReactMarkdown>
          </li>
        ))}
      </ul>
    </div>
    )}
  </div>

  );
}

export default Document