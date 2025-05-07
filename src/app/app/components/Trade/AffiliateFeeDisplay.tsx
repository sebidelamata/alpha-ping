import React from "react";
import { formatUnits } from "ethers";
import { Badge } from "@/components/components/ui/badge";

interface IAffiliateFeeDisplay {
    price: {
        fees: {
            integratorFee: {
                amount: string | null;
                token: string | null;
            };
        };
    };
    buyTokenObject: {
        symbol: string;
    };
    buyTokenDecimals: number;
}

const AffiliateFeeDisplay: React.FC<IAffiliateFeeDisplay> = ({
    price,
    buyTokenObject,
    buyTokenDecimals
}) => {
    return (
        <div>
            {
                price && 
                price.fees.integratorFee !== null 
                && price.fees.integratorFee.amount ? 
                    <Badge className="text-xs" variant={"default"}>
                        {
                            "Affiliate Fee: " +
                            Number(
                                formatUnits(
                                    BigInt(price.fees.integratorFee.amount),
                                    buyTokenDecimals
                                )
                            ) +
                            " " +
                            buyTokenObject.symbol
                        }
                    </Badge>: 
                    null
            }
        </div>
    );
}
export default AffiliateFeeDisplay;