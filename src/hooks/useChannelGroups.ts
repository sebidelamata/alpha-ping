import { useMemo } from "react";
import useUserChannelsWithMetadata from "./useUserChannelsWithMetadata";

const useChannelGroups = () => {

   // user channels zipped with metadata
    const { userChannelsWithMetadata } = useUserChannelsWithMetadata()

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

    return{
        spotChannels,
        aaveChannels,
        nftChannels
    }
}
export default useChannelGroups;