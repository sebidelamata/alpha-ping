import React, { ReactNode } from 'react';
import { Metadata } from 'next';
import '../styles/index.css'; 
import ProviderProvider from '../contexts/ProviderContext';
import SocketProvider from '../contexts/SocketContext';
import MessagesProvider from '../contexts/MessagesContext';
import ChannelProvider from '../contexts/ChannelContext';
import UserProvider from '../contexts/UserContext';
import Web3WalletConnectProvider from '../contexts/Web3ConnectContext';

// Define metadata for the entire app
export const metadata: Metadata = {
  title: 'AlphaPING | Chat | Trade',
  description: 'A blockchain-native group chat app that aggregates analysis and trading within the app and posts user token amounts to increase transparency.',
  openGraph: {
    title: 'AlphaPING | Chat | Trade',
    description: 'A blockchain-native group chat app...',
    images: ['/Apes.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@__AlphaPING__',
    creator: '@__AlphaPING__',
    title: 'AlphaPING | Chat | Trade',
    description: 'A blockchain-native group chat app...',
    images: '/Apes.svg',
  },
};

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <ProviderProvider>
          <Web3WalletConnectProvider>
            <SocketProvider>
              <ChannelProvider>
                <MessagesProvider>
                  <UserProvider>
                    <main>{children}</main>
                  </UserProvider>
                </MessagesProvider>
              </ChannelProvider>
            </SocketProvider>
          </Web3WalletConnectProvider>
        </ProviderProvider>
      </body>
    </html>
  );
};

export default Layout;
