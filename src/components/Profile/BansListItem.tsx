import React, {
    useState,
    MouseEvent
} from "react";
import { AlphaPING } from "../../../typechain-types/contracts/AlphaPING.sol/AlphaPING";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import { useUserProviderContext } from "../../contexts/UserContext";

interface BansListItemProps{
    ban: string;
    channel: AlphaPING.ChannelStructOutput
}

const BansListItem:React.FC<BansListItemProps> = ({ban, channel}) => {

    const { alphaPING, signer } = useEtherProviderContext()
    const { userUsername } = useUserProviderContext()

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

    return(
        <div className="bans-list-item">
            <a 
            href={`https://arbiscan.io/address/${ban}`}
            className='ban-address'
            target='_blank'
            >
              <h5>
              {
                (userUsername !== null && userUsername !== '') ?
                userUsername :
                ban.slice(0, 6) + '...' + ban.slice(38, 42)
              }
              </h5>
            </a>
            {
                showModal === false &&
                    <button
                        onClick={(e) => handleClick(e)}
                        className="owner-banner-button"
                    >
                        Unban
                    </button>
            }
            {/* {
                showModal === true &&
                <form 
                    action=""
                    onSubmit={(e) => handleSubmit(e)}
                    className="owner-banner-form"
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
            } */}
        </div>
    )
}

export default BansListItem