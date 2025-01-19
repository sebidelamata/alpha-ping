import React from "react";
import Footer from "src/app/components/Footer";
import { Separator } from "@radix-ui/react-separator";

const Litepaper:React.FC = () => {
    return(
        <div className="relative flex h-screen flex-col gap-4">
            <h2 className="p-4 text-4xl font-bold">
                AlphaPING Litepaper
            </h2>
            <br />
            <p className="pl-4 font-light">Version: 1.0</p>
            <p className="pl-4 font-light">Date: Nov 7th, 2024</p>
            <Separator className="m-8 mx-64 border border-accent"/>
            <h3 className="p-4 text-xl font-bold">
                1. Introduction
            </h3>
            <p className="px-4">
                AlphaPING is an innovative DeFi chat protocol that integrates social trading, sentiment analysis, real-time project research, and decentralized trading—all in one place. By blending these elements, AlphaPING fosters a collaborative environment for DeFi enthusiasts, traders, and developers, while filtering out bots and spam through a unique membership model.
            </p>
            <br />
            <p className="px-4">
                As the DeFi ecosystem grows, the need for platforms that combine trust, transparency, and utility has become evident. AlphaPING addresses this need by requiring users to hold either an ERC-20 or ERC-721 membership token, ensuring a user base that is committed and verifiable. The platform also leverages sentiment analysis on user-generated data to offer actionable insights into market sentiment, which can support more informed trading decisions.
            </p>
            <Separator className="m-8 mx-64 border border-accent"/>
            <h3 className="pl-4 text-xl font-bold">2. Vision</h3>
            <p className="p-4">
                AlphaPING aims to be the go-to social hub for DeFi, merging community-driven discussions, transparent interactions, and access to the best trading prices without leaving the platform. We envision a platform where:
            </p>
            <ul className="px-4">
                <li className="p-2">
                    <strong>Convenience for Users</strong> – everything traders and investors need in one place.
                </li>
                <li className="p-2">
                    <strong>Transparency is prioritized</strong> – user token balances are displayed at the time of each post.
                </li>
                <li className="p-2">
                    <strong>Spam and bots are minimized</strong> – only verified members with NFT Memberships can post and interact.
                </li>
                <li className="p-2">
                    <strong>Social insights drive trading</strong> – sentiment and token-weighted sentiment scores provide clarity on community sentiment around projects.
                </li>
            </ul>
            <Separator className="m-8 mx-64 border border-accent"/>
            <h3 className="p-4 text-xl font-bold">3. Core Features</h3>
            <h4 className="p-4 pl-6 text-lg">3.1 Membership-Based Access</h4>
            <p className="p-4 pl-6">
                To maintain a spam-free environment, AlphaPING requires users to hold an ERC-721 token and join channels on-chain to participate in discussions. Token ownership is verified on-chain, ensuring transparency and accountability. Channel mods can ban poor behavior on-chain. Users can follow and block all on-chain.
            </p>
            <Separator className="m-6 mx-96 border border-secondary/50"/>
            <h4 className="p-4 pl-6 text-lg">3.2 Transparency in User Interactions</h4>
            <p className="p-4 pl-6">
                User token balances are recorded at the time of each post, with current balances displayed alongside. This approach encourages honesty, reduces risk of “rug pulls,” and enhances trust in user opinions.
            </p>
            <Separator className="m-6 mx-96 border border-secondary/50"/>
            <h4 className="p-4 pl-6 text-lg">3.3 Sentiment Analysis</h4>
            <p className="p-4 pl-6">
                AlphaPING analyzes user-generated content to provide a sentiment score that reflects the collective community outlook on various DeFi projects. This sentiment analysis is token-weighted, adding additional and unique insight for traders on the platform.
            </p>
            <Separator className="m-6 mx-96 border border-secondary/50"/>
            <h4 className="p-4 pl-6 text-lg">3.4 1Inch Router Integration</h4>
            <p className="p-4 pl-6">
                With AlphaPING’s integration with the 1Inch Router, users can execute trades at the best available rates directly within the platform, simplifying the trading experience and eliminating the need to leave the application.
            </p>
            <Separator className="m-8 mx-64 border border-accent"/>
            <h3 className="p-4 text-xl font-bold">4. Tokenomics</h3>
            <h4 className="p-4 pl-6 text-lg">4.1 Native Token Utility</h4>
            <p className="p-4 pl-6">
                AlphaPING’s native token serves a dual role within the platform: governance and profit-sharing. Holders can stake their tokens to participate in profit-sharing, which distributes a portion of AlphaPING’s net revenues (anticipated revenues from marketing minus operating costs). Staked tokens are eligible for periodic distributions based on platform revenue, aligning the interests of AlphaPING and its most engaged supporters.
            </p>
            <Separator className="m-6 mx-96 border border-secondary/50"/>
            <h4 className="p-4 pl-6 text-lg">4.2 Distribution</h4>
            <p className="p-4 pl-6">To incentivize early community involvement and platform growth, the token distribution plan includes:</p>
            <ul className="px-4">
                <li className="p-2 pl-6">
                    <strong>Airdrops</strong> to early adopters and contributors.
                </li>
                <li className="p-2 pl-6">
                    <strong>Incentives</strong> for active participation in governance and long-term staking.
                </li>
                <li className="p-2 pl-6">
                    <strong>Liquidity</strong> pools to support token trading and adoption across DeFi ecosystems.
                </li>
            </ul>
            <Separator className="m-8 mx-64 border border-accent"/>
            <h3 className="p-4 text-xl font-bold">5. Conclusion</h3>
            <p className="mb-8 px-4">
                AlphaPING represents a new direction in social DeFi platforms, one that combines trust, transparency, and a seamless trading experience. As we work towards a community-driven protocol, AlphaPING will continue to evolve with user feedback and governance to ensure it remains relevant and valuable to DeFi users. Join us as we build a platform where community insight and on-chain data meet for an optimized trading experience.
            </p>
            <Footer/>
        </div>
    )
} 

export default Litepaper