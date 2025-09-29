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

const PostBalance:React.FC<PostBalanceProps> = ({ 
    message,
    tokenDecimals 
}) => {

    const { cmcFetch } = useCMCPriceDataContext()
    const { tokenSymbol } = useGetTokenSymbol()

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
                                    `${
                                        (
                                        Math.round(
                                            parseFloat(
                                                ethers.formatUnits(
                                                   getFullStringScientificNotationSafe(message.messageTimestampTokenAmount), 
                                                    tokenDecimals
                                                )
                                            ) * 1e8
                                        ) / 1e8
                                        ).toString()
                                    } ${tokenSymbol ?? ''}`
                                    ) : (
                                    `${getFullStringScientificNotationSafe(message.messageTimestampTokenAmount)} ${tokenSymbol ?? 'NFT'}${getFullStringScientificNotationSafe(message.messageTimestampTokenAmount) === '1' ? '' : 's'}`
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
                            `$${
                                humanReadableNumbers(
                                    (
                                        (Math.round(
                                            parseFloat(
                                                ethers.formatUnits(
                                                    getFullStringScientificNotationSafe(message.messageTimestampTokenAmount), 
                                                    tokenDecimals
                                                )
                                            ) * 1e8
                                        ) / 1e8) * Number(cmcFetch.tokenUSDPrice)
                                    ).toString()
                                )
                                }`
                            ) : (
                            `$${humanReadableNumbers(
                                (Number(getFullStringScientificNotationSafe(message.messageTimestampTokenAmount)) * Number(cmcFetch.twentyFourHourChange)
                            ).toString())}`
                            )
                        }
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default PostBalance;