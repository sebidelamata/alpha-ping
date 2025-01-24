'use client';

import React, {
    useState, 
    useEffect
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
import { SidebarMenuButton } from "@/components/components/ui/sidebar"

interface ChannelProps{
    channel: AlphaPING.ChannelStructOutput;
}

const Channel:React.FC<ChannelProps> = ({
    channel
}) => {

    const { alphaPING, signer } = useEtherProviderContext()
    const { currentChannel, setCurrentChannel, setSelectedChannelMetadata } = useChannelProviderContext()


    // holds metadata fetched from coinmarketcap
    const defaultTokenMetadata:tokenMetadata = {
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
      };
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
  
      if (hasJoined) {
        setCurrentChannel(channel)
        document.title = `AlphaPING | ${channel.name}`;
      } else {
        setJoinChannelLoading(true)
        const transaction = await alphaPING?.connect(signer).joinChannel(BigInt(channel.id))
        await transaction?.wait()
        setCurrentChannel(channel)
        document.title = `AlphaPING | ${channel.name}`;
        setJoinChannelLoading(false)
      }
    }

    // pass hover info to leaveChannel component to make icon appear
    const [isHovered, setIsHovered] = useState(false);

    const fetchChannelIcons = async (tokenAddress:string) => {
        let response
        const url=`https://alpha-ping-proxy-server-670fa5485762.herokuapp.com/token-metadata/${tokenAddress}`
        try{
            response = await fetch(url)

            if (!response.ok) {
            throw new Error('Failed to fetch');
            }
            response = await response.json();
            const dynamicKey = Object.keys(response.data)[0];
            setTokenMetaData(response.data[dynamicKey])
            
        }catch(error: unknown){
            response = null;
            console.error("Error: " + (error as Error).toString())
        }
    }

    useEffect(() => {
        if((channel !== undefined) && (channel !== null)){
            fetchChannelIcons(channel.tokenAddress)
        }     
    }, [signer, channel])

    useEffect(() => {
        if(currentChannel && currentChannel.id.toString() === channel.id.toString()){
            setSelectedChannelMetadata(tokenMetada)
        }
    },[currentChannel, setSelectedChannelMetadata, tokenMetada, channel.id])

    return(
        <SidebarMenuButton>
            <Avatar className="size-6">
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
                    alt="Token Logo"
                    loading="lazy"
                />
                <AvatarFallback>
                    {channel.name.slice(0,2)}
                </AvatarFallback>
            </Avatar>
            <div className="channel-name">
                {channel.name}
            </div>
            <LeaveChannel isHovered={isHovered} channelID={channel.id.toString()}/>
            {
                joinChannelLoading === true &&
                <div className="join-channel-loading-container">
                    <div className="join-channel-loading">
                        <Loading/>
                    </div>
                </div>
            }
        </SidebarMenuButton>
    )
}

export default Channel;