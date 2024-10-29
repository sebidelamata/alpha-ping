import React,
{ 
    useState, 
    MouseEvent, 
    FormEvent 
} from "react";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import { useUserProviderContext } from "../../contexts/UserContext";
import Loading from "../Loading";

interface ErrorType {
    reason: string
}

interface OwnerBannerProps{
    txMessageOwner: string | null | undefined; 
    setTxMessageOwner: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

const OwnerBanner:React.FC<OwnerBannerProps> = ({txMessageOwner, setTxMessageOwner}) => {

    const { alphaPING, signer } = useEtherProviderContext()
    const { setOwner } = useUserProviderContext()

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
        const value = e.target.newOwner.value
        setError(null)
        setTxMessageOwner(null)
        setLoading(true)
        try{
            const tx = await alphaPING?.connect(signer).transferOwner(value)
            await tx?.wait()
            console.log(tx?.hash)
            setTxMessageOwner(tx?.hash)
            setOwner(value)
        }catch(error: unknown){
            if((error as ErrorType).reason)
            setError((error as ErrorType).reason)
        }finally{
            setLoading(false)
            console.log(txMessageOwner)
        }

    }

    return(
        <div>
            <h3>You currently have Owner admin role.</h3>
            <button
                onClick={(e) => handleClick(e)}
            >Transfer Owner Role</button>
            {
                showModal === true &&
                <form 
                    action=""
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <label 
                        htmlFor="newOwner"
                    >
                        New Owner
                    </label>
                    <input 
                        type="text" 
                        name="newOwner" 
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

export default OwnerBanner;