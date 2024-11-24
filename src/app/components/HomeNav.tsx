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
                        <p onClick={(e) => handleClick(e)}>
                            Socials
                        </p>
                </li>
            </ul>
            {
                showSocials === true &&
                <ul className="socials-list">
                    <li>
                        <Link href={'https://x.com/__AlphaPING__'} target="_blank">
                            <img 
                                src="/x.svg" 
                                alt="X Link" 
                                className="homenav-icon"
                            />
                        </Link>
                    </li>
                    <li>
                        <Link href={'https://warpcast.com/'} target="_blank">
                            <img 
                                src="/warpcast.svg" 
                                alt="Warpcast Link" 
                                className="homenav-icon"
                            />
                        </Link>
                    </li>
                    <li>
                        <Link href={'https://discord.com/channels/1309709451397431346/1310010641259434156'} target="_blank">
                            <img 
                                src="/discord.svg" 
                                alt="Discord Link" 
                                className="homenav-icon"
                            />
                        </Link>
                    </li>
                    <li>
                        <Link href={'https://t.me/+c-zi1QU486RiNDNh'} target="_blank">
                            <img 
                                src="/Telegram_logo.svg" 
                                alt="Telegram Link" 
                                className="homenav-icon"
                            />
                        </Link>
                    </li>
                </ul>
            }
        </div>
    )
}

export default HomeNav