import { Signer } from 'ethers';
import { defaultTokenMetadata } from "src/constants/defaultTokenMetadata";
import fetchTokenMetadataCMC from "src/lib/fetchTokenMetadataCMC";
import fetchL1Address from "src/lib/fetchL1Address";
import fetchUnderlyingTokenAddress from "src/lib/fetchUnderlyingTokenAddress";
import { isBeefyToken } from './isBeefyToken';
import { BeefyVault } from 'src/types/global';

// here is where we run through the possible scenarios to fetch the token metadata
const fetchTokenMetadata = async (tokenAddress:string, signer: Signer, beefyVaults: BeefyVault[]) => {
    if(!signer){
        console.error('No signer available to fetch token metadata for token:', tokenAddress);
        return defaultTokenMetadata;
    }
    // // first we will check if the token is a beefy finance vault
    if (isBeefyToken(tokenAddress, beefyVaults)) {
            console.log('Beefy Finance token detected:', tokenAddress);
            const outputMetadata = defaultTokenMetadata
            outputMetadata.protocol = "beefy"
            return outputMetadata
        }
    // then we will try to get token metatadata from coinmarketcap
    const tokenMetaData:tokenMetadata = await fetchTokenMetadataCMC(tokenAddress);
    // if we got metadata back, we will set it
    if (tokenMetaData) {
        // setTokenMetaData(tokenMetaData);
        console.log('Token metadata found for token:', tokenAddress, 'Metadata:', tokenMetaData);
        return tokenMetaData;
    }

    // if we didnt get metadata back, we will try to fetch the l1 address
    // and then try to get the metadata for that address
    let l1Address: string | null = null;
    try{
        l1Address = await fetchL1Address(tokenAddress, signer);
    }   catch(error: unknown){
        if(error !== undefined || error !== null){
            console.warn("Error fetching L1 Address for " + tokenAddress + ": " + (error as Error).toString())
        }
    }
    // if we got a l1 address, we will try to fetch the metadata for that
    if (l1Address) {
        console.log('L1 Address found for token:', tokenAddress, 'L1 Address:', l1Address);
        const l1TokenMetaData:tokenMetadata = await fetchTokenMetadataCMC(l1Address);
        // if we got metadata back, we will set it
        if (l1TokenMetaData) {
            // setTokenMetaData(l1TokenMetaData);
            console.log('L1 Token metadata found for token:', tokenAddress, 'Metadata:', l1TokenMetaData);
            return l1TokenMetaData;
        }
    }

    // if we still dont have anything. maybe it's an aave token
    // we will try to fetch the underlying asset address
    let underlyingAsset: string | null = null;
    try{
        underlyingAsset = await fetchUnderlyingTokenAddress(tokenAddress, signer);
    } catch(error: unknown){
        if(error !== undefined || error !== null){
            console.warn("Error fetching underlying asset for " + tokenAddress + ": " + (error as Error).toString())
        }
    }
    // if we got an underlying asset, we will try to fetch the metadata for that
    if (underlyingAsset) {
        console.log('Underlying Asset found for token:', tokenAddress, 'Underlying Asset:', underlyingAsset);
        const underlyingTokenMetaData:tokenMetadata = await fetchTokenMetadataCMC(underlyingAsset);
        // if we got metadata back, we will set it
        if (underlyingTokenMetaData) {
            // we can also set the optional protocol field of the metadata object
            underlyingTokenMetaData.protocol = "aave"
            // setTokenMetaData(underlyingTokenMetaData);
            console.log('Underlying Token metadata found for token:', tokenAddress, 'Metadata:', underlyingTokenMetaData);
            return underlyingTokenMetaData;
        }
        // if we didn't get metata data back for the underlying asset
        // theres is a possibility that the underlying asset
        // is a bridged token and we need to try to fetch the l1 address
        const underlyingL1Address = await fetchL1Address(underlyingAsset, signer);
        if (underlyingL1Address) {
            const underlyingL1TokenMetaData:tokenMetadata = await fetchTokenMetadataCMC(underlyingL1Address);
            // if we got metadata back, we will set it
            if (underlyingL1TokenMetaData) {
                // we can also set the optional protocol field of the metadata object
                underlyingL1TokenMetaData.protocol = "aave"
                // setTokenMetaData(underlyingL1TokenMetaData);
                console.log('Underlying L1 Token metadata found for token:', tokenAddress, 'Metadata:', underlyingL1TokenMetaData);
                return underlyingL1TokenMetaData;
            }
        }
    }
    // if we still don't have metadata, we will set the default metadata
    console.error('No token metadata found for token:', tokenAddress);
    // setTokenMetaData(defaultTokenMetadata);
    console.log('Using default token metadata for token:', tokenAddress);
    return defaultTokenMetadata;
}

export default fetchTokenMetadata;