'use client';

import React, {
    useState 
} from "react";
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
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/components/ui/select";

type SentimentScoresTimeseries = {
    datetime: Date;
    score: number;
};

interface IChannelScoreDial{
    scoreTimeseries: null | SentimentScoresTimeseries[];
}

interface ICustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: SentimentScoresTimeseries }>;
}

const ChannelScoreOverTime:React.FC<IChannelScoreDial> = ({scoreTimeseries}) => {

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
            const date = data.datetime instanceof Date ? data.datetime : new Date(data.datetime);
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

    const [timeRange, setTimeRange] = useState<string>("3m")
    const filteredData = scoreTimeseries !== null ?
        scoreTimeseries.filter((item) => {
            const date = new Date(item.datetime)
            const referenceDate = new Date()
            let daysToSubtract = 90
            if (timeRange === "1y") {
                daysToSubtract = 365
            } else if(timeRange === "6m"){
                daysToSubtract = 180
            } else if (timeRange === "30d") {
                daysToSubtract = 30
            } else if (timeRange === "7d"){
                daysToSubtract = 7
            } else if(timeRange === "all"){
                return scoreTimeseries
            }
            const startDate = new Date(referenceDate)
            startDate.setDate(startDate.getDate() - daysToSubtract)
            return date >= startDate
        }) :
        scoreTimeseries
    
    // Dummy data for empty chart template
    const emptyData = [
        { datetime: new Date(), score: 0 }
    ];


    return(
        <Card className="bg-primary text-secondary p-4 shadow-lg h-[500px] w-full">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
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
                Showing total visitors for the last 3 months
            </CardDescription>
            </div>
            <Select 
                value={timeRange} 
                onValueChange={setTimeRange}
            >
            <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label="Select a value"
            >
                <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="all" className="rounded-lg">
                    All
                </SelectItem>
                <SelectItem value="1y" className="rounded-lg">
                    Last Year
                </SelectItem>
                <SelectItem value="6m" className="rounded-lg">
                    Last 6 months
                </SelectItem>
                <SelectItem value="3m" className="rounded-lg">
                    Last 3 months
                    </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                    Last 30 days
                </SelectItem>
                    <SelectItem value="7d" className="rounded-lg">
                    Last 7 days
                </SelectItem>
            </SelectContent>
            </Select>
        </CardHeader>
                <CardContent className="flex flex-col items-center bg-primary">
                    {
                        filteredData !== null && 
                        filteredData.length > 0 ?
                        (
                            <ChartContainer
                                config={chartConfig}
                                className="mx-auto aspect-square h-[400px] w-full bg-primary"
                            >
                                <LineChart
                                    accessibilityLayer
                                    data={filteredData}
                                    margin={{
                                    left: 12,
                                    right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                    dataKey="datetime"
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
                                    dataKey="datetime"
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
                                    />
                                </LineChart>
                                <div className="relative left-[50%] bottom-[50%] text-4xl text-accent">
                                    No Data
                                </div>
                            </ChartContainer>
                        )
                    }
                </CardContent>
        </Card>
    )
}

export default ChannelScoreOverTime;