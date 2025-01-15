import React from "react";
import HomeNav from "./components/HomeNav";
import Footer from "./components/Footer";

const Home:React.FC = () => {
    return(
        <div className="flex h-screen flex-col">
            <HomeNav/>
            <h1 className="flex h-[16vh] justify-center align-middle text-2xl">
                AlphaPING
            </h1>
            <h2 className="flex h-[10vh] justify-center align-middle text-xl">
                Chat | Trade
            </h2>
            <p className="z-30 flex  w-screen grow justify-end pr-36 pt-96 text-right text-lg">
                Research with Transparency. Trust in your Community. Trade at the Best Prices. All in One Place.
            </p>
            <img 
                src="/bananaPeeled.svg" 
                alt="banana" 
                className="absolute left-[5%] top-[15%] flex h-[70vh] object-contain " 
                loading="lazy"
            />
            <Footer/>
        </div>
    )
}

export default Home;