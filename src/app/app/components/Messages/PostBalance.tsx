'use client';

import React from "react";
import { ethers } from 'ethers'

interface PostBalanceProps{
    message: Message;
    tokenDecimals: number | null;
}

const PostBalance:React.FC<PostBalanceProps> = ({ 
    message,
    tokenDecimals 
}) => {

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
            </div>
        </div>
    )
}

export default PostBalance;