import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client"

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

import { useEtherProviderContext } from './contexts/ProviderContext';

const App:React.FC = () => {

  const { alphaPING } = useEtherProviderContext()

  // account stuff
  const [account, setAccount] = useState<string | null>(null)
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

  useEffect(() => {
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

    socket.on('message update', (updatedMessage) => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === updatedMessage.id ? updatedMessage : msg
        )
      )
    })

    return () => {
      socket.off('connect')
      socket.off('new message')
      socket.off('get messages')
      socket.off('message update')
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
            account={account} 
            currentChannel={currentChannel} 
            setCurrentChannel={setCurrentChannel}
            channelAction={channelAction}
            setChannelAction={setChannelAction}
            setSelectedChannelMetadata={setSelectedChannelMetadata}
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
          setIsMember={setIsMember}
          account={account}
        />
      }
    </>
  )
}

export default App
