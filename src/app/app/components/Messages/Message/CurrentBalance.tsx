'use client';

import React, {
    useState,
    useEffect
} from "react";
import { ethers } from 'ethers'
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import ERC20Faucet from '../../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'

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
        <div className='flex flex-row gap-1'>
            <div className='current-token-amount-title'>
              <strong>Current Balance:</strong>
            </div>
            <div className='current-token-amount-value'>
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
    )
}

export default CurrentBalance;