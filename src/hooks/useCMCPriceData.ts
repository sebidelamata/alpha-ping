import { useState, useEffect } from "react";
import qs from 'qs';
import { useChannelProviderContext } from '../contexts/ChannelContext';

const useCMCPriceData = () => {
    const { 
            selectedChannelMetadata
        } = useChannelProviderContext()
  // get latest quote in USD
    const [cmcLoading, setCMCLoading] = useState<boolean>(false);
    const [cmcError, setCmcError] = useState<string | null>(null);
    const [cmcFetch, setCmcFetch] = useState<cmcPriceData>({
        twentyFourHourChange: "",
        tokenUSDPrice: "",
        marketCap: "",
        percent_change_1h: "",
        percent_change_7d: "",
        percent_change_30d: "",
        percent_change_60d: "",
        volume_24h: "",
        volume_change_24h: ""
    } as cmcPriceData);
    useEffect(() => {
        if (!selectedChannelMetadata || !selectedChannelMetadata.slug) {
            setCMCLoading(true)
            setCmcFetch({
                twentyFourHourChange: "",
                tokenUSDPrice: "",
                marketCap: "",
                percent_change_1h: "",
                percent_change_7d: "",
                percent_change_30d: "",
                percent_change_60d: "",
                volume_24h: "",
                volume_change_24h: ""
            } as cmcPriceData)
            setCmcError("No token symbol available for price fetch")
            setCMCLoading(false)
            return;
        }
        const params = {
            slug: selectedChannelMetadata?.slug,
        }
        const fetchTokenStats = async () => {
            try{
                setCMCLoading(true);
                setCmcError(null);
                const response = await fetch(`/api/CMCquoteLatest?${qs.stringify(params)}`);
                // check response
                if(!response.ok){
                    setCmcError("Failed to fetch token price from CoinMarketCap");
                    setCmcFetch({
                        twentyFourHourChange: "",
                        tokenUSDPrice: "",
                        marketCap: "",
                        percent_change_1h: "",
                        percent_change_7d: "",
                        percent_change_30d: "",
                        percent_change_60d: "",
                        volume_24h: "",
                        volume_change_24h: ""
                    } as cmcPriceData)
                }
                const data = await response.json();
                // check data structure
                if(
                    !data?.data || typeof data.data !== 'object'
                ){
                    setCmcError('Invalid response structure from API')
                    setCmcFetch({
                        twentyFourHourChange: "",
                        tokenUSDPrice: "",
                        marketCap: "",
                        percent_change_1h: "",
                        percent_change_7d: "",
                        percent_change_30d: "",
                        percent_change_60d: "",
                        volume_24h: "",
                        volume_change_24h: ""
                    } as cmcPriceData)
                }
                // Get the first token's data dynamically
                const tokenDataArray = Object.values(data.data) as CMCQuoteUSD[];
                if (!tokenDataArray?.length || !tokenDataArray?.[0].quote?.USD?.price) {
                    setCmcError("USD price not found in response");
                    setCmcFetch({
                        twentyFourHourChange: "",
                        tokenUSDPrice: "",
                        marketCap: "",
                        percent_change_1h: "",
                        percent_change_7d: "",
                        percent_change_30d: "",
                        percent_change_60d: "",
                        volume_24h: "",
                        volume_change_24h: ""
                    } as cmcPriceData)
                }
                const usdPrice = tokenDataArray[0].quote.USD.price;
                const change24h = tokenDataArray[0].quote.USD.percent_change_24h
                const percent_change_1h = tokenDataArray[0].quote.USD.percent_change_1h
                const percent_change_7d = tokenDataArray[0].quote.USD.percent_change_7d
                const percent_change_30d = tokenDataArray[0].quote.USD.percent_change_30d
                const percent_change_60d = tokenDataArray[0].quote.USD.percent_change_60d
                const volume_24h = tokenDataArray[0].quote.USD.volume_24h
                const volume_change_24h = tokenDataArray[0].quote.USD.volume_change_24h
                const marketCapValue = tokenDataArray[0].quote.USD.market_cap
                setCmcFetch({
                    twentyFourHourChange: change24h.toString(),
                    tokenUSDPrice: usdPrice.toString(),
                    marketCap: marketCapValue.toString(),
                    percent_change_1h: percent_change_1h.toString(),
                    percent_change_7d: percent_change_7d.toString(),
                    percent_change_30d: percent_change_30d.toString(),
                    percent_change_60d: percent_change_60d.toString(),
                    volume_24h: volume_24h.toString(),
                    volume_change_24h: volume_change_24h.toString()
                })
            } catch (error) {
                setCmcError("An error occurred while fetching the token price: " + error);
            }finally{
                setCMCLoading(false);
            }
        }
        // initial fetch
        fetchTokenStats();
        // refetch every 60 seconds
        const interval = setInterval(() => {
            fetchTokenStats();
        }, 60000);
        return () => clearInterval(interval);
    },[selectedChannelMetadata, setCmcFetch]);
    // Separate useEffect for error logging to avoid dependency issues
    useEffect(() => {
        if (cmcError) {
            console.error('CMC API Error:', cmcError);
        }
    }, [cmcError]);

    return { cmcFetch, cmcLoading, cmcError };
}

export default useCMCPriceData;