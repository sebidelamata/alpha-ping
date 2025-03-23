'use client';

import React, {
    useState,
    MouseEvent,
    FormEvent
} from "react";
import Loading from "../Loading";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { Button } from "@/components/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/components/ui/dialog"
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/components/ui/avatar"
import Link from "next/link";
import { Separator } from "@radix-ui/react-separator";
import { useToast } from "@/components/hooks/use-toast"
import { 
    ShieldCheck, 
    CircleX 
} from "lucide-react";

interface ErrorType{
    message: string;
}

interface UserFollowsUnfollowProps{
    userFollow: string;
    userPFP: string | null;
    username: string | null;
}

const UserFollowsUnfollow:React.FC<UserFollowsUnfollowProps> = ({
    userFollow,
    userPFP,
    username
}) => {
    const { 
        alphaPING, 
        signer 
    } = useEtherProviderContext()
    const { toast } = useToast()

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState<boolean>(false); 
    const [txMessage, setTxMessage] = useState<null | string>(null)

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        try{
            setLoading(true)
            setError(null)
            setTxMessage(null)
            if(userFollow && userFollow !== undefined){
                const tx = await alphaPING?.connect(signer).removeFromPersonalFollowList(userFollow)
                await tx?.wait()
                if(tx !== undefined && tx.hash !== undefined){
                    setTxMessage(tx?.hash)
                }
            }
        }catch(error: unknown){
            if((error as ErrorType).message)
            setError((error as ErrorType).message)
            // display error
            if(error !== null && (error as ErrorType).message !== undefined){
                toast({
                    title: "Transaction Error!",
                    description: (username !== null && username !== '') ?
                        `Unfollow ${username} Not Completed!` :
                        `Unfollow ${userFollow.slice(0, 4)}...${userFollow.slice(38,42)} Not Completed!`,
                    duration:5000,
                    action: (
                        <div className="flex flex-col gap-1 justify-center items-center">
                            <CircleX size={40}/>
                            <div className="flex flex-col gap-1 text-sm">
                            {
                                (error as ErrorType).message.length > 100 ?
                                `${(error as ErrorType).message.slice(0,100)}...` :
                                (error as ErrorType).message
                            }
                            </div>
                        </div>
                    ),
                    variant: "destructive",
                })
            }
        }finally{
            setLoading(false)
            // display success
            if(txMessage !== null){
                toast({
                    title: "Transaction Confirmed!",
                    description: (username !== null && username !== '') ?
                        `Unfollow ${username} Completed!` :
                        `Unfollow ${userFollow.slice(0, 4)}...${userFollow.slice(38,42)} Completed!`,
                    duration:5000,
                    action: (
                        <div className="flex flex-row gap-1">
                            <ShieldCheck size={80}/>
                            <div className="flex flex-col gap-1">
                                <p>View Transaction on</p>
                                <Link 
                                    href={`https://arbiscan.io/tx/${txMessage}`} 
                                    target="_blank"
                                    className="text-accent"
                                >
                                    Arbiscan
                                </Link>
                            </div>
                        </div>
                    )
                })
            }
        }

    }

    const handleCancel = (e:MouseEvent) => {
        e.preventDefault()
        setOpen(false)
    }

    return(
        <Dialog 
            open={open} 
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                >
                    Unfollow
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex flex-row items-center justify-center gap-4 text-3xl">
                            <Link 
                                className="flex flex-row gap-1"
                                href={`https://arbiscan.io/address/${userFollow}`}
                                target="_blank"
                            >
                                    { "Unfollow" } 
                                    {
                                        username !== null ? 
                                        <span 
                                            className="text-accent">
                                                {username}
                                        </span> : 
                                        <span 
                                            className="text-accent">
                                                {userFollow.slice(0,4)}...${userFollow.slice(37,41)}
                                        </span>
                                    }
                                    {"?"}
                            </Link>
                            {
                                (userPFP !== null && userPFP !== '') ?
                                <Avatar>
                                    <AvatarImage
                                        src={userPFP} 
                                        alt="User Icon" 
                                        loading="lazy"
                                    />
                                    <AvatarFallback>
                                        {
                                            (username !== null && username !== '') ?
                                            username.slice(0,2) :
                                            userFollow.slice(0, 2)
                                        }
                                    </AvatarFallback>
                                </Avatar> :
                                <Avatar>
                                    <AvatarImage
                                        src='/monkey.svg' 
                                        alt="Default User Icon" 
                                        loading="lazy"
                                    />
                                </Avatar>
                            }
                        </div>
                    </DialogTitle>
                    <DialogDescription className="flex flex-col items-center justify-center gap-4">
                        Their messages will no longer show up when your Chat is in Follow Mode. 
                    </DialogDescription>
                    <Separator/>
                    <form
                        onSubmit={(e) => handleSubmit(e)}
                        className="flex flex-col items-center justify-center gap-4"
                    >
                        <Button 
                            type="submit"
                            variant="destructive" 
                            className="w-[200px]"
                        >
                            Unfollow
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

export default UserFollowsUnfollow;