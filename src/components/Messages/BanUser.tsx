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

interface BanUSerProps{
    user: string;
}

const BanUser:React.FC<BanUSerProps> = ({user}) => {

    const { currentChannel } = useChannelProviderContext()
    const { mod, owner } = useUserProviderContext()
    const { alphaPING, signer } = useEtherProviderContext()

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [txMessageBan, setTxMessageBan] = useState<string | null | undefined>(null)

    const handleClick = async (e:MouseEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try{
            if(
                currentChannel && 
                currentChannel.id !== undefined &&
                (
                    mod === true ||
                    owner === true
                )
            ){
                const tx = await alphaPING?.connect(signer).channelBan(user, currentChannel?.id)
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
                Ban User
            </button>
            {
                loading &&
                    <Loading/>
            }
        </>
    )
}

export default BanUser