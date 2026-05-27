import { 
    useState,
    useEffect,
} from "react";
import useCurrentChannelERC20Contract from "./useCurrentChannelERC20Contract";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

const useGetBalance = ( user: string = "", tokenAddress: string = "", nativeToken: boolean = false ) => {

    const { signer, provider } = useEtherProviderContext()
    const { token } = useCurrentChannelERC20Contract(tokenAddress, nativeToken)

    const [userBalance, setUserBalance] = useState<string | null>(null)

    useEffect(() => {
        const getUserBalance = async () => {
            // Guard: nothing to look up yet
            if (!signer && !user) return;

            if (nativeToken === true && provider != null) {
                // Guard: need a valid address for native balance
                const address = user !== "" ? user : await signer?.getAddress()
                if (!address) return;
                const balance = await provider.getBalance(address)
                setUserBalance(balance.toString())
                return;
            }

            if (token !== null && nativeToken === false) {
                // Guard: resolve address — never pass signer object to balanceOf
                let address: string | undefined;
                if (user !== "") {
                    address = user;
                } else {
                    address = await signer?.getAddress()
                }
                if (!address) return;
                const userBalance = await token.balanceOf(address)
                setUserBalance(userBalance.toString())
            }
        }
        getUserBalance()
    }, [token, signer, user, nativeToken, provider])

    return { userBalance }
}

export default useGetBalance;