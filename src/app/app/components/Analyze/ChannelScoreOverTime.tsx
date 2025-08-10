'use client';

import React, { useState } from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
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
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem, 
    DropdownMenuContent
} from "@/components/components/ui/dropdown-menu";
import { Button } from "@/components/components/ui/button";
import CustomTooltip from "./CustomTooltip";

type TimeFrame = 'all' | '1y' | '6m' | '3m' | '30d' | '7d' | '1d';
type Metric = 'none' | 'price' | 'mcap' | 'volume';

interface IChannelScoreDial{
    scoreTimeseries: null | SentimentScoresTimeseries[];
    timeRange: TimeFrame;
}

const ChannelScoreOverTime: React.FC<IChannelScoreDial> = ({
    scoreTimeseries, 
    timeRange
}) => {

    const { 
        currentChannel, 
        selectedChannelMetadata 
    } = useChannelProviderContext()

    const [metric, setMetric] = useState<Metric>('none');

    const chartConfig = {
        time: { 
            color: "hsl(273 54% 72)"
        }, 
        score: {
            label: `${currentChannel?.name || 'Current Channel'} Vibe Score`,
            color: "hsl(273 54% 72)"
        },
        price: {
            label: "Price",
            color: "hsl(0 0% 100%)"
        },
        market_cap: {
            label: "Market Cap",
            color: "hsl(0 0% 100%)"
        },
        volume: {
            label: "Volume", 
            color: "hsl(0 0% 100%)"
        }
    } satisfies ChartConfig
    
    // Dummy data for empty chart template
    const emptyData = [
        { 
            message: {
                _id: '',
                channel: '',
                account: '',
                text: '',
                timestamp: new Date(0), 
                messageTimestampTokenAmount: '0',
                reactions: {},
                replyId: null
            }, 
            score: 0,
            time: new Date(0).getTime() 
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    className="w-32 h-8 justify-between"
                                >+ Market Data</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-primary text-secondary">
                                <DropdownMenuRadioGroup value={metric} onValueChange={(m) => setMetric(m as Metric)}>
                                    <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="price">Price</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="mcap">MCap</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="volume">Volume</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardTitle>
                    <CardDescription>
                        {descriptions[timeRange] || ""}
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
                                <XAxis
                                    dataKey="time"
                                    tickLine={true}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<CustomTooltip />}
                                />
                                <Line
                                    dataKey="score"
                                    type="natural"
                                    stroke="hsl(273 54% 72)"
                                    strokeWidth={3}
                                    dot={false}
                                />
                                {
                                    metric !== 'none' && (
                                        <Line
                                            dataKey={
                                                metric === 'price'
                                                    ? 'price'
                                                    : metric === 'mcap'
                                                    ? 'market_cap'
                                                    : 'volume'
                                            }
                                            type="monotone"
                                            stroke="hsl(0 0% 100%)"
                                            strokeWidth={3}
                                            dot={false}
                                        />
                                    )
                                }
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
                                        domain={[-1, 1]}
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