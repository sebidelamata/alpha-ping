import { useState, useEffect } from "react";
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
              const decimalsNumber = typeof tokenDecimals === 'bigint' ? 
                Number(tokenDecimals) : 
                Number(tokenDecimals.toString())
              setTokenDecimals(decimalsNumber)
            } catch (error) {
              console.warn('Failed to fetch token decimals:', error)
              setTokenDecimals(null)
            }
          }
        }
        // only grab decimals if it is a erc20
        if(
          currentChannel &&
          currentChannel?.tokenType.toLowerCase() === 'erc20' && 
          currentChannel?.tokenAddress !== undefined && 
          token !== null
        ) {
          fetchTokenDecimals()
        }
      }, [token, currentChannel])

      return { tokenDecimals }

}

export default useGetTokenDecimals;