import { useMemo } from "react";
import useUserChannels from "./useUserChannels";
import { defaultTokenMetadata } from "src/constants/defaultTokenMetadata";
import { useTokenMetadataContext } from "src/contexts/TokenMetaDataContext";

const useUserChannelsWithMetadata = () => {

    const { tokenMetaData, tokenMetadataLoading } = useTokenMetadataContext()

    const { userChannels } = useUserChannels()

    const userChannelsWithMetadata = useMemo(() => {
      // want to prevent returning anything while metadata is loading
      if(tokenMetadataLoading){
        return []
      } else {
        return userChannels.map((channel, i) => ({
          channel,
          metadata: tokenMetaData[i] || defaultTokenMetadata,
        }));
      }
    }, [userChannels, tokenMetaData, tokenMetadataLoading])

    return useMemo(() => ({
        userChannelsWithMetadata
    }), [userChannelsWithMetadata]);
}

export default useUserChannelsWithMetadata