import React from "react";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
import { formatUnits } from "ethers";
import TokenPriceUSD from "./TokenPriceUSD";

interface IQuoteSellTokenDisplay{
    buyTokenObject: Token;
    buyAmount: string;
    sellTokenValueUSD: string | null;
    setSellTokenValueUSD: null | ((value: string) => void);
}

const QuoteBuyTokenDisplay:React.FC<IQuoteSellTokenDisplay> = ({
    buyTokenObject,
    buyAmount,
    sellTokenValueUSD,
    setSellTokenValueUSD
}) => {
    return(
    <div className="p-4 rounded-sm gap-2">
        <div className="flex text-xl mb-2 justify-center w-64">
            You receive
        </div>
        <div 
            className="size-64 flex flex-col justify-center items-center border border-solid border-secondary rounded"
        >
                <Avatar className="justify-center">
                    <AvatarImage
                        alt={buyTokenObject.symbol}
                        src={buyTokenObject.logoURI || ""}
                        className="h-9 w-9 mr-2"
                    />
                    <AvatarFallback>
                        {buyTokenObject.symbol}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-row">
                    <span>{formatUnits(buyAmount, buyTokenObject.decimals)}</span>
                    <div className="ml-2">{buyTokenObject.symbol}</div>
                </div>
                <TokenPriceUSD
                    tokenSymbol={buyTokenObject.symbol}
                    amount={formatUnits(buyAmount, buyTokenObject.decimals)}
                    sellTokenValueUSD={sellTokenValueUSD}
                    setSellTokenValueUSD={setSellTokenValueUSD}
                    tradeSide="buy"
                />
        </div>
        </div>
    )
}

export default QuoteBuyTokenDisplay