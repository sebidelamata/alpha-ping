'use client';

import React from 'react';

// messages
import Messages from './components/Messages'
//analyze
import Analyze from './components/Analyze';
// trade
import Trade from './components/Trade/Trade';
import Loading from './components/Loading';

// join alpha ping modal
import JoinAlphaPING from './components/JoinAlphaPING'
import { useAppKitAccount } from "@reown/appkit/react";
import { useUserProviderContext } from '../../contexts/UserContext';
import { useChannelProviderContext } from '../../contexts/ChannelContext';
import BlacklistedScreen from './components/BlacklistedScreen';
import useIsMember from 'src/hooks/useIsMember';

const App:React.FC = () => {

  const { blacklisted } = useUserProviderContext()
  const { isConnected } = useAppKitAccount()
  const { channelAction } = useChannelProviderContext()
  const { 
    isMember, 
    setIsMember, 
    loading 
  } = useIsMember()

  const renderChannelAction = () => {
    switch(channelAction){
      case 'chat':
        return <Messages/>
      case 'analyze':
        return <Analyze/>
      case 'trade':
        return  <Trade/>
    }
  }

  if(
    loading === true &&
    isConnected === true
  ){
    return (
      <Loading text='Loading User Attributes...'/>
    )
  }

  return (
    <>
      {
        (
          isMember === true &&
          isConnected === true
        ) &&
        <div className='flex flex-row w-full h-screen pt-24 overflow-hidden'>
          <div className='flex-1 h-full'>
            {renderChannelAction()}
          </div>
        </div>
      }
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
