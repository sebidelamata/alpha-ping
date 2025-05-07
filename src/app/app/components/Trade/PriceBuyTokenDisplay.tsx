'use client'

import React from "react";
import { Label } from "@/components/components/ui/label";
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
import tokenList from "../../../../../public/tokenList.json";
import tokensByChain from "src/lib/tokensByChain";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

interface IPriceBuyTokenDisplay {
    setTradeDirection: (direction: string) => void;
    setBuyToken: (token: string) => void;
    setBuyAmount: (amount: string) => void;
    buyToken: string;
    buyAmount: string;
}

const PriceBuyTokenDisplay: React.FC<IPriceBuyTokenDisplay> = ({
    setTradeDirection,
    setBuyToken,
    setBuyAmount,
    buyToken,
    buyAmount,
}) => {

    const { chainId } = useEtherProviderContext()

    const handleBuyTokenChange = (value: string) => {
        setBuyToken(value);
    }

    return(
        <section className="mt-4 flex flex-col items-start justify-center gap-4">
            <div className="flex flex-row">
                <Label
                    htmlFor="buy-select"
                    className="w-36"
                >
                    <div className="text-3xl">
                        Buy
                    </div>
                </Label>
            </div>
            <div className="flex flex-row w-full gap-2">
                <Select
                    value={buyToken}
                    name="buy-token-select"
                    onValueChange={handleBuyTokenChange}
                >
                    <SelectTrigger
                        id="buy-token-select"
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
                <Label htmlFor="buy-amount"/>
                <Input
                    id="buy-amount"
                    value={buyAmount}
                    className="h-16 rounded-md text-3xl cursor-not-allowed"
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
        </section>
    )
}

export default PriceBuyTokenDisplay;