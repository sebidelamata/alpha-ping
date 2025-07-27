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
                                                    message.messageTimestampTokenAmount.toString(), 
                                                    tokenDecimals
                                                )
                                            ) * 1e8
                                        ) / 1e8
                                        ).toString()
                                    } ${tokenSymbol ?? ''}`
                                    ) : (
                                    `${message.messageTimestampTokenAmount.toString()} ${tokenSymbol ?? 'NFT'}${message.messageTimestampTokenAmount.toString().toString() === '1' ? '' : 's'}`
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
                                                    message.messageTimestampTokenAmount.toString(), 
                                                    tokenDecimals
                                                )
                                            ) * 1e8
                                        ) / 1e8) * Number(cmcFetch.tokenUSDPrice)
                                    ).toString()
                                )
                                }`
                            ) : (
                            `$${humanReadableNumbers(
                                (Number(message.messageTimestampTokenAmount) * Number(cmcFetch.twentyFourHourChange)
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