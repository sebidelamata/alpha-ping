import * as React from "react";
import type { AppProps } from "next/app";
import '../styles/index.css';
import ProviderProvider from "../contexts/ProviderContext";
import SocketProvider from "../contexts/SocketContext";
import MessagesProvider from "../contexts/MessagesContext";
import ChannelProvider from "../contexts/ChannelContext";
import UserProvider from "../contexts/UserContext";
import Web3WalletConnectProvider from "../contexts/Web3ConnectContext";

const AlphaPINGApp:React.FC<AppProps> = ({ Component, pageProps }) => {
  return(
    <ProviderProvider>
      <Web3WalletConnectProvider>
        <SocketProvider>
          <ChannelProvider>
            <MessagesProvider>
              <UserProvider>
                <Component {...pageProps} />
              </UserProvider>
            </MessagesProvider>
          </ChannelProvider>
        </SocketProvider>
      </Web3WalletConnectProvider>
    </ProviderProvider>
  )
}

export default AlphaPINGApp
