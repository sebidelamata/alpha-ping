import React, {
    useState
} from "react";
import { useSocketProviderContext } from "../../contexts/SocketContext";

interface DeleteMessageProps {
    messageID: string;
}

const DeleteMessage:React.FC<DeleteMessageProps> = ({messageID}) => {

    const { socket } = useSocketProviderContext()

    const [messageDeleteLoading, setMessageDeleteLoading] = useState<boolean>(false)
    const [messageDeleteError, setMessageDeleteError] = useState<string>('')

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault()
        if (!socket) {
            return
        }
        try {
            socket.emit('delete message', { id: messageID });
        } catch (err: unknown) {
            setMessageDeleteError((err as Error).message);
        } finally {
            setMessageDeleteLoading(false);
        }
    }

    return(
        <div className="delete-message">
            <button 
                className="delete-message-button"
                onClick={(e) => handleClick(e)}
            >
                {messageDeleteLoading ? 'Deleting...' : 'Delete'}
            </button>
            {messageDeleteError && <p className="error-message">{messageDeleteError}</p>}
        </div>
    )
}

export default DeleteMessage;
