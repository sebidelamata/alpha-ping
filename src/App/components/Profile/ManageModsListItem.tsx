import React, {
    useState,
    useEffect,
    MouseEvent,
    FormEvent
} from "react";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import monkey from '/monkey.svg'
import Loading from "../Loading";

interface ManageModsListItemProps{
    mod: string | undefined
}

interface ErrorType{
    message: string;
}

const ManageModsListItem:React.FC<ManageModsListItemProps> = ({mod}) => {

    const { alphaPING } = useEtherProviderContext()

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
        setTxMessageUnblacklist(null)
        setLoading(true)
        try{
            if(mod && mod !== undefined){
                const tx = await alphaPING?.connect(signer).banMod(mod)
                await tx?.wait()
                setTxMessageUnblacklist(tx?.hash)
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
        if(mod === undefined){
            console.error('Mod is undefined!')
            return
        }
        try{
            const usernameResult = await alphaPING?.username(mod) || null
            setUsername(usernameResult)
            const pfpResult = await alphaPING?.profilePic(mod) || null
            setUserPFP(pfpResult)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchUserMetaData()
    }, [mod])

    return(
        <div className="manage-mods-list-item-container">
             <div className="blacklisted-pfp">
                {
                    (userPFP !== null && userPFP !== '') ?
                    <img src={userPFP} alt="User Icon" className='monkey-icon'/> :
                    <img src={monkey} alt="User Icon" className='monkey-icon'/>
                }
            </div>
            <div className="blacklisted-username">
                {
                    (username !== null && username !== '') ?
                    username :
                    mod?.slice(0, 6) + '...' + mod?.slice(38, 42)
                }
            </div>
            {
                showModal === false &&
                    <button
                        onClick={(e) => handleClick(e)}
                        className="blacklist-pardon-button"
                    >
                        Pardon User
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

export default ManageModsListItem