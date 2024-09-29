import * as React from "react";
import {createRoot} from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./Routes";
import './index.css'
import ProviderProvider from "./contexts/ProviderContext";
import SocketProvider from "./contexts/SocketContext";
import MessagesProvider from "./contexts/MessagesContext";

const router = createBrowserRouter(routes);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <ProviderProvider>
      <SocketProvider>
        <MessagesProvider>
          <RouterProvider router={router} />
        </MessagesProvider>
      </SocketProvider>
    </ProviderProvider>
  </React.StrictMode>
);

