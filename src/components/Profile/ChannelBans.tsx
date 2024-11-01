import React, {
    useState,
    useEffect
} from "react";
import { AlphaPING } from "../../../typechain-types/contracts/AlphaPING.sol/AlphaPING";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import { useMessagesProviderContext } from "../../contexts/MessagesContext";
import Loading from "../Loading";
import BansListItem from "./BansListItem";

interface ErrorType {
    reason: string
}

interface ChannelBansProps{
    channel: AlphaPING.ChannelStructOutput;
}

const ChannelBans:React.FC<ChannelBansProps> = ({channel}) => {

    const { alphaPING } = useEtherProviderContext()
    const { messages } = useMessagesProviderContext()

    //hold tx message for a ban
    const [txMessageUnban, setTxMessageUnban] = useState<string | null | undefined>(null)

    const [showBans, setShowBans] = useState<boolean>(false)
    const handleClick = () => {
        setShowBans(!showBans)
    }

    const [channelAuthors, setChannelAuthors] = useState<string[]>([])
    const getChannelAuthors = () => {
        if(showBans === true){
            const authors = Array.from(
                new Set (
                    messages
                        .filter((message) => {
                            return message.channel === channel.id.toString()
                        })
                        .map((message) => {
                            return message.account
                        })
                )
            )
            setChannelAuthors(authors)
        }
    }
    useEffect(() => {
        getChannelAuthors()
    }, [messages, showBans])

    const [channelBans, setChannelBans] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const getChannelBans = async () => {
        if(showBans === true){
            try{
                if(channel && channel.id !== undefined){
                    const result = await Promise.all(
                            channelAuthors.map(async (author) => {
                            return alphaPING?.channelBans(channel?.id, author)
                        })
                    )
                    const authors = channelAuthors.filter((author, index) => {
                        return result[index] === true
                    })
                    setChannelBans(authors)
                }
            }catch(error: unknown){
                if((error as ErrorType).reason)
                setError((error as ErrorType).reason)
            }finally{
                setLoading(false)
            }
        }
    }
    useEffect(() => {
        getChannelBans()
    }, [showBans, messages, txMessageUnban])

    return(
        <div className="ban-container">
            <h5
                onClick={() => handleClick()}
            >
                Channel Bans {showBans === false ? '>' : ''}
            </h5>
            {
                showBans === true &&
                channelBans.length > 0 &&
                <ul className="bans-list">
                    {
                        channelBans.map((ban) => {
                            return(
                                <li key={ban}>
                                    <BansListItem 
                                        ban={ban}
                                        channel={channel}
                                        txMessageUnban={txMessageUnban}
                                        setTxMessageUnban={setTxMessageUnban}
                                    />
                                </li>
                            )
                        })
                    }
                </ul>
            }
            {
                showBans === true &&
                channelBans.length === 0 &&
                <div className="no-bans-div">
                    The are currently no banned users for this channel.
                </div>
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

export default ChannelBans