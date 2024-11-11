'use client';

import React, {
    useState,
    useEffect,
    MouseEvent,
    FormEvent
} from "react";
import { AlphaPING } from "../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import Loading from "../Loading";
import monkey from '/monkey.svg'

interface ErrorType {
    reason: string
}

interface BansListItemProps{
    ban: string;
    channel: AlphaPING.ChannelStructOutput;
    setTxMessageUnban: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

const BansListItem:React.FC<BansListItemProps> = ({
    ban, 
    channel, 
    setTxMessageUnban
}) => {

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
        setTxMessageUnban(null)
        setLoading(true)
        try{
            if(channel && channel.id !== undefined){
                const tx = await alphaPING?.connect(signer).channelUnban(ban, channel?.id)
                await tx?.wait()
                setTxMessageUnban(tx?.hash)
            }
        }catch(error: unknown){
            if((error as ErrorType).reason)
            setError((error as ErrorType).reason)
        }finally{
            setLoading(false)
        }

    }

    const [username, setUsername] = useState<string | null>(null)
    const [userPFP, setUserPFP] = useState<string | null>(null)
    const fetchUserMetaData = async () => {
        try{
            const usernameResult = await alphaPING?.username(ban) || null
            setUsername(usernameResult)
            const pfpResult = await alphaPING?.profilePic(ban) || null
            setUserPFP(pfpResult)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchUserMetaData()
    }, [ban])

    return(
        <div className="bans-list-item">
            <div className="blacklisted-pfp">
                {
                    (userPFP !== null && userPFP !== '') ?
                    <img src={userPFP} alt="User Icon" className='monkey-icon'/> :
                    <img src={monkey} alt="User Icon" className='monkey-icon'/>
                }
            </div>
            <a 
            href={`https://arbiscan.io/address/${ban}`}
            className='ban-address'
            target='_blank'
            >
              <h5>
              {
                (username !== null && username !== '') ?
                username :
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
            {
                showModal === true &&
                <form 
                    action=""
                    onSubmit={(e) => handleSubmit(e)}
                    className="unban-form"
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

export default BansListItem