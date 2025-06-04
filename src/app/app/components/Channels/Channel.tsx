'use client';

import React, {
    useState, 
    useEffect,
    useMemo
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
import qs from 'qs';
  

interface IChannel{
    channel: AlphaPING.ChannelStructOutput;
}

const Channel:React.FC<IChannel> = ({
    channel
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


    // holds metadata fetched from coinmarketcap
    const defaultTokenMetadata = useMemo(() => ({
        id: 0,
        name: '',
        category: '',
        description: '',
        contract_address: [],
        date_added: '',
        date_launched: '',
        infinite_supply: false,
        is_hidden: 0,
        logo: '',
        notice: '',
        platform: {
            coin: {
                id: '',
                name: '',
                slug: '',
                symbol: '',
            },
            name: '',
        },
        self_reported_market_circulating_supply: '',
        self_reported_market_cap: '',
        self_reported_tags: '',
        slug: '',
        subreddit: '',
        symbol: '',
        "tag-groups": [],
        "tag-names": [],
        tags: [],
        twitter_username: [],
        urls: {
            announcement: [],
            chat: [],
            explorer: [],
            facebook: [],
            message_board: [],
            reddit: [],
            source_code: [],
            technical_doc: [],
            twitter: [],
            website: [],
        }
      }), 
      []
    );
    const [tokenMetada, setTokenMetaData] = useState<tokenMetadata>(defaultTokenMetadata)
    const [joinChannelLoading, setJoinChannelLoading] = useState<boolean>(false)
    
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
        // document.title = `AlphaPING | ${channel.name}`;
      } else {
        setJoinChannelLoading(true)
        const transaction = await alphaPING?.connect(signer).joinChannel(BigInt(channel.id))
        await transaction?.wait()
        setCurrentChannel(channel)
        // document.title = `AlphaPING | ${channel.name}`;
        setJoinChannelLoading(false)
      }
    }

    // pass hover info to leaveChannel component to make icon appear
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchTokenMetadata = async (tokenAddress:string) => {
            let response
            const params = {
                address: tokenAddress,
            }
            try{
                response = await fetch(`/api/tokenMetadataCMC?${qs.stringify(params)}`)
    
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                const json = await response.json();
                if(json?.data && Object.keys(json.data).length > 0){
                    const dynamicKey = Object.keys(json.data)[0];
                    const tokenData = json.data[dynamicKey];
                    if (tokenData) {
                        setTokenMetaData(tokenData);
                    } else {
                        console.warn('No token metadata found for dynamicKey:', dynamicKey);
                    }
                } else {
                    console.warn('No data received for token metadata:', json);
                }
            } catch(error: unknown){
                if(error !== undefined || error !== null){
                    console.error("Error: " + (error as Error).toString())
                    setTokenMetaData(defaultTokenMetadata);
                }
            }
        }
        if(
            (channel !== undefined) && 
            (channel !== null) && 
            (channel.tokenAddress !== undefined) && 
            (channel.tokenAddress !== null)
        ){
            fetchTokenMetadata(channel.tokenAddress)
        }     
    }, [channel, channel?.tokenAddress, defaultTokenMetadata])

    useEffect(() => {
        if(currentChannel && currentChannel.id.toString() === channel.id.toString()){
            setSelectedChannelMetadata(tokenMetada)
        }
    },[currentChannel, setSelectedChannelMetadata, tokenMetada, channel])

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
                                            tokenMetada.logo !== '' ? 
                                            tokenMetada.logo : 
                                            (
                                                channel.tokenType === 'ERC20' ?
                                                '/erc20IconAlt.svg' :
                                                '/blank_nft.svg'
                                            )
                                        :
                                            tokenMetada.logo !== '' ? 
                                            tokenMetada.logo : 
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
                    <LeaveChannel isHovered={isHovered} channel={channel} tokenMetada={tokenMetada}/>
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
                        <Avatar>
                            <AvatarImage
                                src={
                                    tokenMetada.logo !== '' ? 
                                    tokenMetada.logo : 
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
                        {
                            tokenMetada.tags.length > 0 ?
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>
                                        <Badge
                                            variant="secondary"
                                        >
                                            {channel.tokenType}
                                        </Badge>
                                    </AccordionTrigger>
                                    <AccordionContent className="max-h-[10svh] overflow-scroll">
                                        {
                                            tokenMetada.tags.length > 0 &&
                                            <ScrollArea>
                                                <ul>
                                                    {
                                                        tokenMetada.tags.map((tag, index) => {
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
                                            </ScrollArea>
                                        }
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion> :
                            <Badge
                                variant="secondary"
                            >
                                {channel.tokenType}
                            </Badge>
                        }
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default Channel;