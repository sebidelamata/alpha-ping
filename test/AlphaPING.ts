const { expect } = require("chai")
const { ethers } = require("hardhat")
import {
  Signer,
  ContractFactory,
  AddressLike
} from 'ethers'
import { AlphaPING } from "../typechain-types/contracts/AlphaPING.sol/AlphaPING";

const tokens = (n: number) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("AlphaPING", function () {
  
  const NAME = "AlphaPING"
  const SYMBOL = "APING"
  const ARBITRUM_TOKEN_CONTRACT_ADDRESS = "0x912CE59144191C1204E64559FE8253a0e49E6548"
  const ARBITRUM_TOKEN_NAME = "Arbitrum"
  const ARBITRUM_TOKEN_TYPE = "ERC20"
  const GBC_TOKEN_CONTRACT_ADDRESS = "0x17f4BAa9D35Ee54fFbCb2608e20786473c7aa49f"
  const GBC_TOKEN_NAME = "Blueberry Club"
  const GBC_TOKEN_TYPE = "ERC721"

  let AlphaPING: ContractFactory
  let alphaPING: AlphaPING
  let deployer: Signer, user: Signer, nonMember: Signer
  let userIsMemberBefore: boolean;
  beforeEach( async () => {
    [deployer, user, nonMember] = await ethers.getSigners()
    AlphaPING = await ethers.getContractFactory("AlphaPING")
    alphaPING = await AlphaPING.deploy(NAME, SYMBOL) as AlphaPING

    // set up user 1
    userIsMemberBefore = await alphaPING.isMember(await nonMember.getAddress())
    let tx = await alphaPING.connect(user).mint()
    await tx.wait()

    // owner can create channel
    tx = await alphaPING.connect(deployer).createChannel(
      ARBITRUM_TOKEN_CONTRACT_ADDRESS,
      "ERC20"
    )
    await tx.wait()

    // user can create channel
    tx = await alphaPING.connect(user).createChannel(
      GBC_TOKEN_CONTRACT_ADDRESS,
      "ERC721"
    )
    await tx.wait()
  })

  describe("Deployment", function() {

    it("Sets the name", async () => {
      let name = await alphaPING.name()
      expect(name).to.equal(NAME)
    })
    it("Sets the symbol", async () => {
      let symbol = await alphaPING.symbol()
      expect(symbol).to.equal(SYMBOL)
    })
    it("Sets the owner", async () => {
      let owner = await alphaPING.owner()
      expect(owner).to.equal(await deployer.getAddress())
    })
  })

  describe("Adding Members", function () {
    it("Sets the owner as member", async () => {
      let ownerIsMember = await alphaPING.isMember(await deployer.getAddress())
      expect(ownerIsMember).to.equal(true)
    })
    it("User is not a member before signing up", async () => {
      expect(userIsMemberBefore).to.equal(false)
    })
    it("User is member after minting", async () => {
      let userIsMember = await alphaPING.isMember(await user.getAddress())
      expect(userIsMember).to.equal(true)
    })
    it("Increases member nft total supply", async () => {
      let result = await alphaPING.totalSupply()
      expect(result).to.be.equal(2)
    })
  })

  describe("Creating and Getting Channels", function() {

    it("Returns total channels", async () => {
      let totalChannels = await alphaPING.totalChannels()
      expect(totalChannels).to.equal(2)
    })
    it("Returns channel attributes for ERC20 type tokens", async () => {
      let arbitrumToken = await alphaPING.getChannel(1)
      expect(arbitrumToken.id).to.equal(1)
      expect(arbitrumToken.name).to.equal(ARBITRUM_TOKEN_NAME)
      expect(arbitrumToken.tokenAdress).to.equal(ARBITRUM_TOKEN_CONTRACT_ADDRESS)
      expect(arbitrumToken.tokenType).to.equal(ARBITRUM_TOKEN_TYPE)
    })
    it("Returns channel attributes for ERC721 type tokens", async () => {
      let gbcToken = await alphaPING.getChannel(2)
      expect(gbcToken.id).to.equal(2)
      expect(gbcToken.name).to.equal(GBC_TOKEN_NAME)
      expect(gbcToken.tokenAdress).to.equal(GBC_TOKEN_CONTRACT_ADDRESS)
      expect(gbcToken.tokenType).to.equal(GBC_TOKEN_TYPE)
    })
  })

  describe("Joining Channels", function() {
    const ID = 1;
    let resultBefore: boolean
    beforeEach(async() => {
      resultBefore = await alphaPING.hasJoinedChannel(ID, await user.getAddress())
      const tx = await alphaPING.connect(user).joinChannel(ID)
      await tx.wait()
    })

    it("User not joined before", async () => {
      expect(resultBefore).to.equal(false)
    })
    it("Joins the user", async () => {
      let result = await alphaPING.hasJoinedChannel(ID, await user.getAddress())
      expect(result).to.equal(true)
    })
  })

  describe("Leaving Channels", function() {
    const ID = 1;
    let resultBefore: boolean
    beforeEach(async() => {
      let tx = await alphaPING.connect(user).joinChannel(ID)
      await tx.wait()
      resultBefore = await alphaPING.hasJoinedChannel(ID, await user.getAddress())
      tx = await alphaPING.connect(user).leaveChannel(ID)
      await tx.wait()
    })

    it("User has joined before", async () => {
      expect(resultBefore).to.equal(true)
    })
    it("Allows the user to leave the channel", async () => {
      let result = await alphaPING.hasJoinedChannel(ID, await user.getAddress())
      expect(result).to.equal(false)
    })
  })

  describe("Transfer Owners", function() {
    it("Allows owner to transfer ownership", async () => {
      let tx = await alphaPING.connect(deployer).transferOwner(user)
      await tx.wait()
      let newOwner = await alphaPING.owner()
      expect(newOwner).to.equal(user)
    })
  })

  describe("Transfer Mods", function() {
    const ID = 1
    it("Allows owner to transfer moderator role", async () => {
      let tx = await alphaPING.connect(deployer).transferMod(user, ID)
      await tx.wait()
      let newMod = await alphaPING.mods(ID)
      expect(newMod).to.equal(user)
    })
  })

  describe("Channel Bans", function() {
    const ID = 1
    let isBannedBefore: boolean
    this.beforeEach(async () => {
      isBannedBefore = await alphaPING.channelBans(ID, user)
      let tx = await alphaPING.connect(deployer).channelBan(user, ID)
      await tx.wait()
    })

    it("User not banned at first", async () => {
      expect(isBannedBefore).to.equal(false)
    })
    it("Allows mod to ban user", async () => {
      let isBanned = await alphaPING.channelBans(ID, user)
      expect(isBanned).to.equal(true)
    })
    it("Allows mod to unban user", async () => {
      let tx = await alphaPING.connect(deployer).channelUnban(user, ID)
      await tx.wait()
      let isBanned = await alphaPING.channelBans(ID, user)
      expect(isBanned).to.equal(false)
    })
  })

  describe("Blacklist User", function() {
    const ID = 1
    let isBlackListedBefore: boolean
    this.beforeEach(async () => {
      isBlackListedBefore = await alphaPING.isBlackListed(user)
      let tx = await alphaPING.connect(deployer).blacklistUser(user)
      await tx.wait()
    })

    it("User not blacklisted at first", async () => {
      expect(isBlackListedBefore).to.equal(false)
    })
    it("Allows owner to blacklist user", async () => {
      let isBlacklisted = await alphaPING.isBlackListed(user)
      expect(isBlacklisted).to.equal(true)
    })
    it("Allows owner to unblacklist user", async () => {
      let tx = await alphaPING.connect(deployer).unBlacklistUser(user)
      await tx.wait()
      let isBlackListed = await alphaPING.isBlackListed(user)
      expect(isBlackListed).to.equal(false)
    })
  })

  describe("Mod Bans", function() {
    const ID = 1
    let isModBefore: AddressLike
    beforeEach(async () => {
      let tx = await alphaPING.transferMod(user, ID)
      isModBefore = await alphaPING.mods(ID)
      tx = await alphaPING.connect(deployer).banMod(user, ID)
      await tx.wait()
    })

    it("User is mod at first", async () => {
      expect(isModBefore).to.equal(user)
    })
    it("Mod role has been transferred to owner", async () => {
      let isMod: AddressLike = await alphaPING.mods(ID)
      expect(isMod).to.equal(deployer)
    })
    it("Former mod is blacklisted", async () => {
      let isBanned = await alphaPING.isBlackListed(user)
      expect(isBanned).to.equal(true)
    })
  })

  describe("Promotion Periods", function() {
    const ID = 1
    let isPromoPeriodBefore: boolean
    beforeEach(async () => {
      isPromoPeriodBefore = await alphaPING.promoPeriod()
      let tx = await alphaPING.connect(deployer).stopPromoPeriod()
      await tx.wait()
    })

    it("Promo period starts at deployment", async () => {
      expect(isPromoPeriodBefore).to.equal(true)
    })
    it("Can turn off promo period", async () => {
      let isPromoPeriod: boolean = await alphaPING.promoPeriod()
      expect(isPromoPeriod).to.equal(false)
    })
    it("Can turn promo period back on", async () => {
      let tx = await alphaPING.connect(deployer).startPromoPeriod()
      let isPromoPeriod: boolean = await alphaPING.promoPeriod()
      expect(isPromoPeriod).to.equal(true)
    })
  })

  // describe("Withdrawing", function() {
  //   const ID = 1;
  //   const AMOUNT = ethers.utils.parseUnits("10", "ether")
  //   let balanceBefore

  //   beforeEach(async() => {
  //     balanceBefore = await ethers.provider.getBalance(deployer.address)
  //     let tx = await dappcord.connect(user).mint(ID, { value: AMOUNT})
  //     await tx.wait()
  //     tx = await dappcord.connect(deployer).withdraw()
  //     await tx.wait()
  //   })

  //   it("Updates owner balance", async () => {
  //     let balanceAfter = await ethers.provider.getBalance(deployer.address)
  //     expect(balanceAfter).to.be.greaterThan(balanceBefore)
  //   })
  //   it("Updates contract balance", async () => {
  //     let result = await ethers.provider.getBalance(dappcord.address)
  //     expect(result).to.be.equal(0)
  //   })
  // })
})
