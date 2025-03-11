'use client';

import React, {
    useState,
    ChangeEvent
} from "react"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { 
    Dialog, 
    DialogTrigger, 
    DialogContent, 
    DialogDescription, 
    DialogTitle, 
    DialogHeader, 
    DialogFooter 
} from "@/components/components/ui/dialog";
import { Button } from "@/components/components/ui/button";
import { FilePlus2 } from "lucide-react";

interface MessageAttachmentsProps {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    inputRef: React.RefObject<HTMLInputElement>;
}

interface Emoji {
    native: string
}

const MessageAttachments: React.FC<MessageAttachmentsProps> = ({ message, setMessage, inputRef }) => {

    const [open, setOpen] = useState<boolean>(false)
    const [selectedOption, setSelectedOption] = useState<string>('emoji')
    const [imageUrl, setImageUrl] = useState<string>('')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [duneURL, setDuneURL] = useState<string>('')
    const [duneSrc, setDuneSrc] = useState<string>('');

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
            setSelectedOption('emoji')
            inputRef.current?.focus();
        }
    }

    const handleDuneUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value
        setDuneURL(url)
        const srcIndex = url.indexOf("src=");
        if (srcIndex !== -1) {
            const src = url.slice(srcIndex + 5).replace(/"/g, ''); // Extract the src part and remove quotes
            setDuneSrc(src);
        }
    }

    const handleAddDuneUrl = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); 
        if (duneURL) {
            setMessage(message + `${duneURL}`)
            setDuneURL('')
            setSelectedOption('emoji')
            inputRef.current?.focus();
        }
    }

    return(
        <Dialog
            open={open} 
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button 
                    type="button" 
                    className="w-[36px] h-[36px] border-accent"
                    variant={"outline"}
                >
                    <FilePlus2/>
                </Button>
            </DialogTrigger>
            <DialogContent>
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
                                            loading="lazy"
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
                                loading="lazy"
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
                                loading="lazy"
                            />
                        </button>
                    </li>
                </ul>
            </DialogContent>
        </Dialog>
    )
}

export default MessageAttachments