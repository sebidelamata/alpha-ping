import React, {
    useState,
    useEffect,
    MouseEvent,
    FormEvent
} from "react";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import { useUserProviderContext } from "../../contexts/UserContext";
import monkey from '/monkey.svg'
import Loading from "../../../components/Loading";

interface FollowingListItemProps{
    follow: string;
}

interface ErrorType{
    message: string;
}

const FollowingListItem:React.FC<FollowingListItemProps> = ({follow}) => {


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
            if(follow && follow !== undefined){
                const tx = await alphaPING?.connect(signer).removeFromPersonalFollowList(follow)
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

    const [username, setUsername] = useState<string | null>(null)
    const [userPFP, setUserPFP] = useState<string | null>(null)
    const fetchUserMetaData = async () => {
        try{
            const usernameResult = await alphaPING?.username(follow) || null
            setUsername(usernameResult)
            const pfpResult = await alphaPING?.profilePic(follow) || null
            setUserPFP(pfpResult)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchUserMetaData()
    }, [follow])

    return(
        <div className="follow-list-item-container">
            <div className="follow-pfp">
                {
                    (userPFP !== null && userPFP !== '') ?
                    <img src={userPFP} alt="User Icon" className='monkey-icon'/> :
                    <img src={monkey} alt="User Icon" className='monkey-icon'/>
                }
            </div>
            <div className="follow-username">
                {
                    (username !== null && username !== '') ?
                    username :
                    follow.slice(0, 6) + '...' + follow.slice(38, 42)
                }
            </div>
            {
                showModal === false &&
                    <button
                        onClick={(e) => handleClick(e)}
                        className="followlist-unfollow-button"
                    >
                        Unfollow
                    </button>
            }
            {
                showModal === true &&
                <form 
                    action=""
                    onSubmit={(e) => handleSubmit(e)}
                    className="pardon-form"
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

export default FollowingListItem