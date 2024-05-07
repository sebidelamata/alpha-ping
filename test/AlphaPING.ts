const { expect } = require("chai")
const { ethers } = require("hardhat")
import {
  Signer,
  ContractFactory
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

  let AlphaPING
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

  describe("Creating Channels", function() {

    it("Returns total channels", async () => {
      let totalChannels = await alphaPING.totalChannels()
      expect(totalChannels).to.equal(2)
    })
    it("Returns channel attributes", async () => {
      let arbitrumToken = await alphaPING.getChannel(1)
      expect(arbitrumToken.id).to.equal(1)
      expect(arbitrumToken.name).to.equal(ARBITRUM_TOKEN_NAME)
      expect(arbitrumToken.tokenAdress).to.equal(ARBITRUM_TOKEN_CONTRACT_ADDRESS)
      expect(arbitrumToken.tokenType).to.equal(ARBITRUM_TOKEN_TYPE)
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
