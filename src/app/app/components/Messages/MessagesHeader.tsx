'use client';

import React, {
    useState,
    useEffect
} from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { CardTitle } from "@/components/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/components/ui/avatar";
import qs from "qs";
import { Skeleton } from "@/components/components/ui/skeleton";
import { Badge } from "@/components/components/ui/badge";
import humanReadableNumbers from "src/lib/humanReadableNumbers";

const MessagesHeader: React.FC = () => {

    const { currentChannel, selectedChannelMetadata } = useChannelProviderContext();
    
    useEffect(() => {
    console.log('MessagesHeader re-rendered, selectedChannelMetadata changed:', selectedChannelMetadata);
}, [selectedChannelMetadata]);

console.log(selectedChannelMetadata)

    // get latest quote in USD
        const [tokenUSDPrice, setTokenUSDPrice] = useState<string>("");
        const [twentyFourHourChange, setTwentyFourHourChange] = useState<string>("");
        const [marketCap, setMarketCap] = useState<string>("");
        const [loading, setLoading] = useState<boolean>(false);
        const [cmcError, setCmcError] = useState<string | null>(null);
        useEffect(() => {
            if (!selectedChannelMetadata || !selectedChannelMetadata.slug) {
                setLoading(true)
                setTokenUSDPrice("");
                setTwentyFourHourChange("");
                setMarketCap("");
                setCmcError("No token symbol available for price fetch");
                setLoading(false);
                return;
            }
            const params = {
                slug: selectedChannelMetadata?.slug,
            }
            async function main() {
                try{
                    setLoading(true);
                    setCmcError(null);
                    const response = await fetch(`/api/CMCquoteLatest?${qs.stringify(params)}`);
                    // check response
                    if(!response.ok){
                        setCmcError("Failed to fetch token price from CoinMarketCap");
                        setTokenUSDPrice("");
                    }
                    const data = await response.json();
                    console.log('CMC API Response:', data);
                    // check data structure
                    if(
                        !data?.data || typeof data.data !== 'object'
                    ){
                        setCmcError('Invalid response structure from API')
                        setTokenUSDPrice("");
                    }
                    // Get the first token's data dynamically
                    const tokenDataArray = Object.values(data.data) as CMCQuoteUSD[];
                    console.log('tokenDataArray:', tokenDataArray);
                    if (!tokenDataArray?.length || !tokenDataArray?.[0].quote?.USD?.price) {
                        setCmcError("USD price not found in response");
                        setTokenUSDPrice("");
                    }
                    const usdPrice = tokenDataArray[0].quote.USD.price;
                    setTokenUSDPrice(usdPrice.toString());
                    const change24h = tokenDataArray[0].quote.USD.percent_change_24h
                    setTwentyFourHourChange(change24h.toString());
                    const marketCapValue = tokenDataArray[0].quote.USD.market_cap
                    setMarketCap(marketCapValue.toString());
                } catch (error) {
                    setCmcError("An error occurred while fetching the token price: " + error);
                }finally{
                    setLoading(false);
                }
            }
            main();
        },[selectedChannelMetadata]);
        // Separate useEffect for error logging to avoid dependency issues
        useEffect(() => {
            if (cmcError) {
                console.error('CMC API Error:', cmcError);
            }
        }, [cmcError]);

    return (
        <CardTitle className="flex flex-row flex-wrap w-full bg-primary text-secondary gap-4 items-center justify-start p-4">
            {
                currentChannel &&
                selectedChannelMetadata &&
                <div className="flex flex-row gap-2">
                    <Avatar className="size-8">
                        <AvatarImage
                            src={
                                selectedChannelMetadata.logo !== '' ? 
                                selectedChannelMetadata.logo : 
                                (
                                    currentChannel.tokenType === 'ERC20' ?
                                    '/erc20Icon.svg' :
                                    '/blank_nft.svg'
                                )
                            }
                            loading="lazy"
                            alt="AlphaPING Logo"
                        />
                        <AvatarFallback>AP</AvatarFallback>
                    </Avatar>
                </div>
            }
            {
                currentChannel &&
                <div className="text-3xl">
                    {currentChannel.name}
                </div>
            }
            {
                tokenUSDPrice !== "" &&
                <div className="text-3xl text-secondary">
                    {
                        loading === false ?
                        // if its is less than a dollar extend to 6 decimal places, 
                        // less thann a penny 10
                        `$${
                            Number(tokenUSDPrice).toLocaleString('en-US', {
                                minimumFractionDigits: Number(tokenUSDPrice) <= 0.01 ? 10 : 
                                                    Number(tokenUSDPrice) <= 1 ? 6 : 2,
                                maximumFractionDigits: Number(tokenUSDPrice) <= 0.01 ? 10 : 
                                                    Number(tokenUSDPrice) <= 1 ? 6 : 2
                            })
                        }` :
                        <Skeleton className="w-24 h-6" />
                    }
                </div>
            }
            {
                twentyFourHourChange !== "" &&
                <div className={
                        Number(twentyFourHourChange) < 0 ? 
                        `text-xl text-red-500` :
                        `text-xl text-green-500`
                    }
                >
                    {
                        loading === false ?
                            Number(twentyFourHourChange) < 0 ? 
                            `▼ ${
                                Number(twentyFourHourChange).toFixed(2)
                            }% (24h)` :
                            `▲ ${
                                Number(twentyFourHourChange).toFixed(2)
                            }% (24h)` :
                        <Skeleton className="w-24 h-6" />
                    }
                </div>
            }
            {
                marketCap !== "" &&
                <Badge variant={"secondary"}>
                    {
                        loading === false ?
                        // if its is less than a dollar extend to 6 decimal places, 
                        // less thann a penny 10
                        `Market Cap $${
                            humanReadableNumbers(marketCap)
                        }
                        ` :
                        <Skeleton className="w-24 h-6" />
                    }
                </Badge>
            }
        </CardTitle>
    );
}
export default MessagesHeader;