'use client';

import React,
  { MouseEventHandler } from "react";
import { useChannelProviderContext } from "../../../../contexts/ChannelContext";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/components/ui/sidebar"

const ChannelActions: React.FC = () => {

  const { setChannelAction } = useChannelProviderContext()

  const channelActionHandler:MouseEventHandler<HTMLElement> = async (e) => {
    const action = (e.target as HTMLElement).id
    setChannelAction(action)
  }

  const actions = [
    'Chat',
    'Analyze',
    'Trade'
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
                        <SidebarMenuButton>
                          {action}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                  ))
                }
            </SidebarMenu>
        </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default ChannelActions