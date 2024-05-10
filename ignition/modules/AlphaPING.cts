import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NAME = "AlphaPING";
const SYMBOL = "APING";

const alphaPINGModule = buildModule("AlphaPING", (m) => {

  const alphaPING = m.contract("AlphaPING", [NAME, SYMBOL]);

  const tokenAdresses = [
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', //weth
    '0x912CE59144191C1204E64559FE8253a0e49E6548', //arb token
    '0x13A7DeDb7169a17bE92B0E3C7C2315B46f4772B3', //boop token
  ]

  for(let i=0; i<tokenAdresses.length; i++){
    m.call(
      alphaPING, 
      "createChannel", 
      [tokenAdresses[i], "ERC20"], 
      { id: `createChannel_${i}` }
    )
  }



  return { alphaPING };
});

export default alphaPINGModule;
