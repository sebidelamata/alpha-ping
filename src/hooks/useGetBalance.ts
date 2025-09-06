import { 
    useState,
    useEffect,
    useMemo 
} from "react";
import useCurrentChannelERC20Contract from "./useCurrentChannelERC20Contract";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

const useGetBalance = ( user: string = "", tokenAddress: string = "", nativeToken: boolean = false ) => {

    const { signer, provider } = useEtherProviderContext()
    const { token } = useCurrentChannelERC20Contract(tokenAddress, nativeToken)

    const [userBalance, setUserBalance] = useState<string | null>(null)

    useEffect(() => {
        const getUserBalance = async () => {
          // hanfles case where token is native token 
          if(
            nativeToken===true && 
            provider !== null && 
            provider !== undefined
          ){
            const balance = await provider.getBalance(user)
            setUserBalance(balance.toString())
          }
          if(token !== null && nativeToken===false) {
            const account = user === "" ? signer : user
            const userBalance = await token.balanceOf(account)
            setUserBalance(userBalance.toString())
          }
        }
        getUserBalance()
      }, [token, signer, user, nativeToken, provider])

    return useMemo(() => ({ userBalance }), [userBalance])
}

export default useGetBalance;