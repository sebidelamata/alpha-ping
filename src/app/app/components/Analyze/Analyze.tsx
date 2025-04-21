'use client';

import React, {
    useEffect,
    useState,
    useMemo,
} from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useMessagesProviderContext } from "src/contexts/MessagesContext";
import vader from 'vader-sentiment'
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent
} from "@/components/components/ui/card";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@radix-ui/react-avatar";
import OverallScoreDial from "./OverallScoreDial";
import ChannelScoreDial from "./ChannelScoreDial";
import ChannelScoreBarChartPosNeutNeg from "./ChannelScoreBarChartPosNeutNeg";
import ChannelScoreOverTime from "./ChannelScoreOverTime";
import { mockMessages } from "mocks/mockMessages";
import Loading from "../Loading";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/components/ui/select";
import timeFilterMessages from "src/lib/timeFilterMessages";
import weightAllMessages from "src/lib/weightAllMessages";
import weightChannelMessages from "src/lib/weightChannelMessages";

type SentimentScoresTimeseries = {
    datetime: Date;
    score: number;
    postBalance: string;
};


const Analyze:React.FC = () => {

    const { currentChannel, selectedChannelMetadata } = useChannelProviderContext()
    const {messages} = useMessagesProviderContext()

    // filter for date range before weighting
    const [timeRange, setTimeRange] = useState<TimeFrame>("all")
    const timeFilteredData = useMemo(() => {
        return mockMessages !== null ?
        timeFilterMessages(mockMessages, timeRange) : 
        null
    },[mockMessages, timeRange])

    // get message scores
    const [scores, setScores] = useState<SentimentScore[]>([])
    useEffect(() => {
        const getScores = ():void => {
            const scores:SentimentScore[] = []
            if(timeFilteredData !== null){
                timeFilteredData.map((message) => {
                    scores.push(
                        vader.SentimentIntensityAnalyzer.polarity_scores(message.text) 
                    )
                })
            }
            console.log(scores)
            setScores(scores)
        }
        getScores()
    }, [timeFilteredData])


    // weight messages
    // all channels
    const [messageWeighting, setMessageWeighting] = useState<Weighting>("unweighted")
    const [weights, setWeights] = useState<number[]>([])
    useEffect(() => {
        const weights = timeFilteredData !== null ?
            weightAllMessages(timeFilteredData, messageWeighting) :
            []
        setWeights(weights)
    }, [timeFilteredData, messageWeighting])
    // current channel
    const [channelWeights, setChannelWeights] = useState<number[]>([])
    useEffect(() => {
        const weights = timeFilteredData !== null &&
            currentChannel !== null ?
            weightChannelMessages(timeFilteredData, messageWeighting, currentChannel) :
            []
        setChannelWeights(weights)
    }, [timeFilteredData, messageWeighting, currentChannel])
    
    // get scores from filtered and weighted data
    // all messages
    const [allMessagesScore, setAllMessagesScore] = useState<SentimentScore | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const getAllMessagesScore = () => {
            if(weightedData !== null){
                setLoading(true)
                const input = weightedData.map((message) => {
                    return message.text
                })
                .join()
                if(input.length > 0){
                    const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);
                    setAllMessagesScore(intensity)
                    setLoading(false)
                }else{
                    setLoading(true)
                    setAllMessagesScore(null)
                    setLoading(false)
                }
            }
        }
        getAllMessagesScore()
    }, [weightedData])

    // get the overall current channel score
    const [currentChannelMessagesScore, setcurrentChannelMessagesScore] = useState<SentimentScore | null>(null)
    useEffect(() => {
        const getCurrentChannelMessagesScore = () => {
            if(weightedChannelData !== null){
                setLoading(true)
                const input = weightedChannelData.map((message) => {
                    if(message.channel.toString() === currentChannel?.id.toString()){
                        return message.text
                    }
                })
                .join()
                if(input.length > 0){
                    const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);
                    setcurrentChannelMessagesScore(intensity)
                    setLoading(false)
                }else{
                    setLoading(true)
                    setcurrentChannelMessagesScore(null)
                    setLoading(false)
                }
            }
        }
        getCurrentChannelMessagesScore()
    }, [weightedChannelData, currentChannel])

    const [scoreTimeseries, setScoreTimeseries] = useState<null | SentimentScoresTimeseries[]>(null)
    useEffect(() => {
        const getChannelScoreTimeseries = () => {
            if(weightedChannelData !== null){
                setLoading(true)
                const input = weightedChannelData.map((message) => {
                    if(message.channel.toString() === currentChannel?.id.toString()){
                        return message
                    }
                })
                const intensity: SentimentScoresTimeseries[] = input
                    .map((message) => {
                        if(message !== null && message !== undefined){
                            return(
                                {
                                    datetime: message.timestamp,
                                    score: vader.SentimentIntensityAnalyzer.polarity_scores(message.text).compound,
                                    postBalance: message.messageTimestampTokenAmount
                                } as SentimentScoresTimeseries
                            )
                        }
                    })
                    .filter((item): item is SentimentScoresTimeseries => item !== undefined); 
                setScoreTimeseries(intensity)
                setLoading(false)
            } else {
                return null
            }
        }
        getChannelScoreTimeseries()
    }, [weightedChannelData, currentChannel])

    loading === true &&
        <Loading/>

    return(
        <Card
        className="flex flex-col w-full h-full bg-primary text-secondary overflow-hidden"
        onWheel={(e) => {
        e.stopPropagation(); 
      }}
        >
            <CardHeader className="sticky top-0 z-10 flex flex-row justify-between gap-2">
                <div className="flex flex-col gap-2">
                    <CardTitle className="flex flex-row text-3xl gap-4">
                        Analyze {currentChannel?.name || ""}
                        {
                            currentChannel &&
                            selectedChannelMetadata &&
                            <div className="flex flex-row gap-2">
                                <Avatar className="size-10">
                                    <AvatarImage
                                        src={
                                            selectedChannelMetadata.logo !== '' ? 
                                            selectedChannelMetadata.logo : 
                                            (
                                                currentChannel.tokenType === 'ERC20' ?
                                                '/erc20Icon.svg' :
                                                '/blank_nft.svg'
                                            )
                                        }
                                        loading="lazy"
                                        alt="AlphaPING Logo"
                                    />
                                    <AvatarFallback>AP</AvatarFallback>
                                </Avatar>
                            </div>
                        }
                    </CardTitle>
                    <CardDescription>
                        Dive into user sentiments, drill down to your follow list.
                    </CardDescription>
                </div>
                <div className="flex flex-row justify-start gap-4">
                    <Select 
                        value={messageWeighting} 
                        onValueChange={(value: string) => setMessageWeighting(value as Weighting)}
                    >
                        <SelectTrigger
                            className="w-[220px] rounded-lg sm:ml-auto"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Unweighted" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="unweighted" className="rounded-lg">
                                Unweighted
                            </SelectItem>
                            <SelectItem value="post" className="rounded-lg">
                                Post Balance Weighted
                            </SelectItem>
                            <SelectItem value="current" className="rounded-lg">
                                Current Balance Weighted
                            </SelectItem>
                            <SelectItem value="delta" className="rounded-lg">
                                Balance Delta Weighted
                                </SelectItem>
                            <SelectItem value="inverse" className="rounded-lg">
                                Inverse Balance Weighted
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Select 
                        value={timeRange} 
                        onValueChange={(value: string) => setTimeRange(value as TimeFrame)}
                    >
                        <SelectTrigger
                            className="w-[160px] rounded-lg sm:ml-auto"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all" className="rounded-lg">
                                All Time
                            </SelectItem>
                            <SelectItem value="1y" className="rounded-lg">
                                Last Year
                            </SelectItem>
                            <SelectItem value="6m" className="rounded-lg">
                                Last 6 months
                            </SelectItem>
                            <SelectItem value="3m" className="rounded-lg">
                                Last 3 months
                                </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                            </SelectItem>
                                <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent
                className='flex flex-row flex-wrap h-full w-full overflow-y-auto'
            >
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