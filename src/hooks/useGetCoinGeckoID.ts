import coinGeckoIdMap from '../constants/coinGeckoIDMap.json';
import { useChannelProviderContext } from 'src/contexts/ChannelContext';
import { useMemo } from 'react';

const useGetCoinGeckoID = (optionalAddress:string="") => {

    const { selectedChannelMetadata, currentChannel } = useChannelProviderContext()
    
    const coinGeckoMetadata = coinGeckoIdMap.filter((token) => {
        // make a case for when fetching id for channel that is not current channel (for the trading page)
        if(optionalAddress !== "" && token.platforms['arbitrum-one']) {
            return token.platforms['arbitrum-one'].toLowerCase() === optionalAddress.toLowerCase()
        }
        // normal case, fetch for current channel (one for underlying token of channel for etheruem and arbitrum)
        if(selectedChannelMetadata && selectedChannelMetadata.platform.slug === 'ethereum' && token.platforms['ethereum']) {
            return token.platforms['ethereum'].toLowerCase() === (selectedChannelMetadata.platform.token_address).toLowerCase()
        }
        if(selectedChannelMetadata && selectedChannelMetadata.platform.slug === 'arbitrum' && token.platforms['arbitrum-one']) {
            return token.platforms['arbitrum-one'].toLowerCase() === (selectedChannelMetadata.platform.token_address).toLowerCase()
        }
        // nfts or small tokens wont have cmc token metadata but might have a token address
        if(!selectedChannelMetadata && currentChannel?.tokenAddress) {
            return token.platforms['arbitrum-one'].toLowerCase() === (currentChannel.tokenAddress).toLowerCase()
        }
    })

    const coinGeckoId = coinGeckoMetadata.length > 0 ? coinGeckoMetadata[0].id : null;

    return useMemo(() => ({ coinGeckoId }), [coinGeckoId]);
}

export default useGetCoinGeckoID;