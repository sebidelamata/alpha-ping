import { useState, useEffect } from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { ethers, formatUnits } from "ethers";
import AaveL2LendingPool from "../lib/aaveL2PoolABI.json"
import aTokenUnderlyingAsset from "../lib/aTokenAaveUnderlyingAsset.json"

const useFetchAaveAssetDetails = () => {
    const { 
        selectedChannelMetadata,
        currentChannel 
    } = useChannelProviderContext()
    const { signer } = useEtherProviderContext()

    // this fetches the supply and borrow APY for the token
    const [aaveAssetDetails, setAaveAssetDetails] = useState<AaveSupplyBorrowRate | null>(null)
    useEffect(() => {
        if(!currentChannel){
            return
        }
        const fetchAaveDetails = async () => {
            const aaveLendingPool = new ethers.Contract(
            // aave lending pool address
            "0x794a61358d6845594f94dc1db02a252b5b4814ad",
            AaveL2LendingPool.abi,
            signer
            );
            const aToken = new ethers.Contract(
                currentChannel?.tokenAddress,
                aTokenUnderlyingAsset.abi,
                signer
            );
          try{
            const underlyingAssetAddress = await aToken.UNDERLYING_ASSET_ADDRESS()
            const reserveData = await aaveLendingPool.getReserveData(underlyingAssetAddress)
            if (reserveData) {
              console.log('reserveData: ', reserveData)
    
              // Raw values are BigNumbers; convert them to human‑readable strings
              const cleanedReservesData: AaveSupplyBorrowRate = {
                supplyRate: formatUnits(reserveData.currentLiquidityRate, 27),
                borrowRate: formatUnits(reserveData.currentVariableBorrowRate, 27)
              };
              console.log('asset aave data:', cleanedReservesData);
              setAaveAssetDetails(cleanedReservesData);
            } else {
                console.warn('No aave account data found for this asset:', underlyingAssetAddress);
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
        if(
            selectedChannelMetadata &&
            selectedChannelMetadata.protocol &&
            selectedChannelMetadata.protocol === 'aave'
        ){
          fetchAaveDetails()
        }
    }, [
    currentChannel,
    selectedChannelMetadata,
    signer
    ])

    return { aaveAssetDetails }
}

export default useFetchAaveAssetDetails