import React from "react";
import { Badge } from "@/components/components/ui/badge";
import formatTax from "src/lib/formatTax"

interface ITaxInfoDisplay {
    buyTokenTax: {
        buyTaxBps: string;
    };
    sellTokenTax: {
        sellTaxBps: string;
    };
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
            {buyTokenTax.buyTaxBps !== "0" &&
                <Badge variant={"destructive"}>
                    {
                    buyTokenObject.symbol +
                    ` Buy Tax: ${formatTax(buyTokenTax.buyTaxBps)}%`
                    }
                </Badge>
            }
            {sellTokenTax.sellTaxBps !== "0" && (
            <Badge variant={"destructive"}>
                {
                sellTokenObject.symbol +
                ` Sell Tax: ${formatTax(sellTokenTax.sellTaxBps)}%`
                }
            </Badge>
            )}
        </div>
    )
}

export default TaxInfoDisplay;