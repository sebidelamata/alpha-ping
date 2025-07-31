import coinGeckoIdMap from '../constants/coinGeckoIDMap.json';
import { useChannelProviderContext } from 'src/contexts/ChannelContext';

const useGetCoinGeckoID = () => {

    const { selectedChannelMetadata } = useChannelProviderContext()
    
    const coinGeckoMetadata = coinGeckoIdMap.filter((token) => {
        if(selectedChannelMetadata && selectedChannelMetadata.platform.slug === 'ethereum' && token.platforms['ethereum']) {
        return token.platforms['ethereum'].toLowerCase() === (selectedChannelMetadata.platform.token_address).toLowerCase();
    }})

    const coinGeckoId = coinGeckoMetadata.length > 0 ? coinGeckoMetadata[0].id : null;

    return { coinGeckoId }
}

export default useGetCoinGeckoID;