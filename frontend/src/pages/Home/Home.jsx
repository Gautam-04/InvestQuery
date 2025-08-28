import './Home.css';
import { RiArrowRightLine } from 'react-icons/ri';
import { useSearch } from '../../context/SearchContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

function Home() {
  const {search, setSearch} = useSearch(); 
  
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log("User Query:", search);
    try {
      toast.success("Query submitted successfully!");
    } catch (error) {
      console.error("Error submitting query:", error);
      toast.error("Failed to submit query. Please try again.");
    }
    navigate('/result');
  };

  return (
    <section className="Home">
      <div className="MainBody">
        <h1 className="hero-title font-ubuntu">Where do you want to invest today?</h1>
        <p className="hero-subtitle font-cairo">Get personalized stock picks by simply asking.</p>

        <div className="hero-input-container font-pt-sans">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && search.length > 0) handleSubmit(); }}
            placeholder="I want to invest ₹10,000 in low-risk stocks for 2 years..."
          />
          <button className={search.length > 0 ? "hero-input-btn show" : "hero-input-btn hide"} onClick={handleSubmit}>
            <RiArrowRightLine className='icon'/>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Home;
