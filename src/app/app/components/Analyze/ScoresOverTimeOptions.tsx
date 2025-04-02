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

    // get different lengths of data 
    const yearData = (scoreTimeseries:SentimentScoresTimeseries[] | null) => {
        if(scoreTimeseries !== null){
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
            const filteredData = scoreTimeseries?.filter(entry => 
                new Date(entry.datetime) >= oneYearAgo
            );
            return filteredData as SentimentScoresTimeseries[]
        } else {
            return null
        }
    }

    const halfYearData = (scoreTimeseries:SentimentScoresTimeseries[] | null) => {
        if(scoreTimeseries !== null){
            const oneYearAgo = new Date();
            oneYearAgo.setMonth(oneYearAgo.getMonth() - 6);
    
            const filteredData = scoreTimeseries?.filter(entry => 
                new Date(entry.datetime) >= oneYearAgo
            );
            return filteredData as SentimentScoresTimeseries[]
        } else {
            return null
        }
    }

    const quarterData = (scoreTimeseries:SentimentScoresTimeseries[] | null) => {
        if(scoreTimeseries !== null){
            const oneYearAgo = new Date();
            oneYearAgo.setMonth(oneYearAgo.getMonth() - 3);
    
            const filteredData = scoreTimeseries?.filter(entry => 
                new Date(entry.datetime) >= oneYearAgo
            );
            return filteredData as SentimentScoresTimeseries[]
        } else {
            return null
        }
    }
    
    const monthData = (scoreTimeseries:SentimentScoresTimeseries[] | null) => {
        if(scoreTimeseries !== null){
            const oneYearAgo = new Date();
            oneYearAgo.setMonth(oneYearAgo.getMonth() - 1);
    
            const filteredData = scoreTimeseries?.filter(entry => 
                new Date(entry.datetime) >= oneYearAgo
            );
            return filteredData as SentimentScoresTimeseries[]
        } else {
            return null
        }
    }

    const weekData = (scoreTimeseries:SentimentScoresTimeseries[] | null) => {
        if(scoreTimeseries !== null){
            const oneYearAgo = new Date();
            oneYearAgo.setDate(oneYearAgo.getDate() - 7);
    
            const filteredData = scoreTimeseries?.filter(entry => 
                new Date(entry.datetime) >= oneYearAgo
            );
            return filteredData as SentimentScoresTimeseries[]
        } else {
            return null
        }
    }

    const dayData = (scoreTimeseries:SentimentScoresTimeseries[] | null) => {
        if(scoreTimeseries !== null){
            const oneYearAgo = new Date();
            oneYearAgo.setDate(oneYearAgo.getDate() - 1);
    
            const filteredData = scoreTimeseries?.filter(entry => 
                new Date(entry.datetime) >= oneYearAgo
            );
            return filteredData as SentimentScoresTimeseries[]
        } else {
            return null
        }
    }

    return(
        <Tabs defaultValue="all" className="bg-primary text-secondary p-4 shadow-lg h-[500px] w-full">
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
                <ChannelScoreOverTime scoreTimeseries={yearData(scoreTimeseries)}/>
            </TabsContent>
            <TabsContent value="sixmonth">
                <ChannelScoreOverTime scoreTimeseries={halfYearData(scoreTimeseries)}/>
            </TabsContent>
            <TabsContent value="quarter">
                <ChannelScoreOverTime scoreTimeseries={quarterData(scoreTimeseries)}/>
            </TabsContent>
            <TabsContent value="month">
                <ChannelScoreOverTime scoreTimeseries={monthData(scoreTimeseries)}/>
            </TabsContent>
            <TabsContent value="week">
                <ChannelScoreOverTime scoreTimeseries={weekData(scoreTimeseries)}/>
            </TabsContent>
            <TabsContent value="day">
                <ChannelScoreOverTime scoreTimeseries={dayData(scoreTimeseries)}/>
            </TabsContent>
        </Tabs>
    )
}

export default ScoresOverTimeOptions;