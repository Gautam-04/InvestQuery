import './Home.css';
import { useNavigate } from 'react-router-dom';
import invest from '../../assets/home-page.png';
import doc from '../../assets/doc.jpg';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* SECTION 1: Investment Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title font-ubuntu">Where do you want to invest today?</h1>
          <p className="hero-subtitle font-cairo">Get personalized stock picks powered by AI.</p>

          <button 
            className="outlined-btn"
            onClick={() => navigate('/result')}
          >
            Get Picks
          </button>
        </div>

        <div className="hero-image-container">
          <img 
            src={invest} 
            alt="Investment Illustration" 
            className="hero-image"
          />
        </div>
      </section>

      {/* SECTION 2: Document Upload Section */}
      <section className="document-section">
        <div className="document-image-container">
          <img
            src={doc}
            alt="Document Analysis"
            className="document-image"
          />
        </div>

        <div className="document-content">
          <h2 className="document-title font-ubuntu">Upload Financial Document</h2>
          <p className="document-description font-cairo">
            Upload your financial document and optionally ask a question for AI-based analysis.
          </p>
          <button 
            className="outlined-btn"
            onClick={() => navigate('/document')}
          >
            Analyze Documents
          </button>
        </div>
      </section>

    </div>
  );
}

export default Home;