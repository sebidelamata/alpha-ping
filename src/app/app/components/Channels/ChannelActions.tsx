'use client';

import React,
  { MouseEventHandler } from "react";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import { useChannelProviderContext } from "../../../../contexts/ChannelContext";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/components/ui/sidebar"
import { 
  Avatar,
  AvatarImage
 } from "@/components/components/ui/avatar";

const ChannelActions: React.FC = () => {

  const { userProfilePic } = useUserProviderContext()
  const { setChannelAction } = useChannelProviderContext()

  const channelActionHandler:MouseEventHandler<HTMLElement> = async (e) => {
    const action = (e.target as HTMLElement).id
    setChannelAction(action)
  }

  const actions = [
    'Chat',
    'Analyze',
    'Trade',
    'Profile'
  ]

    return(
      <SidebarGroup className="gap-14 pt-4">
        <SidebarGroupLabel>
            <h1 className="text-xl text-secondary">
                Channel Actions
            </h1>
        </SidebarGroupLabel>
        <SidebarGroupContent>
            <SidebarMenu>
                {
                  actions.map((action) => (
                      <SidebarMenuItem 
                        key={action}
                        onClick={(e) => channelActionHandler(e)}
                        id={action}
                        className="flex flex-row"
                      >
                          {action}
                          {
                            action === "Profile" &&
                            userProfilePic !== null &&
                            userProfilePic !== "" &&
                            userProfilePic !== undefined &&
                            <Avatar>
                              <AvatarImage 
                                src={userProfilePic} 
                                alt="user profile picture" 
                                loading="lazy" 
                              />
                            </Avatar>
                          }
                          {
                            action === "Profile" &&
                            <Avatar>
                              <AvatarImage 
                                src="/monkey.svg" 
                                alt="default profile picture" 
                                loading="lazy"
                              />
                            </Avatar>
                          }
                      </SidebarMenuItem>
                  ))
                }
            </SidebarMenu>
        </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default ChannelActions