'use client';

import React, {
    useState,
    MouseEvent
} from "react";
import { useSocketProviderContext } from "../../../../contexts/SocketContext";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/components/ui/button";
import { 
    Dialog, 
    DialogTrigger, 
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader
} from "@/components/components/ui/dialog";

interface DeleteMessageProps {
    messageID: string;
}

const DeleteMessage:React.FC<DeleteMessageProps> = ({messageID}) => {

    const { socket } = useSocketProviderContext()

    const [open, setOpen] = useState<boolean>(false)
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
    const handleCancel = (e:MouseEvent) => {
        e.preventDefault()
        setOpen(false)
    }

    return(
        <div className="flex justify-center items-center">
            <Dialog
                open={open} 
                onOpenChange={setOpen}
            >
                <DialogTrigger 
                    asChild 
                    className="flex flex-row"
                >
                    <Button
                    variant={"ghost"}
                    >
                        {
                            messageDeleteLoading ? 
                            'Deleting...' : 
                            <Trash2/>
                        }
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle 
                            className="flex flex-row items-center justify-center gap-4 text-3xl"
                        >
                            Are You Sure You Want to Delete This Message? 
                        </DialogTitle>
                        <Button
                            onClick={(e) => handleClick(e)}
                            variant={"destructive"}
                        >
                            {
                                messageDeleteLoading ? 
                                'Deleting...' : 
                                <Trash2/>
                            }
                        </Button>
                        <Button
                            onClick={(e) => handleCancel(e)}
                            variant={"secondary"}
                        >
                            Cancel
                        </Button>
                        <DialogDescription>
                            Once your message is deleted it can not be undone.
                            {
                                messageDeleteError && 
                                    <p 
                                        className="error-message"
                                    >
                                            {messageDeleteError}
                                    </p>
                            }
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DeleteMessage;
