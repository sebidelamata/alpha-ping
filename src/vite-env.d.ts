/// <reference types="vite/client" />

interface Channel {
    id: number; // or uint256 if necessary
    tokenAddress: string; // Assuming the token address is represented as a string
    name: string;
    tokenType: string;
}

interface Window {
    ethereum?: any; // You can provide a more specific type if available
}

interface Message {
    channel: string;
    account: string;
    text: string;
  }
