'use client'

import React, {
    useEffect,
    useState,
} from "react";
import { 
    formatUnits, 
    parseUnits,
} from "ethers";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent
} from "@/components/components/ui/card";
import qs from 'qs'
import tokenList from "../../../../../public/tokenList.json";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "src/contexts/UserContext";
import tokensByChain from "src/lib/tokensByChain";
import ApproveOrReviewButton from "./ApproveOrReviewButton";
import PriceFlipTokens from "./PriceFlipTokens";
import PriceSellTokenDisplay from "./PriceSellTokenDisplay";
import PriceBuyTokenDisplay from "./PriceBuyTokenDisplay";
import ZeroXFee from "./ZeroXFee";
import AffiliateFeeDisplay from "./AffiliateFeeDisplay";
import TaxInfoDisplay from "./TaxInfoDisplay";
import AlphaPingFee from "./AlphaPingFee";
import LiquidityRoute from "./LiquidityRoute";
import GasDisplay from "./GasDisplay";
import PriceFooter from "./PriceFooter";
import SlippageSettings from "./SlippageSettings";
import useGetBalance from "src/hooks/useGetBalance";

interface Fills{
    from: string;
    to: string;
    source: string;
    proportionBps: string;
}
  interface IPrice {
    price: PriceResponse | null | undefined;
    setPrice: (price: PriceResponse | null | undefined) => void;
    setFinalize: (finalize: boolean) => void;
    slippage: string;
    setSlippage: React.Dispatch<React.SetStateAction<string>>;
}

