'use client';

import React, {
    useState,
} from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { 
    Card,
    CardContent
} from "@/components/components/ui/card";
import OverallScoreDial from "./OverallScoreDial";
import ChannelScoreDial from "./ChannelScoreDial";
import ChannelScoreBarChartPosNeutNeg from "./ChannelScoreBarChartPosNeutNeg";
import ChannelScoreOverTime from "./ChannelScoreOverTime";
import NewUserNoChannels from "../Channels/NewUserNoChannels";
import useGetCoinGeckoHistoricData from "src/hooks/useGetCoinGeckoHistoricData";
import useTimeFilteredMessages from "src/hooks/useTimeFilteredMessages";
import useCurrentChannelTimeFilteredMessages from "src/hooks/useCurrentChannelTimeFilteredMessages";
import useGetScores from "src/hooks/useGetScores";
import useGetChannelScores from "src/hooks/useGetChannelScores";
import useGetMessageWeights from "src/hooks/useGetMessageWeights";
import useGetMessageChannelWeights from "src/hooks/useGetMessageChannelWeights";
import useGetAllMessagesScore from "src/hooks/useGetAllMessagesScore";
import useGetCurrentChannelMessagesScore from "src/hooks/useGetCurrentChannelMessagesScore";
import useGetScoreTimeseries from "src/hooks/useGetScoreTimeseries";
import AnalyzeHeader from "./AnalyzeHeader";

const Analyze:React.FC = () => {

    const { currentChannel } = useChannelProviderContext()

    // filter for follows and blocks
    const [blocksFilter, setBlocksFilter] = useState<boolean>(true)
    
    // filter for date range before weighting
    // toggle mock messages here
    const [timeRange, setTimeRange] = useState<TimeFrame>("30d")

    // grab historic data from coingecko
    const { historicPriceData } = useGetCoinGeckoHistoricData(timeRange)
    console.log("Historic Price Data:", historicPriceData)

    const { currentChanneltimeFilteredData } = useCurrentChannelTimeFilteredMessages(blocksFilter, timeRange)
    const { timeFilteredData } = useTimeFilteredMessages(blocksFilter, timeRange)

    // scores
    // all messages
    const { scores } = useGetScores(timeFilteredData)
    // current channel
    const { channelScores } = useGetChannelScores(currentChanneltimeFilteredData)

    // weight messages
    // all channels
    const [messageWeighting, setMessageWeighting] = useState<Weighting>("unweighted")
    const { weights } = useGetMessageWeights(
        messageWeighting, 
        timeFilteredData
    )
    // current channel
    const { channelWeights } = useGetMessageChannelWeights(
        currentChanneltimeFilteredData, 
        messageWeighting
    )
    
    // get scores from filtered and weighted data
    // all messages
    const { allMessagesScore } = useGetAllMessagesScore(
        weights, 
        scores
    )
    // current channel
    const { currentChannelMessagesScore } = useGetCurrentChannelMessagesScore(
        channelWeights, 
        channelScores
    )
    // get score timeseries
    const { scoreTimeseries } = useGetScoreTimeseries(
        channelWeights, 
        channelScores, 
        currentChanneltimeFilteredData, 
        historicPriceData !== null ? historicPriceData : []
    )
    
    return(
        <Card
        className="flex flex-col w-full h-full bg-primary text-secondary overflow-hidden"
        onWheel={(e) => {
        e.stopPropagation(); 
      }}
        >
            <AnalyzeHeader
                blocksFilter={blocksFilter}
                setBlocksFilter={setBlocksFilter}
                messageWeighting={messageWeighting}
                setMessageWeighting={setMessageWeighting}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
            />
            <CardContent
                className='flex flex-row flex-wrap h-full w-full overflow-y-auto'
            >
                {
                    currentChannel === null &&
                    <NewUserNoChannels/>
                }
                <ChannelScoreDial  
                    currentChannelMessagesScore={currentChannelMessagesScore}
                />
                <OverallScoreDial 
                    allMessagesScore={allMessagesScore}
                />
                <ChannelScoreBarChartPosNeutNeg
                    currentChannelMessagesScore={currentChannelMessagesScore}
                    allMessagesScore={allMessagesScore}
                />
                <ChannelScoreOverTime 
                    scoreTimeseries={scoreTimeseries}
                    timeRange={timeRange}
                />
            </CardContent>
        </Card>
    )
}

export default Analyze;