import { 
    useState,
    useEffect
} from "react";
import { ethers } from 'ethers'
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import ERC20Faucet from '../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { Contract } from 'ethers'

const useCurrentChannelERC20Contract = (tokenAddress: string = "", nativeToken: boolean = false) => {

    const { currentChannel } = useChannelProviderContext()
    const { signer } = useEtherProviderContext() 

    const [token, setToken] = useState<Contract | null>(null)

    useEffect(() => {
        if (nativeToken) {
            setToken(null)
            return
        }

        // Guard: ensure address is a valid non-empty string before constructing contract
        if (tokenAddress !== "") {
            if (!ethers.isAddress(tokenAddress)) return;
            const token = new ethers.Contract(
                tokenAddress,
                ERC20Faucet.abi,
                signer
            )
            setToken(token)
            return
        }

        if (
            currentChannel?.tokenAddress !== undefined &&
            currentChannel?.tokenAddress !== "" &&
            ethers.isAddress(currentChannel.tokenAddress)
        ) {
            const token = new ethers.Contract(
                currentChannel.tokenAddress,
                ERC20Faucet.abi,
                signer
            )
            setToken(token)
        }
    }, [currentChannel, signer, tokenAddress, nativeToken])

    return { token }
}

export default useCurrentChannelERC20Contract;