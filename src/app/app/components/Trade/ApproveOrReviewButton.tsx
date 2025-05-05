import React, {
    useState,
    useEffect
} from "react";
import { Button } from "@/components/components/ui/button";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { useUserProviderContext } from "src/contexts/UserContext";
import ERC20Faucet from '../../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { ethers } from 'ethers'

interface IApproveOrReviewButton {
    onClick: () => void;
    sellTokenAddress: string;
    disabled?: boolean;
    price: any;
  }

const ApproveOrReviewButton: React.FC<IApproveOrReviewButton> = ({
    onClick,
    sellTokenAddress,
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
            console.log("userAllowance", userAllowance)
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

    return (
        <div className="flex flex-col w-full">
            <Button className="w-full bg-primary text-secondary hover:bg-secondary hover:text-primary">
                Approve
            </Button>
            <Button className="w-full bg-primary text-secondary hover:bg-secondary hover:text-primary">
                Review
            </Button>
        </div>
    );
}
export default ApproveOrReviewButton;
