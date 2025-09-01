import { 
    useEffect, 
    useState
} from "react";
import useGetCoinGeckoID from "./useGetCoinGeckoID";
import qs from "qs";

const useGetCoinGeckoHistoricData = (timeframe: TimeFrame, optionalAddress="") => {

    const { coinGeckoId } = useGetCoinGeckoID(optionalAddress)
    console.log("CoinGecko ID:", coinGeckoId)

    const [historicPriceData, setHistoricPriceData] = useState<historicPriceData[] | null>(null);
    useEffect(() => {
    // this is the function that will fetch the token history from coingecko
            const fetchTokenHistoryCoinGecko = async () => {

                // convert timeframe to number of days
                let numDays: number
                if(timeframe === "1y") {
                    numDays = 365
                }
                else if(timeframe === "6m") {
                    numDays = 180
                }
                else if(timeframe === "3m") {
                    numDays = 90
                }
                else if(timeframe === "30d") {
                    numDays = 30
                }
                else if(timeframe === "7d") {
                    numDays = 7
                }
                else if(timeframe === "1d") {
                    numDays = 1
                }
                else {
                    numDays = 30 // default to 30 days
                }

                const params = {
                    id: coinGeckoId,
                    vs_currency: 'usd',
                    from: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * numDays, // x days ago
                    to: Math.floor(Date.now() / 1000), // now
                }
                try {
                    const response = await fetch(`/api/coinGeckoHistoric?${qs.stringify(params)}`)
                    // make sure we have a valid response
                    if (!response.ok) {
                        throw new Error('Failed to fetch token price history from CoinGecko');
                    }
                    const json = await response.json()
                    console.log("json", json)
                    // now we merge the data into one object (right now its 3 arrays)
                    const { prices, market_caps, total_volumes } = json
                    console.log("prices", prices)
                    console.log("market_caps", market_caps)
                    console.log("totalVolumes", total_volumes)
                    // merge
                    const mergedData:historicPriceData[] = prices.reduce((acc:historicPriceData[], [timestamp, priceValue]: number[], i: number) => {
                    const [, marketCapValue] = market_caps[i];
                    const [, volumeValue] = total_volumes[i];

                    acc.push({
                        time: timestamp,
                        price: priceValue,
                        market_cap: marketCapValue,
                        volume: volumeValue
                    });

                    return acc;
                    }, []);
                    // the key or just an empyt object
                    setHistoricPriceData(mergedData || null);
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