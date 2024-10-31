import React, {
    useState,
    FormEvent,
    MouseEvent
} from "react";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import { useUserProviderContext } from "../../contexts/UserContext";
import { AlphaPING } from "../../../typechain-types/contracts/AlphaPING.sol/AlphaPING";
import Loading from "../Loading";

interface ErrorType {
    reason: string
}

interface ModBannerListItemProps{
    channel: AlphaPING.ChannelStructOutput;
    txMessageMod: string | null | undefined; 
    setTxMessageMod: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

const ModBannerListItem:React.FC<ModBannerListItemProps> = ({
    channel, 
    txMessageMod, 
    setTxMessageMod
}) => {

    const { alphaPING, signer } = useEtherProviderContext()
    const { mod, setMod } = useUserProviderContext()

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
            if(channel && channel.id !== undefined){
                const tx = await alphaPING?.connect(signer).transferMod(value, channel?.id)
                await tx?.wait()
                console.log(tx?.hash)
                setTxMessageMod(tx?.hash)
                const updatedMod = mod.filter(item => item.id !== channel?.id);
                setMod(updatedMod)
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
        <div className="mod-banner-li">
            <h4 className="mod-banner-li-title">
                {
                    channel &&
                    channel?.name
                }
            </h4>
            {
                showModal === false &&
                    <button
                        onClick={(e) => handleClick(e)}
                        className="mod-banner-button"
                    >
                        {`Transfer Mod Role`}
                    </button>
            }
            {
                showModal === true &&
                <form 
                    action=""
                    onSubmit={(e) => handleSubmit(e)}
                    className="mod-banner-form"
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

export default ModBannerListItem