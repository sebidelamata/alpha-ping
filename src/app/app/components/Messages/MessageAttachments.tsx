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
} from "@/components/components/ui/dialog";
import { 
    Card, 
    CardContent, 
    CardDescription,
    CardHeader, 
    CardTitle
} from "@/components/components/ui/card";
import { Button } from "@/components/components/ui/button";
import { FilePlus2 } from "lucide-react";
import { 
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger 
} from "@/components/components/ui/tabs";
import { Image as ImageIcon } from "lucide-react";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
import { Input } from "@/components/components/ui/input";
import { Plus, SmilePlus } from "lucide-react";

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
                <Card className="bg-primary text-secondary">
                    <CardContent>
                        <CardHeader>
                            <Tabs defaultValue="emoji" className="w-[400px] gap-8">
                                <TabsList className="grid w-full grid-cols-3 bg-primary text-secondary">
                                    <TabsTrigger value="emoji">
                                        <SmilePlus/>
                                    </TabsTrigger> 
                                    <TabsTrigger value="picture">
                                        <ImageIcon/>
                                    </TabsTrigger> 
                                    <TabsTrigger value="dune">
                                        <Avatar className="h-[24px] w-[24px]">
                                            <AvatarImage
                                                src="https://dune.com/assets/DuneLogoCircle.svg" 
                                                alt="Dune Analytics Icon" 
                                                loading="lazy"
                                            />
                                            <AvatarFallback>
                                                Dune
                                            </AvatarFallback>
                                        </Avatar>
                                    </TabsTrigger> 
                                </TabsList>
                                <TabsContent 
                                    value="emoji" 
                                    className="flex items-center justify-center relative top-4"
                                >
                                    <Card className="bg-primary text-secondary">
                                        <CardTitle>
                                            Add Emoji
                                        </CardTitle>
                                        <CardContent>
                                            <Picker 
                                                data={data} 
                                                onEmojiSelect={(emoji: Emoji) => handleEmojiClick(emoji)} 
                                            />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="picture">
                                    <Card className="bg-primary text-secondary flex flex-col gap-4">
                                        <CardTitle>
                                            Add Image
                                        </CardTitle>
                                        <CardDescription>
                                            Paste Image URL
                                        </CardDescription>
                                        <CardContent className="flex flex-col w-[400px] gap-4">
                                            <Input
                                                type="text"
                                                placeholder="Paste image URL"
                                                value={imageUrl}
                                                onChange={handleImageUrlChange}
                                            />
                                            {
                                                imagePreview !== null && 
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Image Preview" 
                                                    loading="lazy"
                                                    className="h-[200px] w-[200px]"
                                                />
                                            }
                                            {
                                                imagePreview === null  &&
                                                <ImageIcon className="w-[200px] h-[200px] justify-center items-center align-middle"/>
                                               
                                            }
                                            <Button 
                                                onClick={(e) => handleAddImageUrl(e)}
                                                variant={"outline"}
                                            >
                                               <Plus/>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="dune">
                                    <Card className="bg-primary text-secondary">
                                        <CardHeader>
                                            <CardTitle>
                                                Embed Dune Link
                                            </CardTitle>
                                            <CardDescription>
                                                Paste Dune Embed link here.
                                            </CardDescription>
                                            <CardContent className="flex flex-col w-[400px] gap-4">
                                                <Input
                                                    type="text"
                                                    placeholder='<iframe src="https://dune.com/embeds/..."/>'
                                                    value={duneURL}
                                                    onChange={handleDuneUrlChange}
                                                />
                                                {
                                                    duneSrc !== '' && 
                                                    <iframe
                                                            src={duneSrc}
                                                            title="Dune Preview"
                                                            className="h-[200px] w-[200px]"
                                                    />
                                                }
                                                {
                                                    duneSrc === ''  &&
                                                    <ImageIcon className="w-[200px] h-[200px] justify-center items-center align-middle"/>
                                               
                                                }
                                                <Button 
                                                    onClick={(e) => handleAddDuneUrl(e)}
                                                    variant={"outline"}
                                                >
                                                    <Plus/>
                                                </Button>
                                            </CardContent>
                                        </CardHeader>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </CardHeader>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}

export default MessageAttachments