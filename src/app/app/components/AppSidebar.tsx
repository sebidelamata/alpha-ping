'use client';

import React from "react";
import Channels from "./Channels/Channels";
import AddChannel from "./Channels/AddChannel";
import ChannelActions from "./Channels/ChannelActions";
import {
    Sidebar,
    SidebarContent,
    SidebarTrigger
  } from "@/components/components/ui/sidebar"
import SidebarProfileFooter from "./Profile/SidebarProfileFooter";


const AppSidebar = () => {
    return(
        <Sidebar 
            collapsible="icon" 
            className="mt-24 pb-24"
        >
            <SidebarContent 
                className="flex flex-col h-full bg-primary text-secondary"
            >
                <SidebarTrigger 
                    className="m-2"
                />
                <Channels/>
                <AddChannel/>
                <ChannelActions/>
            </SidebarContent>
            <SidebarProfileFooter/>
        </Sidebar>
    )
}

export default AppSidebar;