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
import { AaveDetailsProvider } from "src/contexts/AaveDetailsContext";
import { BeefyDetailsProvider } from "src/contexts/BeefyDetailsContext";

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
          <BeefyDetailsProvider>
            <SocketProvider>
              <ChannelProvider>
                <TokenMetadataProvider>
                  <CMCPriceDataProvider>
                      <MessagesProvider>
                        <UserProvider>
                          <AaveDetailsProvider>
                          <SidebarProvider>
                              <Navbar/>
                              <div className="top-24 flex w-full">
                                  <AppSidebar/>
                                  <main className={`flex-1 h-full w-full overflow-hidden`}>
                                      {
                                      isMobile === true &&
                                      <SidebarTrigger className="fixed top-24"/>
                                      }
                                      {children}
                                  </main>
                                  <Toaster/>
                              </div>
                          </SidebarProvider>
                          </AaveDetailsProvider>
                        </UserProvider>
                      </MessagesProvider>
                  </CMCPriceDataProvider>
                </TokenMetadataProvider>
              </ChannelProvider>
            </SocketProvider>
          </BeefyDetailsProvider>
        </ProviderProvider>
      </Web3WalletConnectProvider>
    )
}

export default Layout;