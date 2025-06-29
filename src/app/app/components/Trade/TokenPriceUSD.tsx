'use client';

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
    setSellTokenValueUSD: null | ((value: string) => void);
    tradeSide: string;
    sellTokenValueUSD: string | null;
}

const TokenPriceUSD: React.FC<ITokenPriceUSD> = ({
    tokenSymbol, 
    amount,
    setSellTokenValueUSD,
    tradeSide,
    sellTokenValueUSD
}) => {
    // get latest quote in USD
    const [tokenUSDPrice, setTokenUSDPrice] = useState<string>("");
    const [cmcError, setCmcError] = useState<string | null>(null);
    useEffect(() => {
        const params = {
            symbol: tokenSymbol,
        }
        async function main() {
            try{
                const response = await fetch(`/api/CMCquoteLatest?${qs.stringify(params)}`);
                // check response
                if(response.status !== 200) {
                    setCmcError("Failed to fetch token price from CoinMarketCap");
                }
                const data = await response.json();
                // check data structure
                if(
                    response.status === 200 && 
                    (!data?.data || typeof data.data !== 'object')
                ){
                    setCmcError('Invalid response structure from API')
                }
                // Get the first token's data dynamically
                const tokenDataArray = Object.values(data.data)[0] as CMCQuoteUSD[];
                if (!tokenDataArray?.length || !tokenDataArray[0]?.quote?.USD?.price) {
                    setCmcError("USD price not found in response");
                }
                const usdPrice = tokenDataArray[0].quote.USD.price;
                setTokenUSDPrice(usdPrice.toString());
                // if we have a sell token value and its not null, set it to the sell token value
                // if this is a sell token, set the value in the parent component
                // this is so we can determine the usd difference in between the two tokens
                if(setSellTokenValueUSD !== null && tradeSide === "sell"){
                    setSellTokenValueUSD((Number(usdPrice) * Number(amount)).toString());
                }
            } catch (error) {
                setCmcError("An error occurred while fetching the token price: " + error);
            }
        }
        main();
    },[tokenSymbol, amount, setSellTokenValueUSD, tradeSide]);
    // Separate useEffect for error logging to avoid dependency issues
    useEffect(() => {
        if (cmcError) {
            console.error('CMC API Error:', cmcError);
        }
    }, [cmcError]);

    return(
        tokenUSDPrice !== "" && 
        amount !== "" &&
        !cmcError ? (
            <div>
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
                {
                    sellTokenValueUSD !== null && 
                    tradeSide === "buy" ? (
                        <Badge 
                            variant={"default"}
                            // if we have more than 5% slippage make it red
                            className={
                                (
                                    ((Number(tokenUSDPrice) * Number(amount)) - Number(sellTokenValueUSD)) /
                                    Number(sellTokenValueUSD)
                                ) * 100 <= -5 ?
                                "text-red-500" :
                                "text-gray-400"
                            }
                        >
                            {
                                // percent difference between usd value of token sold vs received
                                // if its is less than a penny extend to 10 decimal places
                                `(${
                                    (
                                        (
                                            ((Number(tokenUSDPrice) * Number(amount)) - Number(sellTokenValueUSD)) /
                                            Number(sellTokenValueUSD)
                                        ) * 100
                                    ).toFixed(2)
                                }%)`
                            }
                        </Badge>
                    ) : null
                }
            </div>
        ) : (
            <Skeleton className="h-8 w-16 rounded" />
        )
    )
}

export default TokenPriceUSD;