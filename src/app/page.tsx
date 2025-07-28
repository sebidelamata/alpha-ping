import React from "react";
import HomeNav from "./components/HomeNav";
import Footer from "./components/Footer";
import TotalVolumeUSDCard from "./components/TotalVolumeUSDCard";

const Home: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-primary text-secondary">
            <HomeNav />
            
            {/* Hero Section */}
            <main className="flex-1 flex flex-col">
                {/* Main Content Area */}
                <div className="flex-1 relative overflow-hidden">
                    {/* Background decorative element */}
                    <div className="absolute inset-0 pointer-events-none">
                        <img 
                            src="/bananaPeeled.svg" 
                            alt="" 
                            className="absolute opacity-20 h-64 sm:h-80 md:h-96 lg:h-[400px] object-contain
                                     top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                                     sm:left-1/4 sm:translate-x-0 md:left-1/6 lg:left-1/8
                                     z-0" 
                            loading="lazy"
                            aria-hidden="true"
                        />
                    </div>
                    
                    {/* Content Container */}
                    <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12 lg:py-16">
                        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
                            {/* Main Title */}
                            <div className="space-y-2">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                                    AlphaPING
                                </h1>
                                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-secondary/80 font-light">
                                    Chat | Analyze | Trade
                                </h2>
                            </div>
                            <div className="max-w-2xl mx-auto">
                                <p className="text-base sm:text-lg md:text-xl text-secondary/90 leading-relaxed">
                                    Research with Transparency. Trust in your Community. Trade at the Best Prices. All in One Place.
                                </p>
                            </div>
                            <div className="mt-8 sm:mt-12">
                                <TotalVolumeUSDCard />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 sm:mt-12">
                                <a 
                                    href="/app" 
                                    target="_blank"
                                    className="inline-flex items-center justify-center px-6 py-3 
                                             bg-accent text-primary font-medium rounded-lg
                                             hover:bg-accent/90 transition-colors
                                             text-sm sm:text-base w-full sm:w-auto"
                                >
                                    Launch App
                                </a>
                                <a 
                                    href="/docs/overview" 
                                    target="_blank"
                                    className="inline-flex items-center justify-center px-6 py-3 
                                             border border-secondary/30 text-secondary font-medium rounded-lg
                                             hover:bg-secondary/10 transition-colors
                                             text-sm sm:text-base w-full sm:w-auto"
                                >
                                    Learn More
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    )
}

export default Home