'use client';

import React, { 
    useEffect, 
    useState,
    createContext,
    useContext,
    type ReactNode 
} from 'react';
import { 
  ethers, 
  Signer 
} from 'ethers';

// ABIs
import AlphaPINGABI from '../../artifacts/contracts/AlphaPING.sol/AlphaPING.json';
// Config
import config from '../blockChainConfigs.json';

// types
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import { EtherProviderType } from '../types/EtherProviderType';
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { Window } from 'src/types/global';

interface BlockChainConfig {
  [key: string]: {
    AlphaPING: {
      address: string;
    };
  };
}

// create context
const ProviderContext = createContext<EtherProviderType | undefined>(undefined);

export const useEtherProviderContext = (): EtherProviderType => {
  const context = useContext(ProviderContext);
  if (context === null || context === undefined) {
    throw new Error('useEtherProviderContext must be used within a ProviderProvider');
  }
  return context;
};

const ProviderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<ethers.Eip1193Provider>('eip155');

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [alphaPING, setAlphaPING] = useState<AlphaPING | null>(null);
  const [channels, setChannels] = useState<AlphaPING.ChannelStructOutput[]>([]);
  const [hasJoined, setHasJoined] = useState<boolean[]>([]);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        if (!walletProvider) {
          console.error("No wallet provider found.");
          return;
        }

        const provider = new ethers.BrowserProvider(walletProvider);
        setProvider(provider);

        const network = await provider.getNetwork();
        const chainId = network.chainId.toString();
        setChainId(chainId);

        const alphaPING = new ethers.Contract(
          (config as BlockChainConfig)[chainId].AlphaPING.address,
          AlphaPINGABI.abi,
          provider
        ) as unknown as AlphaPING;
        setAlphaPING(alphaPING);

        const totalChannels: bigint = await alphaPING.totalChannels();
        const channels = [];

        for (let i = 1; i <= Number(totalChannels); i++) {
          const channel = await alphaPING.getChannel(i);
          channels.push(channel);
        }

        setChannels(channels);

        const signer: Signer = await provider.getSigner();
        setSigner(signer);

        const hasJoinedChannel: boolean[] = [];

        for (let i = 1; i <= Number(totalChannels); i++) {
          const hasJoined = await alphaPING.hasJoinedChannel(
            i as ethers.BigNumberish,
            await signer.getAddress()
          );
          hasJoinedChannel.push(hasJoined);
        }

        setHasJoined(hasJoinedChannel);

        // ✅ Safely use window.ethereum
        ((window as Window).ethereum)?.on?.('accountsChanged', async () => {
          window.location.reload();
        });

      } catch (error) {
        console.error("Error loading blockchain data:", error);
      }
    };

    loadBlockchainData();
  }, [isConnected, walletProvider]);

  return (
    <ProviderContext.Provider value={{
      provider,
      chainId,
      signer,
      alphaPING,
      channels,
      setChannels,
      hasJoined,
      setHasJoined
    }}>
      {children}
    </ProviderContext.Provider>
  );
};

export default ProviderProvider;
