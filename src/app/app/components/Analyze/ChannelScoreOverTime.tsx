'use client';

import React from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@radix-ui/react-avatar";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription,
    CardContent, 
} from "@/components/components/ui/card";
import { 
    CartesianGrid, 
    Line, 
    LineChart, 
    XAxis,
    YAxis
} from "recharts"
  import { 
    ChartConfig, 
    ChartContainer,
    ChartTooltip,
} from "@/components/components/ui/chart"

type TimeFrame = 'all' | '1y' | '6m' | '3m' | '30d' | '7d' | '1d';

interface IChannelScoreDial{
    scoreTimeseries: null | SentimentScoresTimeseries[];
    timeRange: TimeFrame;
}

interface ICustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: SentimentScoresTimeseries }>;
}

const ChannelScoreOverTime:React.FC<IChannelScoreDial> = ({
    scoreTimeseries, 
    timeRange
}) => {

    const { 
        currentChannel, 
        selectedChannelMetadata 
    } = useChannelProviderContext()

    const chartConfig = {
        datetime: { 
            color: "hsl(273 54% 72)"
        }, 
        score: {
        label: `${currentChannel?.name || 'Current Channel'} Vibe Score`,
        color: "hsl(273 54% 72)"
        },
    } satisfies ChartConfig

    // Custom Tooltip Component
    const CustomTooltip = ({ active, payload }: ICustomTooltipProps) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload as SentimentScoresTimeseries; // Full data object
            const date = data.message.timestamp instanceof Date ? data.message.timestamp : new Date(data.message.timestamp);
            const score = `${(data.score * 100).toFixed(2).toString()}%`;
            return (
                <div className="bg-primary text-secondary p-2 rounded shadow font-light">
                    <p>{`Date: ${date.toLocaleDateString()}`}</p>
                    <p>{`Score: ${score}`}</p>
                </div>
            );
        }
        return null;
    };
    
    // Dummy data for empty chart template
    const emptyData = [
        { 
            message: {
            _id: '',
            channel: '',
            account: '',
            text: '',
            timestamp: new Date(0), // Epoch time
            messageTimestampTokenAmount: '0',
            reactions: {},
            replyId: null
          }, 
          score: 0 
        }
    ];

    // Description strings change based on selectors
    const descriptions = {
        'all': `Vibe Scores Over Time`,
        '1y': 'Vibe Scores for the Last Year',
        '6m': 'Vibe Scores for the Last Six Months',
        '3m': 'Vibe Scores for the Last Three Months',
        '30d': 'Vibe Scores for the Last Thirty Days',
        '7d': 'Vibe Scores for the Last Week',
        '1d': 'Vibe Scores for the Last Day',
    }


    return(
        <Card className="bg-primary text-secondary p-4 shadow-lg h-[500px] w-full">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-2 text-center sm:text-left">
                    <CardTitle className="flex flex-row gap-4">
                        {
                            currentChannel &&
                            selectedChannelMetadata &&
                            <div className="flex flex-row gap-2">
                                <Avatar className="size-8">
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
                <CardDescription>
                    {
                        descriptions[timeRange].toString() || ""
                    }
                </CardDescription>
            </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center bg-primary">
                {
                    scoreTimeseries !== null && 
                    scoreTimeseries.length > 0 ?
                    (
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square h-[400px] w-full bg-primary"
                        >
                            <LineChart
                                accessibilityLayer
                                data={scoreTimeseries}
                                margin={{
                                left: 12,
                                right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                dataKey="message.timestamp"
                                tickLine={true}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                />
                                <YAxis
                                    domain={[-1, 1]}  // Fixed Y-axis range from -1 to 1
                                    tickLine={true}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                                />
                                <ChartTooltip
                                cursor={false}
                                content={<CustomTooltip />}
                                />
                                <Line
                                dataKey="score"
                                type="natural"
                                stroke="hsl(273 54% 72)"
                                strokeWidth={4}
                                dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    ) : (
                        <div className="flex flex-col w-full">
                            <ChartContainer
                                config={chartConfig}
                                className="mx-auto aspect-square h-[400px] w-full bg-primary"
                            >
                                    <LineChart
                                        accessibilityLayer
                                        data={emptyData}
                                        margin={{
                                        left: 12,
                                        right: 12,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                        dataKey="message.datetime"
                                        tickLine={true}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                        />
                                        <YAxis
                                            domain={[-1, 1]}  // Fixed Y-axis range from -1 to 1
                                            tickLine={true}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                                        />
                                    </LineChart>
                            </ChartContainer>
                            <div className="relative translate-x-96 bottom-48 text-4xl text-accent w-[50%]">
                                No Data
                            </div>
                        </div>
                    )
                }
            </CardContent>
        </Card>
    )
}

export default ChannelScoreOverTime;