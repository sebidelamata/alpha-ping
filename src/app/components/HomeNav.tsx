'use client';

import React, 
{ 
    useState,
    useEffect,
    useRef,
    MouseEvent as ReactMouseEvent
} from "react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle
  } from "@/components/components/ui/navigation-menu"
  

const HomeNav:React.FC = () => {

    return(
        <div className="home-navbar-container">
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
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link 
                            href={'/app'} 
                            target="_blank" 
                            legacyBehavior 
                            passHref
                        >
                            <NavigationMenuLink className={navigationMenuTriggerStyle()} target="_blank">
                                App
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link 
                            href={'https://github.com/sebidelamata/alpha-ping'} 
                            target="_blank" 
                            legacyBehavior 
                            passHref
                        >
                            <NavigationMenuLink className={navigationMenuTriggerStyle()} target="_blank">
                                Protocol
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link 
                            href={'/docs'} 
                            target="_blank" 
                            legacyBehavior 
                            passHref
                        >
                            <NavigationMenuLink className={navigationMenuTriggerStyle()} target="_blank">
                                Docs
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            Socials
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul>
                                <li>
                                    <Link 
                                        href={'https://x.com/__AlphaPING__'} 
                                        target="_blank"
                                        legacyBehavior 
                                        passHref
                                    >
                                        <NavigationMenuLink target="_blank" className="flex items-center justify-center w-12 h-12">
                                            <img 
                                                src="/x.svg" 
                                                alt="X Link" 
                                                className="homenav-icon"
                                                loading="lazy"
                                            />
                                        </NavigationMenuLink>
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link href={'https://warpcast.com/'} target="_blank">
                                        <img 
                                            src="/warpcast.svg" 
                                            alt="Warpcast Link" 
                                            className="homenav-icon"
                                        />
                                    </Link>
                                </li> */}
                                <li>
                                    <Link 
                                        href={'https://discord.com/channels/1309709451397431346/1310010641259434156'} 
                                        target="_blank"
                                        legacyBehavior 
                                        passHref
                                    >
                                        <NavigationMenuLink target="_blank" className="flex items-center justify-center w-12 h-12">
                                            <img 
                                                src="/discord.svg" 
                                                alt="Discord Link" 
                                                className="homenav-icon"
                                                loading="lazy"
                                            />
                                        </NavigationMenuLink>
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href={'https://t.me/+c-zi1QU486RiNDNh'} 
                                        target="_blank"
                                        legacyBehavior 
                                        passHref
                                    >
                                        <NavigationMenuLink target="_blank" className="flex items-center justify-center w-12 h-12">
                                            <img 
                                                src="/Telegram_logo.svg" 
                                                alt="Telegram Link" 
                                                className="homenav-icon"
                                                loading="lazy"
                                            />
                                        </NavigationMenuLink>
                                    </Link>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

export default HomeNav