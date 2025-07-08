'use client';

import React, {
    useState,
    useEffect
} from "react";
import { ethers } from 'ethers'
import { useEtherProviderContext } from "../../../../../contexts/ProviderContext";
import ERC20Faucet from '../../../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { 
    HoverCard, 
    HoverCardTrigger, 
    HoverCardContent 
} from "@/components/components/ui/hover-card";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import humanReadableNumbers from "src/lib/humanReadableNumbers";

interface PostBalanceProps{
    message: Message;
    tokenAddress: string | null;
    tokenDecimals: number | null;
}

const PostBalance:React.FC<PostBalanceProps> = ({ 
    message,
    tokenAddress,
    tokenDecimals 
}) => {

    const { signer } = useEtherProviderContext()
    const { cmcFetch } = useChannelProviderContext()

    const [tokenSymbol, setTokenSymbol] = useState<string | null>(null)

    useEffect(() => {
        const getTokenSymbol = async () => {
            if(tokenAddress !== null){
                const token = new ethers.Contract(
                    tokenAddress,
                    ERC20Faucet.abi,
                    signer
                )
                const tokenSymbol = await token.symbol()
                setTokenSymbol(tokenSymbol.toString())
            }
        }
        getTokenSymbol()
    }, [message, tokenAddress, signer])

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