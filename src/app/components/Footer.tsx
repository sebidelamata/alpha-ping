import React from "react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
  } from "@/components/components/ui/navigation-menu"

const Footer:React.FC = () => {
    return(
        <div className="grid grid-cols-[auto_auto] justify-between bg-color-3 p-4 align-middle">
            <div className="grid pr-4">
                <img 
                    src="/ApesAlt.svg" 
                    alt="AlphaPing Logo"
                    loading="lazy"
                    className="grid size-12 object-contain align-middle"
                />
            </div>
                <NavigationMenu className="relative right-4 flex flex-row gap-1">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link 
                                href={'https://x.com/__AlphaPING__'} 
                                target="_blank"
                                className="grid "
                                legacyBehavior 
                                passHref
                            >
                                <NavigationMenuLink className={navigationMenuTriggerStyle()} target="_blank">
                                    <img 
                                        src="/xAlt.svg" 
                                        alt="X Icon" 
                                        loading="lazy" 
                                        className="size-12"
                                    />
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link 
                                href={'https://discord.com/channels/1309709451397431346/1310010641259434156'} 
                                target="_blank"
                                className="grid"
                                legacyBehavior 
                                passHref
                            >
                                <NavigationMenuLink className={navigationMenuTriggerStyle()} target="_blank">
                                    <img 
                                        src="/discordAlt.svg" 
                                        alt="Discord Link" 
                                        className="size-12"
                                    />
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link 
                                href={'https://t.me/+c-zi1QU486RiNDNh'} 
                                target="_blank"
                                className="grid"
                                legacyBehavior 
                                passHref
                            >
                                <NavigationMenuLink className={navigationMenuTriggerStyle()} target="_blank">
                                    <img 
                                        src="/Telegram_logoAlt.svg" 
                                        alt="Telegram Link" 
                                        className="size-12"
                                    />
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
        </div>
    )
}

export default Footer