import { useState, useEffect, useMemo } from "react";
import useCurrentChannelERC20Contract from "./useCurrentChannelERC20Contract";
import { useChannelProviderContext } from "src/contexts/ChannelContext";

const useGetTokenDecimals = () => {

    const { token } = useCurrentChannelERC20Contract()
    const { currentChannel } = useChannelProviderContext()

    const [tokenDecimals, setTokenDecimals] = useState<number | null>(null)

    useEffect(() => {
        const fetchTokenDecimals = async () => {
          if (token !== null) {
            try {
              const tokenDecimals = await token.decimals()
              console.log(tokenDecimals)
              setTokenDecimals(tokenDecimals as number)
            } catch (error) {
              console.warn('Failed to fetch token decimals:', error)
              setTokenDecimals(null) 
            }
          } else {
            setTokenDecimals(null) 
          }
        }
        // only grab decimals if it is a erc20
        if(currentChannel?.tokenType.toLowerCase() === 'erc20' && currentChannel?.tokenAddress !== undefined){
          fetchTokenDecimals()
        }
      }, [token, currentChannel])

      return useMemo(() => ({ tokenDecimals }), [tokenDecimals]);

}

export default useGetTokenDecimals;