'use client';

import React, 
{ 
    useState,
    useEffect,
    useRef,
    MouseEvent as ReactMouseEvent
} from "react";
import Link from "next/link";

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
                    <img 
                        src="../Apes.svg" 
                        alt="AlphaPING Logo" 
                        className='logo' 
                        loading="lazy"
                    />
                </div>
                <h1 className='brand-header'>
                    A<span className='header-mid-word-break'>lpha</span>PING {'{beta}'}
                </h1>
            </div>
            <ul className="homenav-links-list">
                <li>
                    <Link href={'/app'} target="_blank">
                        App
                    </Link>
                </li>
                <li>
                    <Link href={'https://github.com/sebidelamata/alpha-ping'} target="_blank">
                        Protocol
                    </Link>
                </li>
                <li>
                    <Link href={'/docs'} target="_blank">
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
                                <Link href={'https://x.com/__AlphaPING__'} target="_blank">
                                    X
                                </Link>
                            </li>
                            <li>
                                <Link href={'https://warpcast.com/'} target="_blank">
                                    Warpcast
                                </Link>
                            </li>
                            <li>
                                <Link href={'https://discord.com/channels/1309709451397431346/1310010641259434156'} target="_blank">
                                    Discord
                                </Link>
                            </li>
                            <li>
                                <Link href={'https://telegram.org/'} target="_blank">
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