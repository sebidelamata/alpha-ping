import React from "react";
import HomeNav from "./components/HomeNav";
import Footer from "./components/Footer";

const Home:React.FC = () => {
    return(
        <div>
            <HomeNav/>
            <h1 className="flex h-[16vh] justify-center align-middle text-2xl">
                AlphaPING
            </h1>
            <h2 className="flex h-[10vh] justify-center align-middle text-xl">
                Chat | Trade
            </h2>
            <p className="relative right-40 flex h-[24vh] justify-end pt-[30%] text-right text-lg">
                Research with Transparency. Trust in your Community. Trade at the Best Prices. All in One Place.
            </p>
            <img 
                src="/bananaPeeled.svg" 
                alt="banana" 
                className="absolute left-5 top-20 flex h-[70vh] object-contain " 
                loading="lazy"
            />
            <Footer/>
        </div>
    )
}

export default Home;