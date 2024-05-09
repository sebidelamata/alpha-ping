# AlphaPING

![Logo](/public/Apes.svg)

## Running AlphaPING in a Local Development Environment

#### 1. Installing Dependencies

Open a terminal and run `npm install`.

#### 2. Starting Local Arbitrum Fork

Run `npx hardhat node`.

#### 3. Testing Smart Contracts

Open a new terminal after starting local Hardhat node (step 2) and run `npx hardhat test`.

#### 4. Deploying Smart Contracts

Open a new terminal after starting local Hardhat node (step 2) and run `npx hardhat ignition deploy ignition/modules/AlphaPING.ts --network localhost`

#### 5. Starting Express Server with Websocket (socket.io) API

Open a new terminal after starting local Hardhat node (step 2) and deploying contracts (step 4), run `node server.mjs`.

#### 6. Starting Front-end Application (React)

Open a new terminal after starting local Hardhat node (step 2), deploying contracts (step 4), and starting the Express server, run `npm run dev`.
