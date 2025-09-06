import { 
    useState, 
    useEffect,
    useMemo, 
} from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

interface ProfilePics {
  [account: string]: string | null;
}

interface ErrorType{
  message: string;
}

const useUniqueProfilePics = (uniqueProfiles: Set<string>) => {

    const { currentChannel } = useChannelProviderContext()
    const { alphaPING } = useEtherProviderContext()

    const [profilePics, setProfilePics] = useState<ProfilePics>({})
    const [profilePicsError, setProfilePicsError] = useState<string | null>(null)
    const [profilePicsLoading, setProfilePicsLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchUserProfiles = async () => {
        if (!currentChannel || uniqueProfiles.size === 0) return;

        try {
            setProfilePicsError(null);
            setProfilePicsLoading(true);

            // Fetch profile pictures
            const profilePicsData: ProfilePics = {};
            await Promise.all(
            Array.from(uniqueProfiles).map(async (profile) => {
                const profilePic = await alphaPING?.profilePic(profile);
                profilePicsData[profile] = profilePic || null;
            })
            );
            setProfilePics(profilePicsData);
        } catch (error) {
            setProfilePicsError((error as ErrorType).message);
        } finally {
            setProfilePicsLoading(false);
        }
        };

        fetchUserProfiles();
    }, [alphaPING, currentChannel, uniqueProfiles]);

    return useMemo(() => ({
        profilePics,
        profilePicsLoading,
        profilePicsError
    }), [profilePics, profilePicsLoading, profilePicsError]);
};

export default useUniqueProfilePics;