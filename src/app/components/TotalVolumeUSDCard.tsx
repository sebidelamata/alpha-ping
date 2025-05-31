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

const TotalVolumeUSDCard: React.FC = () => {
    const [totalVolumeUSD, setTotalVolumeUSD] = useState<string | null>(null)
    
    useEffect(() => {
        const loadVolumeTotal = async () => {
            try {
                const appStart = Math.floor(new Date(2025, 4, 1).getTime() / 1000)
                let trades: AlphaPingSwapRecord[] = []
                let params = {
                    cursor: null,
                    startTimestamp: appStart,
                    endTimestamp: Math.floor(Date.now() / 1000),
                }
                
                let response = await fetch(`/api/totalSwapVolumeUSD?${qs.stringify(params)}`)
                let data = await response.json()
                trades = trades.concat(data.trades)
                
                while (data.nextCursor !== null) {
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
                    (Math.round(total * 100) / 100).toFixed(2)
                )
            } catch (error) {
                console.error('Error loading volume data:', error)
                setTotalVolumeUSD('0.00')
            }
        }
        loadVolumeTotal()
    }, [])

    return (
        <Card className="w-full max-w-2xl mx-auto bg-primary/50 backdrop-blur-sm border border-secondary/20 text-secondary">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-accent text-lg sm:text-xl md:text-2xl font-bold">
                    {totalVolumeUSD === null ? (
                        <div className="flex justify-center">
                            <Skeleton className="h-6 sm:h-8 w-3/4 max-w-sm bg-secondary/20" />
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                                ${humanReadableNumbers(totalVolumeUSD)}
                            </div>
                            <div className="text-sm sm:text-base text-secondary/80 font-normal">
                                of Digital Assets Swapped
                            </div>
                        </div>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
                <p className="text-sm sm:text-base text-secondary/90 leading-relaxed max-w-md mx-auto">
                    Join thousands of traders who trust our platform for transparent, 
                    community-driven trading insights.
                </p>
            </CardContent>
        </Card>
    )
}

export default TotalVolumeUSDCard