'use client';

import React from "react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
  } from "@/components/components/ui/navigation-menu"
  

const HomeNav:React.FC = () => {

    return(
        <div className="flex flex-row justify-between align-middle p-4">
            <div className='gap-4 grid grid-cols-[auto_auto] justify-normal align-middle'>
                <div className='grid size-10 align-middle'>
                    <img 
                        src="../Apes.svg" 
                        alt="AlphaPING Logo" 
                        className='logo' 
                        loading="lazy"
                    />
                </div>
                <h1 className='flex gap-0 text-5xl font-bold'>
                    A<span className='font-light italic text-base align-bottom'>lpha</span>PING {'{beta}'}
                </h1>
            </div>
            <NavigationMenu className="relative right-10">
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
                            <ul className="grid gap-1 p-2 md:w-[200px] lg:w-[300px] lg:grid-cols-[33%_33%_33%] justify-center align-middle">
                                <li className="grid align-middle justify-center">
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
                                <li className="grid align-middle justify-center">
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
                                <li className="grid align-middle justify-center">
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