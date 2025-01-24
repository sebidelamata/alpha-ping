'use client';

import React, 
{
    useState,
    ReactNode
} from "react";
import Navbar from "./components/Navbar/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/components/ui/sidebar"
import AppSidebar from "./components/AppSidebar";

const Layout = ({ children }: { children: ReactNode }) => {

    // elevate joinchannel loading
    const [joinChannelLoading, setJoinChannelLoading] = useState<boolean>(false)

    return(
        <SidebarProvider>
            <Navbar 
                    joinChannelLoading={joinChannelLoading}
                    setJoinChannelLoading={setJoinChannelLoading}
            />
            <div className="top-24 flex">
                <AppSidebar/>
                <main>
                    <SidebarTrigger className="fixed top-32"/>
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}

export default Layout;