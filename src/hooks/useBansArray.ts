import { 
    useState, 
    useEffect 
} from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

interface Bans {
  [account: string]: boolean;
}

interface ErrorType{
  message: string;
}

const useBansArray = (uniqueProfiles: Set<string>) => {

    const { currentChannel } = useChannelProviderContext()
    const { alphaPING } = useEtherProviderContext()

    const [bansArray, setBansArray] = useState<Bans>({})
    const [bansArrayLoading, setBansArrayLoading] = useState<boolean>(false)
    const [bansError, setBansError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUserBans = async () => {
        if (!currentChannel || uniqueProfiles.size === 0) return;

        try {
            setBansError(null);

            // grab unique user channel ban status
            setBansArrayLoading(true)
            const bansData: Bans = {};
            await Promise.all(
                Array.from(uniqueProfiles).map( async (profile) => {
                const ban = await alphaPING?.channelBans(currentChannel.id.toString(), profile) || false
                bansData[profile] = ban
                })
            )
            setBansArray(bansData)
        } catch (error) {
            setBansError((error as ErrorType).message);
        } finally {
            setBansArrayLoading(false);
        }
        };

        fetchUserBans();
    }, [alphaPING, currentChannel, uniqueProfiles]);

    return {
        bansArray,
        bansArrayLoading,
        bansError
    };
};

export default useBansArray;