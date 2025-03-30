import React, {
    useState,
    useEffect
} from "react";
import vader from 'vader-sentiment'
import { useMessagesProviderContext } from "src/contexts/MessagesContext";
import { mockMessages } from "mocks/mockMessages";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent, 
    CardFooter 
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

const OverallScoreDial:React.FC = () => {

    type SentimentScore = {
        compound: number;
        pos: number;
        neu: number;
        neg: number;
    };

    const { messages } = useMessagesProviderContext()

    const chartConfig = {
        allMessagesScore: {
        label: "All Channels Average Sentiment",
    },
    } satisfies ChartConfig
    
    const [allMessagesScore, setallMessagesScore] = useState<SentimentScore | null>(null)
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getAllMessagesScore = () => {
            const input = mockMessages.map((message) => {
                return message.text
            })
            .join()
            const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);
            setallMessagesScore(intensity)
            setLoading(false)
        }
        getAllMessagesScore()
    }, [messages])

    loading === true &&
    <Loading/>

    return(
        <Card className="bg-primary text-secondary p-4 shadow-lg size-[300px]">
            <CardHeader>
                <CardTitle>
                    All Channels Avg Vibe
                </CardTitle>
            </CardHeader>
            {allMessagesScore !== null && (
                <CardContent className="flex flex-col items-center bg-primary">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square h-[150px] bg-primary"
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
                            innerRadius={60}
                            outerRadius={90}
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
                                        {allMessagesScore.compound.toLocaleString()}
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
                                content={<ChartTooltipContent hideLabel />}
                                cursor={false}
                                defaultIndex={1}
                            />
                        </RadialBarChart>
                        </ChartContainer>
                </CardContent>
            )}
        </Card>
    )
}

export default OverallScoreDial;