import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
    return (
        <footer className="bg-accent/10 border-t border-secondary/20 mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Logo and Copyright */}
                    <div className="flex items-center gap-3">
                        <img 
                            src="/ApesAlt.svg" 
                            alt="AlphaPing Logo"
                            loading="lazy"
                            className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                        />
                        <div className="text-center sm:text-left">
                            <div className="text-sm font-medium">AlphaPING</div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-secondary/60 mr-2 hidden sm:inline">
                            Follow us:
                        </span>
                        <div className="flex gap-1">
                            <Link 
                                href="https://x.com/__AlphaPING__" 
                                target="_blank"
                                className="p-2 hover:bg-secondary/10 rounded-md transition-colors"
                                aria-label="Follow us on X (Twitter)"
                            >
                                <img 
                                    src="/xAlt.svg" 
                                    alt="" 
                                    loading="lazy" 
                                    className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                                />
                            </Link>
                            
                            <Link 
                                href="https://discord.com/channels/1309709451397431346/1310010641259434156" 
                                target="_blank"
                                className="p-2 hover:bg-secondary/10 rounded-md transition-colors"
                                aria-label="Join our Discord"
                            >
                                <img 
                                    src="/discordAlt.svg" 
                                    alt="" 
                                    className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                                    loading="lazy"
                                />
                            </Link>
                            
                            <Link 
                                href="https://t.me/+c-zi1QU486RiNDNh" 
                                target="_blank"
                                className="p-2 hover:bg-secondary/10 rounded-md transition-colors"
                                aria-label="Join our Telegram"
                            >
                                <img 
                                    src="/Telegram_logoAlt.svg" 
                                    alt="" 
                                    className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                                    loading="lazy"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer