'use client';

import React, {
    useState,
    useEffect
} from "react";
import tokensByChain from "src/lib/tokensByChain";
import tokenList from "../../../../../public/tokenList.json";
import { useUserProviderContext } from "src/contexts/UserContext";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import qs from 'qs'
import Loading from "../Loading";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent
} from "@/components/components/ui/card";
import { Button } from "@/components/components/ui/button";
import { ArrowLeft } from "lucide-react";
import QuoteSellTokenDisplay from "./QuoteSellTokenDisplay"
import QuoteBuyTokenDisplay from "./QuoteBuyTokenDisplay";
import { CircleArrowRight } from "lucide-react";
import AffiliateFeeDisplay from "./AffiliateFeeDisplay";
import TaxInfoDisplay from "./TaxInfoDisplay";
import LiquidityRoute from "./LiquidityRoute";
import GasDisplay from "./GasDisplay";
import PlaceOrderButton from "./PlaceOrderButton";
import BroadcastTrade from "./BroadcastTrade";
import { AlphaPING } from "typechain-types";

interface IQuote{
    price: PriceResponse;
    quote: QuoteResponse | null | undefined;
    setQuote: (price: QuoteResponse | null) => void;
    slippage: string;
    setFinalize: (finalize: boolean) => void;
}

interface Fills{
    from: string;
    to: string;
    source: string;
    proportionBps: string;
}

