import React from "react";
import HomeNav from "./components/HomeNav";

const Home:React.FC = () => {
    return(
        <div className="home-container">
            <HomeNav/>
            <h1 className="hero">AlphaPING</h1>
            <h2 className="hero-two">Chat | Trade</h2>
            <p className="call-to-action">Research with Transparency. Trust in your Community. Trade at the Best Prices. All in One Place.</p>
            <img src="/bananaPeeled.svg" alt="banana" className="banana-large"/>
        </div>
    )
}

export default Home;