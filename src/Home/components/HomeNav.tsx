import React, 
{ 
    useState,
    useEffect,
    useRef,
    MouseEvent as ReactMouseEvent
} from "react";
import { Link } from "react-router-dom";

const HomeNav:React.FC = () => {

    //show social links if clicked turn off if clicked outside
    const [showSocials, setShowSocials] = useState<boolean>(false)
    const navRef = useRef<HTMLDivElement>(null);

    const handleClick = (e:ReactMouseEvent) => {
        e.preventDefault()
        setShowSocials(!showSocials)
    }

    const handleClickOutside = (event: Event) => {
        if (navRef.current && !navRef.current.contains(event.target as Node)) {
            setShowSocials(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return(
        <div className="home-navbar-container" ref={navRef}>
            <div className='nav-brand'>
                <div className='logo-container'>
                    <img src="../Apes.svg" alt="AlphaPING Logo" className='logo'/>
                </div>
                <h1 className='brand-header'>
                    A<span className='header-mid-word-break'>lpha</span>PING {'{beta}'}
                </h1>
            </div>
            <ul className="homenav-links-list">
                <li>
                    <Link to={'/app'} target="_blank">
                        App
                    </Link>
                </li>
                <li>
                    <Link to={'https://github.com/sebidelamata/alpha-ping'} target="_blank">
                        Protocol
                    </Link>
                </li>
                <li>
                    <Link to={'/docs'} target="_blank">
                        Docs
                    </Link>
                </li>
                <li>
                    {
                        showSocials === false &&
                        <p onClick={(e) => handleClick(e)}>
                            Socials
                        </p>
                    }
                    {
                        showSocials === true &&
                        <ul className="socials-list">
                            <li>
                                <Link to={'https://www.x.com'} target="_blank">
                                    X
                                </Link>
                            </li>
                            <li>
                                <Link to={'https://warpcast.com/'} target="_blank">
                                    Warpcast
                                </Link>
                            </li>
                            <li>
                                <Link to={'https://www.discord.com'} target="_blank">
                                    Discord
                                </Link>
                            </li>
                            <li>
                                <Link to={'https://telegram.org/'} target="_blank">
                                    Telegram
                                </Link>
                            </li>
                        </ul>
                    }
                </li>
            </ul>
        </div>
    )
}

export default HomeNav