'use client';

import React, {
    useState,
    useEffect
} from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { useUserProviderContext } from "src/contexts/UserContext";
import ERC20Faucet from '../../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { ethers } from 'ethers';
import { CardTitle } from "@/components/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/components/ui/avatar";
import qs from "qs";
import { Skeleton } from "@/components/components/ui/skeleton";
import { Badge } from "@/components/components/ui/badge";
import humanReadableNumbers from "src/lib/humanReadableNumbers";
import { 
    Select, 
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue, 
} from "@/components/components/ui/select";
import { Button } from "@/components/components/ui/button";
import Link from "next/link";
import { 
    ScrollText, 
    Globe,
    Telescope,
    SquareArrowUpRight 
} from "lucide-react";
import Image from "next/image";
import ToggleFollowFilter from "../Profile/ToggleFollowFilter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/components/ui/dropdown-menu"
import CopyTextBlock from "./CopyTextBlock";
import { CHAINS } from "src/lib/chainsInfo";

interface cmcPriceData{
    twentyFourHourChange: string;
    tokenUSDPrice: string;
    marketCap: string;
    percent_change_1h: string;
    percent_change_7d: string;
    percent_change_30d: string;
    percent_change_60d: string;
    volume_24h: string;
    volume_change_24h: string;
}

type TimeRange = "1h" | "24h" | "7d" | "30d" | "60d"

