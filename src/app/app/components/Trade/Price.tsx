'use client'

import React, { useState } from "react";
import { parseUnits } from "ethers";
import { 
    Card, 
    CardHeader, 
    CardContent
} from "@/components/components/ui/card";
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
import SlippageSettings from "./SlippageSettings";
import useGetBalance from "src/hooks/useGetBalance";
import useGetPriceData from "src/hooks/useGetPriceData";
import PriceHeader from "./PriceHeader";

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
    const { chainId } = useEtherProviderContext()

    const [sellToken, setSellToken] = useState<string>("usdc");
    const [sellTokenValueUSD, setSellTokenValueUSD] = useState<string | null>(null);
    const [buyToken, setBuyToken] = useState<string>("weth");
    const [sellAmount, setSellAmount] = useState<string>("");
    const [buyAmount, setBuyAmount] = useState<string>("");
    const [tradeDirection, setTradeDirection] = useState<string>("sell");

    // flip tokens and values
    const flipTokens = (
        sellToken: string, 
        buyToken: string,
        sellAmount: string,
        buyAmount: string
    ) => {
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

    const {
        buyTokenTax,
        sellTokenTax,
        zeroExFee,
        route,
        gasEstimate
    } = useGetPriceData(
        setBuyAmount,
        sellAmount,
        buyTokenObject,
        sellTokenObject,
        parsedSellAmount,
        parsedBuyAmount,
        buyTokenDecimals,
        setPrice,
        slippage
    )

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
        : true

    return(
        <Card className="flex flex-wrap w-full h-full bg-primary text-secondary gap-6">
            <CardHeader className="flex flex-row justify-start p-0">
                <PriceHeader    
                    buyTokenObject={buyTokenObject}
                    sellTokenObject={sellTokenObject}
                />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-2 p-0 justify-start">
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
                    sellToken={sellToken}
                    buyToken={buyToken}
                    sellAmount={sellAmount}
                    buyAmount={buyAmount}
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
        </Card>
    )
}
export default Price;