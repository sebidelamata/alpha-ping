import React, { useEffect, useState } from 'react';

// navbar
import Navbar from './components/Navbar/Navbar'
//channels
import Channels from './components/Channels/Channels'
// messages
import Messages from './components/Messages/Messages'
// join alpha ping modal
import JoinAlphaPING from './components/JoinAlphaPING'

import { useEtherProviderContext } from './contexts/ProviderContext';

const App:React.FC = () => {

  const { alphaPING } = useEtherProviderContext()

  // account stuff
  const [account, setAccount] = useState<string | null>(null)
  // selected channel's actions
  const [channelAction, setChannelAction] = useState<string>("chat")
  // is this user a member of the app
  const [isMember, setIsMember] = useState<boolean>(false)
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
          joinChannelLoading={joinChannelLoading}
          setJoinChannelLoading={setJoinChannelLoading}
          />
        <div className='app-body'>
          <Channels 
            account={account}
            channelAction={channelAction}
            setChannelAction={setChannelAction}
            joinChannelLoading={joinChannelLoading}
          />
          {
            channelAction === 'chat' ? (
              <Messages 
                account={account}
              />
            ) : (
              channelAction === 'analyze' ? (
                <div>
                  <h2>Analyze</h2>
                  <p>This is being built in beta and will allow users to use sentiment analysis from each feed</p>
                </div>
              ) : (
                <div>
                  <h2>Trade</h2>
                  <p>This is being built in beta and will allow users to swap assets in-app using 1Inch router</p>
                </div>
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
