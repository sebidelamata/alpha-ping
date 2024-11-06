import React, {
    useState,
    MouseEvent
} from "react";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import unfollow from '/unfollow.svg'
import Loading from "../Loading";

interface ErrorType{
    message: string;
}

interface UnfollowUserProps{
    account: string;
}

const UnfollowUser:React.FC<UnfollowUserProps> = ({account}) => {

    const { alphaPING, signer } = useEtherProviderContext()

    const [followLoading, setFollowLoading] = useState<boolean>(false)
    const [followError, setFollowError] = useState<string | null | undefined>(null)

    const handleClick = async (e:MouseEvent) => {
        e.preventDefault()
        setFollowError(null)
        setFollowLoading(true)
        try{
            const tx = await alphaPING?.connect(signer).removeFromPersonalFollowList(account)
            await tx?.wait()
            console.log(tx?.hash)
            //setTxMessageBlacklist(tx?.hash)
        }catch(error: unknown){
            if((error as ErrorType).message)
                setFollowError((error as ErrorType).message)
        }finally{
            setFollowLoading(false)
            //console.log(txMessageBlacklist)
        }
    }


    return(
        <div className="unfollowing-container">
            <img 
                src={unfollow} 
                alt="unfollow-user" 
                className="unfollow-user-icon" 
                onClick={(e) => handleClick(e)}
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

export default UnfollowUser