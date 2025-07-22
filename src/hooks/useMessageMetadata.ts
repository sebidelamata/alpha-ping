import useUniqueProfiles from "./useUniqueProfiles";
import useUniqueProfilePics from "./useUniqueProfilePics";
import useUniqueUsernames from "./useUniqueUsernames";
import useBansArray from "./useBansArray";
import useBlacklistArray from "./useBlacklistArray";
import { useMemo } from "react";

const useMessageMetadata = () => {

    // grab unique profiles
    const { uniqueProfiles } = useUniqueProfiles()
    // grab usernames pics bans blacklist
    const { profilePics, profilePicsLoading } = useUniqueProfilePics(uniqueProfiles)
    const { usernameArray, usernameArrayLoading } = useUniqueUsernames(uniqueProfiles)
    const { bansArray, bansArrayLoading } = useBansArray(uniqueProfiles)
    const { blacklistArray, blacklistArrayLoading } = useBlacklistArray(uniqueProfiles)

    // Memoize loading states
    const isMetadataLoading = useMemo(() => (
        usernameArrayLoading || 
        bansArrayLoading || 
        blacklistArrayLoading || 
        profilePicsLoading
    ), [
        usernameArrayLoading, 
        bansArrayLoading, 
        blacklistArrayLoading, 
        profilePicsLoading
    ]);

    return {
        profilePics,
        usernameArray,
        bansArray,
        blacklistArray,
        isMetadataLoading,
    }
}

export default useMessageMetadata