'use client';

import React, 
{
    ReactNode
} from "react";
import Navbar from "./components/Navbar/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/components/ui/sidebar"
import AppSidebar from "./components/AppSidebar";
import { useChannelProviderContext } from "../../contexts/ChannelContext";

const Layout = ({ children }: { children: ReactNode }) => {

    const { joinChannelLoading, setJoinChannelLoading } = useChannelProviderContext()

    return(
        <SidebarProvider>
            <Navbar 
                    joinChannelLoading={joinChannelLoading}
                    setJoinChannelLoading={setJoinChannelLoading}
            />
            <div className="top-24 flex">
                <AppSidebar/>
                <main>
                    <SidebarTrigger className="fixed top-24"/>
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}

export default Layout;