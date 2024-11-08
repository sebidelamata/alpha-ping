import React from "react";

const Roadmap:React.FC = () => {
    return(
        <div className="roadmap-container">
            <h2>Roadmap</h2>
            <p>
                Our development roadmap for AlphaPING is structured into progressive phases, each building on the previous one to deliver a seamless and powerful social trading experience.
            </p>
            <br />
            <h3>Phase 0.5: Core Chat Platform Development</h3>
            <p>
                <strong>Goal:</strong> Establish the foundational chat functionality with a responsive, user-friendly interface.
            </p>
            <ul>
                <li>
                    <h4>UI & Framework Enhancements</h4>
                    <ul>
                        <li>
                            <strong>UI Overhaul:</strong> Transition the interface to <strong>ShadCN</strong> for a consistent, modern look.
                        </li>
                        <li>
                            <strong>Framework Migration:</strong> Move the platform to <strong>Next.js</strong> for improved performance and SEO capabilities.
                        </li>
                    </ul>
                </li>
                <li>
                    <h4>Core Chat Features</h4>
                    <ul>
                        <li>
                            <strong>Membership Requirement:</strong> Implement a token-based membership model requiring users to hold an ERC-20 or ERC-721 token for access, reducing spam and bot activity.
                        </li>
                        <li>
                            <strong>Basic Chat Functionality:</strong> Build a chat interface for user discussions and knowledge sharing, laying the foundation for a social trading ecosystem.
                        </li>
                    </ul>
                </li>
            </ul>
            <h4>
                <strong>Target Completion:</strong> Q1 2025
            </h4>
            <br />
            <h3>Phase 1: Sentiment Analysis and Trading Infrastructure</h3>
            <p>
                <strong>Goal:</strong> Equip AlphaPING with analytical and trading features, enabling deeper market insights and direct trading capabilities.
            </p>
            <ul>
                <li>
                    <h4>Sentiment Analysis Tools</h4>
                    <ul>
                        <li>
                            <strong>Point-in-Time Sentiment Tracking:</strong> Implement timeseries tracking to capture changes in market sentiment.
                        </li>
                        <li>
                            <strong>Weighted Sentiment Analysis:</strong> Develop metrics for:
                            <ul>
                                <li>
                                    <strong>Post Balance-Weighted Sentiment:</strong> Analyze sentiment based on token balance at posting.
                                </li>
                                <li>
                                    <strong>Current Balance-Weighted Sentiment:</strong> Track sentiment weighted by users’ real-time token holdings.
                                </li>
                                <li>
                                    <strong>Delta Sentiment:</strong> Compare post and current balances for a “delta” sentiment metric.
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>
                    <h4>Market Data Integration</h4>
                    <ul>
                        <li>
                            <strong>CoinMarketCap API Integration:</strong> Display basic metrics, including asset prices and market cap stats, giving users access to essential market data.
                        </li>
                    </ul>
                </li>
                <li>
                    <h4>Trading Infrastructure</h4>
                    <ul>
                        <li>
                            Integrate <strong>1Inch Router</strong> to enable optimized trading directly within the platform, allowing users to execute trades securely without leaving AlphaPING.
                        </li>
                    </ul>
                </li>
            </ul>
            <h4>
                <strong>Target Completion:</strong> Q2 2025
            </h4>
            <br />
            <h3>Phase 2: Multichain Support and Enhanced Community Engagement</h3>
            <p>
                <strong>Goal:</strong> Broaden AlphaPING’s reach across chains and introduce dynamic engagement features to foster community interaction.
            </p>
            <ul>
                <li>
                    <h4>Multichain Integration</h4>
                    <ul>
                        <li>
                            Prioritize <strong>EVM-compatible Layer 2</strong> chains to enable cross-chain functionality, enhancing user flexibility and liquidity options.
                        </li>
                    </ul>
                </li>
                <li>
                    <h4>Enhanced Engagement Tools</h4>
                    <ul>
                        <li>
                            Enable <strong>Twitter Post Embeds</strong> and <strong>Video Embeds</strong> for more dynamic discussions and shared content within the chat.
                        </li>
                        <li>
                            <strong>Community Polls:</strong> Launch polls for informal voting and sentiment gauging.
                        </li>
                        <li>
                            <strong>Email Notifications:</strong> Introduce notifications to alert users of updates, mentions, or governance announcements.
                        </li>
                    </ul>
                </li>
            </ul>
            <h4>
                <strong>Target Completion:</strong> Q3 2025
            </h4>
            <br />
            <h3>Phase 3: Governance and Decentralized Voting</h3>
            <p>
                <strong>Goal:</strong> Implement community-led governance, allowing users to participate in AlphaPING’s direction.
            </p>
            <ul>
                <li>
                    <h4>Governance Token and Voting Mechanism</h4>
                    <ul>
                        Launch the <strong>Governance Token</strong> and implement decentralized voting, enabling community input on platform decisions.
                    </ul>
                </li>
            </ul>
            <h4>
                <strong>Target Completion:</strong> Q4 2025
            </h4>
            <br />
            <h3>Phase 4: Mobile Accessibility</h3>
            <p>
                <strong>Goal:</strong> Increase accessibility with a mobile app, making AlphaPING available on mobile devices.
            </p>
            <ul>
                <li>
                    <h4>Mobile App Development</h4>
                    <ul>
                        <li>
                            Develop a <strong>React Native Mobile App</strong> for iOS and Android, bringing AlphaPING’s full functionality to mobile users.
                        </li>
                    </ul>
                </li>
            </ul>
            <h4>
                <strong>Target Completion:</strong> Q1 2026
            </h4>
            <br />
            <h3>Phase 5: Advanced Financial Products and Community Incentives</h3>
            <p>
                <strong>Goal:</strong> Introduce innovative financial products and community rewards to enhance platform engagement.
            </p>
            <ul>
                <li>
                    <h4>Airdrop Campaign</h4>
                    <ul>
                        <li>
                            Distribute <strong>Airdrops</strong> to early adopters, contributors, and active community members, fostering loyalty and incentivizing participation.
                        </li>
                    </ul>
                </li>
                <li>
                    <h4>Sentiment Index Perpetual Futures</h4>
                    <ul>
                        <li>
                            Introduce Sentiment Index <strong>Perpetual Futures</strong>, a derivative product based on sentiment indices, providing users with a unique trading instrument.
                        </li>
                    </ul>
                </li>
            </ul>
            <h4>
                <strong>Target Completion:</strong> Q2 2026
            </h4>
            <br />
            <h2>Future Vision</h2>
            <p>
                AlphaPING will continuously evolve with community feedback, offering new tools and innovative features tailored to the needs of decentralized social traders. Each phase builds on the last to create a rich, user-focused ecosystem.
            </p>
        </div>
    )
}

export default Roadmap;