import { useMemo } from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useBeefyDetailsContext } from "src/contexts/BeefyDetailsContext";

const useGetCurrentChannelBeefyVault = () => {
    const { currentChannel, selectedChannelMetadata } = useChannelProviderContext();
    const { beefyLPs, beefyVaults } = useBeefyDetailsContext();

    const currentChannelBeefyVault = useMemo(() => {
        // Early returns for safety
        if (!currentChannel?.tokenAddress) return null;
        if (!selectedChannelMetadata?.protocol) return null;
        if (selectedChannelMetadata.protocol !== 'beefy') return null;
        if (!beefyVaults?.length || !beefyLPs?.length) return null;

        const matchingVault = beefyVaults.find(
            (vault) => vault.earnedTokenAddress?.toLowerCase() === currentChannel.tokenAddress.toLowerCase()
        );
        
        if (!matchingVault) return null;

        return matchingVault || null;
    }, [
        currentChannel?.tokenAddress, 
        beefyLPs, 
        beefyVaults, 
        selectedChannelMetadata
    ]);

    return { currentChannelBeefyVault };
}

export default useGetCurrentChannelBeefyVault;