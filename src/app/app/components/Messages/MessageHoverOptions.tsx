'use client';

import React, {
    useState,
    useEffect,
    useRef,
    MouseEventHandler
} from "react"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useEtherProviderContext } from "../../../../contexts/ProviderContext"
import { useSocketProviderContext } from "../../../../contexts/SocketContext"
import { useUserProviderContext } from "../../../../contexts/UserContext"
import DeleteMessage from "./DeleteMessage"
import { Button } from "@/components/components/ui/button";
import { Reply } from "lucide-react";
import { Message } from "src/types/global";

interface Emoji {
    native: string
}

interface MessageHoverOptionsProps {
    message: Message;
    setReplyId: React.Dispatch<React.SetStateAction<string | null>>;
}

const MessageHoverOptions: React.FC<MessageHoverOptionsProps> = ({
    message, 
    setReplyId
}) => {

    const { socket } = useSocketProviderContext()

    const { signer } = useEtherProviderContext()

    const {
        owner,
        mod,
        banned,
        blacklisted,
        author
    } = useUserProviderContext()

    if (!signer) {
        throw new Error("Signer is not defined");
    }

    // check if user is the author of this message
    const [isAuthor, setIsAuthor] = useState<boolean>(false)
    useEffect(() => {
        const findIsAuthor = (): void => {
            const authored = author.some((a) => (
                a.toString() === message._id.toString()
            ))
            setIsAuthor(authored)
        }
        findIsAuthor()
    }, [message, author])

    const modalRef = useRef<HTMLLIElement>(null);

    const handleClick:MouseEventHandler<HTMLButtonElement> = (e) => {
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
            socket.emit('update reactions', { messageId: message._id, reactions: newReactions });
        }
    };

    const handleReplyClick = () => {
        setReplyId(message._id)
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

    useEffect(() => {
        const fetchAddress = async () => {
            const address = await signer.getAddress()
            setAddress(address)
        }
        if(signer){
            fetchAddress()
        }
    }, [signer])

    return(
        <ul className="flex flex-wrap gap-4 justify-center items-center border-accent-1 border-solid">
            <li 
                ref={modalRef}
            >
                <Button
                    onClick={handleClick}
                    variant={"ghost"}
                >
                    😊
                    {
                        showEmojiKeyboard === true &&
                        <div className="flex absolute right-[50%] top-[50%]">
                            <Picker 
                                data={data} 
                                onEmojiSelect={(emoji: Emoji) => handleEmojiClick(emoji)} 
                            />
                        </div>
                    }
                </Button>
            </li>
            <li >
                <Button
                    variant={"ghost"}
                    onClick={() => handleReplyClick()}  
                >
                    <Reply className="text-secondary"/>
                </Button>
            </li>
            {
                (
                    owner === true ||
                    (mod && mod.length > 0) ||
                    isAuthor === true
                ) &&
                banned === false &&
                blacklisted === false &&
                <li>
                        <DeleteMessage
                            messageID={message._id as unknown as string}
                        />
                </li>
            }
        </ul>
    )
}

export default MessageHoverOptions