import * as React from "react";
import {createRoot} from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./Routes";
import './index.css'
import ProviderProvider from "./contexts/ProviderContext";
import SocketProvider from "./contexts/SocketContext";
import MessagesProvider from "./contexts/MessagesContext";
import ChannelProvider from "./contexts/ChannelContext";
import UserProvider from "./contexts/UserContext";
import Web3WalletConnectProvider from "./contexts/Web3ConnectContext";

const router = createBrowserRouter(routes);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <ProviderProvider>
      <Web3WalletConnectProvider>
        <SocketProvider>
          <ChannelProvider>
            <MessagesProvider>
              <UserProvider>
                <RouterProvider router={router} />
              </UserProvider>
            </MessagesProvider>
          </ChannelProvider>
        </SocketProvider>
      </Web3WalletConnectProvider>
    </ProviderProvider>
  </React.StrictMode>
);

