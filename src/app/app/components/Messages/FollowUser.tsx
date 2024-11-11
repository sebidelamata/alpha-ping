'use client';

import React, {
    useState,
    MouseEvent
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import Loading from "../Loading";

interface ErrorType{
    message: string;
}

interface FollowUserProps{
    account: string;
}

const FollowUser:React.FC<FollowUserProps> = ({account}) => {

    const { alphaPING, signer } = useEtherProviderContext()
    const { setTxMessageFollow } = useUserProviderContext()

    const [followLoading, setFollowLoading] = useState<boolean>(false)
    const [followError, setFollowError] = useState<string | null | undefined>(null)

    const handleClick = async (e:MouseEvent) => {
        e.preventDefault()
        setFollowError(null)
        setFollowLoading(true)
        try{
            const tx = await alphaPING?.connect(signer).addToPersonalFollowList(account)
            await tx?.wait()
            console.log(tx?.hash)
            setTxMessageFollow(tx?.hash)
        }catch(error: unknown){
            if((error as ErrorType).message)
                setFollowError((error as ErrorType).message)
        }finally{
            setFollowLoading(false)
        }
    }


    return(
        <div className="following-container">
            <img 
                src='/follow.svg' 
                alt="follow-user" 
                className="follow-user-icon" 
                onClick={(e) => handleClick(e)}
                loading="lazy"
            />
            {
                followLoading &&
                <Loading/>
            }
            {
                followError &&
                <p>{followError}</p>
            }
        </div>  
    )
}

export default FollowUser