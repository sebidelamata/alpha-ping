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
        <div className="med:p-3 flex w-screen flex-row justify-between gap-2 align-middle sm:p-2 lg:p-4">
            <div className='grid grid-cols-[auto_auto] justify-normal align-middle sm:gap-1 md:gap-3 lg:gap-4'>
                <div className='grid size-9 align-middle'>
                    <img 
                        src="../Apes.svg" 
                        alt="AlphaPING Logo" 
                        className='grid size-9 justify-center object-contain align-middle' 
                        loading="lazy"
                    />
                </div>
                <h1 className='flex gap-0 font-bold sm:text-lg md:text-2xl lg:text-3xl'>
                    A<span className='align-bottom text-base font-light italic'>lpha</span>PING
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
                            href={'/docs/overview'} 
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