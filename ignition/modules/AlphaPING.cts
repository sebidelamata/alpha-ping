import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NAME = "AlphaPING";
const SYMBOL = "APING";

const alphaPINGModule = buildModule("AlphaPING", (m) => {

  const alphaPING = m.contract("AlphaPING", [NAME, SYMBOL]);

  return { alphaPING };
});

export default alphaPINGModule;
