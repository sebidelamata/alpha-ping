import React from "react";
import useGetCoinGeckoHistoricData from "src/hooks/useGetCoinGeckoHistoricData";
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
import CustomTooltip from "../Analyze/CustomTooltip";
import humanReadableNumbers from "src/lib/humanReadableNumbers";

interface IPriceChart {
    buyTokenObject: Token;
    metric: Metric;
    timeRange: TimeFrame;
}

const PriceChart:React.FC<IPriceChart> = ({ 
    buyTokenObject,
    metric,
    timeRange 
}) => {

    const chartConfig = {
        time: { 
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

    // grab historic data from coingecko
    const { historicPriceData } = useGetCoinGeckoHistoricData(
        timeRange, 
        buyTokenObject !== null && 
        buyTokenObject !== undefined ? 
        buyTokenObject.address : 
        ""
    )
    console.log("Historic Price Data:", historicPriceData)

    if(historicPriceData === null) {
        return (
            <div className="mx-auto flex h-[400px] w-full items-center justify-center bg-primary">
                <p className="text-center text-sm text-muted-foreground">
                    Loading chart...
                </p>
            </div>
        )
    }

    return(
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[400px] w-full bg-primary"
        >
            <LineChart
                accessibilityLayer
                data={historicPriceData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="time"
                    tickLine={true}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                        if(timeRange === '1d') {
                            return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        }
                        else{
                            return new Date(value).toLocaleDateString();
                        }
                    }}
                />
                <YAxis
                    yAxisId="left"
                    orientation="left"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={0}
                    tickFormatter={(value) => `$${humanReadableNumbers(value.toString())}`}
                    domain={['auto', 'auto']} 
                />
                <ChartTooltip
                    cursor={false}
                    content={<CustomTooltip />}
                />
                <Line
                    yAxisId="left"
                    dataKey={
                        metric === 'price'
                            ? 'price'
                            : metric === 'mcap'
                            ? 'market_cap'
                            : 'volume'
                    }
                    type="natural"
                    stroke="hsl(0 0% 100%)"
                    strokeWidth={3}
                    dot={false}
                    connectNulls={true}
                />
            </LineChart>
        </ChartContainer>
    )
}

export default PriceChart;