import { useEffect, useState } from "react";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import { defaultTokenMetadata } from "src/constants/defaultTokenMetadata";
import { useBeefyDetailsContext } from "src/contexts/BeefyDetailsContext";
import fetchTokenMetadata from "src/lib/fetchTokenMetadata";

const useAllChannelsMetadata = () => {
    const { signer, alphaPING, channels } = useEtherProviderContext();
    const { beefyVaults } = useBeefyDetailsContext();

    const [allChannelsMetadata, setAllChannelsMetadata] = useState<tokenMetadata[]>([]);
    const [allChannelsMetadataLoading, setAllChannelsMetadataLoading] = useState<boolean>(false);
    const [allChannels, setAllChannels] = useState<AlphaPING.ChannelStructOutput[]>([]);

    useEffect(() => {
        const fetchAllChannelsMetadata = async () => {
            if (!signer || !alphaPING || channels.length > 0) return;
            
            setAllChannelsMetadataLoading(true);
            
            try {
                // First, fetch all available channels from the contract
                const channels:AlphaPING.ChannelStructOutput[] = []
                const totalChannels = await alphaPING.totalChannels()
                for(let i=1; i<=Number(totalChannels); i++){
                    const channel = await alphaPING.getChannel(i)
                    channels.push(channel)
                }
                setAllChannels(channels);

                // Then fetch metadata for each channel
                const allChannelsMetadataPromises = channels.map(async (channel: AlphaPING.ChannelStructOutput) => {
                    // skip fetching metadata for ERC721 tokens
                    if(channel.tokenType.toLowerCase() === 'erc721'){
                        console.warn('ERC721 token type detected, skipping metadata fetch for channel:', channel);
                        return defaultTokenMetadata;
                    }
                    if (channel.tokenAddress) {
                        return await fetchTokenMetadata(channel.tokenAddress, signer, beefyVaults);
                    }
                    console.warn('No token address found for channel:', channel);
                    return defaultTokenMetadata;
                });
                
                const metadata = await Promise.all(allChannelsMetadataPromises);
                setAllChannelsMetadata(metadata);
                
            } catch (error) {
                console.error('Error fetching all channels metadata:', error);
                setAllChannelsMetadata([]);
            } finally {
                setAllChannelsMetadataLoading(false);
            }
        };

        fetchAllChannelsMetadata();
    }, [signer, alphaPING, channels, beefyVaults]);

    return {
        allChannelsMetadata,
        allChannelsMetadataLoading,
        allChannels
    };
}

export default useAllChannelsMetadata;