'use client';

import React, {
    useState, 
    useMemo
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

    const isCurrentChannel = useMemo(() => {
        return currentChannel && currentChannel.id.toString() === channel.id.toString();
    }, [currentChannel, channel.id]);
    
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

    const avatarSources = useMemo(() => {
        const hasLogo = tokenMetadata.logo && tokenMetadata.logo !== '';
        const defaultIcon = channel.tokenType === 'ERC20' ? '/erc20Icon.svg' : '/blank_nft.svg';
        const hoverIcon = channel.tokenType === 'ERC20' ? '/erc20IconAlt.svg' : '/blank_nftAlt.svg';
        
        return {
            normal: hasLogo ? tokenMetadata.logo : defaultIcon,
            hover: hasLogo ? tokenMetadata.logo : hoverIcon
        };
    }, [tokenMetadata.logo, channel.tokenType]);

    // pass hover info to leaveChannel component to make icon appear
    const [isHovered, setIsHovered] = useState(false);

    return(
        <SidebarMenuButton
            className={`flex items-center justify-between ${
                isCurrentChannel ? 
                "bg-accent" :
                "" }`
            }
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => channelHandler(channel)}
        >
            <div className="flex items-center justify-start gap-4">
                <Avatar className="size-4">
                    <AvatarImage 
                        src={isHovered ? avatarSources.hover : avatarSources.normal}
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