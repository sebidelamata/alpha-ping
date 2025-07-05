'use client';

import React, {
    useState, 
} from "react"
import { AlphaPING } from '../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import { ethers } from 'ethers'
import { useEtherProviderContext } from '../../../../contexts/ProviderContext';
import { useChannelProviderContext } from "../../../../contexts/ChannelContext";
import Loading from "../Loading";
import LeaveChannel from "./LeaveChannel";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/components/ui/hover-card"
import { Badge } from "@/components/components/ui/badge"
import { SidebarMenuButton } from "@/components/components/ui/sidebar"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/components/ui/accordion"
import { ScrollArea } from "@/components/components/ui/scroll-area";
import { 
    ScrollText, 
    Globe 
} from "lucide-react";  
import Link from "next/link";
import Image from "next/image";

interface IChannel{
    channel: AlphaPING.ChannelStructOutput;
    tokenMetadata: tokenMetadata;
}

const Channel:React.FC<IChannel> = ({
    channel,
    tokenMetadata
}) => {

    const { 
        alphaPING, 
        signer 
    } = useEtherProviderContext()
    const { 
        currentChannel, 
        setCurrentChannel, 
        setSelectedChannelMetadata 
    } = useChannelProviderContext()

    const [joinChannelLoading, setJoinChannelLoading] = useState<boolean>(false)
    console.log("Channel render", channel.tokenAddress, tokenMetadata);
    
    // handles clicking on channel names from channels list
    const channelHandler = async (channel:AlphaPING.ChannelStructOutput) => {
      // Check if user has joined
      // If they haven't allow them to mint.
      const hasJoined = await alphaPING?.hasJoinedChannel(
        BigInt(channel.id), 
        await signer?.getAddress() || ethers.ZeroAddress
      )
  
      if (hasJoined === true) {
        setCurrentChannel(channel)
        setSelectedChannelMetadata(tokenMetadata)
        // document.title = `AlphaPING | ${channel.name}`;
      } else {
        setJoinChannelLoading(true)
        const transaction = await alphaPING?.connect(signer).joinChannel(BigInt(channel.id))
        await transaction?.wait()
        setCurrentChannel(channel)
        setSelectedChannelMetadata(tokenMetadata)
        // document.title = `AlphaPING | ${channel.name}`;
        setJoinChannelLoading(false)
      }
    }

    // pass hover info to leaveChannel component to make icon appear
    const [isHovered, setIsHovered] = useState(false);

    return(
        <HoverCard>
            <HoverCardTrigger>
                <SidebarMenuButton
                    className={`flex items-center justify-between ${
                        currentChannel && 
                        currentChannel.id.toString() === channel.id.toString() && 
                        "bg-accent" }`
                    }
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => channelHandler(channel)}
                >
                    <div className="flex items-center justify-start gap-4">
                        <Avatar className="size-4">
                            <AvatarImage 
                                src={
                                        isHovered === true ?
                                            tokenMetadata.logo !== '' ? 
                                            tokenMetadata.logo : 
                                            (
                                                channel.tokenType === 'ERC20' ?
                                                '/erc20IconAlt.svg' :
                                                '/blank_nft.svg'
                                            )
                                        :
                                            tokenMetadata.logo !== '' ? 
                                            tokenMetadata.logo : 
                                            (
                                                channel.tokenType === 'ERC20' ?
                                                '/erc20Icon.svg' :
                                                '/blank_nft.svg'
                                            )
                                } 
                                alt="Token Logo"
                                loading="lazy"
                            />
                            <AvatarFallback>
                                {channel.name.slice(0,2)}
                            </AvatarFallback>
                        </Avatar>
                        <p>
                            {channel.name}
                        </p>
                    </div>
                    <LeaveChannel isHovered={isHovered} channel={channel} tokenMetadata={tokenMetadata}/>
                    {
                        joinChannelLoading === true &&
                            <Loading/>
                    }
                </SidebarMenuButton>
            </HoverCardTrigger>
            <HoverCardContent className="bg-primary text-secondary">
                <div
                    className="flex justify-between space-x-4"
                >
                    <div className="flex flex-row gap-2">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="flex items-center justify-start gap-2">
                                    <Avatar>
                                        <AvatarImage
                                            src={
                                                tokenMetadata.logo !== '' ? 
                                                tokenMetadata.logo : 
                                                (
                                                    channel.tokenType === 'ERC20' ?
                                                    '/erc20Icon.svg' :
                                                    '/blank_nft.svg'
                                                )
                                            }
                                            loading="lazy"
                                            alt="AlphaPING Logo"
                                        />
                                        <AvatarFallback>AP</AvatarFallback>
                                    </Avatar>
                                    <h5>{channel.name}</h5>
                                    <Badge
                                        variant="secondary"
                                    >
                                        {channel.tokenType}
                                    </Badge>
                                </AccordionTrigger>
                                <AccordionContent className="max-h-48 overflow-scroll">
                                    <ScrollArea>
                                        <div className="flex flex-col justify-start">
                                            <ul className="flex flex-row flex-wrap">
                                                {
                                                    tokenMetadata.urls.technical_doc.length > 0 &&
                                                    <li>
                                                        <Badge variant="secondary" className="m-1 items-center">
                                                            <Link
                                                                href={tokenMetadata.urls.technical_doc[0]}
                                                                target="_blank"
                                                                className="flex items-center"
                                                            >
                                                                <ScrollText className="h-4 w-4" />
                                                            </Link>
                                                        </Badge>
                                                    </li>
                                                }
                                                {
                                                    tokenMetadata.urls.website.length > 0 &&
                                                    <li>
                                                        <Badge variant="secondary" className="m-1 items-center">
                                                            <Link
                                                                href={tokenMetadata.urls.website[0]}
                                                                target="_blank"
                                                                className="flex items-center"
                                                            >
                                                                <Globe className="h-4 w-4" />
                                                            </Link>
                                                        </Badge>
                                                    </li>
                                                }
                                                {
                                                    tokenMetadata.urls.source_code.length > 0 &&
                                                    <li>
                                                        <Badge variant="secondary" className="m-1 items-center">
                                                            <Link
                                                                href={tokenMetadata.urls.source_code[0]}
                                                                target="_blank"
                                                                className="flex items-center"
                                                            >
                                                                <Image 
                                                                    src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" 
                                                                    alt="Github Icon"
                                                                    loading="lazy"
                                                                    width={18}
                                                                    height={18}
                                                                />
                                                            </Link>
                                                        </Badge>
                                                    </li>
                                                }
                                                {
                                                    tokenMetadata.urls.twitter.length > 0 &&
                                                    <li>
                                                        <Badge variant="secondary" className="m-1 items-center">
                                                            <Link
                                                                href={tokenMetadata.urls.twitter[0]}
                                                                target="_blank"
                                                                className="flex items-center"
                                                            >
                                                                <Image 
                                                                    src="x.svg" 
                                                                    alt="X Icon"
                                                                    loading="lazy"
                                                                    width={18}
                                                                    height={18}
                                                                />
                                                            </Link>
                                                        </Badge>
                                                    </li>
                                                }
                                            </ul>
                                            {
                                                tokenMetadata.description &&
                                                <p className="text-sm text-secondary flex flex-wrap flex-row">
                                                    {
                                                        tokenMetadata.description
                                                    }
                                                </p>
                                            }
                                            <ul className="flex flex-row flex-wrap">
                                                {
                                                    tokenMetadata.tags.length > 0 &&
                                                    tokenMetadata.tags.map((tag, index) => {
                                                        return(
                                                            <li key={index}>
                                                                <Badge variant="outline" className="m-1 border-accent">
                                                                    {
                                                                        tag.length > 20 ?
                                                                        `${tag.slice(0,20)}...` :
                                                                        tag
                                                                    }
                                                                </Badge>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </ScrollArea>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default Channel;