'use client';

import React, { 
    type ReactNode 
} from 'react';
import { 
  ethersAdapter, 
  projectId, 
  networks 
} from '../app/config'
import { createAppKit } from '@reown/appkit/react'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// 3. Create a metadata object - optional
const metadata = {
  name: 'AlphaPING',
  description: 'Research with Transparency. Trust in your Community. Trade at the Best Prices. All in One Place',
  url: 'https://www.alphaping.xyz',
  icons: ['https://www.alphaping.xyz/Apes.svg']
}

// 4. Create a AppKit instance
export const modal = createAppKit({
  adapters: [ethersAdapter],
  networks: networks,
  metadata: metadata,
  projectId: projectId,
  features: {
      analytics: true
      },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': 'rgb(188, 146, 222, 0.8)',
    '--w3m-color-mix-strength': 30,
    '--w3m-accent': 'rgb(188, 146, 222, 0.8)',
    '--w3m-z-index': 9999999
  }
})

const Web3WalletConnectProvider: React.FC<{ children: ReactNode }> = ({children}) => {

    return (
      <>
        {children}
      </>
      
    )
}
  
export default Web3WalletConnectProvider