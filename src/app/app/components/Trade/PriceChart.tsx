'use client';

import React from "react";
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
import useGetPriceChartData from "src/hooks/useGetPriceChartData";
import SellTokenUSDCustomTooltip from "./SellTokenUSDCustomTooltip";


interface IPriceChart {
    buyTokenObject: Token;
    sellTokenObject: Token;
    baseCurrencyUSD: boolean;
    metric: Metric;
    timeRange: TimeFrame;
}

const PriceChart:React.FC<IPriceChart> = ({ 
    buyTokenObject,
    sellTokenObject,
    baseCurrencyUSD,
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

    // grab chart data (may have usd or sell token as base currency)
    const { 
        historicBuyDataUSD, 
        historicDataSellTokenBase 
    } = useGetPriceChartData(
        timeRange, 
        buyTokenObject, 
        sellTokenObject,
    )

    if(historicBuyDataUSD === null) {
        return (
            <div className="mx-auto flex h-[400px] w-full items-center justify-center bg-primary">
                <p className="text-center text-sm text-muted-foreground">
                    Loading chart...
                </p>
            </div>
        )
    }

    if(baseCurrencyUSD === false){
        return(
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-[400px] w-full bg-primary"
            >
                <LineChart
                    accessibilityLayer
                    data={historicBuyDataUSD}
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

    } if(
        baseCurrencyUSD === true && 
        historicDataSellTokenBase !== null
    ){
        return(
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-[400px] w-full bg-primary"
            >
                <LineChart
                    accessibilityLayer
                    data={historicDataSellTokenBase}
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
                    {
                        // if metric is price, show sell token symbol otherwise its the ratio
                        metric === 'price' ?
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={0}
                                tickFormatter={(value) => {
                                    if(value >= 1){
                                        return `${humanReadableNumbers(value.toString())} ${sellTokenObject.symbol}`
                                    } else if(value <= 0.0002){
                                        return `${value.toFixed(6)} ${sellTokenObject.symbol}`
                                    } else {
                                        return `${value.toFixed(4)} ${sellTokenObject.symbol}`
                                    }
                                }}
                                domain={['auto', 'auto']} 
                            /> :
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={0}
                            tickFormatter={(value) => {
                                if(value >= 1){
                                    return `${humanReadableNumbers(value.toString())}`
                                } else if(value <= 0.0002){
                                    return `${value.toFixed(6)}`
                                } else {
                                    return `${value.toFixed(4)}`
                                }
                            }}
                            domain={['auto', 'auto']} 
                        />
                    }
                    <ChartTooltip
                        cursor={false}
                        content={(tooltipProps) => (
                            <SellTokenUSDCustomTooltip 
                                {...tooltipProps}
                                sellTokenObject={sellTokenObject}
                            />
                    )}
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
}

export default PriceChart;