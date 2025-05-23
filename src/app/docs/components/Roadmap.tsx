import React from "react";
import Footer from "src/app/components/Footer";
import { Separator } from "@radix-ui/react-separator";

const Roadmap: React.FC = () => {
  return (
    <div className="relative flex h-screen flex-col gap-4">
      <h2 className="p-4 text-4xl font-bold">Roadmap</h2>
      <p className="px-4">
        Our development roadmap for AlphaPING is structured into progressive phases, each building on the previous one to deliver a seamless and powerful social trading experience.
      </p>
      <Separator className="m-8 mx-64 border border-accent" />

      {/* Phase 0.5 */}
      <h3 className="p-4 text-xl font-bold">
        Phase 0.5: Core Chat Platform Development
        <span className="text-green-600 font-semibold"> ✅ Completed</span>
    </h3>
      <p className="px-4">
        <strong>Goal:</strong> Establish the foundational chat functionality with a responsive, user-friendly interface.
      </p>
      <ul className="px-4">
        <li className="p-2">
          <h4 className="p-4 text-lg">UI & Framework Enhancements</h4>
          <ul className="px-4">
            <li className="p-2">
              <strong>UI Overhaul:</strong> Transition the interface to <strong>ShadCN</strong> for a consistent, modern look.
            </li>
            <li className="p-2">
              <strong>Framework Migration:</strong> Move the platform to <strong>Next.js</strong> for improved performance and SEO capabilities.
            </li>
          </ul>
        </li>
        <Separator className="m-6 mx-96 border border-secondary/50" />
        <li className="p-2">
          <h4 className="p-4 text-lg">Core Chat Features</h4>
          <ul className="px-4">
            <li className="p-2">
              <strong>Membership Requirement:</strong> Implement a token-based membership model requiring users to hold an ERC-721 token for access.
            </li>
            <li className="p-2">
              <strong>Basic Chat Functionality:</strong> Build a chat interface for user discussions and knowledge sharing, laying the foundation for a social trading ecosystem.
            </li>
          </ul>
        </li>
        <Separator className="m-6 mx-96 border border-secondary/50" />
      </ul>
      <h4 className="p-4 text-lg">
        <strong>Target Completion:</strong> Q1 2025
      </h4>
      <Separator className="m-8 mx-64 border border-accent" />

      {/* Phase 1 */}
      <h3 className="p-4 text-xl font-bold">
        Phase 1: Sentiment Analysis and Trading Infrastructure
         <span className="text-green-600 font-semibold"> ✅ Completed</span>
    </h3>
      <p className="px-4">
        <strong>Goal:</strong> Equip AlphaPING with analytical and trading features, enabling deeper market insights and direct trading capabilities.
      </p>
      <ul className="px-4">
        <li className="p-2">
          <h4 className="p-4 text-lg">Sentiment Analysis Tools</h4>
          <ul className="px-4">
            <li className="p-2">
              <strong>Point-in-Time Sentiment Tracking:</strong> Implement timeseries tracking to capture changes in market sentiment.
            </li>
            <li className="p-2">
              <strong>Weighted Sentiment Analysis:</strong> Develop metrics for:
              <ul className="px-4">
                <li className="p-2">
                  <strong>Post Balance-Weighted Sentiment:</strong> Analyze sentiment based on token balance at posting.
                </li>
                <li className="p-2">
                  <strong>Current Balance-Weighted Sentiment:</strong> Track sentiment weighted by users’ real-time token holdings.
                </li>
                <li className="p-2">
                  <strong>Delta Sentiment:</strong> Compare post and current balances for a “delta” sentiment metric.
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <Separator className="m-6 mx-96 border border-secondary/50" />
        <li className="p-2">
          <h4 className="p-4 text-lg">Market Data Integration</h4>
          <ul className="px-4">
            <li className="p-2">
              <strong>CoinMarketCap API Integration:</strong> Display basic metrics, including asset prices and market cap stats, giving users access to essential market data.
            </li>
          </ul>
        </li>
        <Separator className="m-6 mx-96 border border-secondary/50" />
        <li className="p-2">
          <h4 className="p-4 text-lg">Trading Infrastructure</h4>
          <ul className="px-4">
            <li className="p-2">
              Integrate <strong>1Inch Router</strong> to enable optimized trading directly within the platform, allowing users to execute trades securely without leaving AlphaPING.
            </li>
          </ul>
        </li>
      </ul>
      <Separator className="m-6 mx-96 border border-secondary/50" />
      <h4 className="p-4 text-lg">
        <strong>Target Completion:</strong> Q2 2025
      </h4>
      <Separator className="m-8 mx-64 border border-accent" />

      {/* Phase 2 */}
      <h3 className="p-4 text-xl font-bold">
        Phase 2: Multichain Support and Enhanced Community Engagement
        <span className="text-yellow-500 font-semibold"> ⏳ In Progress</span>
        </h3>
      <p className="px-4">
        <strong>Goal:</strong> Broaden AlphaPING’s reach across chains and introduce dynamic engagement features to foster community interaction.
      </p>
      <ul className="px-4">
        <li className="p-2">
          <h4 className="p-4 text-lg">Multichain Integration</h4>
          <ul className="px-4">
            <li className="p-2">
              Prioritize <strong>EVM-compatible Layer 2</strong> chains to enable cross-chain functionality, enhancing user flexibility and liquidity options.
            </li>
          </ul>
        </li>
        <Separator className="m-6 mx-96 border border-secondary/50" />
        <li className="p-2">
          <h4 className="p-4 text-lg">Enhanced Engagement Tools</h4>
          <ul className="px-4">
            <li className="p-2">
              Enable <strong>Twitter Post Embeds</strong> and <strong>Video Embeds</strong> for more dynamic discussions and shared content within the chat.
            </li>
            <li className="p-2">
              <strong>Community Polls:</strong> Launch polls for informal voting and sentiment gauging.
            </li>
            <li className="p-2">
              <strong>Email Notifications:</strong> Introduce notifications to alert users of updates, mentions, or governance announcements.
            </li>
            <li className="p-2">
              <strong>Points Program:</strong> Implement a system that rewards users for participation and engagement.
            </li>
            <li className="p-2">
              <strong>Leaderboard:</strong> Display top contributors to encourage quality participation.
            </li>
          </ul>
        </li>
      </ul>
      <Separator className="m-6 mx-96 border border-secondary/50" />
      <h4 className="p-4 text-lg">
        <strong>Target Completion:</strong> Q3 2025
      </h4>
      <Separator className="m-8 mx-64 border border-accent" />

      {/* Phase 3 */}
      <h3 className="p-4 text-xl font-bold">
        Phase 3: Governance and Decentralized Voting
        <span className="text-blue-500 font-semibold"> 📅 Upcoming</span>
    </h3>
      <p className="px-4">
        <strong>Goal:</strong> Implement community-led governance, allowing users to participate in AlphaPING’s direction.
      </p>
      <ul className="px-4">
        <li className="p-2">
          <h4 className="p-4 text-lg">Governance Token and Voting Mechanism</h4>
          <ul className="px-4">
            <li className="p-2">
              Launch the <strong>Governance Token</strong> and implement decentralized voting, enabling community input on platform decisions.
            </li>
          </ul>
        </li>
      </ul>
      <Separator className="m-6 mx-96 border border-secondary/50" />
      <h4 className="p-4 text-lg">
        <strong>Target Completion:</strong> Q4 2025
      </h4>
      <Separator className="m-8 mx-64 border border-accent" />

      {/* Phase 4 */}
      <h3 className="p-4 text-xl font-bold">
        Phase 4: Mobile Accessibility
        <span className="text-blue-500 font-semibold"> 📅 Upcoming</span>
    </h3>
      <p className="px-4">
        <strong>Goal:</strong> Increase accessibility with a mobile app, making AlphaPING available on mobile devices.
      </p>
      <ul className="px-4">
        <li className="p-2">
          <h4>Mobile App Development</h4>
          <ul className="px-4">
            <li className="p-2">
              Release a fully functional mobile application for iOS and Android to allow users to stay connected and trade on the go.
            </li>
          </ul>
        </li>
      </ul>
      <Separator className="m-6 mx-96 border border-secondary/50" />
      <h4 className="p-4 text-lg">
        <strong>Target Completion:</strong> Q1 2026
      </h4>
      <Footer />
    </div>
  );
};

export default Roadmap;
