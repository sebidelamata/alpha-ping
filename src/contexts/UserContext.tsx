'use client';

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
import AaveL2LendingPool from '../lib/aaveL2PoolABI.json'
import { 
  ethers, 
  formatUnits 
} from 'ethers';

interface UserProviderType{
    account: string;
    owner: boolean;
    setOwner: React.Dispatch<React.SetStateAction<boolean>>;
    mod: AlphaPING.ChannelStructOutput[];
    setMod: React.Dispatch<React.SetStateAction<AlphaPING.ChannelStructOutput[]>>;
    currentChannelMod: boolean;
    banned: boolean;
    txMessageBan: string | null | undefined;
    setTxMessageBan: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    blacklisted: boolean;
    txMessageBlacklist: string | null | undefined;
    setTxMessageBlacklist: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    txMessageFollow: string | null | undefined;
    setTxMessageFollow: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    txMessageBlock: string | null | undefined;
    setTxMessageBlock: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    author: string[];
    userUsername: string | null;
    setUserUsername: React.Dispatch<React.SetStateAction<string | null>>;
    userProfilePic: string | null;
    setUserProfilePic: React.Dispatch<React.SetStateAction<string | null>>;
    followFilter: boolean;
    setFollowFilter: React.Dispatch<React.SetStateAction<boolean>>;
    followingList: string[];
    blockedList: string[];
    aaveAccount: AaveUserAccount | null;
    setAaveAccount: React.Dispatch<React.SetStateAction<AaveUserAccount | null>>;
}

interface ErrorType{
    message: string;
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

    // account address
    const [account, setAccount] = useState<string>('')
    // is user owner
    const [owner, setOwner] = useState<boolean>(false)
    // is user mod for any channels
    const [mod, setMod] = useState<AlphaPING.ChannelStructOutput[]>([])
    // is mod for current channel
    const[currentChannelMod, setCurrentChannelMod] = useState<boolean>(false)
    // is the user banned from any channels
    const [banned, setBanned] = useState<boolean>(false)
    // state changes on user ban or unban and tells the messages to update metadata
    const [txMessageBan, setTxMessageBan] = useState<string | null | undefined>(null)
    // is the user blacklisted
    const [blacklisted, setBlacklisted] = useState<boolean>(false)
    // state changes on user blacklist or unblacklist and tells the messages to update metadata
    const [txMessageBlacklist, setTxMessageBlacklist] = useState<string | null | undefined>(null)
    // state changes on user blacklist or unblacklist and tells the messages to update metadata
    const [txMessageFollow, setTxMessageFollow] = useState<string | null | undefined>(null)
    // state changes on user personal blocks or unblock and tells the messages to update metadata
    const [txMessageBlock, setTxMessageBlock] = useState<string | null | undefined>(null)
    // what messages is the user the author of
    const [author, setAuthor] = useState<string[]>([])
    // grab username
    const [userUsername, setUserUsername] = useState<string | null>(null)
    // grab user profile pic
    const [userProfilePic, setUserProfilePic] = useState<string | null>(null)
    // is the follow filter on
    const [followFilter, setFollowFilter] = useState(false);
    // followingLise is the user's list of followed users
    const [followingList, setFollowingList] = useState<string[]>([])
    // blocked list similar
    const [blockedList, setBlockedList] = useState<string[]>([])

    // loadstates
    const [userAttributesLoading, setUserAttributesLoading] = useState<boolean>(false)
    const [userAttributesError, setUserAttributesError] = useState<string>('')

    // user aave details
    // we need to find the user account details for aave if the user has any aave tokens
    const [aaveAccount, setAaveAccount] = useState<null | AaveUserAccount>(null)

