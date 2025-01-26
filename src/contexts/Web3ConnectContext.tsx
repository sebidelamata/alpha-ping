'use client';

import React, { 
    createContext,
    useContext,
    type ReactNode 
} from 'react';
import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { arbitrum } from '@reown/appkit/networks'
import { defineChain, AppKitNetwork } from '@reown/appkit/networks';


// create context
const Web3ConnectContext = createContext<unknown | undefined>(undefined)

export const useWeb3ConnectProviderContext = (): unknown => {
    const context = useContext(Web3ConnectContext)
    if (context === null || context === undefined) {
        throw new Error('useWeb3ConnectProviderContext must be used within a ProviderProvider')
    }
    return context
}

const Web3WalletConnectProvider: React.FC<{ children: ReactNode }> = ({children}) => {

    const customNetwork = defineChain({
        id: 31_337,
        caipNetworkId: 'eip155:31337',
        chainNamespace: 'eip155',
        name: 'Hardhat',
        nativeCurrency: {
          decimals: 18,
          name: 'Ether',
          symbol: 'ETH',
        },
        rpcUrls: {
          default: {
            http: ['http://127.0.0.1:8545']
          },
        },
        contracts: {
          // Add the contracts here
        }
      })

    // 1. Get projectId
    const projectId = process.env.NEXT_PUBLIC_WALLECTCONNECT_PROJECT_ID || '';

    // 2. Set the networks
    const networks: [AppKitNetwork, ...AppKitNetwork[]] = [arbitrum, customNetwork as AppKitNetwork];

    // 3. Create a metadata object - optional
    const metadata = {
    name: 'AlphaPING',
    description: 'Web3 message board',
    url: 'https://www.alphaping.xyz/', // origin must match your domain & subdomain
    icons: ['https://assets.reown.com/reown-profile-pic.png']
    }

    // 4. Create a AppKit instance
    createAppKit({
    adapters: [new EthersAdapter()],
    networks,
    metadata,
    projectId,
    features: {
        analytics: true // Optional - defaults to your Cloud configuration
        },
    themeVariables: {
      '--w3m-color-mix': 'rgb(188, 146, 222, 0.8)',
      '--w3m-color-mix-strength': 30,
      '--w3m-accent': 'rgb(188, 146, 222, 0.8)',
      '--w3m-z-index': 9999
    }
})
  
    return (
        <Web3ConnectContext.Provider value={{ 
        }}>
            {children}
        </Web3ConnectContext.Provider>
    )
  }
  
  export default Web3WalletConnectProvider