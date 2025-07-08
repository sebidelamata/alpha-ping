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
  CardFooter,
  CardHeader
} from '@/components/components/ui/card';
import { ScrollArea } from '@/components/components/ui/scroll-area';
import NewUserNoChannels from '../Channels/NewUserNoChannels';
import MessagesHeader from './MessagesHeader';
import { Skeleton } from '@/components/components/ui/skeleton'
import { mockMessages } from "mocks/mockMessages";

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
    alphaPING,
    tokenMetaData 
  } = useEtherProviderContext()
  const { 
    currentChannel, 
    tokenMetadataLoading,
    selectedChannelMetadata, 
  } = useChannelProviderContext()
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
  console.log('selectedChannelMetadata', selectedChannelMetadata)

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
    // only grab decimals if it is a erc20
    if(currentChannel?.tokenType.toLowerCase() === 'erc20' && currentChannel?.tokenAddress !== undefined){
      fetchTokenDecimals()
    }
  }, [token, currentChannel])

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
            mockMessages // switch this back to messages
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

  if(error){
    console.warn(error)
  }

  // scroll to end
  const messageEndRef = useRef<HTMLDivElement | null>(null)

  const scrollHandler = () => {
    setTimeout(() => {
        if(messageEndRef.current){
            (messageEndRef.current as HTMLDivElement)?.scrollIntoView({ behavior: 'smooth' })
        }
    }, 100)
  }

  // Scroll on mount
  useEffect(() => {
    scrollHandler()
  }, [])

  // Scroll when messages change or channel
  useEffect(() => {
    if (messages && currentChannel) {
      scrollHandler()
    }
  }, [messages, currentChannel])

  // Scroll when metadata loading completes
  useEffect(() => {
    if (!usernameArrayLoading && !bansArrayLoading && !blacklistArrayLoading) {
      scrollHandler()
    }
  }, [usernameArrayLoading, bansArrayLoading, blacklistArrayLoading])

  return (
    <Card 
      className="flex flex-col w-full h-full bg-primary text-secondary"
      onWheel={(e) => {
        e.stopPropagation(); 
      }}
    >
      {
        // we render the messages header only if token metadata has been fetched
        (selectedChannelMetadata !== undefined || tokenMetadataLoading === false) ?
        <CardHeader className="flex flex-col items-start justify-start p-0">
          <MessagesHeader/>
        </CardHeader> :
        <CardHeader className="flex flex-col items-start justify-start p-0">
          <Skeleton className='h-8 w-full justify-start'/>
          <Skeleton className='h-8 w-full justify-start'/>
          <Skeleton className='h-8 w-full justify-start'/>
        </CardHeader>
      }
      <CardContent className='flex-1 flex flex-col overflow-hidden p-0'>
        <div className="flex-1 overflow-hidden">
          { 
            (
              mockMessages === undefined || 
              mockMessages === null || 
              mockMessages.length === 0 ||
              currentChannel === null ||
              mockMessages
                .filter(message => message.channel === currentChannel.id.toString())
                .length === 0
            ) &&
            tokenMetaData.length > 0 &&
            <ScrollArea className='h-full overflow-y-auto w-full p-4'>
              <SkeletonMessageFeed/>
              <NewUserNoChannels/>
              <div ref={messageEndRef} />
            </ScrollArea>
          }
          {
            currentChannel && 
            followFilter === false &&
            mockMessages
              .filter(message => message.channel === currentChannel.id.toString())
              .length > 0 &&
            <ScrollArea className='h-full overflow-y-auto w-full p-4'>
              <ul className="space-y-2">
                {
                  mockMessages
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
              <div ref={messageEndRef} />
            </ScrollArea>
          }
          {
            currentChannel && 
            followFilter === true &&
            // if length of messages from follow array is > 0 we will display
            mockMessages
              .filter(message => (message.channel === currentChannel.id.toString() && (followingList.includes(message.account)) || message.account === account))
              .length === 0 &&
            <ScrollArea className='h-full overflow-y-auto w-full p-4'>
              <SkeletonMessageFeed/>
              <div ref={messageEndRef} />
            </ScrollArea>
          }
          {
            currentChannel && 
            followFilter === true &&
            // if length of messages from follow array is > 0 we will display
            mockMessages
              .filter(message => (message.channel === currentChannel.id.toString() && (followingList.includes(message.account) || message.account === account)))
              .length > 0 &&
            <ScrollArea className='h-full overflow-y-auto w-full p-4'>
              <ul className="space-y-2">
                {
                  mockMessages
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
              <div ref={messageEndRef} />
            </ScrollArea>
          }
        </div>
      </CardContent>
      <CardFooter className="sticky bottom-0 bg-primary py-3 w-full border-t">
        <SubmitMessage
          userBalance={userBalance}
          replyId={replyId}
          setReplyId={setReplyId}
        />
      </CardFooter>
    </Card>
  );
}

export default Messages;