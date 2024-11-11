import React from "react";

const Overview:React.FC = () => {
    return(
        <div className="overview-container">
            <h2 className="overview-title">
                Overview
            </h2>
            <div className="overview-body">
            AlphaPING is an aggregated social trading platform that combines real-time chat, data analysis, project research, and trading in a single application. It is designed to foster a transparent and engaging community of traders, researchers, and enthusiasts, while filtering out spam and bots. Users gain access by minting a membership token, either as an ERC-20 or ERC-721 asset. Token holdings and balances are recorded and displayed alongside each user’s posts, helping establish transparency and discouraging fraudulent activities. Integrated with the 1Inch Router, AlphaPING ensures users can execute trades at optimal rates without needing to exit the platform.
            </div>
        </div>
    )
}

export default Overview;