# AlphaPING

![Logo](/public/Apes.svg)

## Introduction  
AlphaPING is a decentralized social trading platform that combines real-time sentiment analysis, token-gated communities, and optimized DeFi trading. This project leverages Hardhat for smart contract development, React for the frontend, and Node.js for API and WebSocket integration.  

---

## Features  
- Real-time, token-specific sentiment analysis.  
- Integrated trading tools powered by 1Inch Router.  
- Token-gated memberships using ERC-20/ERC-721 standards.  
- Multichain support starting with Arbitrum.  

---

## Prerequisites  
- Node.js v14+  
- Hardhat v2.12+  
- Metamask or another Ethereum wallet for testing.  
- Arbiscan API key for contract verification.  

---

## License
This project is licensed under the MIT License.

---

## Contributing
We welcome contributions! To get started:

Fork the repository.
Create a new branch for your feature or fix.
Submit a pull request.

## Running AlphaPING in a Local Development Environment

#### 1. Installing Dependencies

Open a terminal and run `npm install`.

#### 2. Starting Local Arbitrum Fork

Run `npx hardhat node`.

#### 3. Testing Smart Contracts

Open a new terminal after starting local Hardhat node (step 2) and run `npx hardhat test`.

#### 4. Deploying Smart Contracts To Local Arbitrum Fork

Open a new terminal after starting local Hardhat node (step 2) and run `npx hardhat ignition deploy ignition/modules/AlphaPING.cts --network localhost`

#### 5. Starting Express Server with Websocket (socket.io) API

Open a new terminal after starting local Hardhat node (step 2) and deploying contracts (step 4), run `node server.mjs`.

#### 6. Starting Front-end Application (React)

Open a new terminal after starting local Hardhat node (step 2), deploying contracts (step 4), and starting the Express server, run `npm run dev`.


## Deploying to Arbitrum Testnet (Sepolia) and Verifying Contract
Open a new terminal and run `npx hardhat ignition deploy ignition/modules/AlphaPING.cts --network arbitrumSepolia --verify`. You will need an account private key to deploy (do not us, store, or save, any personal wallet key here) and an Arbiscan API key to verify your contract.


## Deploying to Arbitrum One and Verifying Contract
Open a new terminal and run `npx hardhat ignition deploy ignition/modules/AlphaPING.cts --network arbitrum --verify`. You will need an account private key to deploy (do not us, store, or save, any personal wallet key here) and an Arbiscan API key to verify your contract.

## Acknowledgments
Built with Hardhat, React, and 1Inch API.
Special thanks to the DeFi and Web3 communities for their inspiration.