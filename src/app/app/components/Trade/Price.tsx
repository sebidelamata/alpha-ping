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
    CardContent, 
    CardFooter 
} from "@/components/components/ui/card";
import ERC20Faucet from '../../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { permit2Abi } from "src/lib/permit2abi";
import qs from 'qs'
import ZeroExLogo from "../../../../../public/dark-0x-logo.png";
import tokenList from "../../../../../public/tokenList.json";
import { ethers } from 'ethers'
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useUserProviderContext } from "src/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import tokensByChain from "src/lib/tokensByChain";
import { Label } from "@/components/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/components/ui/select";
import { Input } from "@/components/components/ui/input";
import { Button } from "@/components/components/ui/button";
import { ArrowDownUp } from "lucide-react";
import { Separator } from "@/components/components/ui/separator";
import ApproveOrReviewButton from "./ApproveOrReviewButton";
import SellTokenPriceUSD from "./SellTokenPriceUSD";
import { Badge } from "@/components/components/ui/badge";

export const DEFAULT_BUY_TOKEN = (chainId: number) => {
    if (chainId === 42161) {
      return "weth";
    }
  };

interface IPrice {
    price: any;
    setPrice: (price: any) => void;
    setFinalize: (finalize: boolean) => void;
}

const Price:React.FC<IPrice> = ({
    price,
    setPrice,
    setFinalize,
}) => {

    const { chainId, signer } = useEtherProviderContext()
    const { account } = useUserProviderContext()
    const { currentChannel } = useChannelProviderContext()

    const [sellToken, setSellToken] = useState("weth");
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

    // update token values for swap
    const handleSellTokenChange = (value: string) => {
        setSellToken(value);
    };
    const handleBuyTokenChange = (value: string) => {
        setBuyToken(value);
    }
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
    
    // Fetch price data and set the buyAmount whenever the sellAmount changes
    useEffect(() => {
        const params = {
        chainId: chainId,
        sellToken: sellTokenObject.address,
        buyToken: buyTokenObject.address,
        sellAmount: parsedSellAmount,
        buyAmount: parsedBuyAmount,
        signer: signer,
        swapFeeRecipient: process.env.NEXT_PUBLIC_FEE_RECIPIENT,
        swapFeeBps: process.env.NEXT_PUBLIC_AFFILIATE_FEE,
        swapFeeToken: buyTokenObject.address,
        tradeSurplusRecipient: process.env.NEXT_PUBLIC_FEE_RECIPIENT,
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
        signer
    ]);

  // Hook for fetching balance information for specified token for a specific taker address
  const [ userBalance, setUserBalance ] = useState<string | null>(null)
  useEffect(() => {
    const getUserBalance = async () => {
        if(sellTokenObject.address !== null){
            const token = new ethers.Contract(
                sellTokenObject.address,
                ERC20Faucet.abi,
                signer
            )
            const userBalance = await token.balanceOf(account)
            setUserBalance(userBalance.toString())
        }
    }
    getUserBalance()
}, [ sellTokenObject.address, signer, account])

  const inSufficientBalance =
  userBalance && sellAmount
      ? parseUnits(sellAmount, sellTokenDecimals) > BigInt(userBalance)
      : true;

  // Helper function to format tax basis points to percentage
  const formatTax = (taxBps: string) => (parseFloat(taxBps) / 100).toFixed(2);

  //function to enter max balance to sell
  const handleMaxSellAmount = () => {
    if (userBalance && sellTokenDecimals) {
        const balance = formatUnits(
            BigInt(userBalance),
            sellTokenDecimals
        );
        setTradeDirection("sell")
        setSellAmount(balance);
    }
  };


    return(
        <Card className="flex flex-col h-full w-[100%] bg-primary text-secondary">
            <CardHeader className="w-[100%] flex flex-row justify-start items-center">
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
            <CardContent>
                <section className="mt-4 flex flex-col items-start justify-center gap-4">
                    <div className="flex flex-row">
                        <Label
                            htmlFor="sell-select"
                            className="w-36"
                        >
                            <div className="text-3xl">
                                Sell
                            </div>
                        </Label>
                    </div>
                    <div className="flex flex-row w-full justify-between items-baseline">
                        <div className="text-accent items-bottom justify-start text-sm">
                            Balance: {userBalance && sellTokenDecimals ?
                                Number(
                                    formatUnits(
                                        BigInt(userBalance),
                                        sellTokenDecimals
                                    )
                                ).toFixed(8) + "... " + sellTokenObject.symbol : 
                                null
                            }   
                        </div>
                        <Button
                            className="text-xl"
                            variant="outline"
                            onClick={handleMaxSellAmount}
                            //disabled={inSufficientBalance}
                        >
                            Max
                        </Button>
                    </div>
                    {
                        sellTokenObject.symbol !== undefined &&
                        <SellTokenPriceUSD sellTokenSymbol={sellTokenObject.symbol}/>
                    }
                    <div className="flex flex-row w-full gap-2">
                        <Select
                            value={sellToken}
                            name="sell-token-select"
                            onValueChange={handleSellTokenChange}
                        >
                            <SelectTrigger
                                id="sell-token-select"
                                className="mr-2 w-50 sm:w-full h-16 rounded-md text-3xl"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                            {
                                tokensByChain(tokenList, Number(chainId))
                                    .map((token) => (
                                        <SelectItem
                                            key={token.address}
                                            value={token.symbol.toLowerCase()}
                                        >
                                            <div className="flex flex-row items-center justify-start gap-4">
                                                <Avatar>
                                                    <AvatarImage 
                                                        alt={token.symbol}
                                                        src={
                                                            (
                                                                token !== null && 
                                                                token.logoURI !== null
                                                            ) ? 
                                                            token.logoURI : 
                                                            ""
                                                        } 
                                                        className="h-12 w-12"
                                                    />
                                                    <AvatarFallback>
                                                        {token.symbol}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    {token.symbol}
                                                </div>
                                            </div>
                                        </SelectItem>
                                ))
                            }
                            </SelectContent>
                        </Select>
                        <Label htmlFor="sell-amount"/>
                        <Input
                            className="h-16 rounded-md text-3xl"
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*[.]?[0-9]*"
                            placeholder="0.0"
                            onBeforeInput={(e) => {
                                const inputEvent = e.nativeEvent as InputEvent;
                                if (inputEvent.data && !/[\d.]/.test(inputEvent.data)) {
                                  e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow only numbers and a single decimal point
                                if (/^\d*\.?\d*$/.test(value)) {
                                  setTradeDirection("sell");
                                  setSellAmount(value);
                                }
                            }}
                            value={sellAmount}
                        >
                        </Input>
                    </div>
                </section>
                <section className="flex flex-col items-center justify-center gap-4">
                    <Separator color="accent"/>
                    <Button 
                        onClick={flipTokens} 
                        className="mt-4 h-30 w-30 text-4xl justify-center align-middle items-center scale-150" 
                        variant={"outline"}
                    >
                        <ArrowDownUp size={48}/>
                    </Button>
                    <Separator color="accent"/>
                </section>
                <section className="mt-4 flex flex-col items-start justify-center gap-4">
                    <div className="flex flex-row">
                        <Label
                            htmlFor="buy-select"
                            className="w-36"
                        >
                            <div className="text-3xl">
                                Buy
                            </div>
                        </Label>
                    </div>
                    <div className="flex flex-row w-full gap-2">
                        <Select
                            value={buyToken}
                            name="buy-token-select"
                            onValueChange={handleBuyTokenChange}
                        >
                            <SelectTrigger
                                id="buy-token-select"
                                className="mr-2 w-50 sm:w-full h-16 rounded-md text-3xl"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                            {
                                tokensByChain(tokenList, Number(chainId))
                                    .map((token) => (
                                        <SelectItem
                                            key={token.address}
                                            value={token.symbol.toLowerCase()}
                                        >
                                            <div className="flex flex-row items-center justify-start gap-4">
                                                <Avatar>
                                                    <AvatarImage 
                                                        alt={token.symbol}
                                                        src={
                                                            (
                                                                token !== null && 
                                                                token.logoURI !== null
                                                            ) ? 
                                                            token.logoURI : 
                                                            ""
                                                        } 
                                                        className="h-12 w-12"
                                                    />
                                                    <AvatarFallback>
                                                        {token.symbol}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    {token.symbol}
                                                </div>
                                            </div>
                                        </SelectItem>
                                ))
                            }
                            </SelectContent>
                        </Select>
                        <Label htmlFor="buy-amount"/>
                        <Input
                            id="buy-amount"
                            value={buyAmount}
                            className="h-16 rounded-md text-3xl cursor-not-allowed"
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*[.]?[0-9]*"
                            placeholder="0.0"
                            onBeforeInput={(e) => {
                                const inputEvent = e.nativeEvent as InputEvent;
                                if (inputEvent.data && !/[\d.]/.test(inputEvent.data)) {
                                e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow only numbers and a single decimal point
                                if (/^\d*\.?\d*$/.test(value)) {
                                setTradeDirection("buy");
                                setBuyAmount(value);
                                }
                            }}
                            disabled={true}
                        >
                        </Input>
                    </div>
                </section>
                {/* Affiliate Fee Display */}
                <div className="text-slate-400">
                    {
                        price && 
                        price.fees.integratorFee !== null 
                        && price.fees.integratorFee.amount ? 
                            "Affiliate Fee: " +
                            Number(
                            formatUnits(
                                BigInt(price.fees.integratorFee.amount),
                                buyTokenDecimals
                            )
                            ) +
                            " " +
                            buyTokenObject.symbol: 
                            null
                    }
                </div>
                {/* Tax Information Display */}
                <div className="text-slate-400">
                    {buyTokenTax.buyTaxBps !== "0" &&
                        <Badge variant={"destructive"}>
                            {
                            buyTokenObject.symbol +
                            ` Buy Tax: ${formatTax(buyTokenTax.buyTaxBps)}%`
                            }
                        </Badge>
                    }
                    {sellTokenTax.sellTaxBps !== "0" && (
                    <Badge variant={"destructive"}>
                        {
                        sellTokenObject.symbol +
                        ` Sell Tax: ${formatTax(sellTokenTax.buyTaxBps)}%`
                        }
                    </Badge>
                    )}
                </div>
                <Separator color="accent" className="h-4" />
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
            <CardFooter>
                <div className="flex flex-col gap-1">
                    <div>
                        Swap at the best prices using 0x aggregator
                    </div>
                    <div className="text-accent">
                        0x collects a fee of 0.15% on each swap,
                    </div>
                    <div className="text-accent">
                        AlphaPING collects 0% on each swap, for a total of a 0.15% fee.
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
export default Price;