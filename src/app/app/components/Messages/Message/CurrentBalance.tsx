'use client';

import React from "react";
import { ethers } from 'ethers'
import { 
    HoverCard, 
    HoverCardTrigger, 
    HoverCardContent 
} from "@/components/components/ui/hover-card";
import { useCMCPriceDataContext } from "src/contexts/CMCPriceDataContext";
import humanReadableNumbers from "src/lib/humanReadableNumbers";
import useGetBalance from "src/hooks/useGetBalance";
import useGetTokenSymbol from "src/hooks/useGetTokenSymbol";

interface CurrentBalanceProps{
    tokenDecimals: number | null;
    account: string;
}

const CurrentBalance:React.FC<CurrentBalanceProps> = ({ 
    tokenDecimals,
    account 
}) => {

    const { cmcFetch } = useCMCPriceDataContext()

    const { userBalance } = useGetBalance(account)
    const { tokenSymbol } = useGetTokenSymbol()

    return(
        <HoverCard>
            <HoverCardTrigger asChild className='flex flex-row gap-1'>
                <div>
                    <div className='current-token-amount-title'>
                        <strong>Current Balance:</strong>
                    </div>
                    <div>
                        {
                            userBalance !== null && (
                                tokenDecimals !== null ? (
                                `${
                                    (
                                    Math.round(
                                        parseFloat(
                                        ethers.formatUnits(userBalance.toString(), tokenDecimals)
                                        ) * 1e8
                                    ) / 1e8
                                    ).toString()
                                } ${tokenSymbol ?? ''}`
                                ) : (
                                `${userBalance.toString()} ${tokenSymbol ?? ''}${userBalance.toString() === '1' ? '' : 's'}`
                                )
                            )
                        }
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="bg-primary text-secondary"> 
                 <div className='flex flex-row gap-1'>
                    <div className='current-token-amount-title'>
                        <strong>Current Balance:</strong>
                    </div>
                    <div>
                        {
                            userBalance !== null && 
                            <div>
                                {
                                    tokenDecimals !== null ? (
                                        `$${
                                            humanReadableNumbers((
                                                (
                                                    parseFloat(
                                                    ethers.formatUnits(userBalance.toString(), tokenDecimals)
                                                    ) * 1e8
                                                ) / 1e8 * Number(cmcFetch.tokenUSDPrice)
                                            ).toString())
                                        }`
                                        ) : (
                                            `$${
                                                humanReadableNumbers(
                                                    (Number(userBalance) * Number(cmcFetch.tokenUSDPrice)).toString()
                                                )
                                            }`
                                        )
                                    }
                            </div>
                        }
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default CurrentBalance;