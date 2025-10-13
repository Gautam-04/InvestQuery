import './Header.css'
import { RiStockLine } from "react-icons/ri";
import { AiFillGithub,AiFillGoogleCircle,AiFillFacebook } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
  return (
    <section className='HeaderSections'>
        <div className="LogoContainer" onClick={()=>navigate("/")}>
            <div className="LogoDiv">
                <RiStockLine className='LogoIcon'/>
            </div>
            <div className="LogoTitle">
                <h1 className="ProjectName font-ubuntu">InvestQuery</h1>
            </div>
        </div>

        <div className="ContactContainer">
            <div className="LogoDiv">
                <AiFillFacebook className='ContactLogo' />
            </div>
            <div className="LogoDiv">
                <AiFillGithub className='ContactLogo' />
            </div>
            <div className="LogoDiv">
                <AiFillGoogleCircle className='ContactLogo' />
            </div>
        </div>
    </section>
  )
}

export default Header