import { useMemo } from "react";
import useUserChannelsWithMetadata from "./useUserChannelsWithMetadata";

const useChannelGroups = () => {

   // user channels zipped with metadata
    const { userChannelsWithMetadata } = useUserChannelsWithMetadata()
    console.log('userChannelsWithMetadata', userChannelsWithMetadata)

    // memoize our channel groups
    const spotChannels = useMemo(() =>
        userChannelsWithMetadata.filter(({ channel, metadata }) =>
            channel.tokenType.toLowerCase() !== 'erc721' &&
            (!metadata?.protocol || metadata.protocol.toLowerCase() !== 'aave')
        ), [userChannelsWithMetadata]
    );
    
    const aaveChannels = useMemo(() =>
        userChannelsWithMetadata.filter(({ channel, metadata }) =>
            channel.tokenType.toLowerCase() !== 'erc721' &&
            metadata?.protocol?.toLowerCase() === 'aave'
        ), [userChannelsWithMetadata]
    );
    
    const nftChannels = useMemo(() =>
        userChannelsWithMetadata.filter(({ channel }) =>
            channel.tokenType.toLowerCase() === 'erc721'
        ), [userChannelsWithMetadata]
    );

    const result = useMemo(() => {
        return {
            spotChannels,
            aaveChannels,
            nftChannels
        };
    }, [spotChannels, aaveChannels, nftChannels]);

return result;
}
export default useChannelGroups;