const MessagesHeader: React.FC = () => {

    const { 
        currentChannel, 
        selectedChannelMetadata, 
        setChannelAction 
    } = useChannelProviderContext();
    const { signer } = useEtherProviderContext()
    const { account } = useUserProviderContext();
    
    const [userBalance, setUserBalance] = useState<string | null>(null)
    const [tokenDecimals, setTokenDecimals] = useState<number | null>(null)

    useEffect(() => {
        const getUserBalance = async () => {
            if(currentChannel != null && currentChannel?.tokenAddress !== null){
                const token = new ethers.Contract(
                    currentChannel.tokenAddress,
                    ERC20Faucet.abi,
                    signer
                )
                const userBalance = await token.balanceOf(account)
                setUserBalance(userBalance.toString())
                const tokenDecimals = await token.decimals()
                setTokenDecimals(tokenDecimals)
            }
        }
        getUserBalance()
    }, [account, signer, currentChannel])

    // hold time range from selector
    const [timeRange, setTimeRange] = useState<TimeRange>("24h")
    // key values o lookup pct change input
    const FIELD_BY_RANGE = {
        "1h":   "percent_change_1h",      // 1‑hour pct change
        "24h":  "twentyFourHourChange",   // 24‑hour pct change
        "7d":   "percent_change_7d",         // 7‑day pct change
        "30d":  "percent_change_30d",        // 30‑day pct change
        "60d":  "percent_change_60d"
    } as const satisfies Record<TimeRange, keyof cmcPriceData>;

console.log(selectedChannelMetadata)

    // get latest quote in USD
        const [cmcFetch, setCmcFetch] = useState<cmcPriceData>({
            twentyFourHourChange: "",
            tokenUSDPrice: "",
            marketCap: "",
            percent_change_1h: "",
            percent_change_7d: "",
            percent_change_30d: "",
            percent_change_60d: "",
            volume_24h: "",
            volume_change_24h: ""
        } as cmcPriceData);
        const [loading, setLoading] = useState<boolean>(false);
        const [cmcError, setCmcError] = useState<string | null>(null);
        useEffect(() => {
            if (!selectedChannelMetadata || !selectedChannelMetadata.slug) {
                setLoading(true)
                setCmcFetch({
                    twentyFourHourChange: "",
                    tokenUSDPrice: "",
                    marketCap: "",
                    percent_change_1h: "",
                    percent_change_7d: "",
                    percent_change_30d: "",
                    percent_change_60d: "",
                    volume_24h: "",
                    volume_change_24h: ""
                } as cmcPriceData)
                setCmcError("No token symbol available for price fetch")
                setLoading(false)
                return;
            }
            const params = {
                slug: selectedChannelMetadata?.slug,
            }
            async function main() {
                try{
                    setLoading(true);
                    setCmcError(null);
                    const response = await fetch(`/api/CMCquoteLatest?${qs.stringify(params)}`);
                    // check response
                    if(!response.ok){
                        setCmcError("Failed to fetch token price from CoinMarketCap");
                        setCmcFetch({
                            twentyFourHourChange: "",
                            tokenUSDPrice: "",
                            marketCap: "",
                            percent_change_1h: "",
                            percent_change_7d: "",
                            percent_change_30d: "",
                            percent_change_60d: "",
                            volume_24h: "",
                            volume_change_24h: ""
                        } as cmcPriceData)
                    }
                    const data = await response.json();
                    console.log('CMC API Response:', data);
                    // check data structure
                    if(
                        !data?.data || typeof data.data !== 'object'
                    ){
                        setCmcError('Invalid response structure from API')
                        setCmcFetch({
                            twentyFourHourChange: "",
                            tokenUSDPrice: "",
                            marketCap: "",
                            percent_change_1h: "",
                            percent_change_7d: "",
                            percent_change_30d: "",
                            percent_change_60d: "",
                            volume_24h: "",
                            volume_change_24h: ""
                        } as cmcPriceData)
                    }
                    // Get the first token's data dynamically
                    const tokenDataArray = Object.values(data.data) as CMCQuoteUSD[];
                    console.log('tokenDataArray:', tokenDataArray);
                    if (!tokenDataArray?.length || !tokenDataArray?.[0].quote?.USD?.price) {
                        setCmcError("USD price not found in response");
                        setCmcFetch({
                            twentyFourHourChange: "",
                            tokenUSDPrice: "",
                            marketCap: "",
                            percent_change_1h: "",
                            percent_change_7d: "",
                            percent_change_30d: "",
                            percent_change_60d: "",
                            volume_24h: "",
                            volume_change_24h: ""
                        } as cmcPriceData)
                    }
                    const usdPrice = tokenDataArray[0].quote.USD.price;
                    const change24h = tokenDataArray[0].quote.USD.percent_change_24h
                    const percent_change_1h = tokenDataArray[0].quote.USD.percent_change_1h
                    const percent_change_7d = tokenDataArray[0].quote.USD.percent_change_7d
                    const percent_change_30d = tokenDataArray[0].quote.USD.percent_change_30d
                    const percent_change_60d = tokenDataArray[0].quote.USD.percent_change_60d
                    const volume_24h = tokenDataArray[0].quote.USD.volume_24h
                    const volume_change_24h = tokenDataArray[0].quote.USD.volume_change_24h
                    const marketCapValue = tokenDataArray[0].quote.USD.market_cap
                    setCmcFetch({
                        twentyFourHourChange: change24h.toString(),
                        tokenUSDPrice: usdPrice.toString(),
                        marketCap: marketCapValue.toString(),
                        percent_change_1h: percent_change_1h.toString(),
                        percent_change_7d: percent_change_7d.toString(),
                        percent_change_30d: percent_change_30d.toString(),
                        percent_change_60d: percent_change_60d.toString(),
                        volume_24h: volume_24h.toString(),
                        volume_change_24h: volume_change_24h.toString()
                    })
                } catch (error) {
                    setCmcError("An error occurred while fetching the token price: " + error);
                }finally{
                    setLoading(false);
                }
            }
            main();
        },[selectedChannelMetadata]);
        // Separate useEffect for error logging to avoid dependency issues
        useEffect(() => {
            if (cmcError) {
                console.error('CMC API Error:', cmcError);
            }
        }, [cmcError]);

        console.log(selectedChannelMetadata)

    return (
        <CardTitle className="flex flex-row flex-wrap w-full bg-primary text-secondary gap-4 items-center justify-start p-4">
            {
                currentChannel &&
                selectedChannelMetadata &&
                <div className="flex flex-row gap-2">
                    <Avatar className="size-8">
                        <AvatarImage
                            src={
                                selectedChannelMetadata.logo !== '' ? 
                                selectedChannelMetadata.logo : 
                                (
                                    currentChannel.tokenType === 'ERC20' ?
                                    '/erc20Icon.svg' :
                                    '/blank_nft.svg'
                                )
                            }
                            loading="lazy"
                            alt="AlphaPING Logo"
                        />
                        <AvatarFallback>AP</AvatarFallback>
                    </Avatar>
                </div>
            }
            {
                currentChannel &&
                <div className="text-3xl">
                    {currentChannel.name}
                </div>
            }
            {
                cmcFetch.tokenUSDPrice !== "" &&
                <div className="text-3xl text-secondary">
                    {
                        loading === false ?
                        // if its is less than a dollar extend to 6 decimal places, 
                        // less thann a penny 10
                        `$${
                            Number(cmcFetch.tokenUSDPrice).toLocaleString('en-US', {
                                minimumFractionDigits: Number(cmcFetch.tokenUSDPrice) <= 0.01 ? 10 : 
                                                    Number(cmcFetch.tokenUSDPrice) <= 1 ? 6 : 2,
                                maximumFractionDigits: Number(cmcFetch.tokenUSDPrice) <= 0.01 ? 10 : 
                                                    Number(cmcFetch.tokenUSDPrice) <= 1 ? 6 : 2
                            })
                        }` :
                        <Skeleton className="w-24 h-6" />
                    }
                </div>
            }
            {
                cmcFetch.twentyFourHourChange !== "" &&
                <div className={
                        Number(cmcFetch[FIELD_BY_RANGE[timeRange]]) < 0 ? 
                        `text-xl text-red-500 w-24` :
                        `text-xl text-green-500 w-24`
                    }
                >
                    {
                        loading === false ?
                            Number(cmcFetch[FIELD_BY_RANGE[timeRange]]) < 0 ? 
                            `▼ ${
                                Number(cmcFetch[FIELD_BY_RANGE[timeRange]]).toFixed(2)
                            }%` :
                            `▲ ${
                                Number(cmcFetch[FIELD_BY_RANGE[timeRange]]).toFixed(2)
                            }%` :
                        <Skeleton className="w-24 h-6" />
                    }
                </div>
            }
            {
                cmcFetch.twentyFourHourChange !== "" &&
                <Select
                    value={timeRange}
                    onValueChange={(val) => setTimeRange(val as TimeRange)}
                >
                    <SelectTrigger className="w-24">
                        <SelectValue placeholder={timeRange}/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Time Select</SelectLabel>
                        {
                            cmcFetch.percent_change_1h !== "" &&
                            <SelectItem value="1h">
                                1h
                            </SelectItem>
                        }
                        {
                            cmcFetch.twentyFourHourChange !== "" &&
                            <SelectItem value="24h">
                                24h
                            </SelectItem>
                        }
                        {
                            cmcFetch.percent_change_7d !== "" &&
                            <SelectItem value="7d">
                                7d
                            </SelectItem>
                        }
                        {
                            cmcFetch.percent_change_30d !== "" &&
                            <SelectItem value="30d">
                                30d
                            </SelectItem>
                        }
                        {
                            cmcFetch.percent_change_60d !== "" &&
                            <SelectItem value="60d">
                                60d
                            </SelectItem>
                        }
                        </SelectGroup>
                    </SelectContent>
                </Select>   
            }
            {
                cmcFetch.marketCap !== "" &&
                <Badge variant={"secondary"}>
                    {
                        loading === false ?
                        // if its is less than a dollar extend to 6 decimal places, 
                        // less thann a penny 10
                        `MCap $${
                            humanReadableNumbers(cmcFetch.marketCap)
                        }
                        ` :
                        <Skeleton className="w-24 h-6" />
                    }
                </Badge>
            }
            {
                cmcFetch.volume_24h !== "" &&
                cmcFetch.volume_change_24h !== "" &&
                <Badge 
                    variant={"default"} 
                    className={
                        Number(cmcFetch.volume_change_24h) < 0 ? 
                        `text-red-500` :
                        `text-green-500`
                    }>
                    {
                        loading === false ?
                        Number(cmcFetch.volume_change_24h) < 0 ?
                            `Vol (24h) $${
                                humanReadableNumbers(cmcFetch.volume_24h)
                            }
                            ▼ ${
                                Number(cmcFetch.volume_change_24h).toFixed(2)
                            }%` : 
                            `Vol (24h) $${
                                humanReadableNumbers(cmcFetch.volume_24h)
                            }
                            ▲ ${
                                Number(cmcFetch.volume_change_24h).toFixed(2)
                            }%` :
                        <Skeleton className="w-24 h-6" />
                    }
                </Badge>
            } 
            {
                userBalance !== null &&
                <Badge variant={"secondary"} className="flex flex-row gap-1">
                    <div className="flex flex-row gap-1">
                        <div className="current-token-amount-title">
                            <strong>Current Balance:</strong>
                        </div>
                        <div className="current-token-amount-value">
                            {
                                    `${
                                    (Math.round(
                                        parseFloat(
                                            ethers.formatUnits(userBalance.toString(), tokenDecimals || 0)
                                        ) * 1e8
                                    ) / 1e8
                                    ).toString()
                                } ${selectedChannelMetadata?.name ?? ''} 
                                 ($${
                                    humanReadableNumbers(
                                        (
                                            Number(cmcFetch.tokenUSDPrice) * 
                                            Number(Math.round(
                                                parseFloat(
                                                    ethers.formatUnits(userBalance.toString(), tokenDecimals || 0)
                                                ) * 1e8
                                            ) / 1e8)
                                        ).toString()
                                    )
                                })`
                            }
                        </div>
                    </div>
                </Badge>
            }
            {
                selectedChannelMetadata &&
                <ul className="flex flex-row flex-wrap">
                    {
                        selectedChannelMetadata.urls.technical_doc.length > 0 &&
                        <li key={"technical_doc"}>
                            <Badge variant="secondary" className="m-1 items-center">
                                <Link
                                    href={selectedChannelMetadata.urls.technical_doc[0]}
                                    target="_blank"
                                    className="flex items-center"
                                >
                                    <ScrollText className="h-4 w-4" />
                                </Link>
                            </Badge>
                        </li>
                    }
                    {
                        selectedChannelMetadata.urls.website.length > 0 &&
                        <li key={"website"}>
                            <Badge variant="secondary" className="m-1 items-center">
                                <Link
                                    href={selectedChannelMetadata.urls.website[0]}
                                    target="_blank"
                                    className="flex items-center"
                                >
                                    <Globe className="h-4 w-4" />
                                </Link>
                            </Badge>
                        </li>
                    }
                    {
                        selectedChannelMetadata.urls.source_code.length > 0 &&
                        <li key={"source_code"}>
                            <Badge variant="secondary" className="m-1 items-center">
                                <Link
                                    href={selectedChannelMetadata.urls.source_code[0]}
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
                        selectedChannelMetadata.urls.twitter.length > 0 &&
                        <li key={"x"}>
                            <Badge variant="secondary" className="m-1 items-center">
                                <Link
                                    href={selectedChannelMetadata.urls.twitter[0]}
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
            }
            {
                currentChannel &&
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} className="h-8 w-8 p-0">
                            <Telescope className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-primary text-secondary max-h-64">
                        {
                            (
                                selectedChannelMetadata &&
                                selectedChannelMetadata.contract_address
                            ) ?
                            <DropdownMenuGroup>
                                {
                                    selectedChannelMetadata.contract_address.map((address) => {
                                        return(
                                            // some tokens have same contract address on different chains so to
                                            // maintain uniqueness we use contract address concatted with chain id
                                        <DropdownMenuItem key={address.contract_address + address.platform.coin.id}>
                                            <div className="flex flex-row gap-2 items-center">
                                                <Avatar>
                                                <AvatarImage
                                                        src={
                                                            // find the chain icon based on the chainId in the metadata
                                                            CHAINS.find(chain => chain.coinId?.toString() === (address.platform.coin.id).toString())?.icon ||
                                                            '/erc20Icon.svg'
                                                        }
                                                        alt={'Arbitrum Icon'}
                                                        loading="lazy"
                                                    />
                                                    <AvatarFallback>
                                                        {address.platform.name.slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    {
                                                        `${address.platform.name}`
                                                    }
                                                </div>
                                                <Button
                                                    variant="default"
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Link
                                                        href={`${
                                                            CHAINS.find(chain => chain.coinId?.toString() === (address.platform.coin.id).toString())?.explorer || ""
                                                        }/address/${address.contract_address}`}
                                                        target="_blank"
                                                    >
                                                        <SquareArrowUpRight className="w-4 h-4"/>
                                                    </Link>
                                                </Button>
                                                <CopyTextBlock text={address.contract_address}/>
                                            </div>
                                        </DropdownMenuItem>
                                        )
                                    })
                                }
                            </DropdownMenuGroup> :
                             <DropdownMenuGroup>
                                <DropdownMenuItem key={currentChannel.tokenAddress}>
                                    <div className="flex flex-row gap-2 items-center">
                                        <Avatar>
                                            <AvatarImage
                                                src={
                                                    CHAINS.find(chain => chain.chainId?.toString() === (42161).toString())?.icon ||
                                                    '/default_chain_icon.svg'
                                                }
                                                alt={'Arbitrum Icon'}
                                                loading="lazy"
                                            />
                                            <AvatarFallback>
                                                Arb
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            Arbitrum
                                        </div>
                                        <Button
                                            variant="default"
                                            className="h-6 w-6 p-0"
                                            >
                                                <Link
                                                    href={`https://arbiscan.io/address/${currentChannel.tokenAddress}`}
                                                    target="_blank"
                                                >
                                                    <SquareArrowUpRight className="w-4 h-4"/>
                                                </Link>
                                        </Button>
                                        <CopyTextBlock text={currentChannel.tokenAddress}/>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuGroup> 
                        }   
                    </DropdownMenuContent>
                </DropdownMenu>
            }
            <ToggleFollowFilter/>
            <Button
                variant="ghost"
                onClick={() => setChannelAction('trade')}
            >
                Trade
            </Button>
            
        </CardTitle>
    );
}
export default MessagesHeader;