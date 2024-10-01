import React, {
    type ReactNode,
    createContext,
    useContext,
    useState,
    useEffect
} from "react"
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import { useEtherProviderContext } from "./ProviderContext"
import { useChannelProviderContext } from "./ChannelContext";
import { useMessagesProviderContext } from "./MessagesContext";

interface UserProviderType{
    owner: boolean;
    mod: boolean;
    banned: boolean;
    blacklisted: boolean;
    author: number[];
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

const UserProvider: React.FC<{ children: ReactNode }> = ({children}) => {

    const { currentChannel } = useChannelProviderContext()
    const { signer, alphaPING } = useEtherProviderContext()
    const { messages } = useMessagesProviderContext()

    // vars
    const [account, setAccount] = useState<string>('')
    const [owner, setOwner] = useState<boolean>(false)
    const [mod, setMod] = useState<boolean>(false)
    const [banned, setBanned] = useState<boolean>(false)
    const [blacklisted, setBlacklisted] = useState<boolean>(false)
    const [author, setAuthor] = useState<number[]>([])

    // loadstates
    const [userAttributesLoading, setUserAttributesLoading] = useState<boolean>(false)
    const [userAttributesError, setUserAttributesError] = useState<string>('')

    // load up user attributes for this channel
    const loadUserAttributes = async (): Promise<void> => {
        if(alphaPING === null){
            return
        }
        if(currentChannel === null){
            return
        }
        if(signer === null){
            return
        }
        const account =  await signer.getAddress()
        setAccount(account)
        try{
            setUserAttributesLoading(true)
            //owner
            const owner = await alphaPING.owner()
            setOwner(owner === account ? true : false)
            //mod
            const mod = await alphaPING.mods(currentChannel.id)
            setMod(mod === account ? true : false)
            //banned
            const banned = await alphaPING.channelBans(currentChannel.id, account)
            setBanned(banned)
            //blacklisted
            const blacklisted = await alphaPING.isBlackListed(account)
            setBlacklisted(blacklisted)
            //author
            const channelMessages = messages.filter(message => message.channel === currentChannel.id.toString())
            const author = []
            for(let i=0; i<channelMessages.length; i++){
                if(account === channelMessages[i].account){
                    author.push(channelMessages[i].id)
                }
            }
            setAuthor(author)
        }catch(err: unknown){
            console.error(err as string)
            setUserAttributesError(err.message as string)
        }finally{
            setUserAttributesLoading(false)
        }
    }

    useEffect(() => {
        loadUserAttributes()
    }, [currentChannel, account, messages])
    
    return (
        <UserContext.Provider value={{ 
            owner,
            mod,
            banned,
            blacklisted,
            author
        }}>
            {children}
        </UserContext.Provider>
  )
    

}

export default UserProvider