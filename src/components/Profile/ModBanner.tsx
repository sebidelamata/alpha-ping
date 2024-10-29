import React,
{ 
    useState, 
    MouseEvent, 
    FormEvent 
} from "react";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import { useUserProviderContext } from "../../contexts/UserContext";
import { useChannelProviderContext } from "../../contexts/ChannelContext";
import Loading from "../Loading";

interface ErrorType {
    reason: string
}

interface ModBannerProps{
    txMessageMod: string | null | undefined; 
    setTxMessageMod: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

const ModBanner:React.FC<ModBannerProps> = ({txMessageMod, setTxMessageMod}) => {

    const { alphaPING, signer } = useEtherProviderContext()
    const { setMod } = useUserProviderContext()
    const { currentChannel } = useChannelProviderContext()

    const [showModal, setShowModal] = useState<boolean>(false)

    const handleClick = (e:MouseEvent) => {
        e.preventDefault()
        setShowModal(true)
    }

    const handleCancel = (e:MouseEvent) => {
        e.preventDefault()
        setShowModal(false)
    }

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        const value = e.target.newMod.value
        setError(null)
        setTxMessageMod(null)
        setLoading(true)
        try{
            if(currentChannel && currentChannel.id !== undefined){
                const tx = await alphaPING?.connect(signer).transferMod(value, currentChannel?.id)
                await tx?.wait()
                console.log(tx?.hash)
                setTxMessageMod(tx?.hash)
                setMod(value)
            }
        }catch(error: unknown){
            if((error as ErrorType).reason)
            setError((error as ErrorType).reason)
        }finally{
            setLoading(false)
            console.log(txMessageMod)
        }

    }

    return(
        <div>
            <h3>
                {
                    `You are currently have Moderator admin role for ${currentChannel?.name.toString()}`
                }
            </h3>
            <button
                onClick={(e) => handleClick(e)}
            >Transfer Mod Role</button>
            {
                showModal === true &&
                <form 
                    action=""
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <label 
                        htmlFor="newMod"
                    >
                        New Mod
                    </label>
                    <input 
                        type="text" 
                        name="newMod" 
                        placeholder="0x..."
                    />
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

export default ModBanner;