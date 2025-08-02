import { useMemo } from "react";
import useTimeFilteredMessages from "./useTimeFilteredMessages";
import { useChannelProviderContext } from "src/contexts/ChannelContext";

const useCurrentChannelTimeFilteredMessages = (blocksFilter: boolean, timeRange: TimeFrame) => {

    const { timeFilteredData } = useTimeFilteredMessages(blocksFilter, timeRange)
    const { currentChannel } = useChannelProviderContext()

    // current channel time filtered data
    const currentChanneltimeFilteredData = useMemo(() => {
        if(timeFilteredData !== null && currentChannel !== null){
            const channelMessages: Message[] = timeFilteredData.filter((message) => {
                return message.channel.toString() === currentChannel.id.toString()
            })
            return channelMessages
        } else {
            return []
        }
    },[timeFilteredData, currentChannel])

    return { currentChanneltimeFilteredData }
}

export default useCurrentChannelTimeFilteredMessages;