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

interface CurrentBalanceProps{
    message: Message;
    tokenAddress: string | null;
    tokenDecimals: number | null;
}

const CurrentBalance:React.FC<CurrentBalanceProps> = ({ 
    message,
    tokenAddress,
    tokenDecimals 
}) => {

    const { signer } = useEtherProviderContext()
    const { cmcFetch } = useChannelProviderContext()

    const [userBalance, setUserBalance] = useState<string | null>(null)

    useEffect(() => {
        const getUserBalance = async () => {
            if(tokenAddress !== null){
                const token = new ethers.Contract(
                    tokenAddress,
                    ERC20Faucet.abi,
                    signer
                )
                const userBalance = await token.balanceOf(message.account)
                setUserBalance(userBalance.toString())
            }
        }
        getUserBalance()
    }, [message, tokenAddress, signer])

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
                        <strong>Post Balance:</strong>
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