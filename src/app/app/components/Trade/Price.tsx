'use client'

import React, {
    useEffect,
    useState,
} from "react";
import { 
    formatUnits, 
    parseUnits,
    ethers
} from "ethers";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent
} from "@/components/components/ui/card";
import { permit2Abi } from "src/lib/permit2abi";
import ERC20Faucet from '../../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import qs from 'qs'
import ZeroExLogo from "../../../../../public/dark-0x-logo.png";
import tokenList from "../../../../../public/tokenList.json";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "src/contexts/UserContext";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@radix-ui/react-avatar";
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

export const DEFAULT_BUY_TOKEN = (chainId: number) => {
    if (chainId === 42161) {
      return "weth";
    }
  };

interface IPrice {
    price: any;
    setPrice: (price: any) => void;
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
    const { chainId, signer, provider } = useEtherProviderContext()

    const [sellToken, setSellToken] = useState("weth");
    const [sellTokenValueUSD, setSellTokenValueUSD] = useState<string | null>(null);
    const [buyToken, setBuyToken] = useState<string>("usdc");
    const [sellAmount, setSellAmount] = useState("");
    const [buyAmount, setBuyAmount] = useState("");
    const [tradeDirection, setTradeDirection] = useState("sell");
    const [error, setError] = useState([]);
    const [buyTokenTax, setBuyTokenTax] = useState({
      buyTaxBps: "0",
      sellTaxBps: "0",
    });
    const [sellTokenTax, setSellTokenTax] = useState({
      buyTaxBps: "0",
      sellTaxBps: "0",
    });
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

            if (data?.validationErrors?.length > 0) {
                // error for sellAmount too low
                setError(data.validationErrors);
            } else {
                setError([]);
            }
            if (data.buyAmount) {
                setBuyAmount(formatUnits(data.buyAmount, buyTokenDecimals));
                setPrice(data);
            }
            // Set token tax information
            if (data?.tokenMetadata) {
                setBuyTokenTax(data.tokenMetadata.buyToken);
                setSellTokenTax(data.tokenMetadata.sellToken);
            }
            // set zero ex trade fee info
            if(data?.fees && data?.fees.zeroExFee) {
                setZeroExFee(data.fees.zeroExFee.amount);
            }
            // set liquidity route
            if (data?.route) {
                const routeSources = data.route.fills.map((r: any) => r.source);
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

    // Hook for fetching balance information for specified token for a specific taker address
    const [ userBalance, setUserBalance ] = useState<string | null>(null)
    useEffect(() => {
        const getUserBalance = async () => {
            if (!provider || !account) {
                setUserBalance(null);
                return;
            }

            try {
                // Check if the token is ETH (native token)
                if (sellToken.toLowerCase() === 'eth' || sellTokenObject?.address === null) {
                    // Fetch native ETH balance
                    const balance = await provider.getBalance(account);
                    setUserBalance(balance.toString());
                } else {
                    // Fetch ERC-20 token balance
                    const token = new ethers.Contract(
                        sellTokenObject.address,
                        ERC20Faucet.abi,
                        signer
                    );
                    const userBalance = await token.balanceOf(account);
                    setUserBalance(userBalance.toString());
                }
            } catch (error) {
                console.error('Error fetching balance:', error);
                setUserBalance(null);
            }
        };
    getUserBalance()
}, [ sellTokenObject.address, signer, account, provider, sellToken])

  const inSufficientBalance =
  userBalance && sellAmount
      ? parseUnits(sellAmount, sellTokenDecimals) > BigInt(userBalance)
      : true;

    return(
        <Card className="flex flex-col w-full h-full bg-primary text-secondary">
            <CardHeader className="w-full flex flex-row justify-start items-center">
                <CardTitle className="text-5xl">
                    Trade with
                </CardTitle>
                <Avatar>
                    <AvatarImage src={ZeroExLogo.src} className="h-24"/>
                    <AvatarFallback>
                        0x
                    </AvatarFallback>
                   </Avatar>
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
                    slippage={slippage}
                    setSlippage={setSlippage}
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
                <div>
                    {
                        `Max Slippage: ${slippage}%`
                    }
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