import React, 
    { 
        useState,
        MouseEvent 
    } from "react";
import { useChannelProviderContext } from "../../contexts/ChannelContext";
import { useUserProviderContext } from "../../contexts/UserContext";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import Loading from "../Loading";

interface ErrorType {
    reason: string
}

interface UnbanUserProps{
    user: string;
}

const UnbanUser:React.FC<UnbanUserProps> = ({user}) => {

    const { currentChannel } = useChannelProviderContext()
    const { currentChannelMod, owner, txMessageBan, setTxMessageBan } = useUserProviderContext()
    const { alphaPING, signer } = useEtherProviderContext()

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const handleClick = async (e:MouseEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try{
            if(
                currentChannel && 
                currentChannel.id !== undefined &&
                (
                    currentChannelMod === true ||
                    owner === true
                )
            ){
                const tx = await alphaPING?.connect(signer).channelUnban(user, currentChannel?.id)
                await tx?.wait()
                console.log(tx?.hash)
                setTxMessageBan(tx?.hash)
            }
        }catch(error: unknown){
            if((error as ErrorType).reason)
            setError((error as ErrorType).reason)
        }finally{
            setLoading(false)
            console.log(txMessageBan)
        }
    }

    return(
        <>
            <button 
                className="ban-button"
                onClick={(e) => handleClick(e)}
            >
                Unban
            </button>
            {
                loading &&
                    <Loading/>
            }
            {
                error !== null &&
                    <p>{error}</p>
            }
        </>
    )
}

export default UnbanUser;