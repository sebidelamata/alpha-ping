'use client';
import React, {
    useState,
    useEffect
} from "react";
import { 
    Card, 
    CardHeader, 
    CardTitle,
    CardContent 
} from "@/components/components/ui/card";
import qs from 'qs'
import humanReadableNumbers from "src/lib/humanReadableNumbers";
import { Skeleton } from "@/components/components/ui/skeleton";

const TotalVolumeUSDCard:React.FC = () => {

    const [totalVolumeUSD, setTotalVolumeUSD] = useState<string | null>(null)
    useEffect(() => {
    const loadVolumeTotal = async () => {
        const appStart = Math.floor(new Date(2025,4,1).getTime() / 1000)
        let trades:AlphaPingSwapRecord[] = []
        let params = {
            cursor: null,
            // start on may 1st 2025 (4 = may)
            // Unix timestamp, not milliseconds
            startTimestamp: appStart,
            endTimestamp: Math.floor(Date.now() / 1000),
        }
        let response = await fetch(`/api/totalSwapVolumeUSD?${qs.stringify(params)}`)
        let data = await response.json()
        trades = trades.concat(data.trades)
        while(data.nextCursor !== null){
            params = {
                cursor: data.nextCursor,
                startTimestamp: appStart,
                endTimestamp: Math.floor(Date.now() / 1000),
            }
            response = await fetch(`/api/totalSwapVolumeUSD?${qs.stringify(params)}`)
            data = await response.json()
            trades = trades.concat(data.trades)
        }
        let total = 0
        trades.map((trade) => total += parseFloat(trade.volumeUsd))
        setTotalVolumeUSD(
            (
                Math.round(total * 100) / 100
            ).toFixed(2)
        )
        }
        loadVolumeTotal()
    }, [])

    return(
        <Card className="flex flex-col h-full w-full bg-primary text-secondary justify-end">
            <CardHeader>
                <CardTitle className="flex text-accent justify-end">
                    {
                        totalVolumeUSD === null ?
                        <Skeleton className="w-96 h-8"/>:
                        `$${humanReadableNumbers(totalVolumeUSD)} of Digital Assets Swapped`
                    }
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-end">
                Research with Transparency. Trust in your Community. Trade at the Best Prices. All in One Place.
            </CardContent>
        </Card>
    )
}

export default TotalVolumeUSDCard;