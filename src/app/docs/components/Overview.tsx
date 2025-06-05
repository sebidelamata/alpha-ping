import React from "react";
import Footer from "src/app/components/Footer";

const Overview:React.FC = () => {
    return(
        <div className="relative flex h-screen flex-col">
            <h2 className="pl-4 text-4xl font-bold">
                Overview
            </h2>
            <div className="grow p-4 pt-16">
                <p>
                    AlphaPING is an aggregated social trading platform that combines real-time chat, data analysis, project research, and trading in a single application. It is designed to foster a transparent and engaging community of traders, researchers, and enthusiasts, while filtering out spam and bots. Users gain access by minting a ERC-721 membership token. Token holdings and balances are recorded and displayed alongside each user’s posts, helping establish transparency and discouraging fraudulent activities. Integrated with the 0x RFQ protocol. AlphaPING ensures users can execute trades at optimal rates without needing to exit the platform.
                </p>
            </div>
            <Footer/>
        </div>
    )
}

export default Overview;