'use client';

import React, 
{
    useState,
    useEffect,
    ReactNode
} from "react";
import ProviderProvider from '../../contexts/ProviderContext';
import SocketProvider from '../../contexts/SocketContext';
import MessagesProvider from '../../contexts/MessagesContext';
import ChannelProvider from '../../contexts/ChannelContext';
import UserProvider from '../../contexts/UserContext';
import Web3WalletConnectProvider from '../../contexts/Web3ConnectContext';
import Navbar from "./components/Navbar";
import { 
    SidebarProvider, 
    SidebarTrigger 
} from "@/components/components/ui/sidebar"
import AppSidebar from "./components/AppSidebar";
import { Toaster } from "@/components/components/ui/toaster"
import { TokenMetadataProvider } from "src/contexts/TokenMetaDataContext";
import { CMCPriceDataProvider } from "src/contexts/CMCPriceDataContext";

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
      <Web3WalletConnectProvider>
        <ProviderProvider>
          <TokenMetadataProvider>
            <SocketProvider>
              <ChannelProvider>
                <CMCPriceDataProvider>
                  <MessagesProvider>
                    <UserProvider>
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
                              <Toaster/>
                          </div>
                      </SidebarProvider>
                    </UserProvider>
                  </MessagesProvider>
                </CMCPriceDataProvider>
              </ChannelProvider>
            </SocketProvider>
          </TokenMetadataProvider>
        </ProviderProvider>
      </Web3WalletConnectProvider>
    )
}

export default Layout;