import React, {
    useState, 
    useEffect
} from "react"
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import {ethers} from 'ethers'

interface ChannelProps{
    channel: AlphaPING.ChannelStructOutput;
    index: number;
    currentChannel: AlphaPING.ChannelStructOutput | null;
    alphaPING: AlphaPING | null
    account: string | null;
    provider: ethers.BrowserProvider | null;
    setCurrentChannel: React.Dispatch<React.SetStateAction<AlphaPING.ChannelStructOutput | null>>;
    setSelectedChannelMetadata: React.Dispatch<React.SetStateAction<tokenMetadata | null>>;
}

const Channel:React.FC<ChannelProps> = ({
    channel, 
    index, 
    currentChannel,
    alphaPING,
    account,
    provider,
    setCurrentChannel,
    setSelectedChannelMetadata
}) => {

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
    
    // handles clicking on channel names from channels list
    const channelHandler = async (channel:AlphaPING.ChannelStructOutput) => {
      // Check if user has joined
      // If they haven't allow them to mint.
      const hasJoined = await alphaPING?.hasJoinedChannel(
        BigInt(channel.id), 
        account || ethers.ZeroAddress
      )
  
      if (hasJoined) {
        setCurrentChannel(channel)
      } else {
        const signer:any = await provider?.getSigner()
        const transaction = await alphaPING?.connect(signer).joinChannel(BigInt(channel.id))
        await transaction?.wait()
        setCurrentChannel(channel)
      }
    }

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
            
        }catch(error:any){
            response = null;
            console.error("Error: " + error.toString())
        }
    }

    useEffect(() => {
        if(channel){
            fetchChannelIcons(channel.tokenAddress)
        }     
    }, [account, channel])

    useEffect(() => {
        if(currentChannel && currentChannel.id.toString() === channel.id.toString()){
            setSelectedChannelMetadata(tokenMetada)
        }
    },[currentChannel])

    return(
        <li
            onClick={() => channelHandler(channel)} key={index}
            className={
            currentChannel && 
            currentChannel.id.toString() === channel.id.toString() ? 
            "channel channel-active" : 
            "channel"
            }
        >
            <div className="channel-name">
                {channel.name}
            </div>
            <div className="channel-logo">
                <img 
                    src={tokenMetada.logo} 
                    alt="Token Logo"
                    className={
                        currentChannel && 
                        currentChannel.id.toString() === channel.id.toString() ? 
                        "channel-logo-image channel-logo-image-active" : 
                        "channel-logo-image"
                        }
                />
            </div>
        </li>
    )
}

export default Channel;