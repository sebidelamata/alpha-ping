'use client';

import React from "react";
import Link from "next/link";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/components/ui/avatar";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import useGetCurrentChannelBeefyLP from "src/hooks/useGetCurrentChannelBeefyLP";
import humanReadableNumbers from "src/lib/humanReadableNumbers";
import { Badge } from "@/components/components/ui/badge";
import useGetCurrentChannelBeefyVault from "src/hooks/useGetCurrentChannelBeefyVault";
import { Button } from "@/components/components/ui/button";
import { ExternalLink } from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent 
} from "@/components/components/ui/dropdown-menu";
import { DateTime } from 'luxon';
import useGetCurrentChannelBeefyAPY from "src/hooks/useGetCurrentChannelBeefyAPY";

const MessagesHeaderBeefyStats:React.FC = () => {

    const { 
        selectedChannelMetadata,
    } = useChannelProviderContext()
    const { currentChannelBeefyLP } = useGetCurrentChannelBeefyLP()
    const { currentChannelBeefyVault } = useGetCurrentChannelBeefyVault()
    const { currentChannelBeefyAPY } = useGetCurrentChannelBeefyAPY()
 console.log("beefyLs: ", currentChannelBeefyAPY)

    if(
        selectedChannelMetadata !== null &&
        selectedChannelMetadata.protocol &&
        selectedChannelMetadata.protocol === 'beefy'
    ){
        return(
            <div className="flex flex-row flex-wrap justify-start items-center w-full gap-4 text-xl">
                {
                    currentChannelBeefyVault &&
                    currentChannelBeefyVault.id &&
                    <div className="flex items-center">
                        <Link 
                            className="text-accent flex flex-wrap gap-2 items-center"
                            href={`https://app.beefy.finance/vault/${currentChannelBeefyVault?.id}`}
                            target="_blank"
                        >
                            <Avatar className="size-6">
                                <AvatarImage 
                                    src='https://s2.coinmarketcap.com/static/img/coins/64x64/7311.png' 
                                    alt="Beefy Logo"
                                    loading="lazy"
                                />
                                <AvatarFallback>
                                    Beefy
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                Beefy Position
                            </div>
                        </Link>
                    </div>
                }
                {
                    currentChannelBeefyVault &&
                    currentChannelBeefyVault.status &&
                    (
                        <div className="flex items-center text-sm">
                            {
                                currentChannelBeefyVault.status === 'active' ?
                                <Badge className="text-green-500 rounded-full">
                                    Active
                                </Badge> :
                                <Badge variant={'outline'} className="text-red-500 rounded-full">
                                    Retired
                                </Badge>
                            }
                        </div>
                    )
                }
                {
                    currentChannelBeefyVault &&
                    currentChannelBeefyVault.retireReason &&
                    <div className="flex items-center">
                        <Badge className="text-sm text-red-500">
                            Retire Reason: { 
                                currentChannelBeefyVault.retireReason
                                    .replace('-', ' ')
                                    .toLocaleUpperCase()
                            }
                        </Badge>
                    </div>
                }
                {
                    currentChannelBeefyVault &&
                    currentChannelBeefyVault.retiredAt &&
                    <div className="flex items-center text-sm">
                        <Badge className="text-red-500">
                            Retired At: { 
                                DateTime.fromSeconds(currentChannelBeefyVault.retiredAt).toLocaleString(DateTime.DATETIME_MED)
                            }
                        </Badge>
                    </div>  
                }
                {
                    currentChannelBeefyVault &&
                    currentChannelBeefyVault.strategyTypeId &&
                    <div className="flex items-center">
                        <Badge>
                            Exposure: {
                                currentChannelBeefyVault.strategyTypeId
                                    .replace('-', ' ')
                                    .toLocaleUpperCase()
                            }
                        </Badge>
                    </div>
                }
                {
                    currentChannelBeefyLP !== null &&
                    <div className="flex items-center">
                        <Badge className="text-sm">
                            TVL: { 
                                `$${humanReadableNumbers((Number(currentChannelBeefyLP[1].totalSupply) * Number(currentChannelBeefyLP[1].price)).toString())}`
                            }
                        </Badge>
                    </div>
                }
                {
                    currentChannelBeefyVault &&
                    currentChannelBeefyVault.addLiquidityUrl &&
                    <div className="flex items-center">
                        <Button variant={'secondary'}>
                            <Link 
                                href={currentChannelBeefyVault.addLiquidityUrl} 
                                target="_blank"
                                className="flex flex-row items-center gap-1"
                            >
                                Build LP <ExternalLink className="w-4 h-4"/>
                            </Link>
                        </Button>
                    </div>
                }
                {
                    currentChannelBeefyVault &&
                    currentChannelBeefyVault.risks &&
                    <div className="flex items-center text-sm">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={'outline'}>
                                    Risks
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-primary text-secondary flex flex-col gap-2 p-4">
                                {
                                currentChannelBeefyVault.risks.map((risk, index) => {
                                    return <Badge key={index}>
                                        {
                                            risk.replace('_', ' ')
                                                .toLocaleUpperCase()
                                        }
                                    </Badge>
                                })
                            }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                }
                {
                    currentChannelBeefyVault &&
                    currentChannelBeefyVault.assets &&
                    <div className="flex items-center text-sm">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={'outline'}>
                                    Assets
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-primary text-secondary flex flex-col gap-2 p-4">
                                {
                                currentChannelBeefyVault.assets.map((assets, index) => {
                                    return <Badge key={index}>
                                        {
                                            assets.replace('_', ' ')
                                                .toLocaleUpperCase()
                                        }
                                    </Badge>
                                })
                            }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                }
                {
                    currentChannelBeefyVault &&
                    currentChannelBeefyVault.lastHarvest &&
                    <div className="flex items-center">
                        <Badge className="text-sm">
                            Last Harvest: { 
                                DateTime.fromSeconds(currentChannelBeefyVault.lastHarvest).toLocaleString(DateTime.DATETIME_MED)
                            }
                        </Badge>
                    </div>
                }
                {
                    currentChannelBeefyVault &&
                    currentChannelBeefyVault.oracle &&
                    <div className="flex items-center">
                        <Badge className="text-sm">
                            Oracle: { 
                                currentChannelBeefyVault.oracle
                                    .replace('-', ' ')
                                    .toLocaleUpperCase()
                            }
                        </Badge>
                    </div>
                }
                {
                    currentChannelBeefyAPY &&
                    currentChannelBeefyAPY[1] &&
                    currentChannelBeefyAPY[1].totalApy !== null &&
                    currentChannelBeefyAPY[1].totalApy !== undefined &&
                    currentChannelBeefyAPY[1].totalApy > 0 &&
                    <div className="flex items-center">
                        <Badge className="text-sm">
                            Total APY: { 
                                `${(Number(currentChannelBeefyAPY[1].totalApy) * 100).toFixed(2)}%`
                            }
                        </Badge>
                    </div>
                }
                {
                    currentChannelBeefyAPY &&
                    currentChannelBeefyAPY[1] &&
                    currentChannelBeefyAPY[1].tradingApr !== null &&
                    currentChannelBeefyAPY[1].tradingApr !== undefined &&
                    currentChannelBeefyAPY[1].tradingApr > 0 &&
                    <div className="flex items-center">
                        <Badge className="text-sm">
                            Trading APR: { 
                                `${(Number(currentChannelBeefyAPY[1].tradingApr) * 100).toFixed(2)}%`
                            }
                        </Badge>
                    </div>
                }
                {
                    currentChannelBeefyAPY &&
                    currentChannelBeefyAPY[1] &&
                    currentChannelBeefyAPY[1].vaultApr !== null &&
                    currentChannelBeefyAPY[1].vaultApr !== undefined &&
                    currentChannelBeefyAPY[1].vaultApr > 0 &&
                    <div className="flex items-center">
                        <Badge className="text-sm">
                            Vault APR: { 
                                `${(Number(currentChannelBeefyAPY[1].vaultApr) * 100).toFixed(2)}%`
                            }
                        </Badge>
                    </div>
                }
            </div>
        )
    } else {
        return
    }

}

export default MessagesHeaderBeefyStats