'use client';

import React, 
{ 
    useEffect, 
    useState, 
    useRef
} from 'react'
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
import { useTokenMetadataContext } from 'src/contexts/TokenMetaDataContext';
import useGetTokenDecimals from 'src/hooks/useGetTokenDecimals';
import useMessageMetadata from 'src/hooks/useMessageMetadata';

const Messages:React.FC = () => {

  const { 
    tokenMetaData, 
    tokenMetadataLoading 
  } = useTokenMetadataContext()
  const { 
    currentChannel,
    selectedChannelMetadata, 
  } = useChannelProviderContext()
  const { messages } = useMessagesProviderContext()
  const {
    account,
    followFilter,
    followingList,
    blockedList 
  } = useUserProviderContext()

  const { tokenDecimals } = useGetTokenDecimals()


  // this holds the value (if there is one) of the reply id of a message
  const [replyId, setReplyId] = useState<string | null>(null)

  const {
    usernameArray,
    profilePics,
    bansArray,
    blacklistArray,
    isMetadataLoading,
  } = useMessageMetadata()

  // scroll to end
  const messageEndRef = useRef<HTMLDivElement | null>(null)

  const scrollHandler = () => {
    const timer = setTimeout(() => {
        if(messageEndRef.current){
            (messageEndRef.current as HTMLDivElement)?.scrollIntoView({ behavior: 'smooth' })
        }
    }, 100)
    return () => clearTimeout(timer);
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
    if (!isMetadataLoading) {
      scrollHandler()
    }
  }, [isMetadataLoading])

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
              messages === undefined || 
              messages === null || 
              messages.length === 0 ||
              currentChannel === null ||
              messages
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
            messages
              .filter(message => message.channel === currentChannel.id.toString())
              .length > 0 &&
            <ScrollArea className='h-full overflow-y-auto w-full p-4'>
              <ul className="space-y-2">
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
                        userBan={bansArray[message.account]}
                        blocked={blockedList.includes(message.account)}
                        following={followingList.includes(message.account)}
                        userBlacklist={blacklistArray[message.account]}
                        isMetadataLoading={isMetadataLoading}
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
            messages
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
            messages
              .filter(message => (message.channel === currentChannel.id.toString() && (followingList.includes(message.account) || message.account === account)))
              .length > 0 &&
            <ScrollArea className='h-full overflow-y-auto w-full p-4'>
              <ul className="space-y-2">
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
                        userBan={bansArray[message.account]}
                        blocked={blockedList.includes(message.account)}
                        following={followingList.includes(message.account)}
                        userBlacklist={blacklistArray[message.account]}
                        isMetadataLoading={isMetadataLoading}
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
          replyId={replyId}
          setReplyId={setReplyId}
        />
      </CardFooter>
    </Card>
  );
}

export default Messages;