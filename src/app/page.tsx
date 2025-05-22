import React from "react";
import HomeNav from "./components/HomeNav";
import Footer from "./components/Footer";
import TotalVolumeUSDCard from "./components/TotalVolumeUSDCard";

const Home:React.FC = () => {

    return(
        <div className="flex h-screen flex-col bg-primary text-secondary">
            <HomeNav/>
            <h1 className="flex h-[16svh] justify-center align-middle text-2xl">
                AlphaPING
            </h1>
            <h2 className="flex h-[10svh] justify-center align-middle text-xl">
                Chat | Analyze | Trade
            </h2>
            <TotalVolumeUSDCard/>
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