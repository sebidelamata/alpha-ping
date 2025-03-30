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
import OverallScoreDial from "./OverallScoreDial";

const Analyze:React.FC = () => {

    const { currentChannel } = useChannelProviderContext()

    return(
        <Card
        className="flex flex-col w-full h-full bg-primary text-secondary overflow-clip"
        onWheel={(e) => {
        e.stopPropagation(); 
      }}
        >
            <CardHeader>
                <CardTitle className="text-3xl">
                    Analyze {currentChannel?.name || ""}
                </CardTitle>
            </CardHeader>
            <CardContent
                className='flex-1 h-full w-full'
            >
                <OverallScoreDial/>
            </CardContent>
        </Card>
    )
}

export default Analyze;