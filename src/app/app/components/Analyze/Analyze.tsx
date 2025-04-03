'use client';

import React, {
    useEffect,
    useState
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

type SentimentScore = {
    compound: number;
    pos: number;
    neu: number;
    neg: number;
};

type SentimentScoresTimeseries = {
    datetime: Date;
    score: number;
};

const Analyze:React.FC = () => {

    const { currentChannel, selectedChannelMetadata } = useChannelProviderContext()
    const {messages} = useMessagesProviderContext()

    const [allMessagesScore, setallMessagesScore] = useState<SentimentScore | null>(null)
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getAllMessagesScore = () => {
            setLoading(true)
            const input = mockMessages.map((message) => {
                return message.text
            })
            .join()
            const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);
            setallMessagesScore(intensity)
            setLoading(false)
        }
        getAllMessagesScore()
    }, [messages, currentChannel])

    const [currentChannelMessagesScore, setcurrentChannelMessagesScore] = useState<SentimentScore | null>(null)
    
    useEffect(() => {
        const getCurrentChannelMessagesScore = () => {
            setLoading(true)
            const input = mockMessages.map((message) => {
                if(message.channel.toString() === currentChannel?.id.toString()){
                    return message.text
                }
            })
            .join()
            const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);
            setcurrentChannelMessagesScore(intensity)
            setLoading(false)
        }
        getCurrentChannelMessagesScore()
    }, [messages, currentChannel])

    const [scoreTimeseries, setScoreTimeseries] = useState<null | SentimentScoresTimeseries[]>(null)
    useEffect(() => {
        const getChannelScoreTimeseries = () => {
            setLoading(true)
            const input = mockMessages.map((message) => {
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
                                score: vader.SentimentIntensityAnalyzer.polarity_scores(message.text).compound
                            } as SentimentScoresTimeseries
                        )
                    }
                })
                .filter((item): item is SentimentScoresTimeseries => item !== undefined); 
            setScoreTimeseries(intensity)
            setLoading(false)
        }
        getChannelScoreTimeseries()
    }, [messages, currentChannel])

    loading === true &&
        <Loading/>

    return(
        <Card
        className="flex flex-col w-full h-full bg-primary text-secondary overflow-clip"
        onWheel={(e) => {
        e.stopPropagation(); 
      }}
        >
            <CardHeader>
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
                />
            </CardContent>
        </Card>
    )
}

export default Analyze;