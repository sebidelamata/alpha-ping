import { useEffect } from "react";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import useUserChannels from "./useUserChannels";
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import { defaultTokenMetadata } from "src/constants/defaultTokenMetadata";
import { useTokenMetadataContext } from "src/contexts/TokenMetaDataContext";
import fetchTokenMetadata from "src/lib/fetchTokenMetadata";
//import useBeefyVaults from "./useBeefyVaults";

const useTokenMetadata = () => {
    const { signer } = useEtherProviderContext()
    const { 
        setTokenMetaData, 
        setTokenMetadataLoading 
    } = useTokenMetadataContext()
    const { userChannels } = useUserChannels()

    // const { isBeefyToken, beefyVaults } = useBeefyVaults()
    // console.log('beefyVaults', beefyVaults)

    // here we will grab metadata for each channel with a promise.all
    useEffect(() => {
        const fetchAllUserChannelsMetadata = async () => {
            if (!userChannels || userChannels.length === 0 || !signer) return;
            
            setTokenMetadataLoading(true);
            
            try {
                const allUserChannelsMetadata = await Promise.all(
                    userChannels.map(async (channel: AlphaPING.ChannelStructOutput) => {
                        // skip fetching metadata for ERC721 tokens
                        if(channel.tokenType.toLowerCase() === 'erc721'){
                            console.warn('ERC721 token type detected, skipping metadata fetch for channel:', channel);
                            return defaultTokenMetadata;
                        }
                        if (channel.tokenAddress) {
                            return await fetchTokenMetadata(channel.tokenAddress, signer);
                        }
                        console.warn('No token address found for channel:', channel);
                        return defaultTokenMetadata;
                    })
                );
                
                setTokenMetaData(allUserChannelsMetadata);
                return allUserChannelsMetadata;
            } catch (error) {
                console.error('Error fetching all user channels metadata:', error);
            } finally {
                setTokenMetadataLoading(false);
            }
        };

        fetchAllUserChannelsMetadata();
    }, [
        userChannels, 
        signer, 
        setTokenMetaData, 
        setTokenMetadataLoading
    ]);

}

export default useTokenMetadata