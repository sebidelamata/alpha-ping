'use client';

import React, {
    useState,
    MouseEvent,
    FormEvent
} from "react";
import Loading from "../Loading";
import { useSocketProviderContext } from "../../../../contexts/SocketContext";
import { 
    Dialog, 
    DialogTrigger, 
    DialogContent, 
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter 
} from '@/components/components/ui/dialog'
import { 
    Button 
} from '@/components/components/ui/button'
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from '@/components/components/ui/avatar'
import Link from 'next/link'

interface DeleteBlacklistPostsProps{
    user: string;
    userPFP: string | null;
    username: string | null;
}

const DeleteBlacklistPosts:React.FC<DeleteBlacklistPostsProps> = ({ 
    user,
    userPFP,
    username
}) => {

    const { socket } = useSocketProviderContext()

    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const handleCancel = (e:MouseEvent) => {
        e.preventDefault()
        setOpen(false)
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
        <Dialog
            open={open} 
            onOpenChange={setOpen}
        >
            <DialogTrigger>
                <Button
                    variant={"destructive"}
                    className="w-[200px]"
                >
                    Delete User Posts
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <span className="flex flex-row gap-1 items-center justify-center">
                            <span className="text-2xl">
                                Delete Posts for
                            </span>
                            {
                                (userPFP !== null && userPFP !== '') ?
                                <Avatar>
                                    <AvatarImage
                                        src={userPFP} 
                                        alt="User Icon" 
                                        loading="lazy"
                                    />
                                    <AvatarFallback>
                                        {user.slice(0,2)}
                                    </AvatarFallback>
                                </Avatar> :
                                <Avatar>
                                    <AvatarImage
                                        src='/monkey.svg' 
                                        alt="User Icon" 
                                        loading="lazy"
                                    />
                                </Avatar>
                            }
                            <Link
                                href={`https://arbiscan.io/address/${user}`} 
                                target="_blank"
                                className="text-accent text-3xl"
                            >
                                {
                                    (username !== null && username !== '') ?
                                    username :
                                    user.slice(0, 6) + '...' + user.slice(38, 42)
                                }
                            </Link>
                            <span className="text-2xl">
                                ?
                            </span>
                        </span>
                    </DialogTitle>
                    <DialogDescription className="flex flex-row items-center justify-center">
                        This will delete all of this blacklisted user's posts.
                    </DialogDescription>
                    <form
                        onSubmit={(e) => handleSubmit(e)}
                        className="flex flex-col items-center justify-center gap-4"
                    >
                        <Button 
                            type="submit"
                            variant="destructive" 
                            className="w-[200px]"
                        >
                            Delete User's Posts
                        </Button>
                        <Button
                            variant="outline"
                            className="w-[200px]"
                            onClick={(e) => handleCancel(e)} 
                        >
                            Cancel
                        </Button>
                    </form>
                </DialogHeader>
                {
                    loading === true &&
                        <Loading/>
                }
                {
                    error !== null &&
                    <DialogFooter className="relative right-3 flex w-full flex-row items-center justify-center pr-16 text-sm text-accent">
                        {
                            error.length > 50 ?
                            `${error.slice(0,50)}...` :
                            error
                        }
                    </DialogFooter>
                }
            </DialogContent>
        </Dialog>
    )
}

export default DeleteBlacklistPosts