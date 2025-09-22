import { useEffect, useState } from "react";
import AaveL2LendingPool from '../lib/aaveL2PoolABI.json'
import { 
  ethers, 
  formatUnits 
} from 'ethers';
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { useUserProviderContext } from "src/contexts/UserContext";

const useUserAaveDetails = () => {

    const { signer } = useEtherProviderContext()
    const { account } = useUserProviderContext()

    // user aave details
    // we need to find the user account details for aave if the user has any aave tokens
    const [aaveAccount, setAaveAccount] = useState<null | AaveUserAccount>(null)
    const [aaveAccountLoading, setAaveAccountLoading] = useState<boolean>(false)
    const [aaveAccountError, setAaveAccountError] = useState<null | string>(null)
        
    // we need to find the user account details for aave if the user has any aave tokens
    useEffect(() => {
        const fetchAaveDetails = async (account: string) => {
        if(!signer || !account) return;
        setAaveAccountLoading(true)
        if(aaveAccountError) setAaveAccountError(null)

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
                setAaveAccount(cleanedAccountData);
            } else {
                console.warn('No aave account data found for this user:', accountData);
                return;
            }
            } catch(error: unknown){
            if(error !== undefined || error !== null){
                setAaveAccountError("Error unable to fetch aave user account details for: " + signer + ": " + (error as Error).toString())
                return;
            }
            } finally{
            setAaveAccountLoading(false)
            }
        }
    
        // only run this function if the user is part of an aave channel
        fetchAaveDetails(account)
        // refetch every minute
        const interval = setInterval(() => {
            fetchAaveDetails(account)
        }, 60000);
        return () => clearInterval(interval);
        }, [
        account, 
        signer, 
        aaveAccountError
    ])

    return {
        aaveAccount,
        aaveAccountLoading,
        aaveAccountError
    }

}

export default useUserAaveDetails;