import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { io } from "socket.io-client"

// ABIs
import AlphaPING from '../artifacts/contracts/AlphaPING.sol/AlphaPING.json'
// Config
import config from './blockChainConfigs.json';
// Socket
const socket = io('ws://localhost:3030');

const App: React.FC = () => {

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [account, setAccount] = useState<any | null>(null)

  const [alphaPING, setAlphaPING] = useState<ethers.Contract | null>(null)
  const [channels, setChannels] = useState<Channel[]>([])

  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const loadBlockchainData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    const alphaPING = new ethers.Contract(
      config[network.chainId.toString() as keyof typeof config].AlphaPING.address, 
      AlphaPING.abi, 
      provider
    )
    setAlphaPING(alphaPING)

    const totalChannels = await alphaPING.totalChannels()
    const channels = []

    for (var i = 1; i <= totalChannels; i++) {
      const channel = await alphaPING.getChannel(i)
      channels.push(channel)
    }

    setChannels(channels)

    window.ethereum.on('accountsChanged', async () => {
      window.location.reload()
    })
  }

  return (
    <div className='app-container'>
      <div className='logo-container'>
        <img src="/Apes.svg" alt="AlphaPING Logo" />
      </div>
      <h1>AlphaPING {account}</h1>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
