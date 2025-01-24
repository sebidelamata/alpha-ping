'use client';

import React, { useEffect, useState } from 'react';

// messages
import Messages from './components/Messages/Messages'
// profile
import Profile from './components/Profile/Profile';
// join alpha ping modal
import JoinAlphaPING from './components/JoinAlphaPING'
import { useAppKitAccount } from "@reown/appkit/react";
import { useUserProviderContext } from '../../contexts/UserContext';
import { useEtherProviderContext } from '../../contexts/ProviderContext';
import { useChannelProviderContext } from '../../contexts/ChannelContext';
import BlacklistedScreen from './components/BlacklistedScreen';

const App:React.FC = () => {

  const { alphaPING, signer } = useEtherProviderContext()
  const { blacklisted } = useUserProviderContext()
  const { isConnected } = useAppKitAccount()
  const { channelAction } = useChannelProviderContext()

  // is this user a member of the app
  const [isMember, setIsMember] = useState<boolean>(false)

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
  }, [signer, isConnected])

  const renderChannelAction = () => {
    switch(channelAction){
      case 'Chat':
        return <Messages/>
      case 'Analyze':
        return <div>
                <h2 className='analyze-title'>Analyze</h2>
                <p className='analyze-placeholder'>
                  This is being built in beta and will allow users to use sentiment analysis from each feed
                </p>
              </div>
      case 'Trade':
        return  <div>
                  <h2 className='trade-title'>Trade</h2>
                  <p className='trade-placeholder'>
                    This is being built in beta and will allow users to swap assets in-app using 1Inch router
                  </p>
                </div>
      case 'Profile':
        return <Profile/>
    }
  }

  return (
    <>
      <div className='app-container'>
        <div className='app-body'>
          {renderChannelAction()}
        </div>
      </div>
      {
        blacklisted === true &&
        <BlacklistedScreen/>
      }
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
