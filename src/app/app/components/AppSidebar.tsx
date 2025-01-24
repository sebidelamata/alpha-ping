'use client';

import React, { 
  useState, 
  useEffect 
} from "react";
import { AlphaPING } from '../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
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
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/components/ui/sidebar"

const AppSidebar = () => {
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
                            <SidebarMenuItem key={"test"}>
                                <SidebarMenuButton asChild>
                                <a href={"https://www.google.com"}>
                                    <span>{"test"}</span>
                                </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar;