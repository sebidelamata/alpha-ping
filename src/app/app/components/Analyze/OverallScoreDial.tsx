'use client';

import React, {
    useState,
    useEffect
} from "react";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent, 
} from "@/components/components/ui/card";
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
  } from "recharts"
  import { 
    ChartConfig, 
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent, 
} from "@/components/components/ui/chart"

type SentimentScore = {
    compound: number;
    pos: number;
    neu: number;
    neg: number;
};
interface IOverallScoreDial{
    allMessagesScore: null | SentimentScore;
}

const OverallScoreDial:React.FC<IOverallScoreDial> = ({allMessagesScore}) => {

    const chartConfig = {
        allMessagesScore: {
        label: "All Channels Average Vibe",
    },
    } satisfies ChartConfig
    

    return(
        <Card className="bg-primary text-secondary p-4 shadow-lg size-[360px]">
            <CardHeader className="h-[80px]">
                <CardTitle>
                    All Channels Avg Vibe
                </CardTitle>
            </CardHeader>
            {allMessagesScore !== null && (
                <CardContent className="flex flex-col items-center bg-primary">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square h-[280px] bg-primary"
                    >
                        <RadialBarChart
                            data={
                                [
                                    { allMessagesScore: allMessagesScore.compound, 
                                        fill: "hsl(273 54% 72)",
                                    },
                                ]
                            }
                            startAngle={0}
                            endAngle={((allMessagesScore.compound + 1) / 2) * 360}
                            innerRadius={75}
                            outerRadius={105}
                        >
                            <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-primary last:fill-primary"
                            polarRadius={[86, 74]}
                            />
                            <RadialBar 
                                dataKey="allMessagesScore" 
                                cornerRadius={10} 
                            />
                            <PolarRadiusAxis 
                                tick={false} 
                                tickLine={false} 
                                axisLine={false}
                            >
                            <Label
                                content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-secondary text-4xl font-bold"
                                        >
                                        {(allMessagesScore.compound * 100).toFixed(0).toLocaleString()}%
                                        </tspan>
                                        <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 24}
                                        className="fill-secondary"
                                        >
                                        Vibe Score
                                        </tspan>
                                    </text>
                                    )
                                }
                                }}
                            />
                            </PolarRadiusAxis>
                            <ChartTooltip
                                content={<ChartTooltipContent hideLabel/>}
                                cursor={false}
                                defaultIndex={1}
                                formatter={(value, name) => (
                                    <div className="flex min-w-[130px] items-center text-xs text-secondary gap-1">
                                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                                        name}
                                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-accent">
                                        {(value as number * 100).toFixed(2).toString()}
                                        <span className="font-normal text-accent">
                                          %
                                        </span>
                                      </div>
                                    </div>
                                  )}
                            />
                        </RadialBarChart>
                        </ChartContainer>
                </CardContent>
            )}
        </Card>
    )
}

export default OverallScoreDial;