import useUniqueProfiles from "./useUniqueProfiles";
import useUniqueProfilePics from "./useUniqueProfilePics";
import useUniqueUsernames from "./useUniqueUsernames";
import useBansArray from "./useBansArray";
import useBlacklistArray from "./useBlacklistArray";

const useMessageMetadata = () => {

    // grab unique profiles
    const { uniqueProfiles } = useUniqueProfiles()
    // grab usernames pics bans blacklist
    const { profilePics, profilePicsLoading } = useUniqueProfilePics(uniqueProfiles)
    const { usernameArray, usernameArrayLoading } = useUniqueUsernames(uniqueProfiles)
    const { bansArray, bansArrayLoading } = useBansArray(uniqueProfiles)
    const { blacklistArray, blacklistArrayLoading } = useBlacklistArray(uniqueProfiles)

    return {
        profilePics,
        profilePicsLoading,
        usernameArray,
        usernameArrayLoading,
        bansArray,
        bansArrayLoading,
        blacklistArray,
        blacklistArrayLoading
    }
}

export default useMessageMetadata