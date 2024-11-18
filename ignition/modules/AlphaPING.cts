import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const alphaPINGModule = buildModule("AlphaPING", (m) => {
  const NAME = "AlphaPING";
  const SYMBOL = "APING";

  // Synchronously deploy the contract
  const alphaPING = m.contract("AlphaPING", [NAME, SYMBOL]);

  // Token addresses to initialize channels
  // const tokenAddresses = [
  //   '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // WETH
  //   '0x912CE59144191C1204E64559FE8253a0e49E6548', // ARB Token
  //   '0x13A7DeDb7169a17bE92B0E3C7C2315B46f4772B3', // BOOP Token
  // ];

  // for (let i = 0; i < tokenAddresses.length; i++) {
  //   m.call(alphaPING, "createChannel", [tokenAddresses[i], "ERC20"], { id: `createChannel_${i}` });
  // }

  return { alphaPING };
});

export default alphaPINGModule;
