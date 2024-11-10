import Head from "next/head";
import React, { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

const RootLayout:React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
          <Head>
            <meta charSet="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/Apes.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>AlphaPING | Chat | Trade</title>
          </Head>
          <main>{children}</main>
        </>
      );
}

export default RootLayout;
