import React from "react";
import Link from "next/link";

const Footer:React.FC = () => {
    return(
        <div className="footer">
            <div className="footer-left">
                <img 
                    src="/ApesAlt.svg" 
                    alt="AlphaPing Logo"
                    loading="lazy"
                    className="logo"
                />
            </div>
            <div className="footer-right">
                <ul className="footer-links">
                    <li className="footer-link-li">
                        <Link 
                            href={'https://x.com/__AlphaPING__'} 
                            target="_blank"
                            className="footer-link"
                        >
                            <img 
                                src="/xAlt.svg" 
                                alt="X Icon" 
                                loading="lazy" 
                                className="homenav-icon"
                            />
                        </Link>
                    </li>
                    <li className="footer-link-li">
                        <Link 
                            href={'https://discord.com/channels/1309709451397431346/1310010641259434156'} 
                            target="_blank"
                            className="footer-link"
                        >
                            <img 
                                src="/discordAlt.svg" 
                                alt="Discord Link" 
                                className="homenav-icon"
                            />
                        </Link>
                    </li>
                    <li className="footer-link-li">
                        <Link 
                            href={'https://t.me/+c-zi1QU486RiNDNh'} 
                            target="_blank"
                            className="footer-link"
                        >
                            <img 
                                src="/Telegram_logoAlt.svg" 
                                alt="Telegram Link" 
                                className="homenav-icon"
                            />
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Footer