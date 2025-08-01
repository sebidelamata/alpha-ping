import { 
    useEffect, 
    useState
} from "react";
import useGetCoinGeckoID from "./useGetCoinGeckoID";
import qs from "qs";

const useGetCoinGeckoHistoricData = (timeframe: TimeFrame) => {

    const { coinGeckoId } = useGetCoinGeckoID()

    const [historicPriceData, setHistoricPriceData] = useState<historicPriceData | null>(null);
    useEffect(() => {
    // this is the function that will fetch the token history from coingecko
            const fetchTokenHistoryCoinGecko = async () => {
                console.log("timeframe ",timeframe)
            const params = {
                id: coinGeckoId,
                vs_currency: 'usd',
                from: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30, // 30 days ago
                to: Math.floor(Date.now() / 1000), // now
            }
            console.log(params)
            try {
                const response = await fetch(`/api/coinGeckoHistoric?${qs.stringify(params)}`)
                // make sure we have a valid response
                if (!response.ok) {
                    throw new Error('Failed to fetch token price history from CoinGecko');
                }
                const json = await response.json();
                console.log("Response from CoinGecko:", json);
                // the key or just an empyt object
                setHistoricPriceData(json || null);
            } catch (error) {
                console.warn('Error fetching token price history from coingecko for token', coinGeckoId, ": ", error);
                setHistoricPriceData(null)
            }
        }

        if(timeframe !== null && coinGeckoId !== null) {
            fetchTokenHistoryCoinGecko()
        }
    }, [coinGeckoId, timeframe]);
    // this is the function that will fetch the token history from coingecko

    return { historicPriceData }
    
}

export default useGetCoinGeckoHistoricData;