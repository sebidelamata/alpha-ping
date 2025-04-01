'use client';

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

    return(
        <Card className="bg-primary text-secondary p-4 shadow-lg h-[500px] w-full">
            <CardHeader>
                <CardTitle>
                    {
                        currentChannel &&
                        selectedChannelMetadata &&
                        <div className="flex flex-row gap-2">
                            <Avatar className="size-10">
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
            </CardHeader>
            {scoreTimeseries !== null && (
                <CardContent className="flex flex-col items-center bg-primary">
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
                            strokeWidth={2}
                            dot={false}
                            />
                        </LineChart>
                        </ChartContainer>
                </CardContent>
            )}
        </Card>
    )
}

export default ChannelScoreOverTime;