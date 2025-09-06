import { ethers, Signer } from "ethers";
import aTokenUnderlyingAsset from '../lib/aTokenAaveUnderlyingAsset.json'

// here is another function in case the token is in the Aave
// protocol, we will fetch the underlying token address
// also we will need to test if this token is bridged 
// if we dont get metadata back from cmc
const fetchUnderlyingTokenAddress = async (tokenAddress:string, signer: Signer) => {
    const aToken = new ethers.Contract(
        tokenAddress,
        aTokenUnderlyingAsset.abi,
        signer
    );
    try{
        console.log('Fetching underlying asset for token:', tokenAddress);
        const underlyingAsset = await aToken.UNDERLYING_ASSET_ADDRESS();
            console.log('Underlying Asset Address:', underlyingAsset);
        if (underlyingAsset && underlyingAsset !== ethers.ZeroAddress) {
            return underlyingAsset;
        } else {
            console.warn('No underlying asset found for token:', tokenAddress);
            return null;
        }
    } catch(error: unknown){
        if(error !== undefined || error !== null){
            console.warn("Error unable to fetch underlying asset for" + tokenAddress + ": " + (error as Error).toString())
            return null;
        }
    }
    }

    export default fetchUnderlyingTokenAddress;