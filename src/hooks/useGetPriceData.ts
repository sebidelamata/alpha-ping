import { useState, useEffect } from "react";
import { formatUnits } from "ethers";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import qs from 'qs';

interface Fills{
    from: string;
    to: string;
    source: string;
    proportionBps: string;
}


const useGetPriceData = (
    setBuyAmount: React.Dispatch<React.SetStateAction<string>>,
    sellAmount: string,
    buyTokenObject: Token,
    sellTokenObject: Token,
    parsedSellAmount: string | undefined,
    parsedBuyAmount: string | undefined,
    buyTokenDecimals: number,
    setPrice: (price: PriceResponse) => void,
    slippage: string
) => {  
    const { chainId, signer } = useEtherProviderContext()

    const [buyTokenTax, setBuyTokenTax] = useState<string>("0");
    const [sellTokenTax, setSellTokenTax] = useState<string>("0");
    // trading fees
    const [zeroExFee, setZeroExFee] = useState<string>("0");
    // liquidity route
    const [route, setRoute] = useState<string[]>([])
    // gas estimate
    const [gasEstimate, setGasEstimate] = useState<string | null>(null);

    // Fetch price data and set the buyAmount whenever the sellAmount changes
    useEffect(() => {
        const params = {
        chainId: chainId,
        sellToken: sellTokenObject.address,
        buyToken: buyTokenObject.address,
        sellAmount: parsedSellAmount,
        buyAmount: parsedBuyAmount,
        taker: signer,
        swapFeeRecipient: process.env.NEXT_PUBLIC_FEE_RECIPIENT,
        swapFeeBps: process.env.NEXT_PUBLIC_AFFILIATE_FEE,
        swapFeeToken: buyTokenObject.address,
        tradeSurplusRecipient: process.env.NEXT_PUBLIC_FEE_RECIPIENT,
        slippageBps: (Number(slippage) * 100).toFixed(0),
        };

        async function main() {
            const response = await fetch(`/api/price?${qs.stringify(params)}`);
            const data = await response.json();
            if (data.buyAmount) {
                setBuyAmount(formatUnits(data.buyAmount, buyTokenDecimals));
                setPrice(data);
            }
            // Set token tax information
            if (data?.tokenMetadata) {
                setBuyTokenTax(data.tokenMetadata.buyToken.buyTaxBps);
                setSellTokenTax(data.tokenMetadata.sellToken.sellTaxBps);
            }
            // set zero ex trade fee info
            if(data?.fees && data?.fees.zeroExFee) {
                setZeroExFee(data.fees.zeroExFee.amount);
            }
            // set liquidity route
            if (data?.route) {
                const routeSources = data.route.fills.map((r: Fills) => r.source);
                setRoute(routeSources);
            }
            // set gas estimate
            if (data?.gas && data?.gasPrice) {
                setGasEstimate(
                    (
                        Number(data.gas) * Number(data.gasPrice) / 1e18
                    ).toString()
                );
            }
        }

        if (sellAmount !== "") {
        main();
        const intervalId = setInterval(main, 60000);
    
        return () => clearInterval(intervalId);
        }
    }, [
        setBuyAmount,
        sellTokenObject.address,
        buyTokenObject.address,
        parsedSellAmount,
        parsedBuyAmount,
        chainId,
        sellAmount,
        setPrice,
        buyTokenDecimals,
        signer,
        slippage,
    ]);

    return {
        buyTokenTax,
        sellTokenTax,
        zeroExFee,
        route,
        gasEstimate
    }

}

export default useGetPriceData;