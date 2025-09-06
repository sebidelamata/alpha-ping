import { 
    useState, 
    useEffect,
    useMemo 
} from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

interface Blacklists {
  [account: string]: boolean;
}

interface ErrorType{
  message: string;
}

const useBlacklistArray = (uniqueProfiles: Set<string>) => {

    const { currentChannel } = useChannelProviderContext()
    const { alphaPING } = useEtherProviderContext()

    const [blacklistArray, setBlacklistArray] = useState<Blacklists>({})
    const [blacklistArrayLoading, setBlacklistArrayLoading] = useState<boolean>(false)
    const [blacklistError, setBlacklistError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBlacklist = async () => {
        if (!currentChannel || uniqueProfiles.size === 0) return;

        try {
            setBlacklistError(null);

            // grab unique user application blacklist status
            setBlacklistArrayLoading(true)
            const blacklistData: Blacklists = {};
                await Promise.all(
                Array.from(uniqueProfiles).map( async (profile) => {
                    const blacklist = await alphaPING?.isBlackListed(profile) || false
                    blacklistData[profile] = blacklist
                })
                )
            setBlacklistArray(blacklistData)
        } catch (error) {
            setBlacklistError((error as ErrorType).message);
        } finally {
            setBlacklistArrayLoading(false);
        }
        };

        fetchBlacklist();
    }, [alphaPING, currentChannel, uniqueProfiles]);

    return useMemo(() => ({
        blacklistArray,
        blacklistArrayLoading,
        blacklistError
    }), [blacklistArray, blacklistArrayLoading, blacklistError]);
};

export default useBlacklistArray;