import React, 
{ 
    useEffect, 
    useState, 
    useRef
} from 'react'
import { 
  ethers, 
  Contract 
} from 'ethers'
import ERC20Faucet from '../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { useEtherProviderContext } from '../../contexts/ProviderContext'
import { useChannelProviderContext } from '../../contexts/ChannelContext'
import Message from './Message'
import SubmitMessage from './SubmitMessage'
import { useMessagesProviderContext } from '../../contexts/MessagesContext'
import { useUserProviderContext } from '../../contexts/UserContext'

interface ProfilePics {
  [account: string]: string | null;
}

interface Usernames {
  [account: string]: string | null;
}

interface Bans {
  [account: string]: boolean;
}

interface Blacklists {
  [account: string]: boolean;
}


interface Follows {
  [account: string]: boolean;
}

interface ErrorType{
  message: string;
}

const Messages:React.FC = () => {

  const { signer, alphaPING } = useEtherProviderContext()
  const { currentChannel } = useChannelProviderContext()
  const { messages } = useMessagesProviderContext()
  const { txMessageBan, txMessageBlacklist, account, txMessageFollow } = useUserProviderContext()

  const [token, setToken] = useState<Contract | null>(null)
  const [tokenDecimals, setTokenDecimals] = useState<number | null>(null)
  const [userBalance, setUserBalance] = useState<string | null>(null)

  // this holds the value (if there is one) of the reply id of a message
  const [replyId, setReplyId] = useState<number | null>(null)

  useEffect(() => {
    if(currentChannel?.tokenAddress !== undefined){
      const token = new ethers.Contract(
        currentChannel?.tokenAddress,
        ERC20Faucet.abi,
        signer
      )
      setToken(token)
    }
  }, [currentChannel])

  const fetchTokenDecimals = async () => {
    if(token !== null){
      const tokenDecimals = await token.decimals()
      setTokenDecimals(tokenDecimals as number)
    }
  }
  useEffect(() => {
    fetchTokenDecimals()
  }, [token])

  const getUserBalance = async () => {
    if(token !== null){
      const userBalance = await token.balanceOf(signer)
      setUserBalance(userBalance.toString())
    }
  }
  useEffect(() => {
    getUserBalance()
  }, [token])

  const [profilePics, setProfilePics] = useState<ProfilePics>({})
  const [profilePicsLoading, setProfilePicsLoading] = useState<boolean>(false)
  const [usernameArray, setUsernameArray] = useState<Usernames>({})
  const [usernameArrayLoading, setUsernameArrayLoading] = useState<boolean>(false)
  const [bansArray, setBansArray] = useState<Bans>({})
  const [bansArrayLoading, setBansArrayLoading] = useState<boolean>(false)
  const [blacklistArray, setBlacklistArray] = useState<Blacklists>({})
  const [blacklistArrayLoading, setBlacklistArrayLoading] = useState<boolean>(false)
  const [followsArray, setFollowsArray] = useState<Follows>({})
  const [followsArrayLoading, setFollowsArrayLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessagesMetadata = async () => {
    try{
      if(currentChannel !== null){
        setError(null)
        // store unique profiles for this message feed
        const uniqueProfiles = new Set<string>(
          messages
            .filter(message => message.channel === currentChannel.id.toString())
            .map(message => message.account)
        );
  
        // grab unique user avatars
        setProfilePicsLoading(true)
        const profilePicsData: ProfilePics = {};
        await Promise.all(
          Array.from(uniqueProfiles).map( async (profile) => {
            const profilePic = await alphaPING?.profilePic(profile)
            profilePicsData[profile] = profilePic || null
          })
        )
        setProfilePics(profilePicsData)
  
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

        // grab all the users you are following
        setFollowsArrayLoading(true)
        const followsData: Follows = {}
        await Promise.all(
          Array.from(uniqueProfiles).map( async (profile) => {
            const follow = await alphaPING?.personalFollowList(account, profile) || false
            followsData[profile] = follow
          })
        )
        setFollowsArray(followsData)
      }
    }catch(error){
      setError((error as ErrorType).message)
    }finally{
      setProfilePicsLoading(false)
      setUsernameArrayLoading(false)
      setBansArrayLoading(false)
      setBlacklistArrayLoading(false)
      setFollowsArrayLoading(false)
    }
  }
  useEffect(() => {
    if (currentChannel) {
      fetchMessagesMetadata();
    }
  }, [currentChannel, txMessageBan, txMessageBlacklist, txMessageFollow])


  // scroll to end
  const messageEndRef = useRef<HTMLDivElement | null>(null)


  const scrollHandler = () => {
    setTimeout(() => {
        if(messageEndRef.current){
            (messageEndRef.current as HTMLDivElement)?.scrollIntoView({ behavior: 'smooth' })
        }
    }, 500)
  }

  useEffect(() => {
    scrollHandler()
  })

  return (
    <div className="messages">
      <div className="messages-feed">

        {
        currentChannel && 
        messages.filter(message => message.channel === currentChannel.id.toString()).map((message, index) => (
          <Message
            key={message.id}
            message={message}
            index={index}
            tokenDecimals={tokenDecimals}
            tokenAddress={currentChannel?.tokenAddress}
            setReplyId={setReplyId}
            reply={
              message.replyId !== null && message.replyId ? 
              messages.find((targetMessage) => { return targetMessage.id === message.replyId }) || null :
              null
            }
            profilePic={profilePics[message.account]}
            profilePicsLoading={profilePicsLoading}
            username={usernameArray[message.account]}
            usernameArrayLoading={usernameArrayLoading}
            userBan={bansArray[message.account]}
            bansArrayLoading={bansArrayLoading}
            userBlacklist={blacklistArray[message.account]}
            blacklistArrayLoading={blacklistArrayLoading}
            following={followsArray[message.account]}
          />
        ))}

        <div ref={messageEndRef} />
        { error !== null && <p>{error}</p>}
      </div>
      <SubmitMessage
        currentChannel={currentChannel}
        userBalance={userBalance}
        messagesLength={messages.length}
        replyId={replyId}
        setReplyId={setReplyId}
      />
    </div>
  );
}

export default Messages;