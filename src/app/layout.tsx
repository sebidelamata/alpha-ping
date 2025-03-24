import React, { ReactNode } from 'react';
import { Metadata } from 'next';
import '../styles/index.css'; 
import Head from 'next/head';
import { Roboto } from 'next/font/google'

// set font propertoes
const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

// Define metadata for the entire app
export const metadata: Metadata = {
  title: 'AlphaPING | Chat | Trade',
  description: 'A blockchain-native group chat app that aggregates analysis and trading within the app and posts user token amounts to increase transparency.',
  icons: ['/Apes.svg'],
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
    <html lang="en" className={roboto.className}>
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/Apes.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body id='root' className='bg-primary text-secondary'>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
};

export default Layout;
