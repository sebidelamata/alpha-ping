import { useMemo } from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useBeefyDetailsContext } from "src/contexts/BeefyDetailsContext";

const useGetCurrentChannelBeefyLP = () => {
    const { currentChannel, selectedChannelMetadata } = useChannelProviderContext();
    const { beefyLPs, beefyVaults } = useBeefyDetailsContext();

    const currentChannelBeefyLP = useMemo(() => {
        if (
            !currentChannel || 
            !beefyLPs || 
            beefyLPs.length === 0 ||
            !beefyVaults || 
            beefyVaults.length === 0 ||
            !selectedChannelMetadata ||
            selectedChannelMetadata.protocol !== 'beefy'
        ) return null

        const matchingVault = beefyVaults.find(
            (vault) => vault.earnedTokenAddress?.toLowerCase() === currentChannel.tokenAddress.toLowerCase()
        );
        
        if (!matchingVault) return null;
        const matchingLP = beefyLPs.find(
            matchingVault.oracle !== 'tokens' ?
            (lpArray) => lpArray[0] === matchingVault.oracleId :
            (lpArray) => lpArray[0] === matchingVault.id
        );

        return matchingLP || null;
    }, [
        currentChannel, 
        beefyLPs, 
        beefyVaults, 
        selectedChannelMetadata
    ]);

    return { currentChannelBeefyLP };
}

export default useGetCurrentChannelBeefyLP;