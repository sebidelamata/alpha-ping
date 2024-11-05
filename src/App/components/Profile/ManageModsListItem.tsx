import React, {
    useState,
    useEffect,
    MouseEvent,
    FormEvent
} from "react";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import monkey from '/monkey.svg'
import Loading from "../Loading";
import { AddressLike } from "ethers";

interface ManageModsListItemProps{
    mod: { [mod: string]: number[] }
}

interface ErrorType{
    message: string;
}

const ManageModsListItem:React.FC<ManageModsListItemProps> = ({mod}) => {

    const { alphaPING, signer } = useEtherProviderContext()

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
        //setTxMessageUnblacklist(null)
        setLoading(true)
        try{
            if(mod && mod !== undefined){
                const tx = await alphaPING?.connect(signer).banMod(Object.keys(mod)[0] as unknown as AddressLike, Object.values(mod)[0])
                await tx?.wait()
                //setTxMessageUnblacklist(tx?.hash)
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
    const [channelNames, setChannelNames] = useState<(string | null)[]>([])
    const fetchUserMetaData = async () => {
        if(mod === undefined){
            console.error('Mod is undefined!')
            return
        }
        try{
            const usernameResult = await alphaPING?.username(Object.keys(mod)[0]) || null
            setUsername(usernameResult)
            const pfpResult = await alphaPING?.profilePic(Object.keys(mod)[0]) || null
            setUserPFP(pfpResult)
            const fetchedNames:string[] = []
            for(let i=0; i<Object.values(mod)[0].length; i++){
                const result = await alphaPING?.getChannel(Object.values(mod)[0][i])
                const channelname = result?.name || ''
                fetchedNames.push(channelname)
            }
            setChannelNames(fetchedNames)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchUserMetaData()
    }, [mod])

    return(
        <div className="manage-mods-list-item-container">
             <div className="ban-mod-pfp">
                {
                    (userPFP !== null && userPFP !== '') ?
                    <img src={userPFP} alt="User Icon" className='monkey-icon'/> :
                    <img src={monkey} alt="User Icon" className='monkey-icon'/>
                }
            </div>
            <div className="ban-mod-username">
                {
                    (username !== null && username !== '') ?
                    username :
                    Object.keys(mod)[0].slice(0, 6) + '...' + Object.keys(mod)[0].slice(38, 42)
                }
            </div>
            <div className="mod-for">
                Mod For:
            </div>
            <ul className="ban-mod-channels-list">
                {
                    channelNames.map((name) => {
                        return(
                            <li key={name}>
                                {name}
                            </li>
                        )
                    })
                }
            </ul>
            {
                showModal === false &&
                    <button
                        onClick={(e) => handleClick(e)}
                        className="blacklist-pardon-button"
                    >
                        Ban Mod
                    </button>
            }
            {
                showModal === true &&
                <form 
                    action=""
                    onSubmit={(e) => handleSubmit(e)}
                    className="ban-mod-form"
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