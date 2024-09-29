import React, {
    useState,
    useEffect,
    useRef,
    MouseEventHandler
} from "react"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useEtherProviderContext } from "../../contexts/ProviderContext"
import { useSocketProviderContext } from "../../contexts/SocketContext"
import DeleteMessage from "./DeleteMessage"

interface Emoji {
    native: string
}

interface MessageHoverOptionsProps {
    message: Message;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
    setReplyId: React.Dispatch<React.SetStateAction<number | null>>;
}

const MessageHoverOptions: React.FC<MessageHoverOptionsProps> = ({message, setMessages, setReplyId}) => {

    const { socket } = useSocketProviderContext()

    const { signer } = useEtherProviderContext()

    if (!signer) {
        throw new Error("Signer is not defined");
    }

    const modalRef = useRef<HTMLLIElement>(null);

    const handleClick:MouseEventHandler<HTMLLIElement> = (e) => {
        e.preventDefault()
        setShowEmojiKeyboard(true)
    }

    const [address, setAddress] = useState<string | null>(null)
    const [showEmojiKeyboard, setShowEmojiKeyboard] = useState<boolean>(false)

    const handleEmojiClick = (emoji: Emoji) => {
        if (!emoji || !emoji.native) {
            console.error("Invalid emoji selected:", emoji);
            return;
        }
        console.log(message.reactions)
        const emojiReactions = message.reactions && message.reactions[emoji.native] || [];
        const signerIndex = emojiReactions.findIndex((s: string) => s === address);

        let newEmojiReactions;
        if (signerIndex > -1) {
            newEmojiReactions = [
                ...emojiReactions.slice(0, signerIndex),
                ...emojiReactions.slice(signerIndex + 1),
            ];
        } else {
            newEmojiReactions = [...emojiReactions, address];
        }

        const newReactions = {
            ...message.reactions,
            [emoji.native]: newEmojiReactions,
        };
        
        if(socket !== null){
            socket.emit('update reactions', { messageId: message.id, reactions: newReactions });
        }
    };

    const handleReplyClick = () => {
        setReplyId(message.id)
        const inputField = document.getElementById('message-form-input')
        inputField?.focus()
    }
    
    // handling closing the modal when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowEmojiKeyboard(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchAddress = async () => {
        const address = await signer.getAddress()
        setAddress(address)
    }
    useEffect(() => {
        if(signer){
            fetchAddress()
        }
    }, [signer])

    return(
            <>
                <ul className="message-hover-options">
                    <li 
                        className="emoji-reply"
                        ref={modalRef}
                        onClick={handleClick}
                    >
                        😊
                        {
                            showEmojiKeyboard === true &&
                            <div className="emoji-reaction">
                                <Picker 
                                    data={data} 
                                    onEmojiSelect={(emoji: Emoji) => handleEmojiClick(emoji)} 
                                />
                            </div>
                        }
                    </li>
                    <li 
                        className="text-reply"
                        onClick={() => handleReplyClick()}    
                    >
                        <img src="/reply.svg" alt="text reply" className="text-reply"/>
                    </li>
                    <li className="delete-message-container">
                        <DeleteMessage
                            messageID={message.id as unknown as string}
                            setMessages={setMessages}
                        />
                    </li>
                </ul>
            </>
    )
}

export default MessageHoverOptions