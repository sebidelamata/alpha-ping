import React from "react";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
import { Token } from "src/types/global";
import { formatUnits } from "ethers";
import TokenPriceUSD from "./TokenPriceUSD";

interface IQuoteSellTokenDisplay{
    sellTokenObject: Token;
    sellAmount: string;
    sellTokenValueUSD: string | null;
    setSellTokenValueUSD: null | ((value: string) => void);
}

const QuoteSellTokenDisplay:React.FC<IQuoteSellTokenDisplay> = ({
    sellTokenObject,
    sellAmount,
    sellTokenValueUSD,
    setSellTokenValueUSD
}) => {
    return(
    <div className="p-4 rounded-sm gap-2">
        <div className="flex text-xl mb-2 justify-center w-64">
            You pay
        </div>
        <div 
            className="size-64 flex flex-col justify-center items-center border border-solid border-secondary rounded"
        >
                <Avatar className="justify-center">
                    <AvatarImage
                        alt={sellTokenObject.symbol}
                        src={sellTokenObject.logoURI || ""}
                        className="h-9 w-9 mr-2"
                    />
                    <AvatarFallback>
                        {sellTokenObject.symbol}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-row">
                    <span>{formatUnits(sellAmount, sellTokenObject.decimals)}</span>
                    <div className="ml-2">{sellTokenObject.symbol}</div>
                </div>
                <TokenPriceUSD
                    tokenSymbol={sellTokenObject.symbol}
                    amount={formatUnits(sellAmount, sellTokenObject.decimals)}
                    sellTokenValueUSD={sellTokenValueUSD}
                    setSellTokenValueUSD={setSellTokenValueUSD}
                    tradeSide="sell"
                />
        </div>
        </div>
    )
}

export default QuoteSellTokenDisplay