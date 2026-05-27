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
import useGetTokenSymbol from "src/hooks/useGetTokenSymbol";
import getFullStringScientificNotationSafe from "src/lib/getFullStringScientificNotationSafe";

interface PostBalanceProps{
    message: Message;
    tokenDecimals: number | null;
}

const PostBalance: React.FC<PostBalanceProps> = ({ 
    message,
    tokenDecimals 
}) => {

    const { cmcFetch } = useCMCPriceDataContext()
    const { tokenSymbol } = useGetTokenSymbol()

    // Guard: don't render if the raw amount is missing or undefined
    const rawAmount = message.messageTimestampTokenAmount
    if (rawAmount == null || rawAmount === '' || rawAmount === 'undefined') {
        return null;
    }

    const safeAmount = getFullStringScientificNotationSafe(rawAmount)

    // Guard: ensure safeAmount is usable before passing to ethers
    if (!safeAmount || safeAmount === 'undefined') {
        return null;
    }

    return(
        <HoverCard>
            <HoverCardTrigger asChild>
                <div className='flex flex-row gap-1'>
                    <div className='current-token-amount-title'>
                        <strong>Post Balance:</strong>
                    </div>
                    <div className='current-token-amount-value'>
                        {
                            tokenDecimals !== null ? (
                                `${(
                                    Math.round(
                                        parseFloat(
                                            ethers.formatUnits(safeAmount, tokenDecimals)
                                        ) * 1e8
                                    ) / 1e8
                                ).toString()} ${tokenSymbol ?? ''}`
                            ) : (
                                `${safeAmount} ${tokenSymbol ?? 'NFT'}${safeAmount === '1' ? '' : 's'}`
                            )
                        }
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="bg-primary text-secondary">
                <div className='flex flex-row gap-1'>
                    <div className='current-token-amount-title'>
                        <strong>Post Balance:</strong>
                    </div>
                    <div className='current-token-amount-value'>
                        {
                            tokenDecimals !== null ? (
                                `$${humanReadableNumbers(
                                    (
                                        (Math.round(
                                            parseFloat(
                                                ethers.formatUnits(safeAmount, tokenDecimals)
                                            ) * 1e8
                                        ) / 1e8) * Number(cmcFetch.tokenUSDPrice)
                                    ).toString()
                                )}`
                            ) : (
                                `$${humanReadableNumbers(
                                    (Number(safeAmount) * Number(cmcFetch.twentyFourHourChange)).toString()
                                )}`
                            )
                        }
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default PostBalance;