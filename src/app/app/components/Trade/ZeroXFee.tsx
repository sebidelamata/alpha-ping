import React from "react";
import { Badge } from "@/components/components/ui/badge";
import { formatUnits } from "ethers";

interface IZeroXFee {
    zeroExFee: string;
    sellTokenObject: {
        address: string | null;
        symbol: string;
        decimals: number;
        logoURI: string | null;
    };
    sellTokenDecimals: number | null;
    sellTokenPriceUSD: string | null;
}

const ZeroXFee: React.FC<IZeroXFee> = ({
    zeroExFee,
    sellTokenObject,
    sellTokenDecimals,
    sellTokenPriceUSD
}) => { 

    return(
        sellTokenDecimals !== null ?
        <div>
            <Badge variant={"secondary"}>
                {
                    `0x Fee: 
                        ${Number(
                            formatUnits(
                                BigInt(zeroExFee),
                                sellTokenDecimals
                            )
                        )} 
                        ${sellTokenObject.symbol}
                        (${
                            sellTokenPriceUSD !== null && 
                            Number(sellTokenPriceUSD) > 0
                                ? "$" + Number(Number(sellTokenPriceUSD) * Number(
                                    formatUnits(
                                        BigInt(zeroExFee),
                                        sellTokenDecimals
                                    )
                                )).toFixed(6)
                                : "$0.00"
                        })
                    `
                }
            </Badge>
        </div> :
        null
    )
}

export default ZeroXFee;