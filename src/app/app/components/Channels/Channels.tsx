'use client';

import React, { 
  useState, 
  useEffect 
} from "react";
import { AlphaPING } from '../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import Channel from "./Channel";
import AddChannel from "./AddChannel";
import { useEtherProviderContext } from '../../../../contexts/ProviderContext';
import { useChannelProviderContext } from "../../../../contexts/ChannelContext";
import ChannelActions from "./ChannelActions";
import { ethers } from 'ethers'

const Channels:React.FC = () => {

  const { 
    alphaPING, 
    channels, 
    setChannels, 
    hasJoined, 
    signer, 
    setHasJoined 
  } = useEtherProviderContext()
  const { 
    currentChannel, 
    joinChannelLoading, 
    channelAction, 
    setChannelAction  
  } = useChannelProviderContext()

  const [userChannels, setUserChannels] = useState<AlphaPING.ChannelStructOutput[]>([])
  const loadUserChannels = ():void => {
    const userChannels: AlphaPING.ChannelStructOutput[] = []
    hasJoined.map((joined, index) => {
      if(joined === true){
        userChannels.push(channels[index])
      }
    })
    setUserChannels(userChannels)
  }
  useEffect(() => {
    loadUserChannels()
  }, [channels, joinChannelLoading, hasJoined, signer])

  // weve elevated this state from add channels to make the channels list rerender on add channel
  const [addChannelLoading, setAddChannelLoadingLoading] = useState<boolean>(false)

  // reload our channels if we get a new one
  const reloadChannels = async () => {
    const totalChannels:bigint | undefined = await alphaPING?.totalChannels()
    const channels = []

    for (let i = 1; i <= Number(totalChannels); i++) {
      const channel = await alphaPING?.getChannel(i)
      if(channel){
        channels.push(channel)
      }
    }
    setChannels(channels)

    const hasJoinedChannel = []

      if(alphaPING !== null && signer !== null){
        for (let i = 1; i <= Number(totalChannels); i++) {
          const hasJoined = await alphaPING.hasJoinedChannel(
            (i as ethers.BigNumberish), 
            await signer.getAddress()
          )
          hasJoinedChannel.push(hasJoined)
        }
  
        setHasJoined(hasJoinedChannel as boolean[])
      }
  }
  useEffect(() => {
    reloadChannels()
  }, [currentChannel, joinChannelLoading, signer])

  const [showChannels, setShowChannels] = useState<boolean>(true)
  const toggleChannels = (): void => {
    setShowChannels(!showChannels)
  }
  
    return (
      <div className="channels">
        <div className="channels-toggle-container">
          {
            showChannels === true ?
            <button 
              className="channels-toggle-button"
              onClick={() => toggleChannels()}
            >
              <img 
                src="/collapseIcon.svg" 
                alt="Click to Collapse" 
                className="channels-toggle-button-image"
              />
            </button> :
            <button 
              className="channels-toggle-button"
              onClick={() => toggleChannels()}
            >
              <img 
                src="/moreIcon.svg" 
                alt="Click to Expand" 
                className="channels-toggle-button-image-small"
              />
            </button>

          }
        </div>
        {
          showChannels === false ?
          <div></div> :
          <div>
            <div className="channels-menu">
            <h2 className="channels-title">
              Channels
            </h2>
            <ul className="channels-list">
              {
                userChannels.map((channel, index) => (
                  <Channel
                    channel={channel}
                    key={index}
                  />
                ))
              }
            </ul>
          </div>
          <AddChannel
            addChannelLoading={addChannelLoading}
            setAddChannelLoadingLoading={setAddChannelLoadingLoading}
          />
          <ChannelActions channelAction={channelAction} setChannelAction={setChannelAction}/>
        </div>
        }
      </div>
    );
  }
  
  export default Channels;