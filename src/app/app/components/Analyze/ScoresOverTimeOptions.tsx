'use client';

import React from "react";
import { 
    Tabs, 
    TabsList, 
    TabsTrigger, 
    TabsContent 
} from "@/components/components/ui/tabs";
import ChannelScoreOverTime from "./ChannelScoreOverTime";

type SentimentScoresTimeseries = {
    datetime: Date;
    score: number;
};

interface IChannelScoreDial{
    scoreTimeseries: null | SentimentScoresTimeseries[];
}

const ScoresOverTimeOptions:React.FC<IChannelScoreDial> = ({scoreTimeseries}) => {
    return(
        <Tabs defaultValue="account" className="bg-primary text-secondary p-4 shadow-lg h-[500px] w-full">
        <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="year">Y</TabsTrigger>
            <TabsTrigger value="sixmonth">6M</TabsTrigger>
            <TabsTrigger value="quarter">3M</TabsTrigger>
            <TabsTrigger value="month">1M</TabsTrigger>
            <TabsTrigger value="week">1W</TabsTrigger>
            <TabsTrigger value="day">1D</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <ChannelScoreOverTime scoreTimeseries={scoreTimeseries}/>
            </TabsContent>
            <TabsContent value="year">
                <ChannelScoreOverTime scoreTimeseries={scoreTimeseries}/>
            </TabsContent>
            <TabsContent value="sixmonth">
                <ChannelScoreOverTime scoreTimeseries={scoreTimeseries}/>
            </TabsContent>
            <TabsContent value="quarter">
                <ChannelScoreOverTime scoreTimeseries={scoreTimeseries}/>
            </TabsContent>
            <TabsContent value="month">
                <ChannelScoreOverTime scoreTimeseries={scoreTimeseries}/>
            </TabsContent>
            <TabsContent value="week">
                <ChannelScoreOverTime scoreTimeseries={scoreTimeseries}/>
            </TabsContent>
            <TabsContent value="day">
                <ChannelScoreOverTime scoreTimeseries={scoreTimeseries}/>
            </TabsContent>
        </Tabs>
    )
}

export default ScoresOverTimeOptions;