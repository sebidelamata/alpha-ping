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
import { Badge } from "@/components/components/ui/badge";


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
        const percentChange = historicBuyDataUSD.length > 1 ?
            ((historicBuyDataUSD[historicBuyDataUSD.length - 1].price - historicBuyDataUSD[0].price) / historicBuyDataUSD[0].price) * 100
            : 0

        const volumeChange = historicBuyDataUSD.length > 1 ?
            ((historicBuyDataUSD[historicBuyDataUSD.length - 1].volume - historicBuyDataUSD[0].volume) / historicBuyDataUSD[0].volume) * 100
            : 0
        
        return(
            <>
                <div className="flex flex-row gap-4 items-center">
                    {
                        historicBuyDataUSD.length > 0 &&
                        <div className="text-3xl text-secondary">
                            {
                                `$${
                                    Number(historicBuyDataUSD[historicBuyDataUSD.length - 1].price).toLocaleString('en-US', {
                                        minimumFractionDigits: Number(historicBuyDataUSD[historicBuyDataUSD.length - 1].price) <= 0.01 ? 10 : 
                                                            Number(historicBuyDataUSD[historicBuyDataUSD.length - 1].price) <= 1 ? 6 : 2,
                                        maximumFractionDigits: Number(historicBuyDataUSD[historicBuyDataUSD.length - 1].price) <= 0.01 ? 10 : 
                                                            Number(historicBuyDataUSD[historicBuyDataUSD.length - 1].price) <= 1 ? 6 : 2
                                    })
                                }`
                            }
                        </div>
                    }
                    {
                        historicBuyDataUSD.length > 0 &&
                        <div className={
                                Number(percentChange) < 0 ? 
                                `text-xl text-red-500 w-24` :
                                `text-xl text-green-500 w-24`
                            }
                        >
                            {
                                    Number(percentChange) < 0 ? 
                                    `▼ ${
                                        Number(percentChange).toFixed(2)
                                    }%` :
                                    `▲ ${
                                        Number(percentChange).toFixed(2)
                                    }%`
                            }
                        </div>
                    }
                    {
                        historicBuyDataUSD.length > 0 &&
                        <Badge variant={"secondary"}>
                            {
                                `MCap $${
                                    humanReadableNumbers((historicBuyDataUSD[historicBuyDataUSD.length - 1].market_cap).toString())
                                }`
                            }
                        </Badge>
                    }
                    {
                        historicBuyDataUSD.length > 0 &&
                        <Badge 
                            variant={"default"} 
                            className={
                                Number(volumeChange) < 0 ? 
                                `text-red-500` :
                                `text-green-500`
                            }>
                            {
                                Number(volumeChange) < 0 ?
                                    `Vol $${
                                        humanReadableNumbers(historicBuyDataUSD[historicBuyDataUSD.length - 1].volume.toString())
                                    }
                                    ▼ ${
                                        Number(volumeChange).toFixed(2)
                                    }%` : 
                                    `Vol $${
                                        humanReadableNumbers(historicBuyDataUSD[historicBuyDataUSD.length - 1].volume.toString())
                                    }
                                    ▲ ${
                                        Number(volumeChange).toFixed(2)
                                    }%`
                            }
                        </Badge>
                    } 
                </div>
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
            </>
        )

    } if(
        baseCurrencyUSD === true && 
        historicDataSellTokenBase !== undefined &&
        historicDataSellTokenBase !== null &&
        historicDataSellTokenBase.length > 0
    ){
        const percentChange = historicDataSellTokenBase.length > 1 ?
            ((historicDataSellTokenBase[historicDataSellTokenBase.length - 1].price - historicDataSellTokenBase[0].price) / historicDataSellTokenBase[0].price) * 100
            : 0

        const volumeChange = historicDataSellTokenBase.length > 1 ?
        ((historicDataSellTokenBase[historicDataSellTokenBase.length - 1].volume - historicDataSellTokenBase[0].volume) / historicBuyDataUSD[0].volume) * 100
        : 0

        return(
            <>
                <div className="flex flex-row gap-4 items-center">  
                    {
                        historicDataSellTokenBase.length > 0 &&
                        <div className="text-3xl text-secondary">
                            {
                                `${
                                    Number(historicDataSellTokenBase[historicDataSellTokenBase.length - 1].price).toLocaleString('en-US', {
                                        minimumFractionDigits: Number(historicDataSellTokenBase[historicDataSellTokenBase.length - 1].price) <= 0.01 ? 10 : 
                                                            Number(historicDataSellTokenBase[historicDataSellTokenBase.length - 1].price) <= 1 ? 6 : 2,
                                        maximumFractionDigits: Number(historicDataSellTokenBase[historicDataSellTokenBase.length - 1].price) <= 0.01 ? 10 : 
                                                            Number(historicDataSellTokenBase[historicDataSellTokenBase.length - 1].price) <= 1 ? 6 : 2
                                    })
                                } ${sellTokenObject.symbol}`
                            }
                        </div>
                    }
                    {
                        historicDataSellTokenBase.length > 0 &&
                        <div className={
                                Number(percentChange) < 0 ? 
                                `text-xl text-red-500 w-24` :
                                `text-xl text-green-500 w-24`
                            }
                        >
                            {
                                    Number(percentChange) < 0 ? 
                                    `▼ ${
                                        Number(percentChange).toFixed(2)
                                    }%` :
                                    `▲ ${
                                        Number(percentChange).toFixed(2)
                                    }%`
                            }
                        </div>
                    }
                    {
                        historicDataSellTokenBase.length > 0 &&
                        <Badge variant={"secondary"}>
                            {
                                `MCap ${
                                    humanReadableNumbers((historicDataSellTokenBase[historicDataSellTokenBase.length - 1].market_cap * 100).toString())
                                }% of ${sellTokenObject.symbol}`
                            }
                        </Badge>
                    }
                    {
                        historicDataSellTokenBase.length > 0 &&
                        <Badge 
                            variant={"default"} 
                            className={
                                Number(volumeChange) < 0 ? 
                                `text-red-500` :
                                `text-green-500`
                            }>
                            {
                                Number(volumeChange) < 0 ?
                                `Vol ${
                                    humanReadableNumbers(historicDataSellTokenBase[historicDataSellTokenBase.length - 1].volume.toString())
                                }X  
                                ${sellTokenObject.symbol} ▼ ${
                                    Number(volumeChange).toFixed(2)
                                }%` :
                                `Vol ${
                                    humanReadableNumbers(historicDataSellTokenBase[historicDataSellTokenBase.length - 1].volume.toString())
                                }X  
                                ${sellTokenObject.symbol} ▲ ${
                                    Number(volumeChange).toFixed(2)
                                }%`
                            }
                        </Badge>
                    } 
                </div>
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
            </>
        )
    }
}

export default PriceChart;