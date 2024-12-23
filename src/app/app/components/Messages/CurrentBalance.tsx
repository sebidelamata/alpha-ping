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
    tokenDecimals: number | null;
    tokenAddress: string | null;
}

const CurrentBalance:React.FC<CurrentBalanceProps> = ({ 
    message,
    tokenDecimals,
    tokenAddress 
}) => {

    const { signer } = useEtherProviderContext()

    const [userBalance, setUserBalance] = useState<string | null>(null)

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
    useEffect(() => {
        getUserBalance()
    }, [message, tokenAddress])

    return(
        <div className='current-token-amount'>
            <div className='current-token-amount-title'>
              <strong>Current Balance:</strong>
            </div>
            <div className='current-token-amount-value'>
              {
                tokenDecimals !== null &&
                userBalance !== null &&
                    ethers.formatUnits(
                        userBalance.toString(), 
                        tokenDecimals
                    )
              }
            </div>
        </div>
    )
}

export default CurrentBalance;