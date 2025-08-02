import {
    useState,
    useEffect
} from "react";
import weightAllMessages from "src/lib/weightAllMessages";
import { useMessagesProviderContext } from "src/contexts/MessagesContext";

const useGetMessageWeights = (messageWeighting: Weighting, timeFilteredData: Message[] | null) => {

    const { authorCurrentTokenBalances } = useMessagesProviderContext()
    // weight messages
    // all channels
    const [weights, setWeights] = useState<number[]>([])
    useEffect(() => {
        const weights = timeFilteredData !== null ?
            weightAllMessages(
                timeFilteredData, 
                messageWeighting, 
                authorCurrentTokenBalances
            ) :
            []
        setWeights(weights)
    }, [timeFilteredData, messageWeighting, authorCurrentTokenBalances])

    return { weights }
}

export default useGetMessageWeights;