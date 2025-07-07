'use client';

import React, {
    useState,
    useEffect
} from "react";
import { ethers } from 'ethers'
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import ERC20Faucet from '../../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'

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
                    `${message.messageTimestampTokenAmount.toString().toString()} ${tokenSymbol ?? 'NFT'}${message.messageTimestampTokenAmount.toString().toString() === '1' ? '' : 's'}`
                    )
                }
            </div>
        </div>
    )
}

export default PostBalance;