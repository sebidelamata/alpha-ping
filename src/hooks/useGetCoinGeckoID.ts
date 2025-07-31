import coinGeckoIdMap from '../constants/coinGeckoIDMap.json';
import { useChannelProviderContext } from 'src/contexts/ChannelContext';

const useGetCoinGeckoID = () => {

    const { selectedChannelMetadata, currentChannel } = useChannelProviderContext()
    
    const coinGeckoMetadata = coinGeckoIdMap.filter((token) => {
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

    return { coinGeckoId }
}

export default useGetCoinGeckoID;