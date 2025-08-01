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
} from "@/components/components/ui/avatar";
import OverallScoreDial from "./OverallScoreDial";
import ChannelScoreDial from "./ChannelScoreDial";
import ChannelScoreBarChartPosNeutNeg from "./ChannelScoreBarChartPosNeutNeg";
import ChannelScoreOverTime from "./ChannelScoreOverTime";
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
import averageScores from "src/lib/averageScores";
import weightTimeseries from "src/lib/weightTimeseries";
import NewUserNoChannels from "../Channels/NewUserNoChannels";
import { Switch } from "@/components/components/ui/switch";
import { Label } from "@/components/components/ui/label";
import { useUserProviderContext } from "src/contexts/UserContext";

const Analyze:React.FC = () => {

    const { currentChannel, selectedChannelMetadata } = useChannelProviderContext()
    const {messages, authorCurrentTokenBalances} = useMessagesProviderContext()
    const { 
        account, 
        followingList, 
        blockedList,
        followFilter,
        setFollowFilter 
    } = useUserProviderContext()

    // filter for follows and blocks
    const [blocksFilter, setBlockssFilter] = useState<boolean>(true)
    const followBlockFilteredMessages = useMemo(() => {
        // make sure thyre not null
        if(messages === null){
            return null
        }
        if(followFilter === false && blocksFilter === false){
            // if both filters are off, return all messages
            return messages

        }
        if(followFilter === true && blocksFilter === false){
            // if only follows filter is on, return messages from follows
            return messages.filter((message) => {
                return(
                    // return the meeages that belong to their account
                    message.account.toString() === account.toString() ||
                    // return mesages if the author is on the following list
                    followingList.includes(message.account.toString())
                )
            })
        }
        if(followFilter === false && blocksFilter === true){
            // if only blocks filter is on, return messages that are not from blocked accounts
            return messages.filter((message) => {
                return(
                    // return the meeages that belong to their account
                    message.account.toString() === account.toString() ||
                    // return mesages if the author is not on the blocked list
                    blockedList.includes(message.account.toString()) === false
                )
            })
        }
        if(followFilter === true && blocksFilter === true){
            // if both filters are on, return messages from follows and not from blocks
            return messages.filter((message) => {
                return(
                    // return the meeages that belong to their account
                    message.account.toString() === account.toString() ||
                    // return mesages if the author is on the following list or not blocked
                    (
                        followingList.includes(message.account.toString()) &&
                        blockedList.includes(message.account.toString()) === false
                    )
                )
            })
        }
        else{
            return null
        }
    }
    , [messages, followFilter, blocksFilter, account, followingList, blockedList])
    
    // filter for date range before weighting
    // toggle mock messages here
    const [timeRange, setTimeRange] = useState<TimeFrame>("all")
    const timeFilteredData = useMemo(() => {
        return followBlockFilteredMessages !== null ?
        timeFilterMessages(followBlockFilteredMessages, timeRange) : 
        null
    },[followBlockFilteredMessages, timeRange])

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

    // get message scores
    // all channels
    const [scores, setScores] = useState<SentimentScore[]>([])
    useEffect(() => {
        const getScores = ():void => {
            if(timeFilteredData !== null){
                const scores: SentimentScore[] = []
                timeFilteredData.forEach((message) => {
                    if (typeof message.text === 'string') {
                        const score = vader.SentimentIntensityAnalyzer.polarity_scores(message.text)
                        if (score && typeof score.compound !== 'undefined') {
                            scores.push(score)
                        }
                    }
                })
                setScores(scores)
            }
        }
        getScores()
    }, [timeFilteredData])
    // current channel
    const [channelScores, setChannelScores] = useState<SentimentScore[]>([])
    useEffect(() => {
        const getChannelScores = ():void => {
            const scores: SentimentScore[] = []
            currentChanneltimeFilteredData.forEach((message) => {
                if (typeof message.text === 'string') {
                    const score = vader.SentimentIntensityAnalyzer.polarity_scores(message.text)
                    if (score && typeof score.compound !== 'undefined') {
                        scores.push(score)
                    }
                }
            })
            setChannelScores(scores)
        }
        getChannelScores()
    }, [currentChanneltimeFilteredData])


    // weight messages
    // all channels
    const [messageWeighting, setMessageWeighting] = useState<Weighting>("unweighted")
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
    // current channel
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
    }, [currentChanneltimeFilteredData, messageWeighting, currentChannel, authorCurrentTokenBalances])
    
    // get scores from filtered and weighted data
    // all messages
    const [allMessagesScore, setAllMessagesScore] = useState<SentimentScore | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const getAllMessagesScore = () => {
            setLoading(true)
            const averagedScores = averageScores(weights, scores)
            setAllMessagesScore(averagedScores)
            setLoading(false)
        }
        getAllMessagesScore()
    }, [scores, weights])

    // get the overall current channel score
    const [currentChannelMessagesScore, setcurrentChannelMessagesScore] = useState<SentimentScore | null>(null)
    useEffect(() => {
        const getCurrentChannelMessagesScore = () => {
            setLoading(true)
            const averagedScores = averageScores(channelWeights, channelScores)
            setcurrentChannelMessagesScore(averagedScores)
            setLoading(false)
        }
        getCurrentChannelMessagesScore()
    }, [channelWeights, channelScores])

    // grab score time series plus message
    const [scoreTimeseries, setScoreTimeseries] = useState<null | SentimentScoresTimeseries[]>(null)
    useEffect(() => {
        const getChannelScoreTimeseries = () => {
            if(
                channelScores.length > 0 &&
                channelWeights.length > 0 &&
                currentChanneltimeFilteredData !== null
            ){
                setLoading(true)
                const timeseriesWeightedScores = weightTimeseries(channelWeights, channelScores)
                const timeseries: SentimentScoresTimeseries[] = channelScores.map((_, index) => {
                    const message = currentChanneltimeFilteredData[index];
                    const weighted = timeseriesWeightedScores[index];
                    if (message && weighted && typeof weighted.compound === 'number') {
                      return {
                        message,
                        score: weighted.compound,
                      };
                    }
                  }).filter((item): item is SentimentScoresTimeseries => item !== undefined);
                setScoreTimeseries(timeseries)
                setLoading(false)
            } else {
                return null
            }
        }
        getChannelScoreTimeseries()
    }, [channelWeights, channelScores, currentChanneltimeFilteredData])

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
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <div className="flex items-center space-x-2">
                        <Switch 
                            id="follows-filter" 
                            className="data-[state=checked]:bg-accent"
                            checked={followFilter} 
                            onCheckedChange={() => setFollowFilter(!followFilter)}
                        />
                        <Label htmlFor="follows-filter">Follows</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch 
                            id="blocks-filter" 
                            className="data-[state=checked]:bg-accent"
                            checked={blocksFilter} 
                            onCheckedChange={() => setBlockssFilter(!blocksFilter)}
                        />
                        <Label htmlFor="blocks-filter">Blocks</Label>
                    </div>
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