    useEffect(() => {
         // load up user attributes for this channel
        const loadUserAttributes = async (): Promise<void> => {
            if(alphaPING === null){
                return
            }
            // if(currentChannel === null){
            //     return
            // }
            if(signer === null){
                return
            }

            // grab user address
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

                // fetch current channel mod
                const checkCurrentChannelMod = currentChannel !== null ? 
                    await alphaPING.mods(currentChannel.id) === account : 
                    false
                setCurrentChannelMod(checkCurrentChannelMod)
                
                //banned
                const banned = currentChannel ? await alphaPING.channelBans(currentChannel.id, account) : false
                setBanned(banned)
                
                //blacklisted
                const blacklisted = await alphaPING.isBlackListed(account)
                setBlacklisted(blacklisted)
                
                //author
                const channelMessages = currentChannel ? messages.filter(message => message.channel === currentChannel.id.toString()) : messages
                const author = []
                for(let i=0; i<channelMessages.length; i++){
                    if(account === channelMessages[i].account){
                        author.push(channelMessages[i]._id)
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
                
                // grab profile pic
                if(account !== null){
                    const profilePic = await alphaPING?.profilePic(account)
                    if(profilePic === undefined){
                        setUserProfilePic(null)
                    } else {
                        setUserProfilePic(profilePic)
                    }
                }

                // grab user following list and block list
                const totalUserCount = (await alphaPING?.totalSupply() || 0).toString()
                const allUsers = await Promise.all(
                    Array.from({ length: Number(totalUserCount) }, (_, i) => i + 1)
                        .map( async (numbah) => {
                            return alphaPING?.ownerOf(numbah)
                        }) 
                )
                const followingList: string[] = []
                await Promise.all(
                    allUsers.map(async (user) => {
                        const result = await alphaPING?.personalFollowList(account, user)
                        if(result.toString() === 'true'){
                            followingList.push(user.toString())
                        }
                    })
                )
                setFollowingList(followingList)
                const blockedList: string[] = []
                await Promise.all(
                    allUsers.map(async (user) => {
                        const result = await alphaPING?.personalFollowList(account, user)
                        if(result.toString() === 'true'){
                            followingList.push(user.toString())
                        }
                    })
                )
                setBlockedList(blockedList)

            }catch(err: unknown){
                console.error(err as string)
                setUserAttributesError((err as ErrorType).message)
            }finally{
                setUserAttributesLoading(false)
            }
        }
        loadUserAttributes()
        if(userAttributesLoading){
            console.log("User Attributes Loading...")
        }
        if(userAttributesError){
            console.error(userAttributesError)
        }
    }, [
        currentChannel, 
        account, 
        messages, 
        signer,
        alphaPING,
        channels,
        userAttributesError,
        userAttributesLoading
    ])

    // we are going to use this timer to refetch a new aave detail every 60 seconds
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    // Timer to update lastUpdated every 60 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
        setLastUpdated(new Date());
        }, 60 * 1000); // 60 seconds in milliseconds
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run once on mount
      
    // we need to find the user account details for aave if the user has any aave tokens
    useEffect(() => {
        const fetchAaveDetails = async (account: string) => {
        const aaveLendingPool = new ethers.Contract(
            // aave lending pool address
            "0x794a61358d6845594f94dc1db02a252b5b4814ad",
            AaveL2LendingPool.abi,
            signer
          );
          try{
            const accountData = await aaveLendingPool.getUserAccountData(account)
            console.log('accountData: ', accountData)
            if (accountData) {
              console.log('accountData: ', accountData)
    
              // Raw values are BigNumbers; convert them to human‑readable strings
              const cleanedAccountData: AaveUserAccount = {
                totalCollateral: formatUnits(accountData.totalCollateralBase, 8),
                totalDebt: formatUnits(accountData.totalDebtBase, 8),
                availableBorrows: formatUnits(accountData.availableBorrowsBase, 8),
                // liquidation threshhold in bps
                currentLiquidationThreshold: (Number(accountData.currentLiquidationThreshold) / 10000).toString(), 
                // ltv is in bps
                ltv: (Number(accountData.ltv) / 10000).toString(),
                healthFactor: formatUnits(accountData.healthFactor, 18)
              };
              console.log('user aave data:', cleanedAccountData);
              setAaveAccount(cleanedAccountData);
            } else {
                console.warn('No aave account data found for this user:', accountData);
                return;
            }
          } catch(error: unknown){
            if(error !== undefined || error !== null){
                console.warn("Error unable to fetch aave user account details for: " + signer + ": " + (error as Error).toString())
                return;
            }
          }
        }
    
        // only run this function if the user is part of an aave channel
        
        fetchAaveDetails(account)
      }, [
        account, 
        signer, 
        setAaveAccount,
        lastUpdated
    ])
    
    return (
        <UserContext.Provider value={{ 
            account,
            owner,
            setOwner,
            mod,
            setMod,
            currentChannelMod,
            banned,
            txMessageBan, 
            setTxMessageBan,
            blacklisted,
            txMessageBlacklist, 
            setTxMessageBlacklist,
            txMessageFollow,
            setTxMessageFollow,
            txMessageBlock,
            setTxMessageBlock,
            author,
            userUsername,
            setUserUsername,
            userProfilePic,
            setUserProfilePic,
            followFilter,
            setFollowFilter,
            followingList,
            blockedList,
            aaveAccount,
            setAaveAccount
        }}>
            {children}
        </UserContext.Provider>
  )
    

}

export default UserProvider