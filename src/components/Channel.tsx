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
}

const Channel:React.FC<ChannelProps> = ({
    channel, 
    index, 
    currentChannel,
    alphaPING,
    account,
    provider,
    setCurrentChannel
}) => {

    // holds metadata fetched from coinmarketcap
    const [tokenMetada, setTokenMetaData] = useState({})
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
            console.log(dynamicKey)
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
        console.log(tokenMetada)
        
    }, [account, channel])

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
            {channel.name}
            <img src={tokenMetada.logo} alt="logo" />
        </li>
    )
}

export default Channel;