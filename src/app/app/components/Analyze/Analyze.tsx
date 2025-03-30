'use client';

import React, {
    useEffect,
    useState
} from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent, 
    CardFooter 
} from "@/components/components/ui/card";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@radix-ui/react-avatar";
import OverallScoreDial from "./OverallScoreDial";
import ChannelScoreDial from "./ChannelScoreDial";
import ChannelScoreBarChartPosNeutNeg from "./ChannelScoreBarChartPosNeutNeg";

const Analyze:React.FC = () => {

    const { currentChannel, selectedChannelMetadata } = useChannelProviderContext()

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
                className='flex flex-row h-full w-full'
            >
                <ChannelScoreDial/>
                <OverallScoreDial/>
                <ChannelScoreBarChartPosNeutNeg/>
            </CardContent>
        </Card>
    )
}

export default Analyze;