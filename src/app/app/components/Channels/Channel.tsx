'use client';

import React, {
    useState, 
    useEffect,
    useMemo
} from "react"
import { AlphaPING } from '../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import L1Address from '../../../../lib/ArbitrumBridgedTokenStandardABI.json'
import aTokenUnderlyingAsset from '../../../../lib/aTokenAaveUnderlyingAsset.json'
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
import { 
    ScrollText, 
    Globe 
} from "lucide-react";  
import Link from "next/link";
import Image from "next/image";

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
    const [tokenMetadata, setTokenMetaData] = useState<tokenMetadata>(defaultTokenMetadata)
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

    useEffect(() => {

        // this is the function that will fetch the token metadata from coinmarketcap
        const fetchTokenMetadataCMC = async (tokenAddress:string) => {
            const params = {
                address: tokenAddress,
            }
            try {
                const response = await fetch(`/api/tokenMetadataCMC?${qs.stringify(params)}`)
                // make sure we have a valid response
                if (!response.ok) {
                    throw new Error('Failed to fetch token metadata');
                }
                const json = await response.json();
                // the key or just an empyt object
                const key = Object.keys(json?.data ?? {})[0]
                return key ? json.data[key] : null;
            } catch (error) {
                console.warn('Error fetching token metadata for token', tokenAddress, ": ", error);
                return null;
            }
        }

        // this function will fetch the l1Address from the token
        // we do this if we dont return cmc metadata for the 
        // arbitrum address bc it may be bridged and this is part of the
        // arbitrum bridged token standard
        const fetchL1Address = async (tokenAddress:string) => {
            const arbitrumBridgedTokenStandard = new ethers.Contract(
                tokenAddress,
                L1Address.abi,
                signer
            );
            try {
                const l1Address = await arbitrumBridgedTokenStandard.l1Address();
                if (l1Address && l1Address !== ethers.ZeroAddress) {
                    return l1Address;
                } else {
                    console.warn('No L1 address found for token ', tokenAddress);
                    return null;
                }
            }
            catch (error) {
                console.warn('Error fetching L1 address for: ', tokenAddress, ": ", error);
                return null;
            }
        }

        // here is another function in case the token is in the Aave
        // protocol, we will fetch the underlying token address
        // also we will need to test if this token is bridged 
        // if we dont get metadata back from cmc
        const fetchUnderlyingTokenAddress = async (tokenAddress:string) => {
            const aToken = new ethers.Contract(
                tokenAddress,
                aTokenUnderlyingAsset.abi,
                signer
            );
            try{
                console.log('Fetching underlying asset for token:', tokenAddress);
                const underlyingAsset = await aToken.UNDERLYING_ASSET_ADDRESS();
                    console.log('Underlying Asset Address:', underlyingAsset);
                if (underlyingAsset && underlyingAsset !== ethers.ZeroAddress) {
                    return underlyingAsset;
                } else {
                    console.warn('No underlying asset found for token:', tokenAddress);
                    return null;
                }
            } catch(error: unknown){
                if(error !== undefined || error !== null){
                    console.warn("Error unable to fetch underlying asset for" + tokenAddress + ": " + (error as Error).toString())
                    return null;
                }
            }
        }


        // here is where we run through the possible scenarios to fetch the token metadata
        const fetchTokenMetadata = async (tokenAddress:string) => {
            // first we will try to get token metatadata from coinmarketcap
            const tokenMetaData:tokenMetadata = await fetchTokenMetadataCMC(tokenAddress);
            // if we got metadata back, we will set it
            if (tokenMetaData) {
                setTokenMetaData(tokenMetaData);
                return;
            }

            // if we didnt get metadata back, we will try to fetch the l1 address
            // and then try to get the metadata for that address
            let l1Address: string | null = null;
            try{
                l1Address = await fetchL1Address(tokenAddress);
            }   catch(error: unknown){
                if(error !== undefined || error !== null){
                    console.warn("Error fetching L1 Address for " + tokenAddress + ": " + (error as Error).toString())
                }
            }
            // if we got a l1 address, we will try to fetch the metadata for that
            if (l1Address) {
                console.log('L1 Address found for token:', tokenAddress, 'L1 Address:', l1Address);
                const l1TokenMetaData:tokenMetadata = await fetchTokenMetadataCMC(l1Address);
                // if we got metadata back, we will set it
                if (l1TokenMetaData) {
                    setTokenMetaData(l1TokenMetaData);
                    return;
                }
            }

            // if we still dont have anything. maybe it's an aave token
            // we will try to fetch the underlying asset address
            let underlyingAsset: string | null = null;
            try{
                underlyingAsset = await fetchUnderlyingTokenAddress(tokenAddress);
            } catch(error: unknown){
                if(error !== undefined || error !== null){
                    console.warn("Error fetching underlying asset for " + tokenAddress + ": " + (error as Error).toString())
                }
            }
            // if we got an underlying asset, we will try to fetch the metadata for that
            if (underlyingAsset) {
                console.log('Underlying Asset found for token:', tokenAddress, 'Underlying Asset:', underlyingAsset);
                const underlyingTokenMetaData:tokenMetadata = await fetchTokenMetadataCMC(underlyingAsset);
                // if we got metadata back, we will set it
                if (underlyingTokenMetaData) {
                    // we can also set the optional protocol field of the metadata object
                    underlyingTokenMetaData.protocol = "aave"
                    setTokenMetaData(underlyingTokenMetaData);
                    return;
                }
                // if we didn't get metata data back for the underlying asset
                // theres is a possibility that the underlying asset
                // is a bridged token and we need to try to fetch the l1 address
                const underlyingL1Address = await fetchL1Address(underlyingAsset);
                if (underlyingL1Address) {
                    const underlyingL1TokenMetaData:tokenMetadata = await fetchTokenMetadataCMC(underlyingL1Address);
                    // if we got metadata back, we will set it
                    if (underlyingL1TokenMetaData) {
                        // we can also set the optional protocol field of the metadata object
                        underlyingL1TokenMetaData.protocol = "aave"
                        setTokenMetaData(underlyingL1TokenMetaData);
                        return;
                    }
                }
            }
            // if we still don't have metadata, we will set the default metadata
            console.warn('No token metadata found for token:', tokenAddress);
            setTokenMetaData(defaultTokenMetadata);
        }

        if(
            (channel !== undefined) && 
            (channel !== null) && 
            (channel.tokenAddress !== undefined) && 
            (channel.tokenAddress !== null) &&
            (channel.tokenAddress !== undefined) &&
            (channel.tokenAddress !== null) &&
            (channel.tokenType.toLowerCase() === 'erc20')
        ){
            fetchTokenMetadata(channel.tokenAddress)
        }
        if(
            (channel !== undefined) && 
            (channel !== null) && 
            (channel.tokenAddress !== undefined) && 
            (channel.tokenAddress !== null) &&
            (channel.tokenAddress !== undefined) &&
            (channel.tokenAddress !== null) &&
            channel?.tokenType.toLowerCase() === 'erc721'
        ){
            setTokenMetaData(defaultTokenMetadata)
        }
    }, [
        channel, 
        defaultTokenMetadata,
        channel?.tokenAddress,
        signer
    ])

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