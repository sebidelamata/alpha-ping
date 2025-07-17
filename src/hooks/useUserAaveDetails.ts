import { 
    useState, 
    useEffect 
} from "react";
import AaveL2LendingPool from '../lib/aaveL2PoolABI.json'
import { 
  ethers, 
  formatUnits 
} from 'ethers';
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { useUserProviderContext } from "src/contexts/UserContext";
import { useAaveDetailsContext } from "src/contexts/AaveDetailsContext";

const useUserAaveDetails = () => {

    const { signer } = useEtherProviderContext()
    const { account } = useUserProviderContext()
    const {
        setAaveAccount 
    } = useAaveDetailsContext()

    // we are going to use this timer to refetch a new aave detail every 60 seconds
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    
    // Timer to update lastUpdated every 60 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
        setLastUpdated(new Date());
        }, 60 * 1000); // 60 seconds in milliseconds
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run once on mount
        
    // we need to find the user account details for aave if the user has any aave tokens
    useEffect(() => {
        const fetchAaveDetails = async (account: string) => {
        const aaveLendingPool = new ethers.Contract(
            // aave lending pool address
            "0x794a61358d6845594f94dc1db02a252b5b4814ad",
            AaveL2LendingPool.abi,
            signer
            );
            try{
            const accountData = await aaveLendingPool.getUserAccountData(account)
            console.log('accountData: ', accountData)
            if (accountData) {
                console.log('accountData: ', accountData)
    
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
                setAaveAccount(cleanedAccountData);
            } else {
                console.warn('No aave account data found for this user:', accountData);
                return;
            }
            } catch(error: unknown){
            if(error !== undefined || error !== null){
                console.warn("Error unable to fetch aave user account details for: " + signer + ": " + (error as Error).toString())
                return;
            }
            }
        }
    
        // only run this function if the user is part of an aave channel
        fetchAaveDetails(account)
        }, [
        account, 
        signer, 
        setAaveAccount,
        lastUpdated
    ])

}

export default useUserAaveDetails;