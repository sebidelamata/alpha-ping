import React, {
    type ReactNode,
    createContext,
    useContext,
    useState,
    useEffect
} from "react"
import { useEtherProviderContext } from "./ProviderContext"

interface UserProviderType{
    owner: boolean;
    mod: boolean;
    banned: boolean;
    blacklisted: boolean;
    author: boolean[];
}

// create context
const UserContext = createContext<UserProviderType | undefined>(undefined)

export const useUserProviderContext = (): UserProviderType => {
    const context = useContext(UserContext)
    if (context === null || context === undefined) {
        throw new Error('useUserProviderContext must be used within a ChannelProvider')
    }
    return context
}