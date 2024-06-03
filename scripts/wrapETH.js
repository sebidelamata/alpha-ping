import { ethers } from 'ethers'

const provider = new ethers.JsonRpcProvider('http://localhost:8545');

// Your wallet private key (ensure you keep this safe and never share it)
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const wallet = new ethers.Wallet(privateKey, provider);

  const WETH_ADDRESS = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';

  // WETH contract ABI (minimal ABI to interact with the deposit function)
  const WETH_ABI = [
      "function deposit() public payable",
      "function withdraw(uint256 wad) public",
      "function balanceOf(address account) external view returns (uint256)"
  ];

  const wethContract = new ethers.Contract(WETH_ADDRESS, WETH_ABI, wallet);

const wrapEther = async (amountInEth) => {
    const amountInWei = ethers.parseEther(amountInEth.toString());

    // Deposit ETH to get WETH
    const tx = await wethContract.deposit({ value: amountInWei });

    // Wait for the transaction to be mined
    await tx.wait();

    console.log(`Wrapped ${amountInEth} ETH to WETH. Transaction Hash: ${tx.hash}`);
  }

  // Wrap 0.1 ETH as an example
  wrapEther(0.1)
      .then(() => console.log('Wrapping complete'))
      .catch(error => console.error('Error wrapping ETH:', error));

