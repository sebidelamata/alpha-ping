import React, {
    useState
} from "react";
import { Button } from "@/components/components/ui/button";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { ethers } from 'ethers';
import { useToast } from "@/components/hooks/use-toast"
import { 
    ShieldCheck, 
    CircleX 
} from "lucide-react";
import Link from "next/link";
import { QuoteResponse } from "src/types/global";

interface IPlaceOrderButton{
    quote: QuoteResponse;
    quoteExpired: boolean;
}

interface ErrorType {
    reason: string
}

const PlaceOrderButton:React.FC<IPlaceOrderButton> = ({
    quote,
    quoteExpired,
}) => {

    const { toast } = useToast()
    const { signer, provider } = useEtherProviderContext()

    const [txHash, setTxHash] = useState<string | null>(null);
    const [txMessage, setTxMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [isConfirming, setIsConfirming] = useState<boolean>(false);

    const handlePlaceOrder = async () => {
        if (!quote || !signer || !provider) {
            return;
        }
        setLoading(true);
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
            } catch (error) {
                console.error('Quote: Error signing Permit2', error);
                setLoading(false);
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
            if(
                receipt !== undefined && 
                receipt !== null && 
                receipt.hash !== undefined
            ){
                setTxMessage(receipt?.hash)
            }
            setIsConfirming(false);
            console.log('Quote: Transaction confirmed', receipt);
        } catch (error: unknown) {
            if(error !== null && (error as ErrorType).reason !== undefined){
                toast({
                    title: "Transaction Error!",
                    description: `Swap failed!`,
                    duration:5000,
                    action: (
                        <div className="flex flex-col gap-1 justify-center items-center">
                            <CircleX size={40}/>
                            <div className="flex flex-col gap-1 text-sm">
                            {
                                (error as ErrorType).reason.length > 100 ?
                                `${(error as ErrorType).reason.slice(0,100)}...` :
                                (error as ErrorType).reason
                            }
                            </div>
                        </div>
                    ),
                    variant: "destructive",
                })
            }
        }finally{
            setLoading(false)
            if(txMessage !== null){
                toast({
                    title: "Transaction Confirmed!",
                    description: `Swap Completed!`,
                    duration:5000,
                    action: (
                        <div className="flex flex-row gap-1">
                            <ShieldCheck size={80}/>
                            <div className="flex flex-col gap-1">
                                <p>View Transaction on</p>
                                <Link 
                                    href={`https://arbiscan.io/tx/${txHash}`} 
                                    target="_blank"
                                    className="text-accent"
                                >
                                    Arbiscan
                                </Link>
                            </div>
                        </div>
                    )
                })
            }
        }
    };

    return(
        <Button
            className="font-bold py-2 px-4 rounded w-full"
            disabled={loading || isConfirming || quoteExpired}
            onClick={handlePlaceOrder}
            variant={"secondary"}
            >
            {loading || isConfirming ? "Confirming..." : "Place Order"}
        </Button>
    )
}

export default PlaceOrderButton;