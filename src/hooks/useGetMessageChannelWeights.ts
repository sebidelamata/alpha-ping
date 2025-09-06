import {
    useState,
    useEffect,
    useMemo
} from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useMessagesProviderContext } from "src/contexts/MessagesContext";
import weightChannelMessages from "src/lib/weightChannelMessages";

const useGetMessageChannelWeights = (
    currentChanneltimeFilteredData: Message[], 
    messageWeighting: Weighting
) => {

    const { currentChannel } = useChannelProviderContext()
    const { authorCurrentTokenBalances } = useMessagesProviderContext()

    const [channelWeights, setChannelWeights] = useState<number[]>([])
    useEffect(() => {
        const weights = currentChanneltimeFilteredData !== null &&
            currentChannel !== null ?
            weightChannelMessages(
                currentChanneltimeFilteredData, 
                messageWeighting,
                authorCurrentTokenBalances
            ) :
            []
        setChannelWeights(weights)
    }, [
        currentChanneltimeFilteredData, 
        messageWeighting, 
        currentChannel, 
        authorCurrentTokenBalances
    ])

    return useMemo(() => ({
        channelWeights
    }), [channelWeights]);
}

export default useGetMessageChannelWeights;