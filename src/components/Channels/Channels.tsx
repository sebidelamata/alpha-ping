import React, { 
  useState, 
  useEffect 
} from "react";
import { AlphaPING } from '../../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import Channel from "./Channel";
import AddChannel from "./AddChannel";
import { useEtherProviderContext } from '../../contexts/ProviderContext';
import { useChannelProviderContext } from "../../contexts/ChannelContext";
import ChannelActions from "./ChannelActions";
import EditProfile from "../EditProfile";
import { ethers } from 'ethers'

interface ChannelsProps {
  account: string | null;
  channelAction: string;
  setChannelAction: React.Dispatch<React.SetStateAction<string>>;
  joinChannelLoading: boolean;
}

const Channels:React.FC<ChannelsProps> = ({ 
  account, 
  channelAction,
  setChannelAction,
  joinChannelLoading
}) => {

  const { alphaPING, channels, setChannels, hasJoined, signer, setHasJoined } = useEtherProviderContext()
  const { currentChannel } = useChannelProviderContext()

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
    console.log(userChannels)
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
  }, [currentChannel, joinChannelLoading])
  
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
                  account={account}
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