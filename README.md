# AlphaPING

![Logo](/public/Apes.svg)

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
Open a new terminal and run `npx hardhat ignition deploy ignition/modules/AlphaPING.cts --network arbitrumSepolia --verify`. You will need a private key to deploy (do not us, store, or save, any personal wallet key here).


## Deploying to Arbitrum One and Verifying Contract
Open a new terminal and run `npx hardhat ignition deploy ignition/modules/AlphaPING.cts --network arbitrum --verify`. You will need a private key to deploy (do not us, store, or save, any personal wallet key here).
