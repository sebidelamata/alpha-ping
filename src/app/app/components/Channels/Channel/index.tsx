'use client';

import React, {
    useState, 
} from "react"
import { AlphaPING } from '../../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import { ethers } from 'ethers'
import { useEtherProviderContext } from '../../../../../contexts/ProviderContext';
import { useChannelProviderContext } from "../../../../../contexts/ChannelContext";
import Loading from "../../Loading";
import LeaveChannel from "./LeaveChannel";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
import { SidebarMenuButton } from "@/components/components/ui/sidebar";

interface IChannel{
    channel: AlphaPING.ChannelStructOutput;
    tokenMetadata: tokenMetadata;
}

const Channel:React.FC<IChannel> = ({
    channel,
    tokenMetadata
}) => {

    const { 
        alphaPING, 
        signer 
    } = useEtherProviderContext()
    const { 
        currentChannel, 
        setCurrentChannel, 
        setSelectedChannelMetadata 
    } = useChannelProviderContext()

    const [joinChannelLoading, setJoinChannelLoading] = useState<boolean>(false)
    console.log("Channel render", channel.tokenAddress, tokenMetadata);
    
    // handles clicking on channel names from channels list
    const channelHandler = async (channel:AlphaPING.ChannelStructOutput) => {
      // Check if user has joined
      // If they haven't allow them to mint.
      const hasJoined = await alphaPING?.hasJoinedChannel(
        BigInt(channel.id), 
        await signer?.getAddress() || ethers.ZeroAddress
      )
  
      if (hasJoined === true) {
        setCurrentChannel(channel)
        setSelectedChannelMetadata(tokenMetadata)
        // document.title = `AlphaPING | ${channel.name}`;
      } else {
        setJoinChannelLoading(true)
        const transaction = await alphaPING?.connect(signer).joinChannel(BigInt(channel.id))
        await transaction?.wait()
        setCurrentChannel(channel)
        setSelectedChannelMetadata(tokenMetadata)
        // document.title = `AlphaPING | ${channel.name}`;
        setJoinChannelLoading(false)
      }
    }

    // pass hover info to leaveChannel component to make icon appear
    const [isHovered, setIsHovered] = useState(false);

    return(
        <SidebarMenuButton
            className={`flex items-center justify-between ${
                currentChannel && 
                currentChannel.id.toString() === channel.id.toString() && 
                "bg-accent" }`
            }
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => channelHandler(channel)}
        >
            <div className="flex items-center justify-start gap-4">
                <Avatar className="size-4">
                    <AvatarImage 
                        src={
                                isHovered === true ?
                                    tokenMetadata.logo !== '' ? 
                                    tokenMetadata.logo : 
                                    (
                                        channel.tokenType === 'ERC20' ?
                                        '/erc20IconAlt.svg' :
                                        '/blank_nft.svg'
                                    )
                                :
                                    tokenMetadata.logo !== '' ? 
                                    tokenMetadata.logo : 
                                    (
                                        channel.tokenType === 'ERC20' ?
                                        '/erc20Icon.svg' :
                                        '/blank_nft.svg'
                                    )
                        } 
                        alt="Token Logo"
                        loading="lazy"
                    />
                    <AvatarFallback>
                        {channel.name.slice(0,2)}
                    </AvatarFallback>
                </Avatar>
                <p>
                    {channel.name}
                </p>
            </div>
            <LeaveChannel isHovered={isHovered} channel={channel} tokenMetadata={tokenMetadata}/>
            {
                joinChannelLoading === true &&
                    <Loading/>
            }
        </SidebarMenuButton>
    )
}

export default Channel;