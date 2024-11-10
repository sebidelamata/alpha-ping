import React, {
    useState,
    MouseEvent,
    FormEvent
} from "react";
import Loading from "../../../components/Loading";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import { useUserProviderContext } from "../../contexts/UserContext";

interface ErrorType{
    message: string;
}

interface UserFollowsFollowBackProps{
    userFollow: string;
}

const UserFollowsFollowBack:React.FC<UserFollowsFollowBackProps> = ({userFollow}) => {

    const { alphaPING, signer } = useEtherProviderContext()
    const { setTxMessageFollow } = useUserProviderContext()

    const [showModal, setShowModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const handleClick = (e:MouseEvent) => {
        e.preventDefault()
        setShowModal(true)
    }

    const handleCancel = (e:MouseEvent) => {
        e.preventDefault()
        setShowModal(false)
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        setError(null)
        setTxMessageFollow(null)
        setLoading(true)
        try{
            if(userFollow && userFollow !== undefined){
                const tx = await alphaPING?.connect(signer).addToPersonalFollowList(userFollow)
                await tx?.wait()
                setTxMessageFollow(tx?.hash)
            }
        }catch(error: unknown){
            if((error as ErrorType).message)
            setError((error as ErrorType).message)
        }finally{
            setLoading(false)
        }

    }

    return(
        <div className="user-follows-follow-back">
            {
                showModal === false &&
                <button
                    onClick={(e) => handleClick(e)}
                    className="user-followlist-follow-back-button"
                >
                    Follow Back
                </button>
            }
            {
                showModal === true &&
                <form 
                    action=""
                    onSubmit={(e) => handleSubmit(e)}
                    className="follow-back-form"
                >
                    <input 
                        type="submit" 
                    />
                    <button 
                        onClick={(e) => handleCancel(e)}
                    >
                        Cancel
                    </button>
                </form>
            }
            {
                loading === true &&
                    <Loading/>
            }
            {
                error !== null &&
                    <p>{error}</p>
            }
        </div>
    )

}

export default UserFollowsFollowBack