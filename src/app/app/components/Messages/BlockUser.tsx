'use client';

import React, 
    { 
        useState,
        MouseEvent 
    } from "react";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import Loading from "../Loading";
import block from '/block.svg'

interface ErrorType {
    reason: string
}

interface BlockUserProps{
    user: string;
}

const BlockUser:React.FC<BlockUserProps> = ({user}) => {

    const { setTxMessageBlock } = useUserProviderContext()
    const { alphaPING, signer } = useEtherProviderContext()

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const handleClick = async (e:MouseEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try{
            const tx = await alphaPING?.connect(signer).addToPersonalBlockList(user)
            await tx?.wait()
            console.log(tx?.hash)
            setTxMessageBlock(tx?.hash)
        }catch(error: unknown){
            if((error as ErrorType).reason)
            setError((error as ErrorType).reason)
        }finally{
            setLoading(false)
        }
    }

    return(
        <div className="block-container">
            <img 
                src={block} 
                alt="block-user" 
                className="block-user-icon" 
                onClick={(e) => handleClick(e)}
            />
            {
                loading &&
                    <Loading/>
            }
            {
                error &&
                <p>{error}</p>
            }
        </div>
    )
}

export default BlockUser;