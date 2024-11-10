import React, 
    { 
        useState,
        MouseEvent 
    } from "react";
import { useUserProviderContext } from "../../contexts/UserContext";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import Loading from "../../../components/Loading";

interface ErrorType {
    reason: string
}

interface BlacklistUserProps{
    user: string;
}

const BlacklistUser:React.FC<BlacklistUserProps> = ({user}) => {

    const { owner, setTxMessageBlacklist } = useUserProviderContext()
    const { alphaPING, signer } = useEtherProviderContext()

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const handleClick = async (e:MouseEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try{
            if(
                owner === true
            ){
                const tx = await alphaPING?.connect(signer).blacklistUser(user)
                await tx?.wait()
                console.log(tx?.hash)
                setTxMessageBlacklist(tx?.hash)
            }
        }catch(error: unknown){
            if((error as ErrorType).reason)
            setError((error as ErrorType).reason)
        }finally{
            setLoading(false)
        }
    }

    return(
        <>
            <button 
                className="blacklist-button"
                onClick={(e) => handleClick(e)}
            >
                Blacklist
                
            </button>
            {
                loading &&
                    <Loading/>
            }
            {
                error &&
                <p>{error}</p>
            }
        </>
    )
}

export default BlacklistUser;