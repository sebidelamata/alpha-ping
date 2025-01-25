'use client';

import React, 
{
    useState,
    useEffect,
    ReactNode
} from "react";
import Navbar from "./components/Navbar/Navbar";
import { 
    SidebarProvider, 
    SidebarTrigger 
} from "@/components/components/ui/sidebar"
import AppSidebar from "./components/AppSidebar";

const Layout = ({ children }: { children: ReactNode }) => {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
        // Set isMobile to true if the window width is less than 768px
        setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        
        // Check window size on initial render
        handleResize();

        // Clean up event listener on unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return(
        <SidebarProvider>
            <Navbar/>
            <div className="top-24 flex">
                <AppSidebar/>
                <main>
                    {
                    isMobile === true &&
                    <SidebarTrigger className="fixed top-24"/>
                    }
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}

export default Layout;