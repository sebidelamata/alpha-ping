import React, {
    useState,
    useEffect
} from "react";
import { useSocketProviderContext } from "../../contexts/SocketContext";

interface DeleteMessageProps {
    messageID: string;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const DeleteMessage:React.FC<DeleteMessageProps> = ({messageID, setMessages}) => {

    const { socket } = useSocketProviderContext()


    const [messageDelete, setMessageDelete] = useState<boolean>(false)
    const [messageDeleteLoading, setMessageDeleteLoading] = useState<boolean>(false)
    const [messageDeleteError, setMessageDeleteError] = useState<string>('')

    const deleteMessage = async () => {
        if (socket) {
            socket.emit('deleteMessage', { id: messageID });
        }
    }

    const handleClick = async (e: any): Promise<void> => {
        try{
            e.preventDefault()
            setMessageDeleteLoading(true)
            await deleteMessage()
            setMessages()
        }catch(err: unknown){
            setMessageDeleteError(err.message as string)
        }finally{
            setMessageDeleteLoading(true)
        }
    }

    return(
        <div className="delete-message">
            <button 
                className="delete-message-button"
                onClick={(e) => handleClick(e)}
            >
                Test
            </button>
        </div>
    )
}

export default DeleteMessage;
