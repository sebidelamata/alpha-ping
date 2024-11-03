import React, {
    MouseEventHandler,
    useState,
    useEffect,
    useRef,
    ChangeEvent
} from "react"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface MessageAttachmentsProps {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    inputRef: React.RefObject<HTMLInputElement>;
}

interface Emoji {
    native: string
}

const MessageAttachments: React.FC<MessageAttachmentsProps> = ({ message, setMessage, inputRef }) => {

    const [active, setActive] = useState<boolean>(false)
    const [selectedOption, setSelectedOption] = useState<string>('emoji')
    const [imageUrl, setImageUrl] = useState<string>('')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [duneURL, setDuneURL] = useState<string>('')
    const [dunePreview, setDunePreview] = useState<string | null>(null)
    const [duneSrc, setDuneSrc] = useState<string>('');

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

    const handleEmojiClick = (emoji: Emoji) => {
        setMessage(message + emoji.native)
        inputRef.current?.focus();
    }

    const handleImageUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value
        setImageUrl(url)
        setImagePreview(url)
    }

    const handleAddImageUrl = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); 
        if (imageUrl) {
            setMessage(message + `![image](${imageUrl})`)
            setImageUrl('')
            setImagePreview(null)
            setActive(false)
            setSelectedOption('emoji')
            inputRef.current?.focus();
        }
    }

    const handleDuneUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value
        console.log(url)
        setDuneURL(url)
        const srcIndex = url.indexOf("src=");
        if (srcIndex !== -1) {
            const src = url.slice(srcIndex + 5).replace(/"/g, ''); // Extract the src part and remove quotes
            setDuneSrc(src);
        }
        setDunePreview(duneSrc)
    }

    const handleAddDuneUrl = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); 
        if (duneURL) {
            setMessage(message + `${duneURL}`)
            setDuneURL('')
            setDunePreview(null)
            setActive(false)
            setSelectedOption('emoji')
            inputRef.current?.focus();
        }
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
                            <Picker 
                                data={data} 
                                onEmojiSelect={(emoji: Emoji) => handleEmojiClick(emoji)} 
                            />
                        </div> :
                            selectedOption === "picture" ?
                                <div className="picture-attach">
                                    <input
                                        type="text"
                                        placeholder="Paste image URL"
                                        value={imageUrl}
                                        onChange={handleImageUrlChange}
                                    />
                                    {
                                        imagePreview !== null && 
                                        <img 
                                            src={imagePreview} 
                                            alt="Image preview" 
                                            className="image-preview" 
                                        />
                                    }
                                    <button 
                                        onClick={(e) => handleAddImageUrl(e)}
                                    >
                                        Add Image
                                    </button>
                                </div> :
                                <div className="dune-attach">
                                    <input
                                        type="text"
                                        placeholder="Paste Dune Embed Link"
                                        value={duneURL}
                                        onChange={handleDuneUrlChange}
                                    />
                                    {
                                        duneSrc !== null && 
                                        <iframe
                                                src={duneSrc}
                                                title="Dune Preview"
                                                className="dune-preview"
                                        />
                                    }
                                    <button 
                                        onClick={(e) => handleAddDuneUrl(e)}
                                    >
                                        Add Dune Embed Link
                                    </button>
                                </div>
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
                    <li className="pictures">
                        <button
                            className="picture-select"
                            onClick={() => setSelectedOption("picture")}
                        >
                            <img 
                                src="/picture.svg" 
                                alt="add picture" 
                                className="picture-icon"
                            />
                        </button>
                    </li>
                    <li className="dune-analytics">
                        <button 
                            className="dune-select"
                            onClick={() => setSelectedOption('dune')}
                        >
                            <img 
                                src="https://dune.com/assets/DuneLogoCircle.svg" 
                                alt="Dune Analytics Icon" 
                                className="dune-icon"
                            />
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default MessageAttachments