import React from "react";

const TechnicalDocs:React.FC = () => {
    return(
        <div className="tech-docs-container">
            <h2 className="tech-docs-title">
                AlphaPING Smart Contract Documentation
            </h2>
            <br />
            <h3>Overview</h3>
            <p>
            The <code>AlphaPING</code> smart contract is a decentralized platform built on Arbitrum where users can mint NFT membershipss, join or create channels, manage memberships, interact with ERC20/ERC721 tokens, and handle user profiles and privacy settings. This contract supports features like premium subscriptions, user bans, personal blocking/following, and channel moderation.
            </p>
            <br />
            <h4>Key Features</h4>
            <ul>
                <li>Minting and managing membership via NFTs.</li>
                <li>Channel creation with ERC20/ERC721 token-based memberships.</li>
                <li>Profile management (username and profile picture).</li>
                <li>Premium membership system with subscription payments.</li>
                <li>Moderation tools (ban users, transfer mod ownership).</li>
                <li>Personal privacy settings (block and follow users).</li>
                <li>Blacklist functionality for malicious behavior.</li>
            </ul>
            <br />
            <h3>Contract Structure</h3>
            <p>The contract consists of several components and mappings to manage users, channels, and subscriptions.</p>
            <br />
            <h4>State Variables</h4>
            <ul>
                <li>
                    <code>totalSupply</code>: Tracks the total supply of NFTs minted (used for membership).
                </li>
                <li>
                    <code>owner</code>: The address of the contract owner.
                </li>
                <li>
                    <code>mods</code>: Mapping of channel IDs to moderators.
                </li>
                <li>
                    <code>totalChannels</code>: Tracks the number of channels created.
                </li>
                <li>
                    <code>channelExistsForToken</code>: Mapping to track whether a channel has been created for a specific token address.
                </li>
                <li>
                    <code>channels</code>: Mapping of channel IDs to channel details (token address, token type, etc.).
                </li>
                <li>
                    <code>hasJoinedChannel</code>: Tracks whether an address has joined a specific channel.
                </li>
                <li>
                    <code>isMember</code>: Maps user addresses to membership status.
                </li>
                <li>
                    <code>profilePic</code>: Stores the profile picture URL string for each user.
                </li>
                <li>
                    <code>username</code>: Maps users to their chosen usernames.
                </li>
                <li>
                    <code>isBlackListed</code>: Tracks blacklisted users (those banned from the platform).
                </li>
                <li>
                    <code>channelBans</code>: Mapping to track bans per channel.
                </li>
                <li>
                    <code>promoPeriod</code>: Flag for a promotional period (can be toggled).
                </li>
                <li>
                    <code>premiumMembershipExpiry</code>: Mapping to track the expiry date of premium memberships for users.
                </li>
                <li>
                    <code>monthDuration</code>: The duration (in seconds) of a monthly subscription.
                </li>
                <li>
                    <code>subscriptionPriceMonthly</code>: The cost (in the subscription currency) for a monthly subscription.
                </li>
                <li>
                    <code>subscriptionCurrency</code>: The address of the ERC20 token used for subscriptions.
                </li>
                <li>
                    <code>personalBlockList</code>: Mapping of user addresses to addresses they have blocked.
                </li>
                <li>
                    <code>personalFollowList</code>: Mapping of user addresses to addresses they are following.
                </li>
            </ul>
            <br />
            <h4>Structs</h4>
            <p><code>Channel</code></p>
            <pre>
                <code>
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
            <ul>
                <li>
                    <code>id</code>: The unique identifier for each channel.
                </li>
                <li>
                    <code>tokenAddress</code>: The address of the ERC20/ERC721 token associated with the channel.
                </li>
                <li>
                    <code>name</code>: The name of the channel.
                </li>
                <li>
                    <code>tokenType</code>: The type of token used (either "ERC20" or "ERC721").
                </li>
            </ul>
            <br />
            <h4>Modifiers</h4>
            <ul>
                <li>
                    <code>onlyOwner</code>: Restricts access to the contract's owner.
                </li>
                <li>
                    <code>onlyMod</code>: Restricts access to channel moderators and the owner.
                </li>
                <li>
                    <code>onlyMember</code>: Restricts access to users who hold a membership NFT.
                </li>
                <li>
                    <code>onlyGoodOnes</code>: Restricts access to non-blacklisted users.
                </li>
                <li>
                    <code>onlyLegitChannels</code>: Ensures the channel ID is valid.
                </li>
            </ul>
            <br />
            <h4>Functions</h4>
            <br />
            <h5>Minting and Membership</h5>
            <code>mint()</code>
            <p>Allows users to mint a new membership NFT and join the platform as a member.</p>
            <pre>
                <code>
                    function mint() public;
                </code>
            </pre>
            <br />
            <br />
            <h5>Profile Management</h5>
            <code>setProfilePic(string memory _picString)</code>
            <p>Allows users to set their profile picture as a string (URL). Must be an image filetype (.png, .jpg, etc)</p>
            <pre>
                <code>
                    function setProfilePic(string memory _picString) public;
                </code>
            </pre>
            <br />
            <code>setUsername(string memory _username)</code>
            <p>Allows users to set their username.</p>
            <pre>
                <code>
                    function setUsername(string memory _username) public;
                </code>
            </pre>
            <br />
            <br />
            <h5>Channel Management</h5>
            <code>createChannel(address _tokenAddress, string memory _tokenType)</code>
            <p>Allows a member to create a new channel using an ERC20/ERC721 token. The token type must be specified.</p>
            <pre>
                <code>
                    function createChannel(address _tokenAddress, string memory _tokenType) public onlyMember onlyGoodOnes;
                </code>
            </pre>
            <br />
            <code>joinChannel(uint _channelId)</code>
            <p>Allows a member to join a channel.</p>
            <pre>
                <code>
                    function joinChannel(uint _channelId) public onlyMember onlyLegitChannels;
                </code>
            </pre>
            <br />
            <code>leaveChannel(uint _channelId)</code>
            <p>Allows a member to leave a channel.</p>
            <pre>
                <code>
                    function leaveChannel(uint _channelId) public onlyLegitChannels;
                </code>
            </pre>
            <br />
            <code>getChannel(uint _channelId)</code>
            <p>Returns the details of a specific channel.</p>
            <pre>
                <code>
                    function getChannel(uint _channelId) public view onlyLegitChannels returns (Channel memory);
                </code>
            </pre>
            <br />
            <br />
            <h5>Ownership and Moderation</h5>
            <code>transferOwner(address _newOwner)</code>
            <p>Transfers the ownership of the contract to a new address.</p>
            <pre>
                <code>
                    function transferOwner(address _newOwner) public onlyOwner;
                </code>
            </pre>
            <br />
            <code>transferMod(address _newMod, uint256 _channelId)</code>
            <p>Transfers the moderator role of a specific channel to a new address.</p>
            <pre>
                <code>
                    function transferMod(address _newMod, uint256 _channelId) public onlyMod(_channelId);
                </code>
            </pre>
            <br />
            <code>channelBan(address _bannedAccount, uint256 _channelId)</code>
            <p>Bans a user from a specific channel.</p>
            <pre>
                <code>
                    function channelBan(address _bannedAccount, uint256 _channelId) public onlyMod(_channelId);
                </code>
            </pre>
            <br />
            <code>channelUnban(address _bannedAccount, uint256 _channelId)</code>
            <p>Unbans a user from a specific channel.</p>
            <pre>
                <code>
                    function channelUnban(address _bannedAccount, uint256 _channelId) public onlyMod(_channelId);
                </code>
            </pre>
            <br />
            <br />
            <h5>User Blacklist and Ban Management</h5>
            <code>blacklistUser(address _blacklistedUser)</code>
            <p>Blacklists a user from the entire platform.</p>
            <pre>
                <code>
                    function blacklistUser(address _blacklistedUser) public onlyOwner;
                </code>
            </pre>
            <br />
            <code>unBlacklistUser(address _blacklistedUser)</code>
            <p>Removes a user from the blacklist.</p>
            <pre>
                <code>
                    function unBlacklistUser(address _blacklistedUser) public onlyOwner;
                </code>
            </pre>
            <br />
            <code>banMod(address _bannedMod, uint256[] memory _channelIds)</code>
            <p>Bans a moderator from the platform and transfers their mod role to the owner for the specified channels.</p>
            <pre>
                <code>
                    function banMod(address _bannedMod, uint256[] memory _channelIds) public onlyOwner;
                </code>
            </pre>
            <br />
            <br />
            <h5>Personal Blocklist and Follow List</h5>
            <code>addToPersonalBlockList(address _blacklistedAddress)</code>
            <p>Adds a user to the caller’s personal blocklist.</p>
            <pre>
                <code>
                    function addToPersonalBlockList(address _blacklistedAddress) public;
                </code>
            </pre>
            <br />
            <code>removeFromPersonalBlockList(address _blacklistedAddress)</code>
            <p>Removes a user from the caller’s personal blocklist.</p>
            <pre>
                <code>
                    function removeFromPersonalBlockList(address _blacklistedAddress) public;
                </code>
            </pre>
            <br />
            <code>addToPersonalFollowList(address _followedAddress)</code>
            <p>Adds a user to the caller’s personal follow list.</p>
            <pre>
                <code>
                    function addToPersonalFollowList(address _followedAddress) public;
                </code>
            </pre>
            <br />
            <br />
            <h4>Subscription and Premium Membership</h4>
            <h5>Set Subscription Details</h5>
            <code>setSubscriptionPriceMonthly(uint256 _price)</code>
            <p>Sets the monthly subscription price for premium membership.</p>
            <pre>
                <code>
                    function setSubscriptionPriceMonthly(uint256 _price) public onlyOwner;
                </code>
            </pre>
            <br />
            <code>setSubscriptionCurrency(address _currencyAddress)</code>
            <p>Sets the address of the ERC20 token used for subscription payments.</p>
            <pre>
                <code>
                    function setSubscriptionCurrency(address _currencyAddress) public onlyOwner;
                </code>
            </pre>
            <br />
            <br />
            <h4>Example Use Cases</h4>
            <ol>
                <li>
                    <h5>Minting a Membership:</h5>
                    <p>Users mint an NFT, which grants them access to the platform and its features (like creating or joining channels).</p>
                </li>
                <li>
                    <h5>Creating a Channel:</h5>
                    <p>A member creates a channel using an ERC20/ERC721 token. The channel will be associated with that token.</p>
                </li>
                <li>
                    <h5>Joining/Leaving a Channel:</h5>
                    <p>A member joins or leaves a channel at any time, allowing them to participate in token-based activities.</p>
                </li>
                <li>
                    <h5>Moderation:</h5>
                    <p>Moderators can ban or unban users from specific channels, while the contract owner can manage the overall platform by blacklisting users or transferring ownership.</p>
                </li>
            </ol>
            <br />
            <br />

        </div>
    )
}

export default TechnicalDocs;