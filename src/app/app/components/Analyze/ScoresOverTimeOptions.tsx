'use client';

import React from "react";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardFooter, 
    CardContent, 
    CardDescription 
} from "@/components/components/ui/card";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@radix-ui/react-avatar";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import ChannelScoreOverTime from "./ChannelScoreOverTime";

type SentimentScoresTimeseries = {
    datetime: Date;
    score: number;
};

interface IChannelScoreDial{
    scoreTimeseries: null | SentimentScoresTimeseries[];
}

const ScoresOverTimeOptions:React.FC<IChannelScoreDial> = ({scoreTimeseries}) => {

    const { currentChannel, selectedChannelMetadata } = useChannelProviderContext()
    return(
        <Card
            className="bg-primary text-secondary p-4 shadow-lg h-[500px] w-full"
        >
            <CardHeader>
                <CardTitle className="flex flex-row gap-4">
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
                    <div>
                        {currentChannel?.name} Vibes Over Time
                    </div>
                    
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center bg-primary">
                <ChannelScoreOverTime scoreTimeseries={scoreTimeseries}/>
            </CardContent>
        </Card>
    )
}

export default ScoresOverTimeOptions;