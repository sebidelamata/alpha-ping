import { useEffect } from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import useUserChannels from "./useUserChannels";

const useSetInitialCurrentChannel = (tokenMetaData:tokenMetadata[]) => {
    const { 
        currentChannel, 
        setCurrentChannel,
        setSelectedChannelMetadata,
      } = useChannelProviderContext()

    const { userChannels } = useUserChannels()

    // set the default channel to the first in the list if one hasn't been selected yet
    useEffect(() => {
        if (!currentChannel && userChannels.length > 0 && tokenMetaData.length > 0) {
            setCurrentChannel(userChannels[0]);
            setSelectedChannelMetadata(tokenMetaData[0]);
        }
    }, [
    userChannels, 
    currentChannel, 
    setCurrentChannel, 
    setSelectedChannelMetadata, 
    tokenMetaData
    ]); 
}

export default useSetInitialCurrentChannel