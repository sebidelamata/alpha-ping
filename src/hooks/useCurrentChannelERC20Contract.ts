import { 
    useState,
    useEffect,
    useMemo
} from "react";
import { ethers } from 'ethers'
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import ERC20Faucet from '../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { Contract } from 'ethers'

const useCurrentChannelERC20Contract = (tokenAddress: string = "", nativeToken: boolean = false) => {

    const { currentChannel } = useChannelProviderContext()
    const { signer } = useEtherProviderContext() 

    // current channel erc20 contract instance ready to go
    const [token, setToken] = useState<Contract | null>(null)

    useEffect(() => {
        if(nativeToken) {
            setToken(null)
            return
        }
        if(currentChannel?.tokenAddress !== undefined && tokenAddress === "") {
            const token = new ethers.Contract(
                currentChannel?.tokenAddress,
                ERC20Faucet.abi,
                signer
            )
            setToken(token)
        }
        if(tokenAddress !== "") {
            const token = new ethers.Contract(
                tokenAddress,
                ERC20Faucet.abi,
                signer
            )
            setToken(token)
        }
    }, [currentChannel, signer, setToken, tokenAddress, nativeToken])

    return useMemo(() => ({ token }), [token]);
}

export default useCurrentChannelERC20Contract;