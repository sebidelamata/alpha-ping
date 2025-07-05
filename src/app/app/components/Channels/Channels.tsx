'use client';

import React,
{
  useState,
  useEffect,
  useMemo
} from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/components/ui/sidebar"
import { ScrollArea } from "@/components/components/ui/scroll-area"
import Channel from "../Channels/Channel";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { AlphaPING } from '../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import L1Address from '../../../../lib/ArbitrumBridgedTokenStandardABI.json'
import aTokenUnderlyingAsset from '../../../../lib/aTokenAaveUnderlyingAsset.json'
import { ethers } from 'ethers';
import qs from 'qs';


const Channels:React.FC = () => {

  const { 
    channels, 
    hasJoined, 
    signer, 
  } = useEtherProviderContext()
  const { 
    currentChannel, 
    setCurrentChannel,
  } = useChannelProviderContext()

  const userChannels = useMemo(
  () =>
    channels.filter((_, i) => hasJoined[i]),
  [channels, hasJoined]
)
  // holds metadata fetched if nothing recieved from coinmarketcap
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

  const [tokenMetaData, setTokenMetaData] = useState<tokenMetadata[]>([]);
  // here we will grab metadata for each channel with a promise.all
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
            // setTokenMetaData(tokenMetaData);
            console.log('Token metadata found for token:', tokenAddress, 'Metadata:', tokenMetaData);
            return tokenMetaData;
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
                // setTokenMetaData(l1TokenMetaData);
                console.log('L1 Token metadata found for token:', tokenAddress, 'Metadata:', l1TokenMetaData);
                return l1TokenMetaData;
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
                // setTokenMetaData(underlyingTokenMetaData);
                console.log('Underlying Token metadata found for token:', tokenAddress, 'Metadata:', underlyingTokenMetaData);
                return underlyingTokenMetaData;
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
                    // setTokenMetaData(underlyingL1TokenMetaData);
                    console.log('Underlying L1 Token metadata found for token:', tokenAddress, 'Metadata:', underlyingL1TokenMetaData);
                    return underlyingL1TokenMetaData;
                }
            }
        }
        // if we still don't have metadata, we will set the default metadata
        console.error('No token metadata found for token:', tokenAddress);
        // setTokenMetaData(defaultTokenMetadata);
        console.log('Using default token metadata for token:', tokenAddress);
        return defaultTokenMetadata;
      }
        
    // this will run through all the user channels and fetch the metadata for each token
    const fetchAllUserChannelsMetadata = async () => {
      const allUserChannelsMetadata = await Promise.all(
        userChannels.map(async (channel: AlphaPING.ChannelStructOutput) => {
          // skipp fetching metadata for ERC721 tokens
          if(channel.tokenType.toLowerCase() === 'erc721'){
            console.warn('ERC721 token type detected, skipping metadata fetch for channel:', channel);
            return Promise.resolve(defaultTokenMetadata);
          }
          if (channel.tokenAddress) {
            return await fetchTokenMetadata(channel.tokenAddress);
          }
          console.warn('No token address found for channel:', channel);
          return Promise.resolve(defaultTokenMetadata);
        })
      );
      console.log('All user channels metadata fetched:', allUserChannelsMetadata);
      setTokenMetaData(allUserChannelsMetadata)
      return allUserChannelsMetadata
    }
    if(
        (userChannels !== undefined) && 
        (userChannels !== null) && 
        userChannels.length > 0
    ){
      fetchAllUserChannelsMetadata()
    }
  }, [userChannels, signer, defaultTokenMetadata])

  useEffect(() => {
    if (!currentChannel && userChannels.length > 0) {
      setCurrentChannel(userChannels[0]);
    }
  }, [userChannels, currentChannel, setCurrentChannel]); 

  
  return (
    <SidebarGroup className="flex flex-col h-full min-h-0">
      <SidebarGroupLabel>
          <h1 className="text-xl text-secondary flex-shrink-0 pb-2">
              Channels
          </h1>
      </SidebarGroupLabel>
      <SidebarGroupContent className="h-full">
          <ScrollArea className="h-full pr-2 overflow-y-auto">
              <SidebarMenu>
                  {
                      userChannels.map((channel, index) => (
                          <SidebarMenuItem key={channel.tokenAddress}>
                            <Channel
                                channel={channel}
                                tokenMetadata={
                                  tokenMetaData[index] || defaultTokenMetadata
                                }
                            />
                          </SidebarMenuItem>
                      ))
                  }
              </SidebarMenu>
          </ScrollArea>
      </SidebarGroupContent>
    </SidebarGroup>   
  );
}

export default Channels;