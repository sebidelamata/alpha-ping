'use client';

import React from "react";
import Channels from "./Channels/Channels";
import AddChannel from "./Channels/AddChannel";
import ChannelActions from "./Channels/ChannelActions";
import ToggleFollowFilter from "./Profile/ToggleFollowFilter";
import {
    Sidebar,
    SidebarContent,
    SidebarTrigger
  } from "@/components/components/ui/sidebar"
import { Separator } from "@/components/components/ui/separator";
import SidebarProfileFooter from "./Profile/SidebarProfileFooter";


const AppSidebar = () => {
    return(
        <Sidebar 
            collapsible="icon" 
            className="mt-24 pb-24"
        >
            <SidebarContent 
                className="bg-primary text-secondary"
            >
                <SidebarTrigger 
                    className="m-2"
                />
                <Separator 
                    className="border border-accent"
                />
                <Channels/>
                <AddChannel/>
                <Separator 
                    className="border border-accent"
                />
                <ChannelActions/>
                <ToggleFollowFilter/>
            </SidebarContent>
            <Separator 
                    className="border border-accent"
            />
            <SidebarProfileFooter/>
        </Sidebar>
    )
}

export default AppSidebar;