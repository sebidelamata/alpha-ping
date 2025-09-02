'use client'

import React from "react";
import { Label } from "@/components/components/ui/label";
import { Input } from "@/components/components/ui/input";
import TokenPriceUSD from "./TokenPriceUSD";
import TokenSelector from "./TokenSelector";

interface IPriceBuyTokenDisplay {
    setTradeDirection: (direction: string) => void;
    setBuyToken: (token: string) => void;
    setBuyAmount: (amount: string) => void;
    buyTokenObject: {
        address: string | null;
        symbol: string;
        decimals: number;
        logoURI: string | null;
        name: string;
    };
    buyAmount: string;
    sellTokenValueUSD: string | null;
}

const PriceBuyTokenDisplay: React.FC<IPriceBuyTokenDisplay> = ({
    setTradeDirection,
    setBuyToken,
    setBuyAmount,
    buyTokenObject,
    buyAmount,
    sellTokenValueUSD
}) => {

    return(
        <section className="flex flex-col items-start justify-center gap-2">
            <div className="flex flex-row">
                <Label
                    htmlFor="buy-select"
                    className="w-36"
                >
                    <div className="text-2xl">
                        Buy
                    </div>
                </Label>
            </div>
            <div className="flex flex-row w-full gap-2">
                <TokenSelector
                    tokenObject={buyTokenObject}
                    setToken={setBuyToken}
                    tradeSide="buy"
                />
                <Label htmlFor="buy-amount"/>
                <Input
                    id="buy-amount"
                    value={buyAmount}
                    className="h-12 rounded-md text-lg cursor-not-allowed"
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
                        setTradeDirection("buy");
                        setBuyAmount(value);
                        }
                    }}
                    disabled={true}
                >
                </Input>
            </div>
            <div className="flex flex-row">
                <TokenPriceUSD
                    tokenSymbol={buyTokenObject.symbol}
                    amount={buyAmount}
                    setSellTokenValueUSD={null}
                    tradeSide={"buy"}
                    sellTokenValueUSD={sellTokenValueUSD}
                />
            </div>
        </section>
    )
}

export default PriceBuyTokenDisplay;