'use client';

import React from "react";
import { 
    Collapsible, 
    CollapsibleTrigger, 
    CollapsibleContent 
} from "@/components/components/ui/collapsible";
import { 
    SidebarMenuButton, 
    SidebarMenuItem,
    SidebarMenuSub 
} from "@/components/components/ui/sidebar";
import { 
    HoverCard, 
    HoverCardTrigger, 
    HoverCardContent 
} from "@/components/components/ui/hover-card";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/components/ui/avatar";
import humanReadableNumbers from "src/lib/humanReadableNumbers";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Channel from "./Channel";
import { useAaveDetailsContext } from "src/contexts/AaveDetailsContext";
import { AlphaPING } from "typechain-types";

interface IAaveChannelGroup{
    channels: {
        channel: AlphaPING.ChannelStructOutput,
        metadata: tokenMetadata
    }[]
}

const AaveChannelGroup:React.FC<IAaveChannelGroup> = ({ channels }) => {

    const { aaveAccount } = useAaveDetailsContext()

    return(
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
                                Number(aaveAccount?.healthFactor) <= 5.0 ?
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
                                Effective LTV: {
                                        aaveAccount?.healthFactor === "115792089237316195423570985008687907853.269984665640564039457584007913129639935" ? 
                                        "0" :
                                        ((1 / Number(aaveAccount?.healthFactor)*100)).toFixed(2)
                                    }%
                            </li>
                            <li className="w-full justify-end flex">
                                Max LTV: {
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
                            channels.map(({ channel, metadata }) => (
                                <SidebarMenuItem key={channel.tokenAddress}>
                                <Channel 
                                    channel={channel} 
                                    tokenMetadata={metadata} 
                                />
                                </SidebarMenuItem>
                            ))
                        }
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
                </Collapsible>
    )
}

export default AaveChannelGroup;