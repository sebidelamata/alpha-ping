'use client';

import React, { useEffect, useState } from 'react';

// messages
import Messages from './components/Messages/Messages'
//analyze
import Analyze from './components/Analyze/Analyze';
// trade
import Trade from './components/Trade/Trade';

// join alpha ping modal
import JoinAlphaPING from './components/JoinAlphaPING'
import { useAppKitAccount } from "@reown/appkit/react";
import { useUserProviderContext } from '../../contexts/UserContext';
import { useEtherProviderContext } from '../../contexts/ProviderContext';
import { useChannelProviderContext } from '../../contexts/ChannelContext';
import BlacklistedScreen from './components/BlacklistedScreen';

const App:React.FC = () => {

  const { alphaPING, signer, isInitialized } = useEtherProviderContext()
  const { blacklisted } = useUserProviderContext()
  const { isConnected } = useAppKitAccount()
  const { channelAction } = useChannelProviderContext()

  // is this user a member of the app
  const [isMember, setIsMember] = useState<boolean>(false)
  console.log('Current origin:', window.location.origin);

  useEffect(() => {
    const findIsMember = async () => {
       if (!signer || !alphaPING || !isInitialized) {
        console.log("Not ready to check membership:", { signer: !!signer, alphaPING: !!alphaPING, isInitialized });
        return;
      }
      const isMember = await alphaPING?.isMember(signer)
      if(isMember){
        setIsMember(isMember)
      }
    }
    findIsMember()
  }, [signer, isConnected, alphaPING, isInitialized])

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

  return (
    <>
      {
        (
          isMember === true &&
          isConnected === true
        ) &&
        <div className='flex flex-row w-[100%] gap-1 relative top-24'>
          {renderChannelAction()}
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
