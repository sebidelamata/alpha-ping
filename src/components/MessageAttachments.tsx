import React, {
    MouseEventHandler,
    useState,
    useEffect,
    useRef
} from "react"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface MessageAttachmentsProps {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

interface emoji {
    native: string
}

const MessageAttachments: React.FC<MessageAttachmentsProps> = ({ message, setMessage }) => {

    const [active, setActive] = useState<boolean>(false)
    const [selectedOption, setSelectedOption] = useState<string>('emoji')

    const modalRef = useRef<HTMLDivElement>(null);

    const handleClick:MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        setActive(true)
    }

    // handling closing the modal when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setActive(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleEmojiClick = (emoji: emoji) => {
        setMessage(message + emoji.native)
    }

    return(
        <div className="attachments-container">
            <div className="attach-button-container">
                <button 
                    className="attach-button"
                    type="button"
                    onClick={(e) => handleClick(e)}
                >
                +
                </button>
            </div>
            <div 
                ref={modalRef}
                className={
                    active === true ?
                    "attachments-options-container active" :
                    "attachments-options-container"
                }
            >
                <div className="options-container">
                    {
                        selectedOption === "emoji" ?
                        <div className="emoji-keyboard">
                            <Picker data={data} onEmojiSelect={(emoji: emoji) => handleEmojiClick(emoji)} />
                        </div> :
                        <div className="picture-attach">picture</div>
                    }
                </div>
                <ul className="options-list">
                    <li className="emojis">
                        <button
                            onClick={() => setSelectedOption("emoji")}
                            className="emoji-select"
                        >
                            😊
                        </button>
                    </li>
                    <li>
                        <button
                            className="picture-select"
                            onClick={() => setSelectedOption("picture")}
                        >
                            <img src="/picture.svg" alt="add picture" className="picture-icon"/>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default MessageAttachments