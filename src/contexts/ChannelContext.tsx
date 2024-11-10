'use client';

import React, {
    type ReactNode,
    createContext,
    useContext,
    useState
} from "react"
import { AlphaPING } from "../../typechain-types/contracts/AlphaPING.sol/AlphaPING";

interface ChannelProviderType{
    currentChannel: AlphaPING.ChannelStructOutput | null;
    setCurrentChannel: React.Dispatch<React.SetStateAction<AlphaPING.ChannelStructOutput | null>>;
    selectedChannelMetadata: tokenMetadata | null;
    setSelectedChannelMetadata: React.Dispatch<React.SetStateAction<tokenMetadata | null>>;
}

// create context
const ChannelContext = createContext<ChannelProviderType | undefined>(undefined)

export const useChannelProviderContext = (): ChannelProviderType => {
    const context = useContext(ChannelContext)
    if (context === null || context === undefined) {
        throw new Error('useUserProviderContext must be used within a ChannelProvider')
    }
    return context
}

const ChannelProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    // selected channel
  const [currentChannel, setCurrentChannel] = useState<AlphaPING.ChannelStructOutput | null>(null)
  // token metadata fetched from coinmarketcap
  const[selectedChannelMetadata, setSelectedChannelMetadata] = useState<tokenMetadata | null>(null)

  return (
    <ChannelContext.Provider value={{ 
        currentChannel,
        setCurrentChannel,
        selectedChannelMetadata,
        setSelectedChannelMetadata
    }}>
        {children}
    </ChannelContext.Provider>
)
}

export default ChannelProvider