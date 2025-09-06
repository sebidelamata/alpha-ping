import { useState, useEffect, useMemo } from "react";
import { ethers } from 'ethers'
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import ERC20Faucet from '../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { useChannelProviderContext } from "src/contexts/ChannelContext";

const useGetTokenSymbol = () => {

    const { signer } = useEtherProviderContext()
    const { currentChannel } = useChannelProviderContext()

    const [tokenSymbol, setTokenSymbol] = useState<string | null>(null)
    useEffect(() => {
        const getTokenSymbol = async () => {
            if(currentChannel !== null){
                const token = new ethers.Contract(
                    currentChannel?.tokenAddress || "",
                    ERC20Faucet.abi,
                    signer
                )
                const tokenSymbol = await token.symbol()
                setTokenSymbol(tokenSymbol.toString())
            }
        }
        getTokenSymbol()
    }, [currentChannel, signer])

    return useMemo(() => ({tokenSymbol}), [tokenSymbol]);

}

export default useGetTokenSymbol