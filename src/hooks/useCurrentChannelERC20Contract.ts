import { 
    useState,
    useEffect 
} from "react";
import { ethers } from 'ethers'
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import ERC20Faucet from '../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { Contract } from 'ethers'

const useCurrentChannelERC20Contract = () => {

    const { currentChannel } = useChannelProviderContext()
    const { signer } = useEtherProviderContext()

    // current channel erc20 contract instance ready to go
    const [token, setToken] = useState<Contract | null>(null)

    useEffect(() => {
        if(currentChannel?.tokenAddress !== undefined){
            const token = new ethers.Contract(
                currentChannel?.tokenAddress,
                ERC20Faucet.abi,
                signer
            )
            setToken(token)
        }
    }, [currentChannel, signer, setToken])

    return { token }
}

export default useCurrentChannelERC20Contract;