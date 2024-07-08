import React, { 
  useState, 
  useEffect 
} from "react";
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import Channel from "./Channel";
import AddChannel from "./AddChannel";
import { useEtherProviderContext } from '../contexts/ProviderContext';
import ChannelActions from "./ChannelActions";
import EditProfile from "./EditProfile";
import { ethers } from 'ethers'

interface ChannelsProps {
  account: string | null;
  currentChannel: AlphaPING.ChannelStructOutput | null;
  setCurrentChannel: React.Dispatch<React.SetStateAction<AlphaPING.ChannelStructOutput | null>>;
  channelAction: string;
  setChannelAction: React.Dispatch<React.SetStateAction<string>>;
  setSelectedChannelMetadata: React.Dispatch<React.SetStateAction<tokenMetadata | null>>;
  joinChannelLoading: boolean;
}

const Channels:React.FC<ChannelsProps> = ({ 
  account, 
  currentChannel, 
  setCurrentChannel,
  channelAction,
  setChannelAction,
  setSelectedChannelMetadata,
  joinChannelLoading
}) => {

  const { alphaPING, channels, setChannels, hasJoined, signer, setHasJoined } = useEtherProviderContext()

  const [userChannels, setUserChannels] = useState<AlphaPING.ChannelStructOutput[]>([])
  const loadUserChannels = ():void => {
    const userChannels: AlphaPING.ChannelStructOutput[] = []
    hasJoined.map((joined, index) => {
      if(joined === true){
        userChannels.push(channels[index])
      }
    })
    console.log(userChannels)
    setUserChannels(userChannels)
  }
  useEffect(() => {
    loadUserChannels()
  }, [channels, joinChannelLoading, hasJoined])

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
  }, [addChannelLoading, joinChannelLoading, hasJoined])
  
    return (
      <div className="channels">
        <div className="channels-menu">
          <h2 className="channels-title">
            Channels
          </h2>
          <ul className="channels-list">
            {
              userChannels.map((channel, index) => (
                <Channel
                  index={index}
                  currentChannel={currentChannel}
                  account={account}
                  setCurrentChannel={setCurrentChannel}
                  setSelectedChannelMetadata={setSelectedChannelMetadata}
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
        <EditProfile/>
      </div>
    );
  }
  
  export default Channels;