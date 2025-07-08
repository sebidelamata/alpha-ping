'use client';

import React, {
    useState,
    useEffect
} from "react";
import { Button } from "@/components/components/ui/button";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/components/ui/avatar";
import qs from 'qs'
import { Skeleton } from "@/components/components/ui/skeleton";
import { 
    Select, 
    SelectTrigger, 
    SelectContent,
    SelectValue,
    SelectGroup,
    SelectItem,
    SelectLabel 
} from "@/components/components/ui/select";
import { Badge } from "@/components/components/ui/badge";
import humanReadableNumbers from "src/lib/humanReadableNumbers";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { useUserProviderContext } from "src/contexts/UserContext";
import { ethers } from "ethers";
import ERC20Faucet from '../../../../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import MessagesHeaderTokenLinks from "./MessagesHeaderTokenLinks";
import ToggleFollowFilter from "../../../Profile/ToggleFollowFilter";

type TimeRange = "1h" | "24h" | "7d" | "30d" | "60d"

const MessagesHeaderTokenStats = () => {

    const { 
        currentChannel, 
        selectedChannelMetadata,
        setCmcFetch,
        cmcFetch, 
        setChannelAction 
    } = useChannelProviderContext()
    const { signer }= useEtherProviderContext()
    const { account } = useUserProviderContext()
    

    const [userBalance, setUserBalance] = useState<string | null>(null)
    const [tokenDecimals, setTokenDecimals] = useState<number | null>(null)
    console.log("selectedChannelMetadata: ", selectedChannelMetadata)

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

    // we are going to use this timer to refetch a new price every 60 seconds
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    // Timer to update lastUpdated every 60 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
        setLastUpdated(new Date());
        }, 60 * 1000); // 60 seconds in milliseconds
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run once on mount

    // get latest quote in USD
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
    },[selectedChannelMetadata, lastUpdated, setCmcFetch]);
    // Separate useEffect for error logging to avoid dependency issues
    useEffect(() => {
        if (cmcError) {
            console.error('CMC API Error:', cmcError);
        }
    }, [cmcError]);
    

    return(
        <div className="flex flex-row flex-wrap w-full bg-primary text-secondary gap-4 items-center justify-start p-2">
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
                                    humanReadableNumbers((Math.round(
                                        parseFloat(
                                            ethers.formatUnits(userBalance.toString(), tokenDecimals || 0)
                                        ) * 1e8
                                    ) / 1e8).toString()
                                    )
                                } ${currentChannel?.name ?? ''} 
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
            <MessagesHeaderTokenLinks/>
            <ToggleFollowFilter/>
            <Button
                variant="ghost"
                onClick={() => setChannelAction('trade')}
            >
                Trade
            </Button>
        </div>
    )
}

export default MessagesHeaderTokenStats;