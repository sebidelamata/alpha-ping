import React, { ReactNode } from 'react';
import { Metadata } from 'next';
import '../styles/index.css'; 
import { Roboto } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

// set font propertoes
const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

// Define metadata for the entire app
export const metadata: Metadata = {
  metadataBase: new URL('https://alphaping.xyz'),
  title: 'AlphaPING | Chat | Trade',
  description: 'A blockchain-native group chat app that aggregates analysis and trading within the app and posts user token amounts to increase transparency.',
  icons: ['/Apes.svg'],
  openGraph: {
    title: 'AlphaPING | Chat | Trade',
    description: 'Research with Transparency. Trust in your Community. Trade at the Best Prices. All in One Place.',
    images: ['/Apes.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@__AlphaPING__',
    creator: '@__AlphaPING__',
    title: 'AlphaPING | Chat | Trade',
    description: 'Research with Transparency. Trust in your Community. Trade at the Best Prices. All in One Place.',
    images: ['/Apes.svg'],
  },
};

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  
  return (
    <html lang="en" className={roboto.className}>
      <body id='root' className='bg-primary text-secondary min-h-screen !important'>
        <main>
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
};

export default Layout;
