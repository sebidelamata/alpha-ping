import { 
    useState, 
    useEffect,
    useMemo 
} from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

interface Usernames {
  [account: string]: string | null;
}

interface ErrorType{
  message: string;
}

const useUniqueUsernames = (uniqueProfiles: Set<string>) => {

    const { currentChannel } = useChannelProviderContext()
    const { alphaPING } = useEtherProviderContext()

    const [usernameArray, setUsernameArray] = useState<Usernames>({})
    const [usernameArrayLoading, setUsernameArrayLoading] = useState<boolean>(false)
    const [usernameError, setUsernameError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUniqueUsernames = async () => {
        if (!currentChannel || uniqueProfiles.size === 0) return;

        try {
            setUsernameError(null);

            // grab unique usernames
          setUsernameArrayLoading(true)
          const usernamesData: Usernames = {};
          await Promise.all(
            Array.from(uniqueProfiles).map( async (profile) => {
              const username = await alphaPING?.username(profile)
              usernamesData[profile] = username || null
            })
          )
          setUsernameArray(usernamesData)
        } catch (error) {
            setUsernameError((error as ErrorType).message);
        } finally {
            setUsernameArrayLoading(false);
        }
        };

        fetchUniqueUsernames();
    }, [alphaPING, currentChannel, uniqueProfiles]);

      return useMemo(() => ({ 
        usernameArray,
        usernameArrayLoading,
        usernameError
    }), [usernameArray, usernameArrayLoading, usernameError]);
};

export default useUniqueUsernames;