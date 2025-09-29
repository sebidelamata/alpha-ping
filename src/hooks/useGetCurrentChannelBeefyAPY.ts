import { useMemo } from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useBeefyDetailsContext } from "src/contexts/BeefyDetailsContext";

const useGetCurrentChannelBeefyAPY = () => {
    const { currentChannel, selectedChannelMetadata } = useChannelProviderContext();
    const { beefyAPYs, beefyVaults } = useBeefyDetailsContext();

    const currentChannelBeefyAPY = useMemo(() => {
        // Early returns for safety
        if (!currentChannel?.tokenAddress) return null;
        if (!selectedChannelMetadata?.protocol) return null;
        if (selectedChannelMetadata.protocol !== 'beefy') return null;
        if (!beefyVaults?.length || !beefyAPYs?.length) return null;

        const matchingVault = beefyVaults.find(
            (vault) => vault.earnedTokenAddress?.toLowerCase() === currentChannel.tokenAddress.toLowerCase()
        );
        
        if (!matchingVault) return null;

        const searchKey = matchingVault.oracle !== 'tokens' ?
            matchingVault.oracleId :
            matchingVault.id;
        const matchingLP = beefyAPYs.find(
            (apy) => apy[0] === searchKey
        );

        return matchingLP || null;
    }, [
        currentChannel?.tokenAddress, 
        beefyAPYs, 
        beefyVaults, 
        selectedChannelMetadata
    ]);

    return { currentChannelBeefyAPY };
}

export default useGetCurrentChannelBeefyAPY;