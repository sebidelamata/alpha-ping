import { useMemo } from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useBeefyDetailsContext } from "src/contexts/BeefyDetailsContext";

const useGetCurrentChannelBeefyLP = () => {
    const { currentChannel, selectedChannelMetadata } = useChannelProviderContext();
    const { beefyLPs, beefyVaults } = useBeefyDetailsContext();

    const currentChannelBeefyLP = useMemo(() => {
        // Early returns for safety
        if (!currentChannel?.tokenAddress) return null;
        if (!selectedChannelMetadata?.protocol) return null;
        if (selectedChannelMetadata.protocol !== 'beefy') return null;
        if (!beefyVaults?.length || !beefyLPs?.length) return null;

        const matchingVault = beefyVaults.find(
            (vault) => vault.earnedTokenAddress?.toLowerCase() === currentChannel.tokenAddress.toLowerCase()
        );
        
        if (!matchingVault) return null;

        const searchKey = matchingVault.oracle !== 'tokens' ?
            matchingVault.oracleId :
            matchingVault.id;
        const matchingLP = beefyLPs.find(
            (lpArray) => lpArray[0] === searchKey
        );

        return matchingLP || null;
    }, [
        currentChannel?.tokenAddress, 
        beefyLPs, 
        beefyVaults, 
        selectedChannelMetadata
    ]);

    return { currentChannelBeefyLP };
}

export default useGetCurrentChannelBeefyLP;