import React, { useEffect, useState } from 'react';

// navbar
import Navbar from './components/Navbar/Navbar'
//channels
import Channels from './components/Channels/Channels'
// messages
import Messages from './components/Messages/Messages'
// profile
import Profile from './components/Profile/Profile';
// join alpha ping modal
import JoinAlphaPING from './components/JoinAlphaPING'
import { useAppKitAccount } from "@reown/appkit/react";

import { useEtherProviderContext } from './contexts/ProviderContext';

const App:React.FC = () => {

  const { alphaPING, signer } = useEtherProviderContext()
  const { isConnected } = useAppKitAccount()

  // selected channel's actions
  const [channelAction, setChannelAction] = useState<string>("chat")
  // is this user a member of the app
  const [isMember, setIsMember] = useState<boolean>(false)
  // elevate joinchannel loading
  const [joinChannelLoading, setJoinChannelLoading] = useState<boolean>(false)

  const findIsMember = async () => {
    if(signer){
      const isMember = await alphaPING?.isMember(signer)
      if(isMember){
        setIsMember(isMember)
      }
    }
  }

  useEffect(() => {
    findIsMember()
  }, [signer])

  const renderChannelAction = () => {
    switch(channelAction){
      case 'chat':
        return <Messages/>
      case 'analyze':
        return <div>
                <h2>Analyze</h2>
                <p>This is being built in beta and will allow users to use sentiment analysis from each feed</p>
              </div>
      case 'trade':
        return  <div>
                  <h2>Trade</h2>
                  <p>This is being built in beta and will allow users to swap assets in-app using 1Inch router</p>
                </div>
      case 'profile':
        return <Profile/>
    }
  }

  return (
    <>
      <div className='app-container'>
        <Navbar
          joinChannelLoading={joinChannelLoading}
          setJoinChannelLoading={setJoinChannelLoading}
          />
        <div className='app-body'>
          <Channels
            channelAction={channelAction}
            setChannelAction={setChannelAction}
            joinChannelLoading={joinChannelLoading}
          />
          {renderChannelAction()}
        </div>
      </div>
      {
        (
          isMember === false ||
          isConnected === false
        ) &&
        <JoinAlphaPING
          setIsMember={setIsMember}
        />
      }
    </>
  )
}

export default App