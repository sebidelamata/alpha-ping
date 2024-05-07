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

  let AlphaPING
  let alphaPING: AlphaPING
  let deployer: Signer, user: Signer
  beforeEach( async () => {
    [deployer, user] = await ethers.getSigners()
    AlphaPING = await ethers.getContractFactory("AlphaPING")
    alphaPING = await AlphaPING.deploy(NAME, SYMBOL) as AlphaPING

    // create channel
    const tx = await alphaPING.connect(deployer).createChannel(
      "0x912CE59144191C1204E64559FE8253a0e49E6548"
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

  describe("Creating Channels", function() {

    it("Returns total channels", async () => {
      let totalChannels = await alphaPING.totalChannels()
      expect(totalChannels).to.equal(1)
    })
    it("Returns channel attributes", async () => {
      let channel = await alphaPING.getChannel(1)
      expect(channel.id).to.equal(1)
      expect(channel.name).to.equal("Arbitrum")
    })
  })

  // describe("Joining Channels", function() {
  //   const ID = 1;
  //   const AMOUNT = ethers.utils.parseUnits("1", "ether")
  //   let resultBefore
  //   beforeEach(async() => {
  //     resultBefore = await dappcord.hasJoined(ID, user.address)
  //     const tx = await dappcord.connect(user).mint(ID, { value: AMOUNT})
  //     await tx.wait()
  //   })

  //   it("User not joined before", async () => {
  //     expect(resultBefore).to.equal(false)
  //   })
  //   it("Joins the user", async () => {
  //     let result = await dappcord.hasJoined(ID, user.address)
  //     expect(result).to.equal(true)
  //   })
  //   it("Increases total supply", async () => {
  //     let result = await dappcord.totalSupply()
  //     expect(result).to.be.equal(ID)
  //   })
  //   it("Updates contract balance", async () => {
  //     let result = await ethers.provider.getBalance(dappcord.address)
  //     expect(result).to.be.equal(AMOUNT)
  //   })
  // })

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
