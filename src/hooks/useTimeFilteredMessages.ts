import { useMemo } from "react";
import useFollowBlockFilteredMessages from "./useFollowBlockFilteredMessages";
import timeFilterMessages from "src/lib/timeFilterMessages";

const useTimeFilteredMessages = (blocksFilter: boolean, timeRange: TimeFrame) => {

    const { followBlockFilteredMessages } = useFollowBlockFilteredMessages(blocksFilter)

    const timeFilteredData = useMemo(() => {
        return followBlockFilteredMessages !== null ?
        timeFilterMessages(followBlockFilteredMessages, timeRange) : 
        null
    },[followBlockFilteredMessages, timeRange])

    return { timeFilteredData }
}

export default useTimeFilteredMessages;