'use client';

import { useChannelProviderContext } from "src/contexts/ChannelContext";
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

    const { currentChannel } = useChannelProviderContext()

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
        scoreTimeseries !== null &&
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
    )
}

export default ChannelScoreOverTime;