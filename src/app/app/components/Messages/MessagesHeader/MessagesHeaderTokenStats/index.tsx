'use client';

import React, { useState } from "react";
import { Button } from "@/components/components/ui/button";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/components/ui/avatar";
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
import { useCMCPriceDataContext } from "src/contexts/CMCPriceDataContext";
import MessagesHeaderTokenLinks from "./MessagesHeaderTokenLinks";
import ToggleFollowFilter from "../../../Profile/ToggleFollowFilter";
import useGetBalance from "src/hooks/useGetBalance";
import { ethers } from "ethers";
import useGetTokenDecimals from "src/hooks/useGetTokenDecimals";
import useGetCurrentChannelBeefyLP from "src/hooks/useGetCurrentChannelBeefyLP";

type TimeRange = "1h" | "24h" | "7d" | "30d" | "60d"

const MessagesHeaderTokenStats = () => {

    const { 
        currentChannel, 
        selectedChannelMetadata,
        setChannelAction 
    } = useChannelProviderContext()
    const { cmcFetch, cmcLoading } = useCMCPriceDataContext()
    const { currentChannelBeefyLP } = useGetCurrentChannelBeefyLP()
    const { tokenDecimals } = useGetTokenDecimals()
    const { userBalance } = useGetBalance()

    const balanceFormatted = (
        userBalance !== null && 
        tokenDecimals !==null 
        ) ?
        ethers.formatUnits(
            userBalance.toString(), 
            tokenDecimals
        ) : '0'
    const balanceNumber = Number(balanceFormatted);
    const usdValue = (
        currentChannelBeefyLP !== undefined && 
        currentChannelBeefyLP !== null
        ) ?
        Number(currentChannelBeefyLP[1].price) * balanceNumber :
        Number(cmcFetch.tokenUSDPrice) * balanceNumber

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

    return(
        <div className="flex flex-row flex-wrap w-full bg-primary text-secondary gap-4 items-center justify-start p-2">
            {
                currentChannel &&
                selectedChannelMetadata &&
                (
                    selectedChannelMetadata.protocol !== undefined &&
                    selectedChannelMetadata.protocol.toLocaleLowerCase() === 'beefy' ?
                    <div className="flex flex-row gap-2">
                        <Badge className="bg-primary text-lg">
                            Yield
                        </Badge>
                    </div> :
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
                )
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
                        cmcLoading === false ?
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
                        cmcLoading === false ?
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
                        cmcLoading === false ?
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
                        cmcLoading === false ?
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
                                `${humanReadableNumbers(balanceFormatted)} ${
                                    selectedChannelMetadata?.symbol || 
                                    currentChannel?.name || 
                                    ''
                                } ($${humanReadableNumbers(usdValue.toString())})`
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