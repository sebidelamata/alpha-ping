
import { useMemo } from "react";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

const useUserChannels = () => {
    const { 
        channels, 
        hasJoined, 
    } = useEtherProviderContext()

    const userChannels = useMemo(
        () => channels.filter((_, i) => hasJoined[i]),
        [channels, hasJoined]
    )

    return { userChannels }
}

export default useUserChannels