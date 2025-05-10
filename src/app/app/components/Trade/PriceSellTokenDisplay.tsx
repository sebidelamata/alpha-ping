'use client'

import React from "react";
import { Label } from "@/components/components/ui/label";
import { Button } from "@/components/components/ui/button";
import { 
    Select, 
    SelectTrigger, 
    SelectValue, 
    SelectContent, 
    SelectItem 
} from "@/components/components/ui/select";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
import { Input } from "@/components/components/ui/input";
import { formatUnits } from "ethers";
import tokenList from "../../../../../public/tokenList.json";
import tokensByChain from "src/lib/tokensByChain";
import TokenPriceUSD from "./TokenPriceUSD";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

interface IPriceSellTokenDisplay {
    setTradeDirection: (value: string) => void;
    setSellToken: (value: string) => void;
    setSellAmount: (value: string) => void;
    setSellTokenValueUSD: (value: string) => void;
    userBalance: string | null;
    sellAmount: string;
    sellToken: string;
    sellTokenObject: {
        address: string | null;
        symbol: string;
        decimals: number;
        logoURI: string | null;
    };
    sellTokenDecimals: number | null;
}

const PriceSellTokenDisplay: React.FC<IPriceSellTokenDisplay> = ({
    setTradeDirection,
    setSellToken,
    setSellAmount,
    setSellTokenValueUSD,
    userBalance,
    sellAmount,
    sellToken,
    sellTokenObject,
    sellTokenDecimals
}) => {

    const { chainId } = useEtherProviderContext()

    // update token values for swap
    const handleSellTokenChange = (value: string) => {
        setSellToken(value);
    };

    //function to enter max balance to sell
    const handleMaxSellAmount = () => {
        if (userBalance && sellTokenDecimals) {
            const balance = formatUnits(
                BigInt(userBalance),
                sellTokenDecimals
            );
            setTradeDirection("sell")
            setSellAmount(balance);
        }
    };

    return (
        <section className="mt-4 flex flex-col items-start justify-center gap-4">
            <div className="flex flex-row">
                <Label
                    htmlFor="sell-select"
                    className="w-36"
                >
                    <div className="text-3xl">
                        Sell
                    </div>
                </Label>
            </div>
            <div className="flex flex-row w-full justify-between items-baseline">
                <div className="text-accent items-bottom justify-start text-sm">
                    Balance: {userBalance && sellTokenDecimals ?
                        Number(
                            formatUnits(
                                BigInt(userBalance),
                                sellTokenDecimals
                            )
                        ).toFixed(8) + "... " + sellTokenObject.symbol : 
                        null
                    }   
                </div>
                <Button
                    className="text-xl"
                    variant="outline"
                    onClick={handleMaxSellAmount}
                    //disabled={inSufficientBalance}
                >
                    Max
                </Button>
            </div>
            {
                sellTokenObject.symbol !== undefined &&
                <TokenPriceUSD 
                    tokenSymbol={sellTokenObject.symbol}
                    amount={sellAmount}
                    setSellTokenValueUSD={setSellTokenValueUSD}
                    tradeSide="sell"
                    sellTokenValueUSD={null}
                />
            }
            <div className="flex flex-row w-full gap-2">
                <Select
                    value={sellToken}
                    name="sell-token-select"
                    onValueChange={handleSellTokenChange}
                >
                    <SelectTrigger
                        id="sell-token-select"
                        className="mr-2 w-50 sm:w-full h-16 rounded-md text-3xl"
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    {
                        tokensByChain(tokenList, Number(chainId))
                            .map((token) => (
                                <SelectItem
                                    key={token.address}
                                    value={token.symbol.toLowerCase()}
                                >
                                    <div className="flex flex-row items-center justify-start gap-4">
                                        <Avatar>
                                            <AvatarImage 
                                                alt={token.symbol}
                                                src={
                                                    (
                                                        token !== null && 
                                                        token.logoURI !== null
                                                    ) ? 
                                                    token.logoURI : 
                                                    ""
                                                } 
                                                className="h-12 w-12"
                                            />
                                            <AvatarFallback>
                                                {token.symbol}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            {token.symbol}
                                        </div>
                                    </div>
                                </SelectItem>
                        ))
                    }
                    </SelectContent>
                </Select>
                <Label htmlFor="sell-amount"/>
                <Input
                    className="h-16 rounded-md text-3xl"
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.]?[0-9]*"
                    placeholder="0.0"
                    onBeforeInput={(e) => {
                        const inputEvent = e.nativeEvent as InputEvent;
                        if (inputEvent.data && !/[\d.]/.test(inputEvent.data)) {
                            e.preventDefault();
                        }
                    }}
                    onChange={(e) => {
                        const value = e.target.value;
                        // Allow only numbers and a single decimal point
                        if (/^\d*\.?\d*$/.test(value)) {
                            setTradeDirection("sell");
                            setSellAmount(value);
                        }
                    }}
                    value={sellAmount}
                >
                </Input>
            </div>
        </section>
    );
}
export default PriceSellTokenDisplay;