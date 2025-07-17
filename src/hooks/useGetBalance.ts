import { 
    useState,
    useEffect 
} from "react";
import useCurrentChannelERC20Contract from "./useCurrentChannelERC20Contract";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

const useGetBalance = () => {

    const { signer } = useEtherProviderContext()
    const { token } = useCurrentChannelERC20Contract()

    const [userBalance, setUserBalance] = useState<string | null>(null)

    useEffect(() => {
        const getUserBalance = async () => {
          if(token !== null){
            const userBalance = await token.balanceOf(signer)
            setUserBalance(userBalance.toString())
          }
        }
        getUserBalance()
      }, [token, signer])

    return { userBalance }
}

export default useGetBalance;