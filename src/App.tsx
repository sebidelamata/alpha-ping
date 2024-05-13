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
// join alpha ping modal
import JoinAlphaPING from './components/JoinAlphaPING'


interface BlockChainConfig {
  [key: string]: {
    AlphaPING: {
      address: string;
    };
  };
}


const App:React.FC = () => {

  // account stuff
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  // the alpha ping contract object
  const [alphaPING, setAlphaPING] = useState<AlphaPING | null>(null)
  // list of all channels
  const [channels, setChannels] = useState<AlphaPING.ChannelStructOutput[]>([])
  // selected channel
  const [currentChannel, setCurrentChannel] = useState<AlphaPING.ChannelStructOutput | null>(null)
  // selected channel's actions
  const [channelAction, setChannelAction] = useState<string>("chat")
  // list of all messages
  const [messages, setMessages] = useState<Message[]>([])
  // is this user a member of the app
  const [isMember, setIsMember] = useState<boolean>(false)
  // token metadata fetched from coinmarketcap
  const[selectedChannelMetadata, setSelectedChannelMetadata] = useState<tokenMetadata | null>(null)

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

  const findIsMember = async () => {
    if(account){
      const isMember = await alphaPING?.isMember(account)
      if(isMember){
        setIsMember(isMember)
      }
    }
  }

  useEffect(() => {
    findIsMember()
  }, [account])

  return (
    <>
      <div className='app-container'>
        <Navbar 
          account={account} 
          setAccount={setAccount}
          />
        <div className='app-body'>
          <Channels 
            provider={provider} 
            account={account} 
            alphaPING={alphaPING} 
            channels={channels} 
            currentChannel={currentChannel} 
            setCurrentChannel={setCurrentChannel}
            channelAction={channelAction}
            setChannelAction={setChannelAction}
          />
          {
            channelAction === 'chat' ? (
              <Messages 
                account={account} 
                messages={messages} 
                currentChannel={currentChannel}
              />
            ) : (
              channelAction === 'analyze' ? (
                <p>Analyze</p>
              ) : (
                <p>Trade</p>
              )
            )

          }
        </div>
      </div>
      {
        isMember === false &&
        <JoinAlphaPING
          alphaPING={alphaPING}
          provider={provider}
          setIsMember={setIsMember}
          account={account}
        />
      }
    </>
  )
}

export default App
