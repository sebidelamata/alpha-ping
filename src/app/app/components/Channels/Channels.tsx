'use client';

import React,
{
  useState,
  useEffect
} from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/components/ui/sidebar"
import { ScrollArea } from "@/components/components/ui/scroll-area"
import Channel from "../Channels/Channel";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { AlphaPING } from '../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import { ethers } from 'ethers';


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
  } = useChannelProviderContext()

const [userChannels, setUserChannels] = useState<AlphaPING.ChannelStructOutput[]>([])
useEffect(() => {
  const loadUserChannels = ():void => {
      const userChannels: AlphaPING.ChannelStructOutput[] = []
      hasJoined.map((joined, index) => {
      if(joined === true){
          userChannels.push(channels[index])
      }
      })
      setUserChannels(userChannels)
  }
  loadUserChannels()
}, [channels, joinChannelLoading, hasJoined, signer])

useEffect(() => {
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
  reloadChannels()
  }, [
      currentChannel, 
      joinChannelLoading, 
      signer, 
      alphaPING, 
      setChannels, 
      setHasJoined
  ]
)
  
    return (
      <SidebarGroup className="gap-14 pt-4">
        <SidebarGroupLabel>
            <h1 className="text-xl text-secondary">
                Channels
            </h1>
        </SidebarGroupLabel>
        <SidebarGroupContent>
            <ScrollArea className="max-h-[45svh]">
                <SidebarMenu>
                    {
                        userChannels.map((channel, index) => (
                            <SidebarMenuItem key={channel.tokenAddress}>
                              <Channel
                                  channel={channel}
                                  key={index}
                              />
                            </SidebarMenuItem>
                        ))
                    }
                </SidebarMenu>
            </ScrollArea>
        </SidebarGroupContent>
      </SidebarGroup>   
    );
  }
  
  export default Channels;