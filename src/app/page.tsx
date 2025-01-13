import React from "react";
import HomeNav from "./components/HomeNav";
import Footer from "./components/Footer";

const Home:React.FC = () => {
    return(
        <div>
            <HomeNav/>
            <h1 className="hero">AlphaPING</h1>
            <h2 className="hero-two">Chat | Trade</h2>
            <p className="call-to-action">Research with Transparency. Trust in your Community. Trade at the Best Prices. All in One Place.</p>
            <img src="/bananaPeeled.svg" alt="banana" className="banana-large" loading="lazy"/>
            <Footer/>
        </div>
    )
}

export default Home;