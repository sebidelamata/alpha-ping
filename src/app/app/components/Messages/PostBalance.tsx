'use client';

import React from "react";
import { ethers } from 'ethers'
import { useChannelProviderContext } from "src/contexts/ChannelContext";

interface PostBalanceProps{
    message: Message;
    tokenDecimals: number | null;
}

const PostBalance:React.FC<PostBalanceProps> = ({ 
    message,
    tokenDecimals 
}) => {

    const { selectedChannelMetadata } = useChannelProviderContext()
console.log(selectedChannelMetadata)
    return(
        <div className='flex flex-row gap-1'>
            <div className='current-token-amount-title'>
              <strong>Post Balance:</strong>
            </div>
            <div className='current-token-amount-value'>
                {
                tokenDecimals !== null &&
                // round to 8 decimals
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
                }
                {
                    ` ${selectedChannelMetadata?.symbol}`
                }
            </div>
        </div>
    )
}

export default PostBalance;