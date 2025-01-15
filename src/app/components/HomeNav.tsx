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
        <div className="flex flex-row justify-between gap-2 p-4 align-middle">
            <div className='grid grid-cols-[auto_auto] justify-normal gap-4 align-middle'>
                <div className='grid size-10 align-middle'>
                    <img 
                        src="../Apes.svg" 
                        alt="AlphaPING Logo" 
                        className='grid size-12 justify-center object-contain align-middle' 
                        loading="lazy"
                    />
                </div>
                <h1 className='flex gap-0 text-3xl font-bold'>
                    A<span className='align-bottom text-base font-light italic'>lpha</span>PING
                </h1>
            </div>
            <NavigationMenu className="relative right-4">
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
                            <ul className="grid justify-center gap-1 bg-primary p-2 align-middle md:w-[200px] lg:w-[300px] lg:grid-cols-[33%_33%_33%]">
                                <li className="grid justify-center align-middle">
                                    <Link 
                                        href={'https://x.com/__AlphaPING__'} 
                                        target="_blank"
                                        legacyBehavior 
                                        passHref
                                    >
                                        <NavigationMenuLink target="_blank" className="flex size-12 items-center justify-center">
                                            <img 
                                                src="/x.svg" 
                                                alt="X Link" 
                                                className="size-6"
                                                loading="lazy"
                                            />
                                        </NavigationMenuLink>
                                    </Link>
                                </li>
                                <li className="grid justify-center align-middle">
                                    <Link 
                                        href={'https://discord.com/channels/1309709451397431346/1310010641259434156'} 
                                        target="_blank"
                                        legacyBehavior 
                                        passHref
                                    >
                                        <NavigationMenuLink target="_blank" className="flex size-12 items-center justify-center">
                                            <img 
                                                src="/discord.svg" 
                                                alt="Discord Link" 
                                                className="size-6"
                                                loading="lazy"
                                            />
                                        </NavigationMenuLink>
                                    </Link>
                                </li>
                                <li className="grid justify-center align-middle">
                                    <Link 
                                        href={'https://t.me/+c-zi1QU486RiNDNh'} 
                                        target="_blank"
                                        legacyBehavior 
                                        passHref
                                    >
                                        <NavigationMenuLink target="_blank" className="flex size-12 items-center justify-center">
                                            <img 
                                                src="/Telegram_logo.svg" 
                                                alt="Telegram Link" 
                                                className="size-6"
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