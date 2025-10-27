import { useState } from "react";
import axios from "axios";
import './Assistant.css'
import ReactMarkdown from "react-markdown";

function Assistant() {
    const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !question) {
      alert("Please upload a document or enter a question.");
      return;
    }
    setLoading(true);
    setResponse("");

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("question", question);

    try {
      const res = await axios.post("http://localhost:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data.answer);
    } catch (err) {
      setResponse("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card">
      <h1 className="form-title">Financial AI Assistant</h1>
      <p className="form-subtitle">
        Upload a financial report or ask a question about stocks and get
        AI-driven insights.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="file-label">Upload Financial Document</label>
          <input type="file" className="file-input" onChange={handleFile} />
        </div>

        <div className="form-group">
          <label className="question-label">Your Question (optional)</label>
          <textarea
            className="question-box"
            rows="3"
            placeholder="E.g. What is the company's Q4 net profit?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="upload-btn" disabled={loading}>
          {loading ? <div className="loader"></div> : "Upload & Analyze"}
        </button>
      </form>

      {response && (
        <div className="result-box fade-in">
          <h2>AI Analysis</h2>
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default Assistant