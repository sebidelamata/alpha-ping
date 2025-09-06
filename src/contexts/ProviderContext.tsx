'use client';

import React, { 
    useEffect, 
    useState,
    useMemo,
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
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        // Reset state when disconnected
        if (!isConnected || !walletProvider) {
          console.log("Wallet not connected, clearing state");
          setProvider(null);
          setChainId(null);
          setSigner(null);
          setAlphaPING(null);
          setChannels([]);
          setHasJoined([]);
          setIsInitialized(false);
          return;
        }

        console.log("Wallet connected, initializing blockchain data...");
        
        const provider = new ethers.BrowserProvider(walletProvider);
        setProvider(provider);

        const network = await provider.getNetwork();
        const chainId = network.chainId.toString();
        setChainId(chainId);

        // Check if we have config for this chain
        if (!(config as BlockChainConfig)[chainId]) {
          console.error(`No configuration found for chain ID: ${chainId}`);
          setIsInitialized(false);
          return;
        }

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
        setIsInitialized(true);

        // Listen for account changes
        if (typeof window !== 'undefined') {
          const eth = window.ethereum;
          (eth as unknown as ExtendedEip1193Provider)?.on?.('accountsChanged', () => window.location.reload());
        }

        console.log("Blockchain data loaded successfully");

      } catch (error) {
        console.error("Error loading blockchain data:", error);
        setIsInitialized(false);
      }
    };

    loadBlockchainData();
  }, [isConnected, walletProvider]);

  const contextValue = useMemo(() => ({
    provider,
    chainId,
    signer,
    alphaPING,
    channels,
    setChannels,
    hasJoined,
    setHasJoined,
    isInitialized
  }), [
    provider,
    chainId,
    signer,
    alphaPING,
    channels,
    hasJoined,
    isInitialized
  ]);

  return (
    <ProviderContext.Provider value={contextValue}>
      {children}
    </ProviderContext.Provider>
  );
};

export default ProviderProvider;