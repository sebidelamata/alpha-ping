import React from "react";
import HomeNav from "./components/HomeNav";

const Home:React.FC = () => {
    return(
        <div className="home-container">
            <HomeNav/>
            <h1>AlphaPING</h1>
            <h2>Chat | Trade</h2>
            <p>Research with Transparency. Trust in your Community. Trade at the Best Prices. All in One Place.</p>
        </div>
    )
}

export default Home;