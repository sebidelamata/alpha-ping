// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

interface IERC20 {
    function name() external view returns (string memory);
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

    struct Channel {
        uint256 id;
        address tokenAdress;
        string name;
        string tokenType;
    }

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

    // need to pass in these args when we deploy
    constructor(string memory _name, string memory _symbol) 
        ERC721(_name, _symbol)
    {
            owner = msg.sender;
    }
    
    // anyone can create a channel if it doesnt exist yet
    function createChannel(
        address _tokenAdress
    ) 
    public 
    onlyMember 
    onlyGoodOnes{
        require(
            channelExistsForToken[_tokenAdress] != true,
            "This Channel Already Exists!"
            );
        // try to classify token type automatically
        string memory _name;
        string memory _tokenType;
        try IERC20(_tokenAdress).name() returns (string memory tokenName) {
            _name = tokenName;
            _tokenType = "ERC20";
        } catch {
            // If it's not an ERC20 token, try ERC721
            try ERC721(_tokenAdress).name() returns (string memory tokenName) {
                _name = tokenName;
                _tokenType = "ERC721";
            } catch {
                // Return an empty string or handle the case where the token doesn't adhere to ERC20 or ERC721 standards
                _name = "";
            }
        }
        // if we dont get a result we error out
        require(
            bytes(_name).length > 0,
            "No Name Found For This Token!"
        );
        totalChannels++;
        channels[totalChannels] = Channel(totalChannels, _tokenAdress, _name, _tokenType);
        // auto-assign owner as mod, 
        // can create process to transfer power to mod later
        mods[totalChannels] = owner;
        // add to channel exists for token
        channelExistsForToken[_tokenAdress] == true;
    }

    // must be a member to join a channel
    function joinChannel(uint _channelId) 
    public 
    onlyMember 
    onlyGoodOnes 
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
    onlyMember
    onlyLegitChannels(_channelId){
        require(
            hasJoinedChannel[_channelId][msg.sender] == true,
            "You Are Not Currently A Member of This Channel!"
            );
        // join channel 
        hasJoinedChannel[_channelId][msg.sender] = false;
    }

    // this is how to join the app in general
    function mint() public{
        // mint nft
        totalSupply++;
        _safeMint(msg.sender, totalSupply);
        isMember[msg.sender] = true;
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
    function transferOwner(address _newOwner) public onlyOwner onlyGoodOnes{
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
    onlyMod(_channelId) 
    onlyGoodOnes{
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

    function withdraw() public onlyOwner onlyGoodOnes{
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
