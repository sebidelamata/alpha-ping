import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: process.env.INFURA_ARBITRUM_ENDPOINT || "",
        blockNumber: 208629482,
        enabled: true,
      },
    },
  },
};

export default config;
