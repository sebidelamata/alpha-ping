import React, {
    useState
} from "react";
import useGetCoinGeckoHistoricData from "src/hooks/useGetCoinGeckoHistoricData";
import { CardTitle } from "@/components/components/ui/card";
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuRadioGroup, 
    DropdownMenuRadioItem 
} from "@/components/components/ui/dropdown-menu";
import { Button } from "@/components/components/ui/button";
import { 
    Select, 
    SelectTrigger, 
    SelectValue, 
    SelectItem, 
    SelectContent 
} from "@/components/components/ui/select";

interface IPriceChart {
    buyTokenObject: Token | null | undefined;
}

const PriceChart:React.FC<IPriceChart> = ({ buyTokenObject }) => {
    
    const [timeRange, setTimeRange] = useState<TimeFrame>("7d")
    const [metric, setMetric] = useState<Metric>('price');

    // grab historic data from coingecko
    const { historicPriceData } = useGetCoinGeckoHistoricData(
        timeRange, 
        buyTokenObject !== null && 
        buyTokenObject !== undefined ? 
        buyTokenObject.address : 
        ""
    )
    console.log("Historic Price Data:", historicPriceData)
    return(
        <CardTitle>
            <div className="flex flex-row items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="outline" 
                            className="w-32 h-8 justify-between"
                        >+ {metric !== 'none' ? metric.toLocaleUpperCase() : 'Market Data'}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-primary text-secondary">
                        <DropdownMenuRadioGroup value={metric} onValueChange={(m) => setMetric(m as Metric)}>
                            <DropdownMenuRadioItem 
                                value="price"
                            >
                                Price
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem 
                                value="mcap"
                            >
                                MCap
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem 
                                value="volume"
                            >
                                Volume
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Select 
                    value={timeRange} 
                    onValueChange={(value: string) => setTimeRange(value as TimeFrame)}
                >
                    <SelectTrigger
                        className="w-[160px] h-8 "
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl bg-primary text-secondary">
                        {/* <SelectItem value="all" className="rounded-lg">
                            All Time
                        </SelectItem> */}
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
                        <SelectItem value="1d" className="rounded-lg">
                            Last 24 hours
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardTitle>
    )
}

export default PriceChart;