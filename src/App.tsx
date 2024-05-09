import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { io } from "socket.io-client"

// ABIs
import AlphaPING from '../artifacts/contracts/AlphaPING.sol/AlphaPING.json'
// Config
import config from './blockChainConfigs.json';
// Socket
const socket = io('ws://localhost:3030');

// navbar
import Navbar from './components/Navbar'
// messages
import Messages from './components/Messages'

const App:React.FC = () => {

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [account, setAccount] = useState<string | null>(null)

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

  useEffect(() => {
    loadBlockchainData()

    // --> https://socket.io/how-to/use-with-react-hooks

    socket.on("connect", () => {
      socket.emit('get messages')
    })

    socket.on('new message', (messages) => {
      setMessages(messages)
    })

    socket.on('get messages', (messages) => {
      setMessages(messages)
    })

    return () => {
      socket.off('connect')
      socket.off('new message')
      socket.off('get messages')
    }
  }, [])

  return (
    <div className='app-container'>
      <Navbar account={account} setAccount={setAccount}/>
      <div className='logo-container'>
        <img src="/Apes.svg" alt="AlphaPING Logo" />
      </div>
      <h1>AlphaPING</h1>
      <Messages account={account} messages={messages} currentChannel={currentChannel}/>
    </div>
  )
}

export default App
