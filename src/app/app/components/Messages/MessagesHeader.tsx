'use client';

import React, {
    useState,
    useEffect
} from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { CardTitle } from "@/components/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/components/ui/avatar";
import qs from "qs";

const MessagesHeader: React.FC = () => {

    const { currentChannel, selectedChannelMetadata } = useChannelProviderContext();
    
    useEffect(() => {
    console.log('MessagesHeader re-rendered, selectedChannelMetadata changed:', selectedChannelMetadata);
}, [selectedChannelMetadata]);

    // get latest quote in USD
        const [tokenUSDPrice, setTokenUSDPrice] = useState<string>("");
        const [cmcError, setCmcError] = useState<string | null>(null);
        useEffect(() => {
            const params = {
                symbol: selectedChannelMetadata?.symbol || '',
            }
            async function main() {
                try{
                    const response = await fetch(`/api/CMCquoteLatest?${qs.stringify(params)}`);
                    // check response
                    if(!response.ok){
                        setCmcError("Failed to fetch token price from CoinMarketCap");
                    }
                    const data = await response.json();
                    console.log('CMC API Response:', data);
                    // check data structure
                    if(
                        !data?.data || typeof data.data !== 'object'
                    ){
                        setCmcError('Invalid response structure from API')
                    }
                    // Get the first token's data dynamically
                    const tokenDataArray = Object.values(data.data)[0] as CMCQuoteUSD[];
                    if (!tokenDataArray?.length || !tokenDataArray[0]?.quote?.USD?.price) {
                        setCmcError("USD price not found in response");
                    }
                    const usdPrice = tokenDataArray[0].quote.USD.price;
                    console.log('USD Price:', usdPrice);
                    setTokenUSDPrice(usdPrice.toString());
                } catch (error) {
                    setCmcError("An error occurred while fetching the token price: " + error);
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
                <div className="text-3xl">
                    {currentChannel.name}
                </div>
            }
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
                tokenUSDPrice !== "" &&
                <div>
                    {
                        `$${parseFloat(tokenUSDPrice).toFixed(2).toLocaleString()}`
                    }
                </div>
            }
        </CardTitle>
    );
}
export default MessagesHeader;