import * as React from "react";
import {createRoot} from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./Routes";
import './index.css'
import ProviderProvider from "./contexts/ProviderContext";

const router = createBrowserRouter(routes);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <ProviderProvider>
      <RouterProvider router={router} />
    </ProviderProvider>
  </React.StrictMode>
);

