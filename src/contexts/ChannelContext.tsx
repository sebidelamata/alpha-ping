'use client';

import React, {
    type ReactNode,
    createContext,
    useContext,
    useEffect,
    useState
} from "react"
import { AlphaPING } from "../../typechain-types/contracts/AlphaPING.sol/AlphaPING";

interface ChannelProviderType{
    currentChannel: AlphaPING.ChannelStructOutput | null;
    setCurrentChannel: React.Dispatch<React.SetStateAction<AlphaPING.ChannelStructOutput | null>>;
    selectedChannelMetadata: tokenMetadata | null;
    setSelectedChannelMetadata: React.Dispatch<React.SetStateAction<tokenMetadata | null>>;
    tokenMetadataLoading: boolean;
    setTokenMetadataLoading: React.Dispatch<React.SetStateAction<boolean>>;
    joinChannelLoading: boolean;
    setJoinChannelLoading: React.Dispatch<React.SetStateAction<boolean>>;
    addChannelLoading: boolean;
    setAddChannelLoading: React.Dispatch<React.SetStateAction<boolean>>;
    channelAction: string;
    setChannelAction: React.Dispatch<React.SetStateAction<string>>;
    cmcFetch: cmcPriceData;
    setCmcFetch: React.Dispatch<React.SetStateAction<cmcPriceData>>;
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
    // token metadata loading state
    const [tokenMetadataLoading, setTokenMetadataLoading] = useState<boolean>(false)
    // join channel loading state
    const [joinChannelLoading, setJoinChannelLoading] = useState<boolean>(false)
    // add channel loading state
    const [addChannelLoading, setAddChannelLoading] = useState<boolean>(false)
    // selected channel's actions ("chat", "analyze", "trade")
    const [channelAction, setChannelAction] = useState<string>("chat")
    // channel price from cmc
    const [cmcFetch, setCmcFetch] = useState<cmcPriceData>({
                twentyFourHourChange: "",
                tokenUSDPrice: "",
                marketCap: "",
                percent_change_1h: "",
                percent_change_7d: "",
                percent_change_30d: "",
                percent_change_60d: "",
                volume_24h: "",
                volume_change_24h: ""
    } as cmcPriceData);

    // set document title based on current Channel
    useEffect(() => {
        if(currentChannel !== null){
            document.title = `AlphaPING | ${currentChannel.name}`;
        }
    }, [currentChannel])

    return (
        <ChannelContext.Provider value={{ 
            currentChannel,
            setCurrentChannel,
            selectedChannelMetadata,
            setSelectedChannelMetadata,
            tokenMetadataLoading,
            setTokenMetadataLoading,
            joinChannelLoading,
            setJoinChannelLoading,
            addChannelLoading,
            setAddChannelLoading,
            channelAction,
            setChannelAction,
            cmcFetch,
            setCmcFetch
        }}>
            {children}
        </ChannelContext.Provider>
    )
}

export default ChannelProvider