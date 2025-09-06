import { ethers, Signer } from "ethers";
import L1Address from '../lib/ArbitrumBridgedTokenStandardABI.json'

// this function will fetch the l1Address from the token
// we do this if we dont return cmc metadata for the 
// arbitrum address bc it may be bridged and this is part of the
// arbitrum bridged token standard
const fetchL1Address = async (tokenAddress:string, signer:Signer) => {

    const arbitrumBridgedTokenStandard = new ethers.Contract(
        tokenAddress,
        L1Address.abi,
        signer
    );
    try {
        const l1Address = await arbitrumBridgedTokenStandard.l1Address();
        if (l1Address && l1Address !== ethers.ZeroAddress) {
            return l1Address;
        } else {
            console.warn('No L1 address found for token ', tokenAddress);
            return null;
        }
    }
    catch (error) {
        console.warn('Error fetching L1 address for: ', tokenAddress, ": ", error);
        return null;
    }
}

export default fetchL1Address;