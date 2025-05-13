'use client'

import React from "react";
import { Label } from "@/components/components/ui/label";
import { Button } from "@/components/components/ui/button";
import { Input } from "@/components/components/ui/input";
import { formatUnits } from "ethers";
import TokenPriceUSD from "./TokenPriceUSD";
import TokenSelector from "./TokenSelector";

interface IPriceSellTokenDisplay {
    setTradeDirection: (value: string) => void;
    setSellToken: (value: string) => void;
    setSellAmount: (value: string) => void;
    setSellTokenValueUSD: (value: string) => void;
    userBalance: string | null;
    sellAmount: string;
    sellTokenObject: {
        address: string | null;
        symbol: string;
        decimals: number;
        logoURI: string | null;
        name: string;
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
    sellTokenObject,
    sellTokenDecimals,
}) => {

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
                    className="flex flex-row w-[100%] justify-start items-baseline gap-4"
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
                <TokenSelector
                    tokenObject={sellTokenObject}
                    setToken={setSellToken}
                    tradeSide="sell"
                />
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