'use client';

import React, {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { DateTime } from 'luxon';
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import PostBalance from "./PostBalance";
import CurrentBalance from "./CurrentBalance";
import MessageHoverOptions from "./MessageHoverOptions";
import BanUser from "./BanUser";
import UnbanUser from "./UnbanUser";
import BlacklistUser from "./BlacklistUser";
import UnblacklistUser from "./UnblacklistUser";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/components/ui/card";
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "@/components/components/ui/avatar";
import { Skeleton } from "@/components/components/ui/skeleton";
import { Badge } from "@/components/components/ui/badge";


interface MessageProps {
    message: Message;
    index: number;
    tokenDecimals: number | null;
    tokenAddress: string | null;
    setReplyId: React.Dispatch<React.SetStateAction<string | null>>;
    reply: Message | null;
    profilePic: string | null;
    profilePicsLoading: boolean;
    username: string | null;
    usernameArrayLoading: boolean;
    userBan: boolean;
    bansArrayLoading: boolean;
    userBlacklist: boolean;
    blacklistArrayLoading: boolean;
    following: boolean;
    followsArrayLoading: boolean;
    blocked: boolean;
    blocksArrayLoading: boolean;
}

const Message: React.FC<MessageProps> = ({
  message, 
  index, 
  tokenDecimals, 
  tokenAddress, 
  setReplyId, 
  reply, 
  profilePic,
  profilePicsLoading,
  username,
  usernameArrayLoading,
  userBan,
  bansArrayLoading,
  userBlacklist,
  blacklistArrayLoading,
  following,
  followsArrayLoading,
  blocked,
  blocksArrayLoading
}) => {

    const { currentChannelMod, owner } = useUserProviderContext()
    const { alphaPING } = useEtherProviderContext()

    const [hoverOptions, sethoverOptions] = useState<boolean>(false)
    const [hoverReactions, sethoverReactions] = useState<string | null>(null)
    const [replyPFP, setReplyPFP] = useState<string | null>(null)
    const [replyUsername, setReplyUsername] = useState<string | null>(null)

    // if there is a reply get username and profile pic to original post
    useEffect(() => {
      const fetchReplyPFP = async () => {
        if(reply && reply !== null){
          const replyPFP = await alphaPING?.profilePic(reply.account) || null
          setReplyPFP(replyPFP)
        }
      }
      fetchReplyPFP()
      const fetchReplyUsername = async () => {
        if(reply && reply !== null){
          const replyUsername = await alphaPING?.username(reply.account) || null
          setReplyUsername(replyUsername)
        }
      }
      fetchReplyUsername()
    }, [alphaPING, reply])

    if (message === null || message === undefined || Object.keys(message).length === 0) {
      // Render a placeholder or nothing if there is no message data
      return <div>Message unavailable</div>;
    }

    // Function to extract image URLs from message text
    const extractImageUrls = (text: string): string[] => {
      const regex = /!\[image\]\((.*?)\)/g;
      let match;
      const urls: string[] = [];
      while ((match = regex.exec(text)) !== null) {
          urls.push(match[1]);
      }
      return urls;
    };

    const imageUrls = extractImageUrls(message.text);

    // Function to extract iframe strings from message text
    const extractIframeStrings = (text: string): string[] => {
      const regex = /<iframe src="(.*?)"/g;
      let match;
      const urls: string[] = [];
      while ((match = regex.exec(text)) !== null) {
        urls.push(match[1]);
      }
      return urls;
    };

  const iframeStrings = extractIframeStrings(message.text);

  // Remove all image markdowns from message text
  const cleanMessageText = message.text
    .replace(/!\[image\]\(.*?\)/g, '')
    .replace(/<iframe src="(.*?)"/g, "")
    .replace(/\/>/g, "")

  return(
    <Card 
      className="flex flex-row bg-primary text-secondary w-full" 
      key={index}
      onMouseEnter={() => sethoverOptions(true)}
      onMouseLeave={() => sethoverOptions(false)}
    >
      <CardHeader className='flex flex-col items-center'>
        {/* <PFP
          profilePic={profilePic}
          profilePicsLoading={profilePicsLoading}
          following={following}
          account={message.account}
          hoverOptions={hoverOptions}
          blocked={blocked}
        /> */}
        {
          <Avatar>
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
        }
        <Link
          href={`https://arbiscan.io/address/${message.account}`}
          className='message-poster-address'
          target='_blank'
        >
          <h3>
            {
              usernameArrayLoading === true ?
              message.account.slice(0, 6) + '...' + message.account.slice(38, 42) :
                (username !== null && username !== '') ?
                username :
                message.account.slice(0, 6) + '...' + message.account.slice(38, 42)
            }
          </h3>
        </Link>
        {
          bansArrayLoading === true &&
          <Skeleton className="h-6 w-16 rounded-md" />
        }
        {
          (
            currentChannelMod === true ||
            owner === true
          ) &&
          hoverOptions === true &&
          userBan === false &&
          <BanUser user={message.account}/>
        }
        {
          (
            currentChannelMod === true ||
            owner === true
          ) &&
          hoverOptions === true &&
          userBan === true &&
          <UnbanUser user={message.account}/>
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
          (
            blacklistArrayLoading === true ||
            followsArrayLoading === true ||
            blocksArrayLoading == true
          ) &&
          <Skeleton className="h-6 w-16 rounded-md" />
        }
        {
          owner === true &&
          hoverOptions === true &&
          userBlacklist === false &&
          <BlacklistUser user={message.account}/>
        }
        {
          owner === true &&
          hoverOptions === true &&
          userBlacklist === true &&
          <UnblacklistUser user={message.account}/>
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
      <CardContent className="grid grid-rows-3 w-full">
        <CardDescription className='flex flex-col gap-4'>
          <div className="flex justify-start items-center gap-16">
            <PostBalance message={message} tokenAddress={tokenAddress} tokenDecimals={tokenDecimals}/>
            <CurrentBalance message={message} tokenAddress={tokenAddress} tokenDecimals={tokenDecimals}/>
            <div className='message-timestamp'>
              {DateTime.fromISO(message.timestamp.toString()).toLocaleString(DateTime.DATETIME_MED)}
            </div>
            {
              hoverOptions === true &&
              <MessageHoverOptions 
                message={message}
                setReplyId={setReplyId}
              />
            }
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
        <div className='message-content-row-two'>
          <p className='message-content-text'>
            {cleanMessageText}
          </p>
          {
            imageUrls.map((url, idx) => (
              <img 
                key={idx} 
                src={url} 
                alt={`Linked content ${idx}`} 
                className='message-image' 
                loading="lazy"
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
                  className="reaction-item"
                  onMouseEnter={() => sethoverReactions(key)}
                  onMouseLeave={() => sethoverReactions(null)}
                >
                  <div className="reaction-emoji">{key}</div>
                  <div className="reaction-count">{value.length}</div>
                </li>
              )
            ))
          }
          {
            hoverReactions !== null &&
            <div className="hover-reactions-accounts">
              <div className="hover-reaction-icon">{hoverReactions}</div>
              <ul className="hover-reaction-address-list">
                {
                  message.reactions[hoverReactions].length > 0 &&
                  message.reactions[hoverReactions].map((address) => (
                    <li className="hover-reaction-address" key={address}>
                      {address.slice(0,4)}...{address.slice(38,42)}
                    </li>
                  ))
                }
              </ul>
            </div>
          }
        </ul>
      </CardContent>
    </Card>
  )
}

export default Message