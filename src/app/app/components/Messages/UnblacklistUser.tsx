'use client';

import React, 
    { 
        useState,
        MouseEvent 
    } from "react";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import Loading from "../Loading";

interface ErrorType {
    reason: string
}

interface UnblacklistUserProps{
    user: string;
}

const UnblacklistUser:React.FC<UnblacklistUserProps> = ({user}) => {

    const { owner, txMessageBlacklist, setTxMessageBlacklist } = useUserProviderContext()
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
                const tx = await alphaPING?.connect(signer).unBlacklistUser(user)
                await tx?.wait()
                console.log(tx?.hash)
                setTxMessageBlacklist(tx?.hash)
            }
        }catch(error: unknown){
            if((error as ErrorType).reason)
            setError((error as ErrorType).reason)
        }finally{
            setLoading(false)
            console.log(txMessageBlacklist)
        }
    }

    return(
        <>
            <button 
                className="blacklist-button"
                onClick={(e) => handleClick(e)}
            >
                Unblacklist
                
            </button>
            {
                loading &&
                    <Loading/>
            }
        </>
    )
}

export default UnblacklistUser;