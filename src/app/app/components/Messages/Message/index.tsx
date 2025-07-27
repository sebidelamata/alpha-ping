'use client';

import React, {
  useState,
} from "react";
import Link from "next/link";
import { DateTime } from 'luxon';
import { useUserProviderContext } from "../../../../../contexts/UserContext";
import PostBalance from "./PostBalance";
import CurrentBalance from "./CurrentBalance";
import MessageHoverOptions from "./MessageHoverOptions";
import MessageReactions from "./MessageReactions";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
} from "@/components/components/ui/card";
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "@/components/components/ui/avatar";
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@/components/components/ui/popover";
import { Skeleton } from "@/components/components/ui/skeleton";
import { Badge } from "@/components/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/components/ui/button";
import { SmilePlus, UserPlus } from "lucide-react";
import PfpPopover from "./PfpPopover";
import MessageAaveHealthFactor from "./MessageAaveHealthFactor";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import extractImageUrls from "src/lib/extractImageUrls";
import extractIframeStrings from "src/lib/extractIframeStrings";
import useReplyUsernameAndPFP from "src/hooks/useReplyUsernameAndPFP";


interface MessageProps {
    message: Message;
    index: number;
    tokenDecimals: number | null;
    tokenAddress: string | null;
    setReplyId: React.Dispatch<React.SetStateAction<string | null>>;
    reply: Message | null;
    profilePic: string | null;
    username: string | null;
    userBan: boolean;
    following: boolean;
    blocked: boolean;
    userBlacklist: boolean;
    isMetadataLoading: boolean;
}

