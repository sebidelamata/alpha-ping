import React from "react";
import { Badge } from "@/components/components/ui/badge";
import formatTax from "src/lib/formatTax"

interface ITaxInfoDisplay {
    buyTokenTax: string;
    sellTokenTax: string;
    buyTokenObject: {
        symbol: string;
    };
    sellTokenObject: {
        symbol: string;
    };
}

const TaxInfoDisplay: React.FC<ITaxInfoDisplay> = ({
    buyTokenTax,
    sellTokenTax,
    buyTokenObject,
    sellTokenObject
}) => {
    return(
        <div>
            {buyTokenTax !== "0" &&
                <Badge variant={"destructive"}>
                    {
                    buyTokenObject.symbol +
                    ` Buy Tax: ${formatTax(buyTokenTax)}%`
                    }
                </Badge>
            }
            {sellTokenTax !== "0" && (
            <Badge variant={"destructive"}>
                {
                sellTokenObject.symbol +
                ` Sell Tax: ${formatTax(sellTokenTax)}%`
                }
            </Badge>
            )}
        </div>
    )
}

export default TaxInfoDisplay;