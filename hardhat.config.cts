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
      url: process.env.NEXT_PUBLIC_INFURA_ARBITRUM_ENDPOINT || "",
      accounts: [process.env.NEXT_PUBLIC_DEPLOYER_PRIVATE_KEY || ""],
    },
    arbitrumSepolia: {
      url: process.env.NEXT_PUBLIC_INFURA_ARBIRTUM_SEPOLIA_ENDPOINT || "",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY || ""],
    },
  },
};

export default config;
