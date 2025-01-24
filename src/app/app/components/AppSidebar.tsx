'use client';

import React, { 
  useState, 
  useEffect 
} from "react";
import { AlphaPING } from '../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import Channel from "./Channels/Channel";
import AddChannel from "./Channels/AddChannel";
import { useEtherProviderContext } from "../../../contexts/ProviderContext";
import { useChannelProviderContext } from "../../../contexts/ChannelContext";
import ChannelActions from "./Channels/ChannelActions";
import { ethers } from 'ethers';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
  } from "@/components/components/ui/sidebar"

const AppSidebar = () => {

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
    



    return(
        <Sidebar collapsible="icon" className="mt-24">
            <SidebarContent className="bg-primary text-secondary">
                <SidebarGroup className="gap-14 pt-4">
                    <SidebarGroupLabel>
                        <h1 className="text-xl text-secondary">
                            Channels
                        </h1>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
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
                    </SidebarGroupContent>
                </SidebarGroup>
                <AddChannel/>
                <ChannelActions/>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar;