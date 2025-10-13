import { 
    useState,
    useEffect,
} from "react";
import useCurrentChannelERC20Contract from "./useCurrentChannelERC20Contract";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

const useGetAllowance = ( 
  spender: string = "", 
  tokenAddress: string = "", 
  nativeToken: boolean = false 
) => {

    const { signer, provider } = useEtherProviderContext()
    const { token } = useCurrentChannelERC20Contract(tokenAddress, nativeToken)

    const [tokenAllowance, settokenAllowance] = useState<string | null>(null)

    useEffect(() => {
        const getUserBalance = async () => {
          // hanfles case where token is native token 
          if(
            nativeToken===true && 
            provider !== null && 
            provider !== undefined
          ){
            return ""
          }
          if(token !== null && nativeToken===false) {
            try{
              const allowance = await token.allowance(signer, spender)
              settokenAllowance(allowance.toString())
            } catch (error) {
              console.error("Error fetching allowance:", error);
              settokenAllowance("0")
            }
          }
        }
        getUserBalance()
      }, [token, signer, nativeToken, provider, spender])

    return { tokenAllowance }
}

export default useGetAllowance;