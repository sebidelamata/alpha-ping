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
import {confetti} from "tsparticles-confetti"
import tokenList from "../../../../../public/tokenList.json";
import tokensByChain from "src/lib/tokensByChain";
import { useSocketProviderContext } from "../../../../contexts/SocketContext"
import { useUserProviderContext } from "src/contexts/UserContext";
import { AlphaPING } from "typechain-types";
import ERC20Faucet from '../../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'

interface IPlaceOrderButton{
    quote: QuoteResponse;
    quoteExpired: boolean;
    isBroadcasting: boolean;
    buyTokenChannel: AlphaPING.ChannelStructOutput | null;
}

interface ErrorType {
    reason: string
}

const PlaceOrderButton:React.FC<IPlaceOrderButton> = ({
    quote,
    quoteExpired,
    isBroadcasting,
    buyTokenChannel
}) => {

    const { toast } = useToast()
    const { 
        signer, 
        provider, 
        chainId 
    } = useEtherProviderContext()
    const { account } = useUserProviderContext()
    const { socket } = useSocketProviderContext()

    const [txMessage, setTxMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [isConfirming, setIsConfirming] = useState<boolean>(false);

    //buy token balance after transaction to attach to message
    const [userBalance, setUserBalance] = useState<string | null>(null);

    // buy token image for our confetti
    const buyTokenImage = tokensByChain(tokenList, Number(chainId)).find(
        (token) => token.address.toLowerCase() === quote.buyToken.toLowerCase()
    )?.logoURI || "erc20Icon.svg";
    // buy token image for our confetti
    const buyTokenObject = tokensByChain(tokenList, Number(chainId)).find(
        (token) => token.address.toLowerCase() === quote.buyToken.toLowerCase()
    );

    // function to post message to chat if broadcasting
    const sendMessage = async (userBalance:string) => {
        if(!buyTokenChannel || !signer || !socket){
            return;
        }
        // post timestamp
        const now: Date = new Date
        // Format the buy amount with proper decimals
        const formattedBuyAmount = (BigInt(quote.buyAmount) / BigInt(10 ** (buyTokenObject?.decimals || 18))).toString() || "0";
        // create message object
        const messageObj = {
          channel: buyTokenChannel.id.toString(),
          account: account.toString(),
          text: `I just bought ${formattedBuyAmount} ${buyTokenChannel.name} on AlphaPING!`,
          timestamp: now.toISOString(),
          messageTimestampTokenAmount: userBalance.toString(),
          reactions: {},
          replyId: null
        }
        // prevent blanks and only if there is a connection
        if (socket !== null) {
          socket.emit('new message', messageObj)
        }
    }

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
                    
                    // Create types object without EIP712Domain for ethers v6
                    const cleanTypes = Object.fromEntries(
                        Object.entries(quote.permit2.eip712.types).filter(([key]) => key !== 'EIP712Domain')
                    );
                    
                    const signature = await signer.signTypedData(
                        quote.permit2.eip712.domain,
                        cleanTypes,
                        quote.permit2.eip712.message
                    );
                    console.log('Quote: Permit2 signature', signature);
                    
                    // Calculate signature byte length correctly
                    // Remove '0x' prefix and divide by 2 to get byte length
                    const signatureBytes = (signature.length - 2) / 2;
                    const signatureLengthHex = ethers.toBeHex(signatureBytes, 32);
                    
                    // Append signature length and signature to calldata
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
            setIsConfirming(true);
            console.log('Quote: Transaction sent', txResponse.hash);
            
            // Wait for confirmation
            const receipt = await txResponse.wait();
            const receiptHash = receipt?.hash;
            if(receiptHash) {
                setTxMessage(receiptHash);
                toast({
                    title: "Transaction Confirmed!",
                    description: `Swap Completed!`,
                    duration: 5000,
                    action: (
                        <div className="flex flex-row gap-1">
                            <ShieldCheck size={80} />
                            <div className="flex flex-col gap-1">
                                <p>View Transaction on</p>
                                <Link
                                    href={`https://arbiscan.io/tx/${receiptHash}`}
                                    target="_blank"
                                    className="text-accent"
                                >
                                    Arbiscan
                                </Link>
                            </div>
                        </div>
                    )
                });
            }
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
            try {
                if(buyTokenObject !== undefined && buyTokenObject !== null){
                    // Check if the token is ETH (native token)
                    if (buyTokenObject?.symbol.toLowerCase() === 'eth' || buyTokenObject?.address === null) {
                        // Fetch native ETH balance
                        const balance = await provider.getBalance(account);
                        setUserBalance(balance.toString());
                    } else {
                        // Fetch ERC-20 token balance
                        const token = new ethers.Contract(
                            buyTokenObject?.address,
                            ERC20Faucet.abi,
                            signer
                        );
                        const tokenBalance = await token.balanceOf(account);
                        setUserBalance(tokenBalance.toString());
                    }
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
                                            href={`https://arbiscan.io/tx/${txMessage}`} 
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
                    if(isBroadcasting === true){
                        await sendMessage(userBalance || "0");
                    }
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 1 },
                        shapes: ["image"],
                        scalar: 6, 
                        disableForReducedMotion: true,
                        shapeOptions: {
                            image: [
                                {
                                    src: "Apes.svg",
                                    width: 32, 
                                    height: 32, 
                                },
                                {
                                    src: buyTokenImage,
                                    width: 32, 
                                    height: 32, 
                                },
                            ]
                        }
                    });
                }
            } catch (error) {
                console.error('Error in finally block:', error);
            }
        }
    }

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