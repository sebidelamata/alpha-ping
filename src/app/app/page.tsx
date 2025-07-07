'use client';

import React, { useEffect, useState } from 'react';

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
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const findIsMember = async () => {
       if (!signer || !alphaPING || !isInitialized) {
        console.log("Not ready to check membership:", { signer: !!signer, alphaPING: !!alphaPING, isInitialized });
        return;
      }
      try{
        setLoading(true)
        const isMember = await alphaPING?.isMember(signer)
          if(isMember){
          setIsMember(isMember)
        }
      } catch (error) {
        console.error("Error checking membership:", error);
      } finally{
        setLoading(false)
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
