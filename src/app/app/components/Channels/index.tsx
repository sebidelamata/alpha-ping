'use client';

import React,
{
  useEffect,
  useMemo,
  useState
} from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub
} from "@/components/components/ui/sidebar"
import { ScrollArea } from "@/components/components/ui/scroll-area"
import Channel from "./Channel";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { AlphaPING } from '../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import L1Address from '../../../../lib/ArbitrumBridgedTokenStandardABI.json'
import AaveL2LendingPool from '../../../../lib/aaveL2PoolABI.json'
import aTokenUnderlyingAsset from '../../../../lib/aTokenAaveUnderlyingAsset.json'
import { 
  ethers, 
  formatUnits 
} from 'ethers';
import qs from 'qs';
import { Skeleton } from "@/components/components/ui/skeleton";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/components/ui/collapsible";
import { useUserProviderContext } from "src/contexts/UserContext";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/components/ui/avatar";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/components/ui/hover-card";
import humanReadableNumbers from "src/lib/humanReadableNumbers";
import { ExternalLink } from "lucide-react";
import Link from "next/link";


const Channels:React.FC = () => {

  const { 
    channels, 
    hasJoined, 
    signer, 
    tokenMetaData,
    setTokenMetaData
  } = useEtherProviderContext()
  const { 
    currentChannel, 
    setCurrentChannel,
    tokenMetadataLoading,
    setTokenMetadataLoading,
    setSelectedChannelMetadata
  } = useChannelProviderContext()
  const { 
    account, 
    aaveAccount, 
    setAaveAccount 
  } = useUserProviderContext()

  // hover states for token and nft menu groups
  const [hoverToken, setHoverToken] = useState<boolean>(false)

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
      setTokenMetadataLoading(true);
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
      setTokenMetadataLoading(false);
      return allUserChannelsMetadata
    }

    // call our function to fetch all user channels metadata
    if(
        (userChannels !== undefined) && 
        (userChannels !== null) && 
        userChannels.length > 0
    ){
      fetchAllUserChannelsMetadata()
    }
  }, [
    userChannels, 
    signer, 
    defaultTokenMetadata, 
    setTokenMetadataLoading, 
    setTokenMetaData
  ])

  // set the default channel to the first in the list if one hasn't been selected yet
  useEffect(() => {
    if (!currentChannel && userChannels.length > 0 && tokenMetaData.length > 0) {
      setCurrentChannel(userChannels[0]);
      setSelectedChannelMetadata(tokenMetaData[0]);
    }
  }, [
    userChannels, 
    currentChannel, 
    setCurrentChannel, 
    setSelectedChannelMetadata, 
    tokenMetaData
  ]); 

  // we are going to use this timer to refetch a new aave detail every 60 seconds
      const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
      // Timer to update lastUpdated every 60 seconds
      useEffect(() => {
          const intervalId = setInterval(() => {
          setLastUpdated(new Date());
          }, 60 * 1000); // 60 seconds in milliseconds
          // Cleanup interval on component unmount
          return () => clearInterval(intervalId);
      }, []); // Empty dependency array to run once on mount
  // we need to find the user account details for aave if the user has any aave tokens
  useEffect(() => {
    const fetchAaveDetails = async (account: string) => {
      const aaveLendingPool = new ethers.Contract(
        // aave lending pool address
        "0x794a61358d6845594f94dc1db02a252b5b4814ad",
        AaveL2LendingPool.abi,
        signer
      );
      try{
        const accountData = await aaveLendingPool.getUserAccountData(account)
        console.log('accountData: ', accountData)
        if (accountData) {
          console.log('accountData: ', accountData)

          // Raw values are BigNumbers; convert them to human‑readable strings
          const cleanedAccountData: AaveUserAccount = {
            totalCollateral: formatUnits(accountData.totalCollateralBase, 8),
            totalDebt: formatUnits(accountData.totalDebtBase, 8),
            availableBorrows: formatUnits(accountData.availableBorrowsBase, 8),
            // liquidation threshhold in bps
            currentLiquidationThreshold: (Number(accountData.currentLiquidationThreshold) / 10000).toString(), 
            // ltv is in bps
            ltv: (Number(accountData.ltv) / 10000).toString(),
            healthFactor: formatUnits(accountData.healthFactor, 18)
          };
          console.log('user aave data:', cleanedAccountData);
          setAaveAccount(cleanedAccountData);
        } else {
            console.warn('No aave account data found for this user:', accountData);
            return;
        }
      } catch(error: unknown){
        if(error !== undefined || error !== null){
            console.warn("Error unable to fetch aave user account details for: " + signer + ": " + (error as Error).toString())
            return;
        }
      }
    }

    // only run this function if the user is part of an aave channel
    if(
      userChannels.filter((channel, index) => {
        return (
          channel.tokenType.toLowerCase() !== 'erc721' && 
          (
            tokenMetaData[index]?.protocol &&
            tokenMetaData[index]?.protocol?.toLowerCase() === 'aave'
          )
        )
      }).length > 0
    ){
      fetchAaveDetails(account)
    }
  }, [
    tokenMetaData, 
    account, 
    signer, 
    userChannels,
    setAaveAccount,
    lastUpdated
  ])

  return (
    <SidebarGroup className="flex flex-col h-full min-h-0">
      <SidebarGroupLabel>
          <h1 className="text-xl text-secondary flex-shrink-0 pb-2">
              Channels
          </h1>
      </SidebarGroupLabel>
      <SidebarGroupContent className="h-full">
          <ScrollArea className="h-full pr-2 overflow-y-auto">
              <SidebarMenu className="overflow-visible">
                  {
                      tokenMetadataLoading === true ? (
                        Array.from({ length: 10 }, (_, index) => (
                          <SidebarMenuItem key={index} className="flex flex-row items-center justify-between w-full pb-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="w-48 h-6"/>
                          </SidebarMenuItem>
                        ))
                      ) : (
                        // when we render the channels, we want three groups:
                        // spot tokens, tokens deposited in Aave (or other 
                        // protocols in the future), and NFTs
                        <>
                          {
                            // filter for spot token channels
                            userChannels.filter((channel, index) => {
                              return (
                                channel.tokenType.toLowerCase() !== 'erc721' && 
                                (
                                  !tokenMetaData[index]?.protocol ||
                                  tokenMetaData[index]?.protocol?.toLowerCase() !== 'aave'
                                )
                              )
                            }).length > 0 &&
                            <Collapsible defaultOpen className="group/collapsible">
                              <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton 
                                    onMouseEnter={() => setHoverToken(true)}
                                    onMouseLeave={() => setHoverToken(false)}
                                  > 
                                    <div className="flex items-center justify-start gap-4">
                                      <Avatar className="size-4">
                                        <AvatarImage 
                                            src={
                                              hoverToken ? 'erc20IconAlt.svg' : 'erc20Icon.svg'
                                            } 
                                            alt="Token Logo"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>
                                            Tokens
                                        </AvatarFallback>
                                      </Avatar>
                                      <p>
                                          Tokens
                                      </p>
                                    </div> 
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <SidebarMenuSub>
                                    {
                                      // filter for spot token channels
                                      userChannels.filter((channel, index) => {
                                        return (
                                          channel.tokenType.toLowerCase() !== 'erc721' && 
                                          (
                                            !tokenMetaData[index]?.protocol ||
                                            tokenMetaData[index]?.protocol?.toLowerCase() !== 'aave'
                                          )
                                        )
                                      })
                                        .map((channel, index) => {
                                          // filter the token metadata we will pass to the channel
                                          const filteredTokenMetadata = tokenMetaData.filter((_, index) => {
                                            return (
                                              userChannels[index].tokenType.toLowerCase() !== 'erc721' &&
                                              (
                                                !tokenMetaData[index]?.protocol ||
                                                tokenMetaData[index]?.protocol?.toLowerCase() !== 'aave'
                                              )
                                            )
                                          })
                                          return <SidebarMenuItem key={channel.tokenAddress}>
                                                    <Channel
                                                        channel={channel}
                                                        tokenMetadata={
                                                          filteredTokenMetadata[index] || defaultTokenMetadata
                                                        }
                                                    />
                                                  </SidebarMenuItem>
                                        })
                                    }
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </SidebarMenuItem>
                            </Collapsible>
                          }
                          {
                            // filter for aave protocol token channels
                            userChannels.filter((channel, index) => {
                              return (
                                channel.tokenType.toLowerCase() !== 'erc721' && 
                                (
                                  tokenMetaData[index]?.protocol &&
                                  tokenMetaData[index]?.protocol?.toLowerCase() === 'aave'
                                )
                              )
                            }).length > 0 &&
                            <Collapsible defaultOpen className="group/collapsible">
                              <SidebarMenuItem>
                                <HoverCard>
                                  <HoverCardTrigger asChild>
                                <CollapsibleTrigger asChild>
                                        <SidebarMenuButton >
                                          <div className="flex items-center justify-start gap-4">
                                            <Avatar className="size-4">
                                              <AvatarImage 
                                                  src='https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png' 
                                                  alt="Token Logo"
                                                  loading="lazy"
                                              />
                                              <AvatarFallback>
                                                  Aave
                                              </AvatarFallback>
                                            </Avatar>
                                            <p>
                                                Aave
                                            </p>
                                            <div 
                                            className={
                                              // render color based on health factor
                                              Number(aaveAccount?.healthFactor) <= 1.1 ?
                                              "text-red-500" :
                                              Number(aaveAccount?.healthFactor) <= 5.0 ?
                                              "text-yellow-500" :
                                              "text-green-500"
                                            }
                                            > 
                                              {
                                                aaveAccount?.healthFactor === "115792089237316195423570985008687907853.269984665640564039457584007913129639935" ? 
                                                "∞" :
                                                Number(aaveAccount?.healthFactor).toFixed(2)
                                              }
                                            </div>
                                          </div>  
                                      </SidebarMenuButton>    
                                    </CollapsibleTrigger>
                                    </HoverCardTrigger>
                                      <HoverCardContent className="bg-primary text-secondary">
                                        <div className="w-full">
                                          <div className="w-full justify-end flex text-xl text-accent">
                                            Aave Stats
                                          </div>
                                          <ul className="flex flex-col gap-2 justify-end">
                                            <li
                                              className={
                                                // render color based on health factor
                                                Number(aaveAccount?.healthFactor) <= 1.1 ?
                                                "text-red-500 w-full justify-end flex" :
                                                Number(aaveAccount?.healthFactor) <= 2.0 ?
                                                "text-yellow-500 w-full justify-end flex" :
                                                "text-green-500 w-full justify-end flex"
                                              }
                                            >
                                              Health Factor: {
                                                Number(aaveAccount?.healthFactor).toFixed(2)
                                              }
                                            </li>
                                            <li className="w-full justify-end flex">
                                              Assets: ${
                                                humanReadableNumbers(Number(aaveAccount?.totalCollateral).toString())
                                              }
                                            </li>
                                            <li className="w-full justify-end flex">
                                              - Debt: ${
                                                humanReadableNumbers(Number(aaveAccount?.totalDebt).toString())
                                              }
                                            </li>
                                            <li className="w-full justify-end flex">
                                              = Net Worth: ${ 
                                                humanReadableNumbers(
                                                  (
                                                    Number(aaveAccount?.totalCollateral) -
                                                    Number(aaveAccount?.totalDebt)
                                                  ).toString()
                                                )
                                              }
                                            </li>
                                            <br/>
                                            <li className="w-full justify-end flex">
                                              Can Borrow: ${ 
                                                humanReadableNumbers(Number(aaveAccount?.availableBorrows).toString()) 
                                              }
                                            </li>
                                            <li className="w-full justify-end flex">
                                              Current LTV: {
                                                (Number(aaveAccount?.ltv) * 100).toFixed(2)
                                              }%
                                            </li>
                                            <li className="w-full justify-end flex">
                                              Liquidation LTV: {
                                                (Number(aaveAccount?.currentLiquidationThreshold) * 100).toFixed(2)
                                              }%
                                            </li>
                                            <li className="w-full justify-end flex text-xl">
                                              <Link
                                                href="https://app.aave.com/"
                                                target="_blank"
                                              >
                                                <ExternalLink className="text-accent"/>
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </HoverCardContent>
                                    </HoverCard>
                                    <CollapsibleContent>
                                      <SidebarMenuSub>
                                        {
                                          // filter for aave protocol token channels
                                          userChannels.filter((channel, index) => {
                                            return (
                                              channel.tokenType.toLowerCase() !== 'erc721' && 
                                              (
                                                tokenMetaData[index]?.protocol &&
                                                tokenMetaData[index]?.protocol?.toLowerCase() === 'aave'
                                              )
                                            )
                                          })
                                            .map((channel, index) => {
                                              // filter the token metadata we will pass to the channel
                                              const filteredTokenMetadata = tokenMetaData.filter((_, index) => {
                                                return (
                                                  userChannels[index].tokenType.toLowerCase() !== 'erc721' &&
                                                  (
                                                    tokenMetaData[index]?.protocol &&
                                                    tokenMetaData[index]?.protocol?.toLowerCase() === 'aave'
                                                  )
                                                )
                                              })
                                              return <SidebarMenuItem key={channel.tokenAddress}>
                                                        <Channel
                                                            channel={channel}
                                                            tokenMetadata={
                                                              filteredTokenMetadata[index] || defaultTokenMetadata
                                                            }
                                                        />
                                                      </SidebarMenuItem>
                                            })
                                        }
                                      </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                              </Collapsible>
                          }
                          {
                            userChannels.filter((channel) => {
                                      return (
                                        channel.tokenType.toLowerCase() === 'erc721'
                                      )
                                    }). length > 0 &&
                            <Collapsible defaultOpen className="group/collapsible">
                              <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuButton>  
                                    <div className="flex items-center justify-start gap-4">
                                      <Avatar className="size-4">
                                        <AvatarImage 
                                            src='blank_nft.svg'
                                            alt="NFT Logo"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>
                                            NFTs
                                        </AvatarFallback>
                                      </Avatar>
                                      <p>
                                          NFTs
                                      </p>
                                    </div> 
                                  </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <SidebarMenuSub>
                                    {
                                      // filter for spot token channels
                                      userChannels.filter((channel) => {
                                        return (
                                          channel.tokenType.toLowerCase() === 'erc721'
                                        )
                                      })
                                        .map((channel, index) => {
                                          // filter the token metadata we will pass to the channel
                                          const filteredTokenMetadata = tokenMetaData.filter((_, index) => {
                                            return (
                                              userChannels[index].tokenType.toLowerCase() === 'erc721'
                                            )
                                          })
                                          return <SidebarMenuItem key={channel.tokenAddress}>
                                                    <Channel
                                                        channel={channel}
                                                        tokenMetadata={
                                                          filteredTokenMetadata[index] || defaultTokenMetadata
                                                        }
                                                    />
                                                  </SidebarMenuItem>
                                        })
                                    }
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </SidebarMenuItem>
                            </Collapsible>
                          }
                        </>
                      )
                  }
              </SidebarMenu>
          </ScrollArea>
      </SidebarGroupContent>
    </SidebarGroup>   
  );
}

export default Channels;