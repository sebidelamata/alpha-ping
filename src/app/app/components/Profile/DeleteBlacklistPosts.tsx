'use client';

import React, {
    useState,
    MouseEvent,
    FormEvent
} from "react";
import Loading from "../Loading";
import { useSocketProviderContext } from "../../../../contexts/SocketContext";

interface DeleteBlacklistPostsProps{
    user: string;
}

const DeleteBlacklistPosts:React.FC<DeleteBlacklistPostsProps> = ({ user }) => {

    const { socket } = useSocketProviderContext()

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
        setLoading(true)
        e.preventDefault()
        if (!socket) {
            return
        }
        try{
            if(user && user !== undefined){
                socket.emit('delete messages by author', { user });
            }
        }catch(error: unknown){
            setError((error as Error).message)
        }finally{
            setLoading(false)
        }

    }

    return(
        <div className="delete-all-messages-container">
            {
                showModal === false &&
                <button
                    onClick={(e) => handleClick(e)}
                    className="blacklist-delete-posts-button"
                >
                    Delete All User Posts
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

export default DeleteBlacklistPosts