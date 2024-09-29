import React, { useEffect, useState } from 'react';
// types
import { AlphaPING } from '../typechain-types/contracts/AlphaPING.sol/AlphaPING';

// navbar
import Navbar from './components/Navbar/Navbar'
//channels
import Channels from './components/Channels/Channels'
// messages
import Messages from './components/Messages/Messages'
// join alpha ping modal
import JoinAlphaPING from './components/JoinAlphaPING'

import { useEtherProviderContext } from './contexts/ProviderContext';
import { useMessagesProviderContext } from './contexts/MessagesContext';

const App:React.FC = () => {

  const { alphaPING } = useEtherProviderContext()
  const { messages, setMessages } = useMessagesProviderContext()

  // account stuff
  const [account, setAccount] = useState<string | null>(null)
  // selected channel
  const [currentChannel, setCurrentChannel] = useState<AlphaPING.ChannelStructOutput | null>(null)
  // selected channel's actions
  const [channelAction, setChannelAction] = useState<string>("chat")
  // is this user a member of the app
  const [isMember, setIsMember] = useState<boolean>(false)
  // token metadata fetched from coinmarketcap
  const[selectedChannelMetadata, setSelectedChannelMetadata] = useState<tokenMetadata | null>(null)
  // elevate joinchannel loading
  const [joinChannelLoading, setJoinChannelLoading] = useState<boolean>(false)

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
          setCurrentChannel={setCurrentChannel}
          joinChannelLoading={joinChannelLoading}
          setJoinChannelLoading={setJoinChannelLoading}
          />
        <div className='app-body'>
          <Channels 
            account={account} 
            currentChannel={currentChannel} 
            setCurrentChannel={setCurrentChannel}
            channelAction={channelAction}
            setChannelAction={setChannelAction}
            setSelectedChannelMetadata={setSelectedChannelMetadata}
            joinChannelLoading={joinChannelLoading}
          />
          {
            channelAction === 'chat' ? (
              <Messages 
                account={account}
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
