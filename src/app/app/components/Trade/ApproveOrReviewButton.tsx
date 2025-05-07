import React, {
    useState,
    useEffect
} from "react";
import { Button } from "@/components/components/ui/button";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { useUserProviderContext } from "src/contexts/UserContext";
import ERC20Faucet from '../../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { ethers } from 'ethers'
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/components/ui/avatar";
import { useToast } from "@/components/hooks/use-toast"
import { 
    ShieldCheck, 
    CircleX 
} from "lucide-react";
import Link from "next/link";
import qs from "qs";

interface IApproveOrReviewButton {
    onClick: () => void;
    sellTokenAddress: string;
    parsedSellAmount: bigint;
    sellTokenSymbol: string;
    sellTokenURI: string | null;
    disabled?: boolean;
    price: any;
}

interface ErrorType {
    reason: string
}

const ApproveOrReviewButton: React.FC<IApproveOrReviewButton> = ({
    onClick,
    sellTokenAddress,
    parsedSellAmount,
    sellTokenSymbol,
    sellTokenURI,
    disabled,
    price,
  }) => {

    const { toast } = useToast()
    const { signer } = useEtherProviderContext()
    const { account } = useUserProviderContext()
  
    const [ userAllowance, setUserAllowance ] = useState<string | null>(null)
    useEffect(() => {
        const getUserAllowance = async () => {
            if(
                sellTokenAddress &&
                signer &&
                account &&
                price?.issues?.allowance?.spender
            ){
                const token = new ethers.Contract(
                    sellTokenAddress,
                    ERC20Faucet.abi,
                    signer
                )
            const userAllowance = await token.allowance(account, price.issues.allowance.spender)
            setUserAllowance(userAllowance.toString())
          }
      }
      getUserAllowance()
    }, [ sellTokenAddress, signer, account, price])

    // 2. (only if insufficent allowance): write to erc20, approve token allowance for the determined spender
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [txMessage, setTxMessage] = useState<string | null>(null)
    const handleApprove = async () => {
        if (!signer || !sellTokenAddress || !price?.issues?.allowance?.spender) {
            console.error("Signer or sellTokenAddress is not available");
            return;
        }
        try {
            setError(null)
            setLoading(true)
            const tokenContract = new ethers.Contract(
                sellTokenAddress,
                ERC20Faucet.abi,
                signer
            )
            const maxApproval = ethers.MaxUint256
            const tx = await tokenContract.approve(price.issues.allowance.spender, maxApproval);
            await tx.wait();
            if(tx !== undefined && tx.hash !== undefined){
                setTxMessage(tx?.hash)
            }
            setUserAllowance(maxApproval.toString()); // optimistically update
          } catch (error: unknown) {
            if((error as ErrorType).reason){
                setError((error as ErrorType).reason)
            }
            if(error !== null && (error as ErrorType).reason !== undefined){
                toast({
                    title: "Transaction Error!",
                    description: `Aprove ${sellTokenSymbol} failed!`,
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
        } finally { 
            setLoading(false)
            if(txMessage !== null){
                toast({
                    title: "Transaction Confirmed!",
                    description: `Aprrove ${sellTokenSymbol} Completed!`,
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
        }
    }

    // If price.issues.allowance is null, show the Review Trade button
    if (price?.issues.allowance === null) {
        return (
            <Button
                type="button"
                disabled={disabled}
                onClick={() => {
                // fetch data, when finished, show quote view
                onClick();
                }}
            >
                {disabled ? "Insufficient Balance" : "Review Trade"}
            </Button>
        );
    }

    return (
        <div className="flex flex-col w-full">
            {
                userAllowance && 
                BigInt(userAllowance) < parsedSellAmount && (
                    <Button
                        variant="ghost"
                        onClick={handleApprove}
                    >
                        <div className="flex flex-row items-center gap-2">
                            <div>
                                {`Approve ${sellTokenSymbol}`}
                            </div>
                            {
                                sellTokenURI && 
                                <Avatar>
                                    <AvatarImage
                                        src={sellTokenURI}
                                        alt="Token Image"
                                        className="w-4 h-4"
                                    />
                                    <AvatarFallback>
                                        {
                                            sellTokenSymbol || "0x"
                                        }
                                    </AvatarFallback>
                                </Avatar>
                            }
                        </div>
                    </Button>
                ) 
            }
            <Button className="w-full bg-primary text-secondary hover:bg-secondary hover:text-primary">
                Review
            </Button>
        </div>
    );
}
export default ApproveOrReviewButton;
