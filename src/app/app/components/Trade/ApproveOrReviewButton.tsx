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

interface IApproveOrReviewButton {
    onClick: () => void;
    sellTokenAddress: string;
    parsedSellAmount: bigint;
    sellTokenSymbol: string;
    sellTokenURI: string | null;
    disabled?: boolean;
    price: any;
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

    // 2. (only if insufficent allowance): write to erc20, approve token allowance for the determined spender
    const handleApprove = async () => {
        if (!signer || !sellTokenAddress || !price?.issues?.allowance?.spender) {
            console.error("Signer or sellTokenAddress is not available");
            return;
        }
        const tokenContract = new ethers.Contract(
            sellTokenAddress,
            ERC20Faucet.abi,
            signer
        )
        const maxApproval = ethers.MaxUint256
        try {
            const tx = await tokenContract.approve(price.issues.allowance.spender, maxApproval);
            await tx.wait();
            setUserAllowance(maxApproval.toString()); // optimistically update
          } catch (err) {
            console.error("Approval failed:", err);
          }
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
