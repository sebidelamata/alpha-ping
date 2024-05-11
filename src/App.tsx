import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { io } from "socket.io-client"

// ABIs
import AlphaPINGABI from '../artifacts/contracts/AlphaPING.sol/AlphaPING.json'
// Config
import config from './blockChainConfigs.json';
// Socket
const socket = io('ws://localhost:3030');
// types
import { AlphaPING } from '../typechain-types/contracts/AlphaPING.sol/AlphaPING';

// navbar
import Navbar from './components/Navbar'
//channels
import Channels from './components/Channels'
// messages
import Messages from './components/Messages'


interface BlockChainConfig {
  [key: string]: {
    AlphaPING: {
      address: string;
    };
  };
}


const App:React.FC = () => {

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [account, setAccount] = useState<string | null>(null)

  const [alphaPING, setAlphaPING] = useState<AlphaPING | null>(null)
  const [channels, setChannels] = useState<AlphaPING.ChannelStructOutput[]>([])

  const [currentChannel, setCurrentChannel] = useState<AlphaPING.ChannelStructOutput | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const loadBlockchainData = async () => {
    try{
      
      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)
      let network = await provider.send('eth_chainId',[]);
      network = parseInt(network, 16).toString()
      const alphaPING = new ethers.Contract(
        (config as BlockChainConfig)[network].AlphaPING.address,
        AlphaPINGABI.abi,
        provider
      ) as unknown as AlphaPING
      setAlphaPING(alphaPING)
      const totalChannels:BigInt = await alphaPING.totalChannels()
      const channels = []

      for (var i = 1; i <= Number(totalChannels); i++) {
        const channel = await alphaPING.getChannel(i)
        channels.push(channel)
      }

      setChannels(channels)

      window.ethereum.on('accountsChanged', async () => {
        window.location.reload()
      })
    }catch(error){
      console.error("Error loading blockchain data:", error);
    }
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
      <div className='app-body'>
        <Channels 
          provider={provider} 
          account={account} 
          alphaPING={alphaPING} 
          channels={channels} 
          currentChannel={currentChannel} 
          setCurrentChannel={setCurrentChannel}
        />
        <Messages 
          account={account} 
          messages={messages} 
          currentChannel={currentChannel}
        />
      </div>
    </div>
  )
}

export default App