const Quote:React.FC<IQuote> = ({
  price,
  quote,
  setQuote,
  slippage,
  setFinalize
}) => {

    const { account } = useUserProviderContext()
    const { chainId } = useEtherProviderContext()

    //for buy value percent difference
    const [sellTokenValueUSD, setSellTokenValueUSD] = useState<string | null>(null)

    // Get token objects
    const sellTokenObject = tokensByChain(tokenList, Number(chainId))
        .filter((token) => token.address.toLowerCase() === price.sellToken.toLowerCase()
        )[0];
    console.log(sellTokenObject)
    const buyTokenObject = tokensByChain(tokenList, Number(chainId))
        .filter(
        (token) => token.address.toLowerCase() === price.buyToken.toLowerCase()
        )[0];

    // Fetch quote data
    useEffect(() => {
        const params = {
        chainId: chainId,
        sellToken: price.sellToken,
        buyToken: price.buyToken,
        sellAmount: price.sellAmount,
        taker: account,
        swapFeeRecipient: process.env.NEXT_PUBLIC_FEE_RECIPIENT,
        swapFeeBps: process.env.NEXT_PUBLIC_AFFILIATE_FEE,
        swapFeeToken: price.buyToken,
        tradeSurplusRecipient: process.env.NEXT_PUBLIC_FEE_RECIPIENT,
        slippageBps: (Number(slippage) * 100).toFixed(0),
        };

        async function main() {
            try {
                console.log('Quote: Fetching quote with params', params);
                const response = await fetch(`/api/quote?${qs.stringify(params)}`);
                const data = await response.json();
                console.log('Quote: Quote data', data);
                if (data.validationErrors?.length > 0) {
                  setQuote(null);
                } else {
                  setQuote(data);
                }
            } catch (err) {
                console.error('Quote: Error fetching quote', err);
                setQuote(null);
            }
        }
        main();
    }, [
        chainId,
        price.sellToken,
        price.buyToken,
        price.sellAmount,
        account,
        setQuote,
        slippage
    ]);

    // our quote is no good after 60 seconds
    const [quoteSecondsLeft, setQuoteSecondsLeft] = useState<number>(60)
    const [quoteExpired, setQuoteExpired] = useState<boolean>(false)
    useEffect(() => {
        const intervalId = setInterval(() => {
            setQuoteSecondsLeft((prev) => {
              if (prev <= 1) {
                clearInterval(intervalId);
                setQuoteExpired(true);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        
          return () => clearInterval(intervalId);
    }, [])

    // whether we should broadcast the trade to chat
    const [isBroadcasting, setIsBroadcasting] = useState(true);
    // set the channel to broadcast to
    const [buyTokenChannel, setBuyTokenChannel] = useState<AlphaPING.ChannelStructOutput | null>(null);


  if (!quote) {
    return (
      <Loading/>
    );
  }
    

    return(
        <Card className="flex flex-col w-full h-full bg-primary text-secondary">
            <CardHeader>
                {
                    quoteExpired === false ?
                    <CardTitle className="flex justify-center gap-4">
                        <Button 
                            variant={"outline"}
                            onClick={() => setFinalize(false)}  
                            className="flex flex-row w-96 gap-4 justify-center"  
                        >
                            <ArrowLeft/>
                        </Button>
                        <div className="flex justify-center">
                            Quote expires in {quoteSecondsLeft.toString()} seconds
                        </div>
                    </CardTitle> :
                    <CardTitle className="text-red-500 flex justify-center w-full">
                        <Button 
                            variant={"destructive"}
                            onClick={() => setFinalize(false)}  
                            className="flex flex-row w-96 gap-4 justify-center"  
                        >
                            <ArrowLeft/>
                            <div>
                                Quote Expired
                            </div>
                        </Button>
                    </CardTitle>
                }
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flew-wrap w-full gap-4 items-center">
                    <QuoteSellTokenDisplay
                        sellTokenObject={sellTokenObject}
                        sellAmount={quote.sellAmount}
                        sellTokenValueUSD={sellTokenValueUSD}
                        setSellTokenValueUSD={setSellTokenValueUSD}
                    />
                    <div className="flex h-full justify-center items-center">
                        <CircleArrowRight className="text-accent size-20"/>
                    </div>
                    <QuoteBuyTokenDisplay
                        buyTokenObject={buyTokenObject}
                        buyAmount={quote.buyAmount}
                        sellTokenValueUSD={sellTokenValueUSD}
                        setSellTokenValueUSD={setSellTokenValueUSD}
                    />
                </div>
                {/* Fees and Taxes */}
                <div className="p-4 rounded-sm">
                    {
                        quote.fees?.integratorFee?.amount &&
                        <AffiliateFeeDisplay
                            price={quote}
                            buyTokenObject={buyTokenObject}
                            buyTokenDecimals={buyTokenObject.decimals}
                        />
                    }
                    {
                        quote.tokenMetadata.buyToken.buyTaxBps !== "0" &&
                        quote.tokenMetadata.buyToken.buyTaxBps !== null &&
                        quote.tokenMetadata.sellToken.sellTaxBps !== "0" &&
                        quote.tokenMetadata.sellToken.sellTaxBps !== null &&
                        (
                            <TaxInfoDisplay
                                buyTokenTax={quote.tokenMetadata.buyToken.buyTaxBps}
                                sellTokenTax={quote.tokenMetadata.sellToken.sellTaxBps}
                                buyTokenObject={buyTokenObject}
                                sellTokenObject={sellTokenObject}
                            />
                        )
                    }
                </div>
                <BroadcastTrade 
                    buyTokenAddress={quote.buyToken}
                    isBroadcasting={isBroadcasting}
                    setIsBroadcasting={setIsBroadcasting}
                    setBuyTokenChannel={setBuyTokenChannel}
                />
                <LiquidityRoute
                    route={quote.route.fills.map((r: Fills) => r.source)}
                    buyTokenObject={buyTokenObject}
                    sellTokenObject={sellTokenObject}
                />
                {
                    quote?.totalNetworkFee &&
                    <GasDisplay gasEstimate={(Number(quote.totalNetworkFee) / 1e18).toString()}/>
                }
                <PlaceOrderButton
                    quote={quote}
                    quoteExpired={quoteExpired}
                    isBroadcasting={isBroadcasting} 
                    buyTokenChannel={buyTokenChannel}
                />
            </CardContent>
            </Card>
    )
}

export default Quote;