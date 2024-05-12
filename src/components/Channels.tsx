import React from "react";
import {ethers} from 'ethers';
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING';

interface ChannelsProps {
  provider: ethers.BrowserProvider | null;
  account: string | null;
  alphaPING: AlphaPING | null;
  channels: AlphaPING.ChannelStructOutput[];
  currentChannel: AlphaPING.ChannelStructOutput | null;
  setCurrentChannel: React.Dispatch<React.SetStateAction<AlphaPING.ChannelStructOutput | null>>;
}

const Channels:React.FC<ChannelsProps> = ({ 
  provider, 
  account, 
  alphaPING, 
  channels, 
  currentChannel, 
  setCurrentChannel 
}) => {
    const channelHandler = async (channel:AlphaPING.ChannelStructOutput) => {
      // Check if user has joined
      // If they haven't allow them to mint.
      const hasJoined = await alphaPING?.hasJoinedChannel(
        BigInt(channel.id), 
        account || ethers.ZeroAddress
      )
  
      if (hasJoined) {
        setCurrentChannel(channel)
      } else {
        const signer:any = await provider?.getSigner()
        const transaction = await alphaPING?.connect(signer).joinChannel(BigInt(channel.id))
        await transaction?.wait()
        setCurrentChannel(channel)
      }
    }
  
    return (
      <div className="channels">
        <div className="channels-text">
          <h2 className="channels-title">
            Channels
          </h2>
          <ul className="channels-list">
            {
              channels.map((channel, index) => (
                <li
                  onClick={() => channelHandler(channel)} key={index}
                  className={
                    currentChannel && 
                    currentChannel.id.toString() === channel.id.toString() ? 
                    "channel channel-active" : 
                    "channel"
                  }
                >
                  {channel.name}
                </li>
              ))
            }
          </ul>
        </div>
  
        <div className="channel_actions">
          <h2>Channel Actions</h2>
          <ul className="channel-actions-list">
            <li className="channel-action-items">Chat</li>
            <li className="channel-action-items">Analyze</li>
            <li className="channel-action-items">Trade</li>
          </ul>
        </div>
      </div>
    );
  }
  
  export default Channels;