'use client';

import React, { useEffect, useState } from 'react';

// messages
import Messages from './components/Messages/Messages'
//analyze
import Analyze from './components/Analyze/Analyze';
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

  useEffect(() => {
    const findIsMember = async () => {
      if(signer){
        const isMember = await alphaPING?.isMember(signer)
        if(isMember){
          setIsMember(isMember)
        }
      }
    }
    findIsMember()
  }, [signer, isConnected, alphaPING])

  const renderChannelAction = () => {
    switch(channelAction){
      case 'chat':
        return <Messages/>
      case 'analyze':
        return <Analyze/>
      case 'trade':
        return  <div>
                  <h2 className='trade-title'>Trade</h2>
                  <p className='trade-placeholder'>
                    This is being built in beta and will allow users to swap assets in-app using 1Inch router
                  </p>
                </div>
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
