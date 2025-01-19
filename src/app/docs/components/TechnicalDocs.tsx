import React from "react";
import Footer from "src/app/components/Footer";

const TechnicalDocs:React.FC = () => {
    return(
        <div className="relative flex h-screen flex-col gap-4">
            <h2 className="p-4 text-4xl font-bold">
                AlphaPING Smart Contract Documentation
            </h2>
            <h3 className="p-4 text-xl font-bold">
                Overview
            </h3>
            <p className="px-4">
                The <code className="text-accent">AlphaPING</code> smart contract is a decentralized platform built on Arbitrum where users can mint NFT memberships, join or create channels, manage memberships, interact with ERC20/ERC721 tokens, and handle user profiles and privacy settings. This contract supports features like premium subscriptions, user bans, personal blocking/following, and channel moderation.
            </p>
            <h4 className="p-4 pl-6 text-lg">
                Key Features
            </h4>
            <ul className="px-4">
                <li className="p-2">
                    Minting and managing membership via NFTs.
                </li>
                <li className="p-2">
                    Channel creation with ERC20/ERC721 token-based memberships.
                </li>
                <li className="p-2">
                    Profile management (username and profile picture).
                </li>
                <li className="p-2">
                    Premium membership system with subscription payments.
                </li>
                <li className="p-2">
                    Moderation tools (ban users, transfer mod ownership).
                </li>
                <li className="p-2">
                    Personal privacy settings (block and follow users).
                </li>
                <li className="p-2">
                    Blacklist functionality for malicious behavior.
                </li>
            </ul>
            <h3 className="p-4 text-xl font-bold">
                Contract Structure
            </h3>
            <p className="px-4">
                The contract consists of several components and mappings to manage users, channels, and subscriptions.
            </p>
            <h4 className="p-4 pl-6 text-lg">
                State Variables
            </h4>
            <ul className="px-4">
                <li className="p-2">
                    <code className="text-accent">totalSupply</code>: Tracks the total supply of NFTs minted (used for membership).
                </li>
                <li className="p-2">
                    <code className="text-accent">owner</code>: The address of the contract owner.
                </li>
                <li className="p-2">
                    <code className="text-accent">mods</code>: Mapping of channel IDs to moderators.
                </li>
                <li className="p-2">
                    <code className="text-accent">totalChannels</code>: Tracks the number of channels created.
                </li>
                <li className="p-2">
                    <code className="text-accent">channelExistsForToken</code>: Mapping to track whether a channel has been created for a specific token address.
                </li>
                <li className="p-2">
                    <code className="text-accent">channels</code>: Mapping of channel IDs to channel details (token address, token type, etc.).
                </li>
                <li className="p-2">
                    <code className="text-accent">hasJoinedChannel</code>: Tracks whether an address has joined a specific channel.
                </li>
                <li className="p-2">
                    <code className="text-accent">isMember</code>: Maps user addresses to membership status.
                </li>
                <li className="p-2">
                    <code className="text-accent">profilePic</code>: Stores the profile picture URL string for each user.
                </li>
                <li className="p-2">
                    <code className="text-accent">username</code>: Maps users to their chosen usernames.
                </li>
                <li className="p-2">
                    <code className="text-accent">isBlackListed</code>: Tracks blacklisted users (those banned from the platform).
                </li>
                <li className="p-2">
                    <code className="text-accent">channelBans</code>: Mapping to track bans per channel.
                </li>
                <li className="p-2">
                    <code className="text-accent">promoPeriod</code>: Flag for a promotional period (can be toggled).
                </li>
                <li className="p-2">
                    <code className="text-accent">premiumMembershipExpiry</code>: Mapping to track the expiry date of premium memberships for users.
                </li>
                <li className="p-2">
                    <code className="text-accent">monthDuration</code>: The duration (in seconds) of a monthly subscription.
                </li>
                <li className="p-2">
                    <code className="text-accent">subscriptionPriceMonthly</code>: The cost (in the subscription currency) for a monthly subscription.
                </li>
                <li className="p-2">
                    <code className="text-accent">subscriptionCurrency</code>: The address of the ERC20 token used for subscriptions.
                </li>
                <li className="p-2">
                    <code className="text-accent">personalBlockList</code>: Mapping of user addresses to addresses they have blocked.
                </li>
                <li className="p-2">
                    <code className="text-accent">personalFollowList</code>: Mapping of user addresses to addresses they are following.
                </li>
            </ul>
            <h4 className="p-4 pl-6 text-lg">
                Structs
            </h4>
            <ul className="px-4">
                <li className="p-2">
                    <p className="px-4">
                        <code className="text-accent">Channel</code>
                    </p>
                    <pre className="m-4 rounded bg-secondary px-4">
                        <br />
                        <code className="text-primary">
                            {
                                `   struct Channel {
    uint256 id;
    address tokenAddress;
    string name;
    string tokenType;
    }`
                            }
                        </code>
                    </pre>
                    <br />
                    <ul className="px-4">
                        <li className="p-2">
                            <code className="text-accent">id</code>: The unique identifier for each channel.
                        </li>
                        <li className="p-2">
                            <code className="text-accent">tokenAddress</code>: The address of the ERC20/ERC721 token associated with the channel.
                        </li>
                        <li className="p-2">
                            <code className="text-accent">name</code>: The name of the channel.
                        </li>
                        <li className="p-2">
                            <code className="text-accent">tokenType</code>: The type of token used (either "ERC20" or "ERC721").
                        </li>
                    </ul>
                </li>
            </ul>
            <h4 className="p-4 pl-6 text-lg">
                Modifiers
            </h4>
            <ul className="px-4">
                <li className="p-2 pl-8">
                    <code className="text-accent">onlyOwner</code>: Restricts access to the contract's owner.
                </li>
                <li className="p-2 pl-8">
                    <code className="text-accent">onlyMod</code>: Restricts access to channel moderators and the owner.
                </li>
                <li className="p-2 pl-8">
                    <code className="text-accent">onlyMember</code>: Restricts access to users who hold a membership NFT.
                </li>
                <li className="p-2 pl-8">
                    <code className="text-accent">onlyGoodOnes</code>: Restricts access to non-blacklisted users.
                </li>
                <li className="p-2 pl-8">
                    <code className="text-accent">onlyLegitChannels</code>: Ensures the channel ID is valid.
                </li>
            </ul>
            <h4 className="p-4 pl-6 text-lg">
                Functions
            </h4>
            <ul className="px-4">
                <li className="p-2">
                    <h5 className="p-4 pl-6">
                        Minting and Membership
                    </h5>
                    <ul className="px-4">
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                mint()
                            </code>
                            <p className="px-4">
                                Allows users to mint a new membership NFT and join the platform as a member.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function mint() public;
                                </code>
                            </pre>
                            <br />
                        </li>
                    </ul>
                </li>
                <li className="p-2">
                    <h5 className="p-4 pl-6">
                        Profile Management
                    </h5>
                    <ul className="px-4">
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                setProfilePic(string memory _picString)
                            </code>
                            <p className="px-4">
                                Allows users to set their profile picture as a string (URL). Must be an image filetype (.png, .jpg, etc)
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function setProfilePic(string memory _picString) public;
                                </code>
                            </pre>
                            <br />
                        </li>
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                setUsername(string memory _username)
                            </code>
                            <p className="px-4">
                                Allows users to set their username.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function setUsername(string memory _username) public;
                                </code>
                            </pre>
                            <br />
                        </li>
                    </ul>
                </li>
                <li className="p-2">
                    <h5 className="p-4 pl-6">
                        Channel Management
                    </h5>
                    <ul className="px-4">
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                createChannel(address _tokenAddress, string memory _tokenType)
                            </code>
                            <p className="px-4">
                                Allows a member to create a new channel using an ERC20/ERC721 token. The token type must be specified.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function createChannel(address _tokenAddress, string memory _tokenType) public onlyMember onlyGoodOnes;
                                </code>
                            </pre>
                            <br />
                        </li>
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                joinChannel(uint _channelId)
                            </code>
                            <p className="px-4">
                                Allows a member to join a channel.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function joinChannel(uint _channelId) public onlyMember onlyLegitChannels;
                                </code>
                            </pre>
                            <br />
                        </li>
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                leaveChannel(uint _channelId)
                            </code>
                            <p className="px-4">
                                Allows a member to leave a channel.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function leaveChannel(uint _channelId) public onlyLegitChannels;
                                </code>
                            </pre>
                            <br />
                        </li>
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                getChannel(uint _channelId)
                            </code>
                            <p className="px-4">
                                Returns the details of a specific channel.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function getChannel(uint _channelId) public view onlyLegitChannels returns (Channel memory);
                                </code>
                            </pre>
                            <br />
                        </li>
                    </ul>
                </li>
                <li className="p-2">
                    <h5 className="p-4 pl-6">
                        Ownership and Moderation
                    </h5>
                    <ul className="px-4">
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                transferOwner(address _newOwner)
                            </code>
                            <p className="px-4">
                                Transfers the ownership of the contract to a new address.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function transferOwner(address _newOwner) public onlyOwner;
                                </code>
                            </pre>
                            <br />
                        </li>
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                transferMod(address _newMod, uint256 _channelId)
                            </code>
                            <p className="px-4">
                                Transfers the moderator role of a specific channel to a new address.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function transferMod(address _newMod, uint256 _channelId) public onlyMod(_channelId);
                                </code>
                            </pre>
                            <br />
                        </li>
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                channelBan(address _bannedAccount, uint256 _channelId)
                            </code>
                            <p className="px-4">
                                Bans a user from a specific channel.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function channelBan(address _bannedAccount, uint256 _channelId) public onlyMod(_channelId);
                                </code>
                            </pre>
                            <br />
                        </li>
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                channelUnban(address _bannedAccount, uint256 _channelId)
                            </code>
                            <p className="px-4">
                                Unbans a user from a specific channel.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function channelUnban(address _bannedAccount, uint256 _channelId) public onlyMod(_channelId);
                                </code>
                            </pre>
                            <br />
                        </li>
                    </ul>
                </li>
                <li className="p-2">
                    <h5 className="p-4 pl-6">
                        User Blacklist and Ban Management
                    </h5>
                    <ul className="px-4">
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                blacklistUser(address _blacklistedUser)
                            </code>
                            <p className="px-4">
                                Blacklists a user from the entire platform.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function blacklistUser(address _blacklistedUser) public onlyOwner;
                                </code>
                            </pre>
                            <br />
                        </li>
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                unBlacklistUser(address _blacklistedUser)
                            </code>
                            <p className="px-4">
                                Removes a user from the blacklist.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function unBlacklistUser(address _blacklistedUser) public onlyOwner;
                                </code>
                            </pre>
                            <br />
                        </li>
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                banMod(address _bannedMod, uint256[] memory _channelIds)
                            </code>
                            <p className="px-4">
                                Bans a moderator from the platform and transfers their mod role to the owner for the specified channels.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function banMod(address _bannedMod, uint256[] memory _channelIds) public onlyOwner;
                                </code>
                            </pre>
                            <br />
                        </li>
                    </ul>
                </li>
                <li className="p-2">
                    <h5 className="p-4 pl-6">
                        Personal Blocklist and Follow List
                    </h5>
                    <ul className="px-4">
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                addToPersonalBlockList(address _blacklistedAddress)
                            </code>
                            <p className="px-4">
                                Adds a user to the caller’s personal blocklist.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function addToPersonalBlockList(address _blacklistedAddress) public;
                                </code>
                            </pre>
                            <br />
                        </li>
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                removeFromPersonalBlockList(address _blacklistedAddress)
                            </code>
                            <p className="px-4">
                                Removes a user from the caller’s personal blocklist.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function removeFromPersonalBlockList(address _blacklistedAddress) public;
                                </code>
                            </pre>
                            <br />
                        </li>
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                addToPersonalFollowList(address _followedAddress)
                            </code>
                            <p className="px-4">
                                Adds a user to the caller’s personal follow list.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function addToPersonalFollowList(address _followedAddress) public;
                                </code>
                            </pre>
                            <br />
                        </li>
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                removeFromPersonalFollowList(address _followedAddress)
                            </code>
                            <p className="px-4">
                                Removes a user from the caller’s personal follow list.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function removeFromPersonalFollowList(address _followedAddress) public;
                                </code>
                            </pre>
                            <br />
                        </li>
                    </ul>
                </li>
                <li className="p-2">
                    <h5 className="p-4 pl-6">
                        Subscription and Premium Membership
                    </h5>
                    <ul className="px-4">
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                setSubscriptionPriceMonthly(uint256 _price)
                            </code>
                            <p className="px-4">
                                Sets the monthly subscription price for premium membership.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function setSubscriptionPriceMonthly(uint256 _price) public onlyOwner;
                                </code>
                            </pre>
                            <br />
                        </li>
                        <li className="p-2">
                            <code className="px-4 text-accent">
                                setSubscriptionCurrency(address _currencyAddress)
                            </code>
                            <p className="px-4">
                                Sets the address of the ERC20 token used for subscription payments.
                            </p>
                            <pre className="m-4 rounded bg-secondary px-4">
                                <br />
                                <code className="text-primary">
                                    function setSubscriptionCurrency(address _currencyAddress) public onlyOwner;
                                </code>
                            </pre>
                            <br />
                        </li>
                    </ul>
                </li>
            </ul>
            <h4 className="p-4 pl-6 text-lg">
                Example Use Cases
            </h4>
            <ol className="px-4">
                <li>
                    <h5 className="px-4">
                        Minting a Membership:
                    </h5>
                    <p className="px-4">
                        Users mint an NFT, which grants them access to the platform and its features (like creating or joining channels).
                    </p>
                </li>
                <br />
                <li>
                    <h5 className="px-4">
                        Creating a Channel:
                    </h5>
                    <p className="px-4">
                        A member creates a channel using an ERC20/ERC721 token. The channel will be associated with that token.
                    </p>
                </li>
                <br />
                <li>
                    <h5 className="px-4">
                        Joining/Leaving a Channel:
                    </h5>
                    <p className="px-4">
                        A member joins or leaves a channel at any time, allowing them to participate in token-based activities.
                    </p>
                </li>
                <br />
                <li>
                    <h5 className="px-4">
                        Moderation:
                    </h5>
                    <p className="px-4">
                        Moderators can ban or unban users from specific channels, while the contract owner can manage the overall platform by blacklisting users or transferring ownership.
                    </p>
                </li>
            </ol>
            <br />
            <Footer/>
        </div>
    )
}

export default TechnicalDocs;