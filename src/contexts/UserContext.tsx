import React, {
    type ReactNode,
    createContext,
    useContext,
    useState,
    useEffect
} from "react"
import { AlphaPING } from "../../typechain-types/contracts/AlphaPING.sol/AlphaPING";
import { useEtherProviderContext } from "./ProviderContext"
import { useChannelProviderContext } from "./ChannelContext";
import { useMessagesProviderContext } from "./MessagesContext";

interface UserProviderType{
    owner: boolean;
    setOwner: React.Dispatch<React.SetStateAction<boolean>>;
    mod: AlphaPING.ChannelStructOutput[];
    setMod: React.Dispatch<React.SetStateAction<AlphaPING.ChannelStructOutput[]>>;
    banned: boolean;
    blacklisted: boolean;
    author: number[];
    userUsername: string | null;
    setUserUsername: React.Dispatch<React.SetStateAction<string | null>>;
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
    const { channels } = useEtherProviderContext()

    // vars
    const [account, setAccount] = useState<string>('')
    const [owner, setOwner] = useState<boolean>(false)
    const [mod, setMod] = useState<AlphaPING.ChannelStructOutput[]>([])
    const [banned, setBanned] = useState<boolean>(false)
    const [blacklisted, setBlacklisted] = useState<boolean>(false)
    const [author, setAuthor] = useState<number[]>([])
    // grab username
    const [userUsername, setUserUsername] = useState<string | null>(null)

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
            // fetch all channels for which this account is a mod
            const modResults = []
            for(let i=0; i<channels.length; i++){
                const result = await alphaPING.mods(channels[i].id)
                if(result === account){
                    modResults.push(channels[i])
                }
            }
            setMod(modResults)
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
            // grab username
            if(account !== null){
                const username = await alphaPING?.username(account)
                if(username === undefined){
                    setUserUsername(null)
                } else {
                    setUserUsername(username)
                }
            }
        }catch(err: unknown){
            console.error(err as string)
            setUserAttributesError(err.message as string)
        }finally{
            setUserAttributesLoading(false)
        }
    }

    useEffect(() => {
        loadUserAttributes()
        console.log(mod)
    }, [currentChannel, account, messages])
    
    return (
        <UserContext.Provider value={{ 
            owner,
            setOwner,
            mod,
            setMod,
            banned,
            blacklisted,
            author,
            userUsername,
            setUserUsername
        }}>
            {children}
        </UserContext.Provider>
  )
    

}

export default UserProvider