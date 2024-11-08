import React from "react";

const Overview:React.FC = () => {
    return(
        <div className="overview-container">
            <h2 className="overview-title">
                Overview
            </h2>
            <div className="overview-body">
                AlphaPING is a aggregated social trading experience that allows users to chat, analyze, research, and trade all in the same place. AlphaPING aims to reduce spam and bots by requiring members to mint a membership as well as other key blockchain-centered actions. The balance of either the ERC-20 or ERC-721 held by the user is recorded at the time of their post and displayed along with their current balance to aid in transaparency and prevent rugs. User chats can then be analyzed using sentiment analysis and token banlance weighted sentiment analsys to put numbers around a project's vibes. 1Inch Router will be incorporated allowing users to secure the best quoted prices without needing to leave the application.
            </div>
        </div>
    )
}

export default Overview;