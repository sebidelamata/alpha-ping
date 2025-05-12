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
import { ethers, formatUnits } from 'ethers'
import formatTax from "src/lib/formatTax";
import Loading from "../Loading";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent
} from "@/components/components/ui/card";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
import { Button } from "@/components/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface IQuote{
    price: any;
    quote: any;
    setQuote: (price: any) => void;
    slippage: string;
    setFinalize: (finalize: boolean) => void;
}

const Quote:React.FC<IQuote> = ({
  price,
  quote,
  setQuote,
  slippage,
  setFinalize
}) => {
    console.log("price", price);

    const { account } = useUserProviderContext()
    const { chainId, signer, provider } = useEtherProviderContext()

    const [error, setError] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

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
                console.log(response)
                const data = await response.json();
                console.log('Quote: Quote data', data);
                if (data.validationErrors?.length > 0) {
                  setError(data.validationErrors.join(", "));
                  setQuote(null);
                } else {
                  setQuote(data);
                  setError(null);
                }
            } catch (err) {
                console.error('Quote: Error fetching quote', err);
                setError("Failed to fetch quote");
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

    const handlePlaceOrder = async () => {
        if (!quote || !signer || !provider) {
          setError("Missing quote, signer, or provider");
          return;
        }
        setIsPending(true);
        setError(null);
        try {
          let txData = quote.transaction.data;
          // Sign Permit2 EIP-712 if provided
          if (quote.permit2?.eip712) {
            try {
              console.log('Quote: Signing Permit2 EIP-712', quote.permit2.eip712);
              const signature = await signer.signTypedData(
                quote.permit2.eip712.domain,
                quote.permit2.eip712.types,
                quote.permit2.eip712.message
              );
              console.log('Quote: Permit2 signature', signature);
              // Append signature length and signature to calldata
              const signatureLengthHex = ethers.toBeHex(signature.length / 2, 32);
              txData = ethers.concat([txData, signatureLengthHex, signature]);
            } catch (err) {
              console.error('Quote: Error signing Permit2', err);
              setError("Failed to sign Permit2");
              setIsPending(false);
              return;
            }
          }
          // Prepare transaction
          const tx = {
            to: quote.transaction.to,
            data: txData,
            value: quote.transaction.value ? BigInt(quote.transaction.value) : undefined,
            gasLimit: quote.transaction.gas ? BigInt(quote.transaction.gas) : undefined,
          };
          console.log('Quote: Sending transaction', tx);
          // Send transaction
          const txResponse = await signer.sendTransaction(tx);
          setTxHash(txResponse.hash);
          setIsConfirming(true);
          console.log('Quote: Transaction sent', txResponse.hash);
          // Wait for confirmation
          const receipt = await txResponse.wait();
          setIsConfirming(false);
          setIsConfirmed(true);
          console.log('Quote: Transaction confirmed', receipt);
        } catch (err: any) {
          console.error('Quote: Transaction error', err);
          setError(err.message || "Transaction failed");
          setIsPending(false);
        }
    };

    // our quote is no good after 30 seconds
    const [quoteSecondsLeft, setQuoteSecondsLeft] = useState<number>(30)
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
                    <CardTitle className="flex justify-center">
                        Quote expires in {quoteSecondsLeft.toString()} seconds
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
                {/* You Pay */}
                <div className="p-4 rounded-sm">
                <div className="text-xl mb-2">You pay</div>
                <div className="flex items-center text-lg sm:text-3xl">
                    <Avatar>
                    <AvatarImage
                        alt={sellTokenObject.symbol}
                        src={sellTokenObject.logoURI || ""}
                        className="h-9 w-9 mr-2"
                    />
                    <AvatarFallback>{sellTokenObject.symbol}</AvatarFallback>
                    </Avatar>
                    <span>{formatUnits(quote.sellAmount, sellTokenObject.decimals)}</span>
                    <div className="ml-2">{sellTokenObject.symbol}</div>
                </div>
                </div>

                {/* You Receive */}
                <div className="p-4 rounded-sm">
                <div className="text-xl mb-2">You receive</div>
                <div className="flex items-center text-lg sm:text-3xl">
                    <Avatar>
                    <AvatarImage
                        alt={buyTokenObject.symbol}
                        src={buyTokenObject.logoURI || ""}
                        className="h-9 w-9 mr-2"
                    />
                    <AvatarFallback>{buyTokenObject.symbol}</AvatarFallback>
                    </Avatar>
                    <span>{formatUnits(quote.buyAmount, buyTokenObject.decimals)}</span>
                    <div className="ml-2">{buyTokenObject.symbol}</div>
                </div>
                </div>

                {/* Fees and Taxes */}
                <div className="p-4 rounded-sm">
                {quote.fees?.integratorFee?.amount && (
                    <div className="text-slate-400">
                    Affiliate Fee: {formatUnits(quote.fees.integratorFee.amount, buyTokenObject.decimals)} {buyTokenObject.symbol}
                    </div>
                )}
                {quote.tokenMetadata.buyToken.buyTaxBps !== "0" && (
                    <div>
                    {buyTokenObject.symbol} Buy Tax: {formatTax(quote.tokenMetadata.buyToken.buyTaxBps)}%
                    </div>
                )}
                {quote.tokenMetadata.sellToken.sellTaxBps !== "0" && (
                    <div>
                    {sellTokenObject.symbol} Sell Tax: {formatTax(quote.tokenMetadata.sellToken.sellTaxBps)}%
                    </div>
                )}
                </div>

                {/* Place Order Button */}
                <Button
                className="font-bold py-2 px-4 rounded w-full"
                disabled={isPending || isConfirming || quoteExpired}
                onClick={handlePlaceOrder}
                variant={"default"}
                >
                {isPending || isConfirming ? "Confirming..." : "Place Order"}
                </Button>

                {/* Transaction Status */}
                {isConfirming && (
                <div className="text-center">Waiting for confirmation ⏳ ...</div>
                )}
                {isConfirmed && (
                <div className="text-center">
                    Transaction Confirmed! 🎉{" "}
                    <a
                    href={`https://arbiscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    Check Arbiscan
                    </a>
                </div>
                )}
                {error && (
                <div className="text-red-500 text-center">Error: {error}</div>
                )}
            </CardContent>
            </Card>
    )
}

export default Quote;