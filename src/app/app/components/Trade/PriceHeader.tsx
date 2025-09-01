'use client';

import React, {
    useState
} from "react";
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
import PriceChart from "./PriceChart";
import PriceFooter from "./PriceFooter";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
import { Label } from "@/components/components/ui/label";
import { Switch } from "@/components/components/ui/switch";
import { DollarSign } from "lucide-react";

interface IPriceHeader {
    buyTokenObject: Token | null | undefined;
    sellTokenObject: Token | null | undefined;
}

const PriceHeader:React.FC<IPriceHeader> = ({ 
    buyTokenObject,
    sellTokenObject 
}) => {
    
    const [timeRange, setTimeRange] = useState<TimeFrame>("7d")
    const [metric, setMetric] = useState<Metric>('price');
    const [baseCurrencyUSD, setBaseCurrencyUSD] = useState<boolean>(false);

    return(
        <CardTitle className="flex flex-col gap-4 pr-0">
            <div className="flex flex-row items-center gap-4 pr-0">
                {
                    buyTokenObject !== null &&
                    buyTokenObject !== undefined &&
                    buyTokenObject.logoURI !== null &&
                    <div className="flex flex-row gap-2">
                        <Avatar className="size-8">
                            <AvatarImage
                                src={
                                    buyTokenObject.logoURI !== '' ? 
                                    buyTokenObject.logoURI : 
                                    '/erc20Icon.svg'
                                }
                                loading="lazy"
                                alt="AlphaPING Logo"
                            />
                            <AvatarFallback>AP</AvatarFallback>
                        </Avatar>
                    </div>
                }
                <div>
                    {buyTokenObject?.name}
                </div>
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="outline" 
                            className="w-32 h-8 justify-between"
                        >
                            {
                                metric.toLocaleUpperCase()
                            }
                        </Button>
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
                <div className="flex flex-row gap-2 items-center">
                    <Label 
                        className="flex flex-row gap-2"
                        htmlFor="blocks-filter"
                    >
                        <DollarSign/>
                    </Label>
                    <Switch 
                        id="blocks-filter" 
                        className="data-[state=checked]:bg-accent"
                        checked={baseCurrencyUSD} 
                        onCheckedChange={() => setBaseCurrencyUSD(!baseCurrencyUSD)}
                    />
                    <Label 
                        className="flex flex-row gap-2"
                        htmlFor="blocks-filter"
                    >
                        {
                            (
                                sellTokenObject &&
                                sellTokenObject.logoURI !== '' &&
                                sellTokenObject.logoURI !== null
                            ) ?
                            <Avatar className="size-8">
                                <AvatarImage
                                    src={
                                        sellTokenObject.logoURI !== '' ? 
                                        sellTokenObject.logoURI : 
                                        '/erc20Icon.svg'
                                    }
                                    loading="lazy"
                                    alt="AlphaPING Logo"
                                />
                                <AvatarFallback>AP</AvatarFallback>
                            </Avatar> :
                            <div>
                                Sell Token
                            </div>
                        }
                    </Label>
                </div>
            </div>
            {
                (
                    buyTokenObject === null || 
                    buyTokenObject === undefined ||
                    sellTokenObject === null || 
                    sellTokenObject === undefined
                ) ?
                <div>
                    Select a token to see price data
                </div> :
                <PriceChart 
                    buyTokenObject={buyTokenObject}
                    sellTokenObject={sellTokenObject}
                    baseCurrencyUSD={baseCurrencyUSD}
                    metric={metric}
                    timeRange={timeRange}
                />
            }
            <PriceFooter/>
        </CardTitle>
    )
}

export default PriceHeader;