// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import "hardhat/console.sol";

interface IERC20 {
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    // Functions
    function name() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function sendTokens(address token, address recipient, uint256 amount) external;
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract AlphaPING is ERC721 {
    // total nft supply (for keeping track of members)
    uint256 public totalSupply;
    // owner and admins
    address public owner;
    // the uint corresponds to the id of the channel
    mapping(uint256 => address) public mods;
    // keeps track of total number of channels
    uint256 public totalChannels;
    // mapping to track whether a channel has been created for a token address
    mapping(address => bool) public channelExistsForToken;
     // maps each channel id to a channel object
    mapping(uint256 => Channel) public channels;
    // maps each channel id to a mapping of each address if it has joined
    mapping(uint256 => mapping(address => bool)) public hasJoinedChannel;
    // we also want to hold memberships
    mapping(address => bool) public isMember;
    // need to be able to ban bad behaviour and bots
    mapping(address => bool) public isBlackListed;
    // keep track of channel bans
    mapping(uint256 => mapping(address => bool)) public channelBans;
    // promo period
    bool public promoPeriod = true;
    // premium membership subscription
    mapping(address => uint256) public premiumMembershipExpiry;
    // to buy a premium subscription we need some other stuff
    // the expiry (how long the subscription lasts in seconds)
    uint256 public monthDuration = 2592000;
    // the cost (how long much the subscription costs for a period)
    uint256 public subscriptionPriceMonthly;
    // our payment currency
    address public subscriptionCurrency;
    // personal blocking
    mapping(address => mapping(address => bool)) public personalBlockList;
    // personal following
    mapping(address => mapping(address => bool)) public personalFollowList;
    // channel object
    struct Channel {
        uint256 id;
        address tokenAddress;
        string name;
        string tokenType;
    }
    //modifiers
    modifier onlyOwner() {
        require(
            msg.sender == owner, 
            "Only Owner Role May Execute This Function!"
            );
        _;
    }
    // we also have mod role per channel, but owner can also do anything a mod can do
    modifier onlyMod(uint256 _channelId) {
        require(
            (msg.sender == mods[_channelId]) || msg.sender == owner,
            "Only Channel Mod or Owner Role May Execute This Function!"
            );
        _;
    }
    // members can create, join, and leave channels
    modifier onlyMember(){
        require(
            isMember[msg.sender] == true,
            "Only AlphaPING Members May Execute This Function!"
            );
        _;
    }
    // bad behavior and bots are banned from pretty much everything
    modifier onlyGoodOnes(){
        require(
            isBlackListed[msg.sender] != true,
            "This User's Priveledges Have Been Revoked Due To Being Blacklisted!"
            );
        _;
    }
    // we verify if it is a real channel a lot
    modifier onlyLegitChannels(uint256 _channelId){
        require(
            _channelId != 0,
            "Channel ID Must Be Greater Than Zero!"
            );
        require(
            _channelId <= totalChannels,
            "Channel ID Too Large!"
            );
        _;
    }
    // Constructor
    // need to pass in these args when we deploy
    constructor(string memory _name, string memory _symbol) 
    ERC721(_name, _symbol)
    {
        owner = msg.sender;
        mint();
        // set up subscription currency (usdc)
        setSubscriptionCurrency(0xaf88d065e77c8cC2239327C5EDb3A432268e5831);
        // set up some initial subscription prices
        // $5 a month
        setSubscriptionPriceMonthly(5000000);
    }
    // Functions
    // this is how to join the app in general
    function mint() public{
        // mint nft
        totalSupply++;
        _safeMint(msg.sender, totalSupply);
        isMember[msg.sender] = true;
    }
    
    // anyone can create a channel if it doesnt exist yet
    function createChannel(
        address _tokenAddress,
        string memory _tokenType
    ) 
    public 
    onlyMember 
    onlyGoodOnes{
        // channel must be new
        require(
            channelExistsForToken[_tokenAddress] != true,
            "This Channel Already Exists!"
            );
        // token can only be ERC20 or ERC721
        // need to hash strings to compare them
        bytes32 erc20Hash = keccak256(abi.encodePacked("ERC20"));
        bytes32 erc721Hash = keccak256(abi.encodePacked("ERC721"));
        bytes32 _tokenTypeHash = keccak256(abi.encodePacked(_tokenType));
        require(
            (_tokenTypeHash == erc20Hash) || (_tokenTypeHash == erc721Hash),
            "Token Type Must Either Be ERC20 or ERC721!"
            );
        // if the token is a 721 make sure it actually is one
        if(_tokenTypeHash == erc721Hash){
            require(
                IERC721(_tokenAddress).supportsInterface(0x80ac58cd),
                "This Is Not A Valid ERC721 Token!"
                );
        } 
        // we can't outright test if an address is an erc20 bc it was
        // implemented before erc165 (supportsInterface)
        // however erc20s have a function that erc721s don't: decimals
        // so we test if we get a reasonable result from calling decimals
        // not perfect but its something
        if(_tokenTypeHash == erc20Hash){
            require(
                IERC20(_tokenAddress).decimals() >= 0,
                "This Is Not A Valid ERC20 Token!"
                );
        } 
        // try to classify token name automatically
        string memory _name;

        if(_tokenTypeHash == erc20Hash){
            try IERC20(_tokenAddress).name() returns (string memory tokenName) {
                _name = tokenName;
            } catch {
                _name = "";
            }
        }

        if(_tokenTypeHash == erc721Hash){
            try ERC721(_tokenAddress).name() returns (string memory tokenName) {
                _name = tokenName;
            } catch {
                _name = "";
            }
        }
        // if we dont get a result we error out
        if(_tokenTypeHash == erc20Hash){
            require(
                bytes(_name).length > 0,
                "No Name Found For This ERC20 Token!"
            );
        }
        if(_tokenTypeHash == erc721Hash){
            require(
                bytes(_name).length > 0,
                "No Name Found For This ERC721 Token!"
            );
        }

        totalChannels++;
        channels[totalChannels] = Channel(totalChannels, _tokenAddress, _name, _tokenType);
        // auto-assign owner as mod, 
        // can create process to transfer power to mod later
        mods[totalChannels] = owner;
        // add to channel exists for token
        channelExistsForToken[_tokenAddress] == true;
    }

    // must be a member to join a channel
    function joinChannel(uint _channelId) 
    public 
    onlyMember 
    onlyLegitChannels(_channelId){
        require(
            hasJoinedChannel[_channelId][msg.sender] != true,
            "You Have Already Joined This Channel"
            );
        // join channel 
        hasJoinedChannel[_channelId][msg.sender] = true;
    }

    // only members can leave channels
    function leaveChannel(uint _channelId) 
    public 
    onlyLegitChannels(_channelId){
        require(
            hasJoinedChannel[_channelId][msg.sender] == true,
            "You Are Not Currently A Member of This Channel!"
            );
        // join channel 
        hasJoinedChannel[_channelId][msg.sender] = false;
    }

    // returns channel properties
    function getChannel(uint _channelId) 
    public 
    view 
    onlyLegitChannels(_channelId)
    returns (Channel memory) {
        return channels[_channelId];
    }

    // transfer owner with some extra rules
    function transferOwner(address _newOwner) public onlyOwner{
        // new owner must be a member
        require(
            isMember[_newOwner] == true,
            "New Owner Must Be An AlphaPING Member!"
            );
        // new owner must be one of the good ones
        require(
            isBlackListed[_newOwner] != true,
            "New Owner Must Not Be Blacklisted!"
            );
        owner = _newOwner;
    }

    // transfer Mod with some rules
    function transferMod(address _newMod, uint256 _channelId) 
    public 
    onlyLegitChannels(_channelId)
    onlyMod(_channelId){
        // new mod must be a member
        require(
            isMember[_newMod] == true,
            "New Channel Mod Must Be An AlphaPING Member!"
            );
        // new mod must be one of the good ones
        require(
            isBlackListed[_newMod] != true,
            "New Channel Mod Must Not Be Blacklisted!"
            );
        mods[_channelId] = _newMod;
    }

    // mods can ban on individual channels
    function channelBan(
        address _bannedAccount, 
        uint256 _channelId
        ) 
    public 
    onlyMod(_channelId){
        require(
            channelBans[_channelId][_bannedAccount] != true,
            "This User Is Already Banned On This Channel!"
            );
        channelBans[_channelId][_bannedAccount] = true;
    }

    // unban user
    function channelUnban(
        address _bannedAccount,
        uint256 _channelId
    )
    public
    onlyMod(_channelId){
        require(
            channelBans[_channelId][_bannedAccount] == true,
            "This User Is Not Currently Banned!"
        );
        channelBans[_channelId][_bannedAccount] = false;
    }

    // blacklistUser
    function blacklistUser(address _blacklistedUser) public onlyOwner{
        require(
            isBlackListed[_blacklistedUser] != true,
            "User Is Already Blacklisted!"
        );
        isBlackListed[_blacklistedUser] = true;
    }

    // reverse blacklist
    function unBlacklistUser(address _blacklistedUser) public onlyOwner{
        require(
            isBlackListed[_blacklistedUser] == true,
            "User Is Not Currently Blacklisted!"
        );
        isBlackListed[_blacklistedUser] = false;
    }

    // this function will remove mode role and add them to blacklist
    function banMod(address _bannedMod, uint256 _channelId) public onlyOwner{
        require(
            isBlackListed[_bannedMod] != true,
            "User Is Already Blacklisted!"
        );
        require(
            mods[_channelId] == _bannedMod,
            "User Is Not A Mod For This Channel!"
        );
        mods[_channelId] = owner;
        isBlackListed[_bannedMod] = true;
    }
    
    // these functions add and remover users from a personal blocklist
    function addToPersonalBlockList(address _blacklistedAddress) public {
        personalBlockList[msg.sender][_blacklistedAddress] = true;
    }
    function removeFromPersonalBlockList(address _blacklistedAddress) public {
        personalBlockList[msg.sender][_blacklistedAddress] = false;
    }

    // these functions add and remover users from a personal blocklist
    function addToPersonalFollowList(address _followedAddress) public {
        personalFollowList[msg.sender][_followedAddress] = true;
    }
    function removeFromPersonalFollowList(address _followedAddress) public {
        personalFollowList[msg.sender][_followedAddress] = false;
    }

    // these are functions for turning off and on free 
    // premium membership promotion period
    function togglePromoPeriod() public onlyOwner{
        promoPeriod = !promoPeriod;
    }

    // set our payment currency
    function setSubscriptionCurrency(address _subscriptionCurrency) public onlyOwner{
        subscriptionCurrency = _subscriptionCurrency;
    }

    // these functions allow the owner to set new subscription prices
    function setSubscriptionPriceMonthly(uint256 _newSubscriptionPrice) public onlyOwner{
        subscriptionPriceMonthly = _newSubscriptionPrice;
    }

    // allow users to purchase premium memberships
    function purchaseMonthlySubscription() external onlyMember{
        require(
            IERC20(subscriptionCurrency).balanceOf(msg.sender) >= subscriptionPriceMonthly, 
            "You do not have enough USDC balance!"
        );
        // Check the allowance
        uint256 allowed = IERC20(subscriptionCurrency).allowance(msg.sender, address(this));
        require(
            allowed >= subscriptionPriceMonthly, 
            "Allowance is not sufficient"
        );
        // Transfer USDC tokens from the sender to the contract
        bool success = IERC20(subscriptionCurrency).transferFrom(msg.sender, address(this), subscriptionPriceMonthly);
        require(
            success,
            "Transfer Failed"
        );
        premiumMembershipExpiry[msg.sender] = block.timestamp + monthDuration;
    }
    // we also need a function to check if the subscription has expired
    function isSubscriptionActive(address _subscriber) external view returns (bool) {
        // owner is premium by default
        if(_subscriber == owner){
            return true;
        }
        return premiumMembershipExpiry[_subscriber] > block.timestamp;
    }

    // allow owner to witdhraw subscription payments
    function withdraw() public onlyOwner{
        bool approved = IERC20(subscriptionCurrency).approve(address(this), subscriptionPriceMonthly);
        bool success = IERC20(subscriptionCurrency).transferFrom(
            address(this), 
            owner, 
            subscriptionPriceMonthly
        );
        require(
            success,
            "Transfer Failed"
        );
    }
}
