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
      accounts: [process.env.NEXT_PUBLIC_DEPLOYER_PRIVATE_KEY || ""],
    },
  },
  etherscan: {
    apiKey: {
      arbitrumSepolia: process.env.NEXT_PUBLIC_ARBISCANAPI_KEY || "",
      arbitrum: process.env.NEXT_PUBLIC_ARBISCANAPI_KEY || "",
    },
    customChains: [
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
            apiURL: "https://api-sepolia.arbiscan.io/api",
            browserURL: "https://sepolia.arbiscan.io/",
        },
      },
      {
        network: "arbitrum",
        chainId: 42161,
        urls: {
            apiURL: "https://api.arbiscan.io/api",
            browserURL: "https://arbiscan.io/",
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
