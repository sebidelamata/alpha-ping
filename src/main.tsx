import * as React from "react";
import {createRoot} from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./Routes";
import './index.css'
import ProviderProvider from "./App/contexts/ProviderContext";
import SocketProvider from "./App/contexts/SocketContext";
import MessagesProvider from "./App/contexts/MessagesContext";
import ChannelProvider from "./App/contexts/ChannelContext";
import UserProvider from "./App/contexts/UserContext";
import Web3WalletConnectProvider from "./App/contexts/Web3ConnectContext";

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

