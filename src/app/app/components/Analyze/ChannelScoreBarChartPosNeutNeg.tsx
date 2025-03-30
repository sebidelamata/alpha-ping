import React, {
    useState,
    useEffect
} from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent, 
} from "@/components/components/ui/card";
import { 
    Area, 
    AreaChart, 
    CartesianGrid, 
    XAxis 
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

interface IChannelScoreBarChartPosNeutNeg{
    currentChannelMessagesScore: null | SentimentScore;
    allMessagesScore: null | SentimentScore;
}

const ChannelScoreBarChartPosNeutNeg:React.FC<IChannelScoreBarChartPosNeutNeg> = ({
    currentChannelMessagesScore,
    allMessagesScore
}) => {

    const { currentChannel } = useChannelProviderContext()

    const chartConfig = {
        currentChannelScore: {
            label: `${currentChannel?.name || 'Current Channel'} Vibes: `,
            color: "hsl(0 0% 100%)",
        },
        allMessagesScore: {
            label: `All Channels Vibes: `,
            color: "hsl(273 54% 72)",
        }
    } satisfies ChartConfig

    const [chartData, setChartData] = useState<{ bias: string; currentChannelScore: string; }[] | null>(null)
    useEffect(() => {
        const getChartData = () => {
            if(
                currentChannelMessagesScore !== null &&
                allMessagesScore !== null
            ){
                const chartData = [
                    {
                        bias: "Negative",
                        currentChannelScore: (currentChannelMessagesScore.neg * 100).toFixed(0).toString(),
                        allMessagesScore: (allMessagesScore.neg * 100).toFixed(0).toString()
                    },
                    {
                        bias: "Neutral",
                        currentChannelScore: (currentChannelMessagesScore.neu * 100).toFixed(0).toString(),
                        allMessagesScore: (allMessagesScore.neu * 100).toFixed(0).toString()
                    },
                    {
                        bias: "Positive",
                        currentChannelScore: (currentChannelMessagesScore.pos * 100).toFixed(0).toString(),
                        allMessagesScore: (allMessagesScore.pos * 100).toFixed(0).toString()
                    }
                ]
                setChartData(chartData)
            }
        }
        getChartData()
    }, [currentChannelMessagesScore, allMessagesScore])

    return(
        <Card className="bg-primary text-secondary p-4 shadow-lg size-[360px]">
            <CardHeader>
                <CardTitle>
                    {currentChannel?.name} Vibe Distribution
                </CardTitle>
            </CardHeader>
            {
                currentChannelMessagesScore !== null && 
                chartData !== null &&
                <CardContent className="flex flex-col items-center bg-primary">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square h-[300px] bg-primary"
                    >
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                            left: 12,
                            right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                            dataKey="bias"
                            tickLine={true}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent/>}/>
                            <defs>
                            <linearGradient id="currentChannelScore" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                offset="5%"
                                stopColor="hsl(0 0% 100%)"
                                stopOpacity={0.8}
                                />
                                <stop
                                offset="95%"
                                stopColor="hsl(0 0% 100%)"
                                stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="allMessagesScore" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                offset="5%"
                                stopColor="hsl(273 54% 72)"
                                stopOpacity={0.8}
                                />
                                <stop
                                offset="95%"
                                stopColor="hsl(273 54% 72)"
                                stopOpacity={0.1}
                                />
                            </linearGradient>
                            </defs>
                            <Area
                            dataKey="currentChannelScore"
                            type="natural"
                            fill="url(#currentChannelScore)"
                            fillOpacity={0.4}
                            stroke="hsl(0 0% 100%)"
                            />
                            <Area
                            dataKey="allMessagesScore"
                            type="natural"
                            fill="url(#allMessagesScore)"
                            fillOpacity={0.4}
                            stroke="hsl(273 54% 72)"
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            }
        </Card>
    )
}

export default ChannelScoreBarChartPosNeutNeg;