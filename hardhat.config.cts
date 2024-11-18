import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.NEXT_PUBLIC_INFURA_ARBITRUM_ENDPOINT || "",
        blockNumber: 208629482,
        enabled: true,
      },
    },
    arbitrum: {
      url: process.env.ARBITRUM_MAINNET_RPC || "",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY || ""],
    },
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOL_RPC || "",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY || ""],
    },
  },
};

export default config;
