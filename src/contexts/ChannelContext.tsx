'use client';

import React, {
    type ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo
} from "react"
import { AlphaPING } from "../../typechain-types/contracts/AlphaPING.sol/AlphaPING";

interface ChannelProviderType{
    currentChannel: AlphaPING.ChannelStructOutput | null;
    setCurrentChannel: React.Dispatch<React.SetStateAction<AlphaPING.ChannelStructOutput | null>>;
    selectedChannelMetadata: tokenMetadata | null;
    setSelectedChannelMetadata: React.Dispatch<React.SetStateAction<tokenMetadata | null>>;
    joinChannelLoading: boolean;
    setJoinChannelLoading: React.Dispatch<React.SetStateAction<boolean>>;
    addChannelLoading: boolean;
    setAddChannelLoading: React.Dispatch<React.SetStateAction<boolean>>;
    channelAction: string;
    setChannelAction: React.Dispatch<React.SetStateAction<string>>;
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
    // join channel loading state
    const [joinChannelLoading, setJoinChannelLoading] = useState<boolean>(false)
    // add channel loading state
    const [addChannelLoading, setAddChannelLoading] = useState<boolean>(false)
    // selected channel's actions ("chat", "analyze", "trade")
    const [channelAction, setChannelAction] = useState<string>("chat")

    // set document title based on current Channel
    useEffect(() => {
        if(currentChannel !== null){
            document.title = `AlphaPING | ${currentChannel.name}`;
        }
    }, [currentChannel])

    // memoize context value
    const contextValue = useMemo(() => ({
        currentChannel,
        setCurrentChannel,
        selectedChannelMetadata,
        setSelectedChannelMetadata,
        joinChannelLoading,
        setJoinChannelLoading,
        addChannelLoading,
        setAddChannelLoading,
        channelAction,
        setChannelAction
    }), [
        currentChannel,
        selectedChannelMetadata,
        joinChannelLoading,
        addChannelLoading,
        channelAction
    ]);

    return (
        <ChannelContext.Provider value={contextValue}>
            {children}
        </ChannelContext.Provider>
    )
}

export default ChannelProvider