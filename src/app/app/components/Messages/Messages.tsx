'use client';

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
import ERC20Faucet from '../../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { useEtherProviderContext } from '../../../../contexts/ProviderContext'
import { useChannelProviderContext } from '../../../../contexts/ChannelContext'
import { useUserProviderContext } from '../../../../contexts/UserContext';
import SkeletonMessageFeed from './SkeletonMessageFeed';
import Message from './Message'
import SubmitMessage from './SubmitMessage'
import { useMessagesProviderContext } from '../../../../contexts/MessagesContext'
import { 
  Card, 
  CardContent,
  CardFooter
} from '@/components/components/ui/card';
import { ScrollArea } from '@/components/components/ui/scroll-area';
import NewUserNoChannels from '../Channels/NewUserNoChannels';

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

interface ErrorType{
  message: string;
}

const Messages:React.FC = () => {

  const { 
    signer, 
    alphaPING 
  } = useEtherProviderContext()
  const { currentChannel } = useChannelProviderContext()
  const { messages } = useMessagesProviderContext()
  const { 
    txMessageBan, 
    txMessageBlacklist, 
    account, 
    txMessageFollow, 
    txMessageBlock, 
    followFilter,
    followingList,
    blockedList 
  } = useUserProviderContext()

  const [token, setToken] = useState<Contract | null>(null)
  const [tokenDecimals, setTokenDecimals] = useState<number | null>(null)
  const [userBalance, setUserBalance] = useState<string | null>(null)

  // this holds the value (if there is one) of the reply id of a message
  const [replyId, setReplyId] = useState<string | null>(null)

  useEffect(() => {
    if(currentChannel?.tokenAddress !== undefined){
      const token = new ethers.Contract(
        currentChannel?.tokenAddress,
        ERC20Faucet.abi,
        signer
      )
      setToken(token)
    }
  }, [currentChannel, signer])

  useEffect(() => {
    const fetchTokenDecimals = async () => {
      if (token !== null) {
        try {
          const tokenDecimals = await token.decimals()
          setTokenDecimals(tokenDecimals as number)
        } catch (error) {
          console.warn('Failed to fetch token decimals:', error)
          setTokenDecimals(null) 
        }
      } else {
        setTokenDecimals(null) 
      }
    }

    fetchTokenDecimals()
  }, [token])

  useEffect(() => {
    const getUserBalance = async () => {
      if(token !== null){
        const userBalance = await token.balanceOf(signer)
        setUserBalance(userBalance.toString())
      }
    }
    getUserBalance()
  }, [token, signer])

  const [profilePics, setProfilePics] = useState<ProfilePics>({})
  const [usernameArray, setUsernameArray] = useState<Usernames>({})
  const [usernameArrayLoading, setUsernameArrayLoading] = useState<boolean>(false)
  const [bansArray, setBansArray] = useState<Bans>({})
  const [bansArrayLoading, setBansArrayLoading] = useState<boolean>(false)
  const [blacklistArray, setBlacklistArray] = useState<Blacklists>({})
  const [blacklistArrayLoading, setBlacklistArrayLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMessagesMetadata = async () => {
      try{
        if(currentChannel !== null){
          setError(null)
          // store unique profiles for this message feed
          const uniqueProfiles = new Set<string>(
            messages // switch this back to messages
              .filter(message => message.channel === currentChannel.id.toString())
              .map(message => message.account)
          );
    
          // grab unique user avatars
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
        }
      }catch(error){
        setError((error as ErrorType).message)
      }finally{
        setUsernameArrayLoading(false)
        setBansArrayLoading(false)
        setBlacklistArrayLoading(false)
      }
    }
    if (currentChannel) {
      fetchMessagesMetadata();
    }
  }, [
    currentChannel, 
    txMessageBan, 
    txMessageBlacklist, 
    txMessageFollow, 
    txMessageBlock, 
    account, 
    messages, 
    alphaPING
  ])

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
  }, [])

  return (
    <Card 
      className="flex flex-col w-full h-full bg-primary text-secondary overflow-clip"
      onWheel={(e) => {
        e.stopPropagation(); 
      }}
    >
      <CardContent className='flex-1 h-full w-full'>
        { 
          (
            messages === undefined || 
            messages === null || 
            messages.length === 0 ||
            currentChannel === null ||
            messages
              .filter(message => message.channel === currentChannel.id.toString())
              .length === 0
          ) &&
          <ScrollArea className='h-full overflow-y-auto w-full'>
            <SkeletonMessageFeed/>
            <NewUserNoChannels/>
          </ScrollArea>
        }
        {
          currentChannel && 
          followFilter === false &&
          <ScrollArea className='h-full overflow-y-auto w-[100%]'>
            <ul>
              {
                messages
                  .filter(message => message.channel === currentChannel.id.toString())
                  .map((message, index) => (
                    <Message
                      key={message._id}
                      message={message}
                      index={index}
                      tokenDecimals={tokenDecimals}
                      tokenAddress={currentChannel?.tokenAddress}
                      setReplyId={setReplyId}
                      reply={
                        message.replyId !== null && message.replyId ? 
                        messages.find((targetMessage) => { return targetMessage._id === message.replyId }) || null :
                        null
                      }
                      profilePic={profilePics[message.account]}
                      username={usernameArray[message.account]}
                      usernameArrayLoading={usernameArrayLoading}
                      userBan={bansArray[message.account]}
                      blocked={blockedList.includes(message.account)}
                      following={followingList.includes(message.account)}
                      bansArrayLoading={bansArrayLoading}
                      userBlacklist={blacklistArray[message.account]}
                      blacklistArrayLoading={blacklistArrayLoading}
                    />
                ))
              }
            </ul>
          </ScrollArea>
        }
        {
          currentChannel && 
          followFilter === true &&
          // if length of messages from follow array is > 0 we will display
          messages
            .filter(message => (message.channel === currentChannel.id.toString() && (followingList.includes(message.account)) || message.account === account))
            .length === 0 &&
          <ScrollArea className='h-full overflow-y-auto w-full'>
            <SkeletonMessageFeed/>
          </ScrollArea>
        }
        {
          currentChannel && 
          followFilter === true &&
          // if length of messages from follow array is > 0 we will display
          messages
            .filter(message => (message.channel === currentChannel.id.toString() && (followingList.includes(message.account) || message.account === account)))
            .length > 0 &&
          <ScrollArea className='h-full overflow-y-auto w-full'>
            <ul>
              {
                messages
                  .filter(message => (message.channel === currentChannel.id.toString() && (followingList.includes(message.account) || message.account === account)))
                  .map((message, index) => (
                    <Message
                      key={message._id}
                      message={message}
                      index={index}
                      tokenDecimals={tokenDecimals}
                      tokenAddress={currentChannel?.tokenAddress}
                      setReplyId={setReplyId}
                      reply={
                        message.replyId !== null && message.replyId ? 
                        // swp this
                        messages.find((targetMessage) => { return targetMessage._id === message.replyId }) || null :
                        null
                      }
                      profilePic={profilePics[message.account]}
                      username={usernameArray[message.account]}
                      usernameArrayLoading={usernameArrayLoading}
                      userBan={bansArray[message.account]}
                      blocked={blockedList.includes(message.account)}
                      following={followingList.includes(message.account)}
                      bansArrayLoading={bansArrayLoading}
                      userBlacklist={blacklistArray[message.account]}
                      blacklistArrayLoading={blacklistArrayLoading}
                    />
                ))
              }
            </ul>
          </ScrollArea>
        }
        <div ref={messageEndRef} />
        { error !== null && <p>{error}</p>}
          <CardFooter className="sticky bottom-0 bg-primary py-3 w-full h-full">
            <SubmitMessage
              userBalance={userBalance}
              replyId={replyId}
              setReplyId={setReplyId}
            />
        </CardFooter>
      </CardContent>
    </Card>
  );
}

export default Messages;