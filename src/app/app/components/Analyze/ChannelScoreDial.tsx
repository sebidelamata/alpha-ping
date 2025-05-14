'use client';

import React from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
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

interface IChannelScoreDial{
    currentChannelMessagesScore: null | SentimentScore;
}

const ChannelScoreDial:React.FC<IChannelScoreDial> = ({currentChannelMessagesScore}) => {

    const { currentChannel } = useChannelProviderContext()

    const chartConfig = {
        currentChannelMessagesScore: {
        label: `${currentChannel?.name || 'Current Channel'} Vibe Score`,
    },
    } satisfies ChartConfig

    return(
        <Card className="bg-primary text-secondary p-4 shadow-lg size-[360px]">
            <CardHeader className="h-[80px]">
                <CardTitle>
                    {currentChannel?.name} Avg Vibe
                </CardTitle>
            </CardHeader>
                <CardContent className="flex flex-col items-center bg-primary">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square h-[280px] bg-primary"
                    >
                        <RadialBarChart
                            data={
                                [
                                    { 
                                        currentChannelMessagesScore: currentChannelMessagesScore !== null ? 
                                            currentChannelMessagesScore.compound : 
                                            null, 
                                        fill: "hsl(0 0% 100%)",
                                    },
                                ]
                            }
                            startAngle={0}
                            endAngle={
                                currentChannelMessagesScore !== null ?
                                    ((currentChannelMessagesScore.compound + 1) / 2) * 360 :
                                    180
                            }
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
                                dataKey="currentChannelMessagesScore" 
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
                                            {
                                                currentChannelMessagesScore !== null ?
                                                    `${(currentChannelMessagesScore.compound * 100).toFixed(0).toLocaleString()}%`:
                                                    'NA'
                                            }
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
                                        { value !== null ?
                                            (value as number * 100).toFixed(2) : 
                                            'NA'
                                        }
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
        </Card>
    )
}

export default ChannelScoreDial;