import React, 
    {
        useState, 
        useEffect
} from "react";
import qs from "qs";
import { Badge } from "@/components/components/ui/badge";
import { Skeleton } from "@/components/components/ui/skeleton";

interface ITokenPriceUSD {
    tokenSymbol: string;
    amount: string;
}

const TokenPriceUSD: React.FC<ITokenPriceUSD> = ({tokenSymbol, amount}) => {

    // get latest quote in USD
        const [tokenUSDPrice, setTokenUSDPrice] = useState<string>("");
        const [cmcError, setCmcError] = useState<string | null>(null);
        useEffect(() => {
            const params = {
                symbol: tokenSymbol,
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
                setTokenUSDPrice(usdPrice.toString());
                setCmcError(null);
            }
            main();
        },[tokenSymbol])

    return(
        tokenUSDPrice !== "" && !cmcError ? (
            <Badge variant={"default"}>
                {
                    // if its is less than a penny extend to 10 decimal places
                    `$${
                        Number((Number(tokenUSDPrice) * Number(amount)).toFixed(2)) === 0 ?
                        (Number(Number(tokenUSDPrice) * Number(amount)).toFixed(10)).toString() :
                        (Number(Number(tokenUSDPrice) * Number(amount)).toFixed(2)).toString()
                    }`
                }
            </Badge>
        ) : (
            <Skeleton className="h-8 w-16 rounded" />
        )
    )
}

export default TokenPriceUSD;