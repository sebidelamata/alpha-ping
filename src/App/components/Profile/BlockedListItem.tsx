import React, {
    useState,
    useEffect,
    MouseEvent,
    FormEvent
} from "react";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import { useUserProviderContext } from "../../contexts/UserContext";
import monkey from '/monkey.svg'
import Loading from "../Loading";

interface BlockedListItemProps{
    block: string;
}

interface ErrorType{
    message: string;
}

const BlockedListItem:React.FC<BlockedListItemProps> = ({block}) => {


    const { alphaPING, signer } = useEtherProviderContext()
    const { setTxMessageBlock } = useUserProviderContext()

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
        setTxMessageBlock(null)
        setLoading(true)
        try{
            if(block && block !== undefined){
                const tx = await alphaPING?.connect(signer).removeFromPersonalBlockList(block)
                await tx?.wait()
                setTxMessageBlock(tx?.hash)
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
            const usernameResult = await alphaPING?.username(block) || null
            setUsername(usernameResult)
            const pfpResult = await alphaPING?.profilePic(block) || null
            setUserPFP(pfpResult)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchUserMetaData()
    }, [block])

    return(
        <div className="block-list-item-container">
            <div className="block-pfp">
                {
                    (userPFP !== null && userPFP !== '') ?
                    <img src={userPFP} alt="User Icon" className='monkey-icon'/> :
                    <img src={monkey} alt="User Icon" className='monkey-icon'/>
                }
            </div>
            <div className="block-username">
                {
                    (username !== null && username !== '') ?
                    username :
                    block.slice(0, 6) + '...' + block.slice(38, 42)
                }
            </div>
            {
                showModal === false &&
                    <button
                        onClick={(e) => handleClick(e)}
                        className="block-list-unblock-button"
                    >
                        Unblock
                    </button>
            }
            {
                showModal === true &&
                <form 
                    action=""
                    onSubmit={(e) => handleSubmit(e)}
                    className="unblock-form"
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

export default BlockedListItem;