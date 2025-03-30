import React, {
    useState,
    useEffect
} from "react";
import vader from 'vader-sentiment'
import { useMessagesProviderContext } from "src/contexts/MessagesContext";
import { mockMessages } from "mocks/mockMessages";
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
import Loading from "../Loading";

const ChannelScoreDial:React.FC = () => {

    type SentimentScore = {
        compound: number;
        pos: number;
        neu: number;
        neg: number;
    };

    const { currentChannel } = useChannelProviderContext()
    const { messages } = useMessagesProviderContext()

    const chartConfig = {
        allMessagesScore: {
        label: `${currentChannel?.name || 'Current Channel'} Average Sentiment`,
    },
    } satisfies ChartConfig
    
    const [currentChannelMessagesScore, setcurrentChannelMessagesScore] = useState<SentimentScore | null>(null)
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getAllMessagesScore = () => {
            const input = mockMessages.map((message) => {
                console.log(message.channel)
                console.log(currentChannel?.id)
                if(message.channel.toString() === currentChannel?.id.toString()){
                    return message.text
                }
            })
            .join()
            const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);
            setcurrentChannelMessagesScore(intensity)
            setLoading(false)
        }
        getAllMessagesScore()
    }, [messages, currentChannel])

    loading === true &&
    <Loading/>

    return(
        <Card className="bg-primary text-secondary p-4 shadow-lg size-[300px]">
            <CardHeader>
                <CardTitle>
                    {currentChannel?.name} Avg Vibe
                </CardTitle>
            </CardHeader>
            {currentChannelMessagesScore !== null && (
                <CardContent className="flex flex-col items-center bg-primary">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square h-[175px] bg-primary"
                    >
                        <RadialBarChart
                            data={
                                [
                                    { allMessagesScore: currentChannelMessagesScore.compound, 
                                        fill: "hsl(273 54% 72)",
                                    },
                                ]
                            }
                            startAngle={0}
                            endAngle={((currentChannelMessagesScore.compound + 1) / 2) * 360}
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
                                background
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
                                        {(currentChannelMessagesScore.compound * 100).toFixed(0).toLocaleString()}%
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
                                    <div className="flex min-w-[130px] items-center text-xs text-secondary">
                                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                                        name}
                                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-accent">
                                        {(value as number * 100).toFixed(2)}
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

export default ChannelScoreDial;