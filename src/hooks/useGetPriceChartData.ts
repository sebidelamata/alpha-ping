import { useState, useEffect } from "react";
import useGetCoinGeckoHistoricData from "src/hooks/useGetCoinGeckoHistoricData";

const useGetPriceChartData = (
    timeRange: TimeFrame, 
    buyTokenObject: Token | null | undefined, 
    sellTokenObject: Token | null | undefined,
) => {

    const { historicPriceData: historicBuyDataUSD } = useGetCoinGeckoHistoricData(
        timeRange,
        buyTokenObject ? buyTokenObject.address : ""
    )

    const { historicPriceData: historicSellDataUSD } = useGetCoinGeckoHistoricData(
        timeRange,
        sellTokenObject ? sellTokenObject.address : ""
    )

    const [historicDataSellTokenBase, setHistoricDataSellTokenBase] = useState<historicPriceData[] | null>(null);
    useEffect(() => {
        const computeSellTokenBaseData = () => {
            if (historicSellDataUSD && historicBuyDataUSD){
                const computedData = historicSellDataUSD.map((sellPoint, index) => {
                const buyPoint = historicBuyDataUSD[index];
                if(
                    buyPoint.price && 
                    sellPoint.price && 
                    buyPoint.market_cap && 
                    sellPoint.market_cap && 
                    buyPoint.volume && 
                    sellPoint.volume
                ){
                    return {
                        time: sellPoint.time,
                        price: buyPoint.price / sellPoint.price,
                        market_cap: buyPoint.market_cap / sellPoint.market_cap,
                        volume: buyPoint.volume / sellPoint.volume,
                    };
                } else{
                    return null
                }
                }) as unknown as historicPriceData[]
                setHistoricDataSellTokenBase(computedData)
            }
        }
        computeSellTokenBaseData();
    }, [historicSellDataUSD, historicBuyDataUSD]);

    // logic to fetch and set chart data based on the parameters
    // This is a placeholder for actual data fetching logic.
    // You would typically use an API call here to get the data.

    return { 
        historicBuyDataUSD,
        historicDataSellTokenBase
     };
}

export default useGetPriceChartData;