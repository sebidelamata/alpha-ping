import React, {
    useState,
    MouseEvent
} from "react";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import follow from '/follow.svg'
import Loading from "../Loading";

interface ErrorType{
    message: string;
}

interface FollowUserProps{
    account: string;
}

const FollowUser:React.FC<FollowUserProps> = ({account}) => {

    const { alphaPING, signer } = useEtherProviderContext()

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
        <div className="following-container">
            <img 
                src={follow} 
                alt="follow-user" 
                className="follow-user-icon" 
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

export default FollowUser