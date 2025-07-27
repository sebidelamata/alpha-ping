import { 
    useState,
    useEffect 
} from "react";
import useCurrentChannelERC20Contract from "./useCurrentChannelERC20Contract";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

const useGetBalance = ( user: string = "" ) => {

    const { signer } = useEtherProviderContext()
    const { token } = useCurrentChannelERC20Contract()

    const [userBalance, setUserBalance] = useState<string | null>(null)

    useEffect(() => {
        const getUserBalance = async () => {
          if(token !== null){
            const account = user === "" ? signer : user
            const userBalance = await token.balanceOf(account)
            setUserBalance(userBalance.toString())
          }
        }
        getUserBalance()
      }, [token, signer, user])

    return { userBalance }
}

export default useGetBalance;