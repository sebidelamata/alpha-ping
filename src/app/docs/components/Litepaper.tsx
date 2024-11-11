import React from "react";

const Litepaper:React.FC = () => {
    return(
        <div className="litepaper-body">
            <h2>AlphaPING Litepaper</h2>
            <br />
            <p>Version: 1.0</p>
            <p>Date: Nov 7th, 2024</p>
            <br />
            <h3>1. Introduction</h3>
            <p>
                AlphaPING is an innovative DeFi chat protocol that integrates social trading, sentiment analysis, real-time project research, and decentralized trading—all in one place. By blending these elements, AlphaPING fosters a collaborative environment for decentralized finance (DeFi) enthusiasts, traders, and developers, while filtering out bots and spam through a unique membership model.
            </p>
            <br />
            <p>
                As the DeFi ecosystem grows, the need for platforms that combine trust, transparency, and utility has become evident. AlphaPING addresses this need by requiring users to hold either an ERC-20 or ERC-721 membership token, ensuring a user base that is committed and verifiable. The platform also leverages sentiment analysis on user-generated data to offer actionable insights into market sentiment, which can support more informed trading decisions.
            </p>
            <h3>2. Vision</h3>
            <p>
                AlphaPING aims to be the go-to social hub for DeFi, merging community-driven discussions, transparent interactions, and access to the best trading prices without leaving the platform. We envision a platform where:
            </p>
            <ul>
                <li>
                    <strong>Convenience for Users</strong> – everything traders and investors need in one place.
                </li>
                <li>
                    <strong>Transparency is prioritized</strong> – user token balances are displayed at the time of each post.
                </li>
                <li>
                    <strong>Spam and bots are minimized</strong> – only verified members with tokens can post and interact.
                </li>
                <li>
                    <strong>Social insights drive trading</strong> – sentiment and token-weighted sentiment scores provide clarity on community sentiment around projects.
                </li>
            </ul>
            <h3>3. Core Features</h3>
            <h4>3.1 Membership-Based Access</h4>
            <p>
                To maintain a spam-free environment, AlphaPING requires users to hold an ERC-721 token and join channels on-chain to participate in discussions. Token ownership is verified on-chain, ensuring transparency and accountability. Channel mods can ban poor behavior on-chain. Users can follow and block all on-chain.
            </p>
            <h4>3.2 Transparency in User Interactions</h4>
            <p>
                User token balances are recorded at the time of each post, with current balances displayed alongside. This approach encourages honesty, reduces risk of “rug pulls,” and enhances trust in user opinions.
            </p>
            <h4>3.3 Sentiment Analysis</h4>
            <p>
                AlphaPING analyzes user-generated content to provide a sentiment score that reflects the collective community outlook on various DeFi projects. This sentiment analysis is token-weighted, adding additional and unique insight for traders on the platform.
            </p>
            <h4>3.4 1Inch Router Integration</h4>
            <p>
                With AlphaPING’s integration with the 1Inch Router, users can execute trades at the best available rates directly within the platform, simplifying the trading experience and eliminating the need to leave the application.
            </p>
            <h3>4. Tokenomics</h3>
            <h4>4.1 Native Token Utility</h4>
            <p>
                AlphaPING’s native token serves a dual role within the platform: governance and profit-sharing. Holders can stake their tokens to participate in profit-sharing, which distributes a portion of AlphaPING’s net revenues (anticipated revenues from marketing minus operating costs). Staked tokens are eligible for periodic distributions based on platform revenue, aligning the interests of AlphaPING and its most engaged supporters.
            </p>
            <h4>4.2 Distribution</h4>
            <p>To incentivize early community involvement and platform growth, the token distribution plan includes:</p>
            <ul>
                <li>
                    <strong>Airdrops</strong> to early adopters and contributors.
                </li>
                <li>
                    <strong>Incentives</strong> for active participation in governance and long-term staking.
                </li>
                <li>
                    <strong>Liquidity</strong> pools to support token trading and adoption across DeFi ecosystems.
                </li>
            </ul>
            <h3>5. Conclusion</h3>
            <p>
                AlphaPING represents a new direction in social DeFi platforms, one that combines trust, transparency, and a seamless trading experience. As we work towards a community-driven protocol, AlphaPING will continue to evolve with user feedback and governance to ensure it remains relevant and valuable to DeFi users. Join us as we build a platform where community insight and on-chain data meet for an optimized trading experience.
            </p>
        </div>
    )
} 

export default Litepaper