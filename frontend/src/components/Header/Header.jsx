import './Header.css'
import { RiStockLine } from "react-icons/ri";
import { AiFillGithub,AiFillGoogleCircle,AiFillFacebook } from "react-icons/ai";

function Header() {
  return (
    <section className='HeaderSections'>
        <div className="LogoContainer">
            <div className="LogoDiv">
                <RiStockLine className='LogoIcon' />
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