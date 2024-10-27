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
import ERC20Faucet from '../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { useEtherProviderContext } from '../../contexts/ProviderContext'
import { useChannelProviderContext } from '../../contexts/ChannelContext'
import Message from './Message'
import SubmitMessage from './SubmitMessage'
import { useMessagesProviderContext } from '../../contexts/MessagesContext'

interface ProfilePics {
  [account: string]: string | null;
}

interface Usernames {
  [account: string]: string | null;
}

const Messages:React.FC = () => {

  const { signer, alphaPING } = useEtherProviderContext()
  const { currentChannel } = useChannelProviderContext()
  const { messages } = useMessagesProviderContext()

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
  const getProfilePics = async () => {
    setProfilePicsLoading(true)
    if(currentChannel !== null){
      const uniqueProfiles: string[] = []
      messages.filter(message => message.channel === currentChannel.id.toString()).map((message) => {
        if(!uniqueProfiles.includes(message.account)){
          uniqueProfiles.push(message.account)
        }
        }
      )
      const profilePicsData: ProfilePics = {};
      await Promise.all(
        uniqueProfiles.map( async (profile) => {
          const profilePic = await alphaPING?.profilePic(profile)
          profilePicsData[profile] = profilePic || null
        })
      )
      setProfilePics(profilePicsData)
      setProfilePicsLoading(false)
    }
  }
  useEffect(() => {
    if (currentChannel) {
      getProfilePics();
    }
  }, [currentChannel])

  const [usernameArray, setUsernameArray] = useState<Usernames>({})
  const [usernameArrayLoading, setUsernameArrayLoading] = useState<boolean>(false)
  const getUsernames = async () => {
    setUsernameArrayLoading(true)
    if(currentChannel !== null){
      const uniqueProfiles: string[] = []
      messages.filter(message => message.channel === currentChannel.id.toString()).map((message) => {
        if(!uniqueProfiles.includes(message.account)){
          uniqueProfiles.push(message.account)
        }
        }
      )
      const usernamesData: Usernames = {};
      await Promise.all(
        uniqueProfiles.map( async (profile) => {
          const username = await alphaPING?.username(profile)
          usernamesData[profile] = username || null
        })
      )
      setUsernameArray(usernamesData)
      setUsernameArrayLoading(false)
    }
  }
  useEffect(() => {
    if (currentChannel) {
      getUsernames();
    }
  }, [currentChannel])


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
          />
        ))}

        <div ref={messageEndRef} />
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