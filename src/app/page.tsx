import React from "react";
import HomeNav from "./components/HomeNav";
import Footer from "./components/Footer";

const Home:React.FC = () => {
    return(
        <div className="flex h-screen flex-col bg-primary text-secondary dark:bg-primary">
            <HomeNav/>
            <h1 className="flex h-[16vh] justify-center align-middle text-2xl">
                AlphaPING
            </h1>
            <h2 className="flex h-[10vh] justify-center align-middle text-xl">
                Chat | Analyze | Trade
            </h2>
            <p className="relative left-10 z-30 flex w-[90%] grow justify-end pt-96 text-right md:text-sm lg:text-lg">
                Research with Transparency. Trust in your Community. Trade at the Best Prices. All in One Place.
            </p>
            <img 
                src="/bananaPeeled.svg" 
                alt="banana" 
                className="absolute top-[27%] flex h-96 object-contain sm:left-[20%] sm:ml-12 md:left-[10%] md:ml-24 lg:left-[10%] lg:ml-32" 
                loading="lazy"
            />
            <Footer/>
        </div>
    )
}

export default Home;