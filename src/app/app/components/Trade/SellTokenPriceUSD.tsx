import React, 
    {
        useState, 
        useEffect
} from "react";
import qs from "qs";
import { Badge } from "@/components/components/ui/badge";
import { Skeleton } from "@/components/components/ui/skeleton";

interface ISellTokenPriceUSD {
    sellTokenSymbol: string;
}

const SellTokenPriceUSD: React.FC<ISellTokenPriceUSD> = ({sellTokenSymbol}) => {

    // get latest quote in USD
        const [sellTokenUSDPrice, setSellTokenUSDPrice] = useState<string>("");
        const [cmcError, setCmcError] = useState<string | null>(null);
        useEffect(() => {
            const params = {
                symbol: sellTokenSymbol,
            }
            async function main() {
                const response = await fetch(`/api/CMCquoteLatest?${qs.stringify(params)}`);
                const data = await response.json();
               // Get the first token's data dynamically
               const tokenDataArray = Object.values(data.data)[0] as any[];
               if (!tokenDataArray?.length || !tokenDataArray[0]?.quote?.USD?.price) {
                   throw new Error("USD price not found in response");
               }
            
                const usdPrice = tokenDataArray[0].quote.USD.price;
                console.log("usdPrice", usdPrice);
                setSellTokenUSDPrice(usdPrice.toString());
                setCmcError(null);
            }
            main();
        },[sellTokenSymbol])

    return(
        sellTokenUSDPrice !== "" && !cmcError ? (
            <Badge variant={"default"}>
                {
                    // if its is less than a penny extend to 10 decimal places
                    `1 ${sellTokenSymbol} = $${
                        Number(Number(sellTokenUSDPrice).toFixed(2)) === 0 ?
                        (Number(sellTokenUSDPrice).toFixed(10)).toString() :
                        (Number(sellTokenUSDPrice).toFixed(2)).toString()
                    } USD`
                }
            </Badge>
        ) : (
            <Skeleton className="h-8 w-16 rounded" />
        )
    )
}

export default SellTokenPriceUSD;