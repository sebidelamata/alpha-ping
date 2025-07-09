'use client';

import React,
{
  useEffect,
  useState
} from "react";
import AaveL2LendingPool from '../../../../../lib/aaveL2PoolABI.json'
import { 
  ethers, 
  formatUnits 
} from 'ethers';
import { Skeleton } from "@/components/components/ui/skeleton";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

interface IMessageAaveHealthFactor{
    account: string;
}

const MessageAaveHealthFactor: React.FC<IMessageAaveHealthFactor> = ({ account }) => {

    const { signer } = useEtherProviderContext()

    // we need to find the user account details for aave if the user has any aave tokens
    const [aaveDetails, setAaveDetails] = useState<null | AaveUserAccount>(null)
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        setLoading(true)
        const fetchAaveDetails = async (account: string) => {
        const aaveLendingPool = new ethers.Contract(
        // aave lending pool address
        "0x794a61358d6845594f94dc1db02a252b5b4814ad",
        AaveL2LendingPool.abi,
        signer
        );
        try{
        const accountData = await aaveLendingPool.getUserAccountData(account)
        if (accountData) {

            // Raw values are BigNumbers; convert them to human‑readable strings
            const cleanedAccountData: AaveUserAccount = {
            totalCollateral: formatUnits(accountData.totalCollateralBase, 8),
            totalDebt: formatUnits(accountData.totalDebtBase, 8),
            availableBorrows: formatUnits(accountData.availableBorrowsBase, 8),
            // liquidation threshhold in bps
            currentLiquidationThreshold: (Number(accountData.currentLiquidationThreshold) / 10000).toString(), 
            // ltv is in bps
            ltv: (Number(accountData.ltv) / 10000).toString(),
            healthFactor: formatUnits(accountData.healthFactor, 18)
            };
            console.log('user aave data:', cleanedAccountData);
            setAaveDetails(cleanedAccountData);
        } else {
            console.warn('No aave account data found for this user:', accountData);
            return;
        }
        } catch(error: unknown){
        if(error !== undefined || error !== null){
            console.warn("Error unable to fetch aave user account details for: " + signer + ": " + (error as Error).toString())
            return;
        }
        }finally {
            setLoading(false)
        }
    }
        fetchAaveDetails(account)
    }, [account, signer]
)

    if(loading){
        return <Skeleton className="w-12"/>
    }else{
        return(
           <div 
                className={
                    // render color based on health factor
                    Number(aaveDetails?.healthFactor) <= 1.1 ?
                    "text-red-500" :
                    Number(aaveDetails?.healthFactor) <= 2.0 ?
                    "text-yellow-500" :
                    "text-green-500"
                }
            > 
                Health Factor: {
                Number(aaveDetails?.healthFactor).toFixed(2)
                }
            </div>
        )
    }
}

export default MessageAaveHealthFactor;