const Price:React.FC<IPrice> = ({
    price,
    setPrice,
    setFinalize,
    slippage,
    setSlippage
}) => {

    const { account } = useUserProviderContext()
    const { chainId, signer } = useEtherProviderContext()

    const [sellToken, setSellToken] = useState<string>("weth");
    const [sellTokenValueUSD, setSellTokenValueUSD] = useState<string | null>(null);
    const [buyToken, setBuyToken] = useState<string>("usdc");
    const [sellAmount, setSellAmount] = useState<string>("");
    const [buyAmount, setBuyAmount] = useState<string>("");
    const [tradeDirection, setTradeDirection] = useState<string>("sell");
    const [buyTokenTax, setBuyTokenTax] = useState<string>("0");
    const [sellTokenTax, setSellTokenTax] = useState<string>("0");
    // trading fees
    const [zeroExFee, setZeroExFee] = useState<string>("0");
    // liquidity route
    const [route, setRoute] = useState<string[]>([])
    // gas estimate
    const [gasEstimate, setGasEstimate] = useState<string | null>(null);

    // flip tokens and values
    const flipTokens = () => {
        const currentSellToken = sellToken;
        setSellToken(buyToken);
        setBuyToken(currentSellToken);
        const currentSellAmount = sellAmount;
        setSellAmount(buyAmount);
        setBuyAmount(currentSellAmount); 
    }

    // grab the token objects from the token list
    const sellTokenObject = tokensByChain(tokenList, Number(chainId)).
        filter((token) => token.symbol.toLowerCase() === sellToken.toLowerCase())[0];
    const buyTokenObject = tokensByChain(tokenList, Number(chainId)).
        filter((token) => token.symbol.toLowerCase() === buyToken.toLowerCase())[0];

    const sellTokenDecimals = (
        sellTokenObject !== undefined &&
        sellTokenObject !== null &&
        sellTokenObject.decimals !== undefined &&
        sellTokenObject.decimals !== null
    ) ? sellTokenObject.decimals : 
    18;
    const buyTokenDecimals = (
        buyTokenObject !== undefined &&
        buyTokenObject !== null &&
        buyTokenObject.decimals !== undefined &&
        buyTokenObject.decimals !== null
    ) ? buyTokenObject.decimals :
    18;

    const parsedSellAmount =
        sellAmount && tradeDirection === "sell"
        ? parseUnits(sellAmount, sellTokenDecimals).toString()
        : undefined;

    const parsedBuyAmount =
        buyAmount && tradeDirection === "buy"
        ? parseUnits(buyAmount, buyTokenDecimals).toString()
        : undefined;

    // we are going to use this timer to refetch a new price every 30 seconds
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    // Timer to update lastUpdated every 30 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
        setLastUpdated(new Date());
        }, 30 * 1000); // 30 seconds in milliseconds
    
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run once on mount
    
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
        }
    }, [
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
        lastUpdated
    ]);

    // get sell token balance
    const { userBalance } = useGetBalance(
        account, 
        sellTokenObject?.address, 
        (
            sellTokenObject?.address === null ||
            sellToken === "eth"
        ) ?
            true : 
            false
    );

  const inSufficientBalance =
  userBalance && sellAmount
      ? parseUnits(sellAmount, sellTokenDecimals) > BigInt(userBalance)
      : true;

    return(
        <Card className="flex flex-col w-full h-full bg-primary text-secondary">
            <CardHeader className="w-full flex flex-row justify-start items-center">
                <CardTitle className="text-5xl">
                    Trade
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 w-full flex flex-col gap-4">
                <PriceSellTokenDisplay
                    setTradeDirection={setTradeDirection}
                    setSellToken={setSellToken}
                    setSellAmount={setSellAmount}
                    setSellTokenValueUSD={setSellTokenValueUSD}
                    userBalance={userBalance}
                    sellAmount={sellAmount}
                    sellTokenObject={sellTokenObject}
                    sellTokenDecimals={sellTokenDecimals}
                />
                <PriceFlipTokens
                    flipTokens={flipTokens}
                />
                <PriceBuyTokenDisplay
                    setTradeDirection={setTradeDirection}
                    setBuyToken={setBuyToken}
                    setBuyAmount={setBuyAmount}
                    buyTokenObject={buyTokenObject}
                    buyAmount={buyAmount}
                    sellTokenValueUSD={sellTokenValueUSD}
                />
                <div className="flex flex-row w-full justify-start items-center">
                    <div className="flex flex-row w-1/2 justify-start">
                        {
                            `Max Slippage: ${slippage}%`
                        }
                    </div>
                    <SlippageSettings
                        slippage={slippage}
                        setSlippage={setSlippage}
                    />
                </div>
                <ZeroXFee
                    zeroExFee={zeroExFee}
                    sellTokenObject={sellTokenObject}
                    sellTokenDecimals={sellTokenDecimals}
                    sellTokenPriceUSD={(Number(sellTokenValueUSD) / Number(sellAmount)).toString()}
                />
                <AlphaPingFee/>
                <AffiliateFeeDisplay
                    price={price}
                    buyTokenObject={buyTokenObject}
                    buyTokenDecimals={buyTokenDecimals}
                />
                <TaxInfoDisplay
                    buyTokenTax={buyTokenTax}
                    sellTokenTax={sellTokenTax}
                    buyTokenObject={buyTokenObject}
                    sellTokenObject={sellTokenObject}
                />
                <LiquidityRoute
                    route={route}
                    buyTokenObject={buyTokenObject}
                    sellTokenObject={sellTokenObject}
                />
                <GasDisplay gasEstimate={gasEstimate}/>
                <ApproveOrReviewButton
                    onClick={() => {
                        setFinalize(true);
                    }}
                    sellTokenAddress={sellTokenObject.address}
                    parsedSellAmount={sellAmount && sellTokenDecimals ? parseUnits(sellAmount, sellTokenDecimals) : BigInt(0)}
                    sellTokenSymbol={sellTokenObject.symbol}
                    sellTokenURI={sellTokenObject.logoURI || null}
                    disabled={inSufficientBalance}
                    price={price}
                />
            </CardContent>
            <PriceFooter/>
        </Card>
    )
}
export default Price;