const Message: React.FC<MessageProps> = ({
  message, 
  index, 
  tokenDecimals, 
  tokenAddress, 
  setReplyId, 
  reply, 
  profilePic,
  username,
  userBan,
  following,
  blocked,
  userBlacklist,
  isMetadataLoading,
}) => {

  const { 
    currentChannelMod, 
    owner 
  } = useUserProviderContext()
  const { selectedChannelMetadata } = useChannelProviderContext()

  const [hoverOptions, sethoverOptions] = useState<boolean>(false)

  // if there is a repl fetch the reply pfp and username
  const {replyPFP, replyUsername} = useReplyUsernameAndPFP(reply)

  if (message === null || message === undefined || Object.keys(message).length === 0) {
    // Render a placeholder or nothing if there is no message data
    return <div>Message unavailable</div>;
  }

  const imageUrls = extractImageUrls(message.text);

  const iframeStrings = extractIframeStrings(message.text);

  // Remove all image markdowns from message text
  const cleanMessageText = message.text
    .replace(/!\[image\]\(.*?\)/g, '')
    .replace(/<iframe src="(.*?)"/g, "")
    .replace(/\/>/g, "")


  const customLoader = ({ src }: { src: string }) => {
    return src; // Returns the full URL without relying on Next.js optimization
  };

  return(
      <Card 
        className="flex flex-cols-2 bg-primary text-secondary w-full" 
        key={index}
        onMouseEnter={() => sethoverOptions(true)}
        onMouseLeave={() => sethoverOptions(false)}
      >
      <CardHeader className='flex flex-col items-center'>
        {
          <Popover>
            <PopoverTrigger asChild>
              <div 
                className="relative group cursor-pointer "
              >
                <Avatar 
                  className="transition-transform duration-200 group-hover:scale-105 group-hover:ring-2 group-hover:ring-accent"
                >
                  {
                    (profilePic !== null && profilePic !== '' && profilePic !== undefined) ?
                    <AvatarImage
                      src={profilePic} 
                      alt="User Icon"
                      loading="lazy"
                    /> :
                    <AvatarImage
                      src={"/monkey.svg"} 
                      alt="User Icon"
                      loading="lazy"
                    />
                  }
                  {
                    (username !== null && username !== '' && username !== undefined) ?
                    <AvatarFallback>
                      {username.slice(0, 2)}
                    </AvatarFallback> :
                    <AvatarFallback>
                      {message.account.slice(0, 2)}
                    </AvatarFallback>
                  }
                </Avatar>
                <UserPlus className="size-4 relative bottom-2 left-8 text-accent transition-transform duration-200 group-hover:scale-105"/>
                <div 
                  className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-20 transition-opacity rounded-full"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="bg-primary text-secondary border-accent">
              <PfpPopover
                profilePic={profilePic}
                username={username}
                message={message}
                userBan={userBan}
                userBlacklist={userBlacklist}
                following={following}
                blocked={blocked}
              />
            </PopoverContent>
          </Popover>
        }
        <Link
          href={`https://arbiscan.io/address/${message.account}`}
          target='_blank'
        >
          <h4>
            {
              isMetadataLoading === true ?
              message.account.slice(0, 6) + '...' + message.account.slice(38, 42) :
                (username !== null && username !== '') ?
                username :
                message.account.slice(0, 6) + '...' + message.account.slice(38, 42)
            }
          </h4>
        </Link>
        {
          isMetadataLoading === true &&
          <Skeleton className="h-6 w-16 rounded-md" />
        }
        {
          currentChannelMod === false &&
          owner === false &&
          hoverOptions === true &&
          userBan === true &&
          <Badge variant="destructive">
            Banned
          </Badge>
        }
        {
          userBan === true &&
          hoverOptions === false &&
          <Badge variant="destructive">
            Banned
          </Badge>
        }
        {
          isMetadataLoading === true &&
          <Skeleton className="h-6 w-16 rounded-md" />
        }
        {
          owner === true &&
          hoverOptions === false &&
          userBlacklist === true &&
          <Badge variant="destructive">
            Blacklisted
          </Badge>
        }
        {
          userBlacklist === true &&
          owner === false &&
          <Badge variant="destructive">
            Blacklisted
          </Badge>
        }
      </CardHeader>
      <CardContent className="flex flex-col w-full gap-4">
        <CardDescription className='flex flex-col gap-4 flex-wrap'>
          <div className="flex justify-start items-center lg:gap-16 med:gap-8 sm:gap-4 flex-wrap">
            <PostBalance message={message} tokenAddress={tokenAddress} tokenDecimals={tokenDecimals}/>
            <CurrentBalance tokenDecimals={tokenDecimals}/>
            {
              selectedChannelMetadata &&
              selectedChannelMetadata.protocol &&
              selectedChannelMetadata.protocol === 'aave' &&
              <MessageAaveHealthFactor account={message.account}/>
            }
            <div className='message-timestamp'>
              {DateTime.fromISO(message.timestamp.toString()).toLocaleString(DateTime.DATETIME_MED)}
            </div>
          </div>
          {
            reply !== null &&
            message.replyId !== null &&
              <div className="flex justify-start items-center align-middle gap-2 test-sm">
                <Avatar>
                  {
                    (replyPFP !== null && replyPFP !== '' && replyPFP !== undefined) ?
                    <AvatarImage
                      src={replyPFP} 
                      alt="User Icon"
                      loading="lazy"
                      className="size-6"
                    /> :
                    <AvatarImage
                      src={"/monkey.svg"} 
                      alt="User Icon"
                      loading="lazy"
                    />
                  }
                  {
                    (replyUsername !== null && replyUsername !== '' && replyUsername !== undefined) ?
                    <AvatarFallback>
                      {replyUsername.slice(0, 2)}
                    </AvatarFallback> :
                    <AvatarFallback>
                      {message.account.slice(0, 2)}
                    </AvatarFallback>
                  }
                </Avatar>
                <div className="reply-author">
                  {
                    (replyUsername !== null && replyUsername !== '' && replyUsername !== undefined) ?
                    `${replyUsername}` :
                    `${reply.account.slice(0,4)}...${reply.account.slice(28,32)}`
                  }
                </div>
                <p className="message-content-reply">
                  {
                  `${reply.text}...`
                  }
                </p>
              </div>
          }
        </CardDescription>
        <div className='flex flex-col gap-8 justify-start w-full'>
          <p className='flex flex-wrap'>
            {cleanMessageText}
          </p>
          {
            imageUrls.map((url, idx) => (
              <Image 
                key={idx} 
                src={url} 
                alt={`Linked content ${idx}`} 
                width={800}
                height={800}
                loading="lazy"
                loader={customLoader}
                sizes="(max-width: 600px) 150px, (max-width: 1024px) 300px, 600px"
              />
            ))
          }
          {
            iframeStrings.map((iframeString, idx) => (
              <iframe
                key={idx}
                src={iframeString}
                title={`Embedded content ${idx}`}
                className="message-iframe"
              />
            ))
          }
        </div>
        <div className="flex flex-row gap-4">
          <ul className="message-content-row-three">
            {
              message !== null && 
              message !== undefined &&
              message.reactions !== undefined &&
              message.reactions !== null &&
              Object.keys(message.reactions).length > 0 &&
              Object.entries(message.reactions).map(([key, value]) => (
                (
                  message.reactions[key].length > 0 && 
                  <li
                    key={key}
                  >
                    <MessageReactions
                      reaction={key}
                      count={value.length.toString()}
                      message={message}
                    />
                  </li>
                )
              ))
            }
          </ul>
          <Popover>
            <PopoverTrigger>
              <Button>
                <SmilePlus/>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-primary text-secondary">
              <MessageHoverOptions 
                message={message}
                setReplyId={setReplyId}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  )
}

export default Message