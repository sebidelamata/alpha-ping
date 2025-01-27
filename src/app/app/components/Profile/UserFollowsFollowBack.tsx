'use client';

import React, {
    useState,
    FormEvent
} from "react";
import Loading from "../Loading";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "../../../../contexts/UserContext";
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

interface ErrorType{
    message: string;
} 

interface UserFollowsFollowBackProps{
    userFollow: string;
    userPFP: string | null;
    username: string | null;
}

const UserFollowsFollowBack:React.FC<UserFollowsFollowBackProps> = ({
    userFollow, 
    userPFP, 
    username
}) => {

    const { alphaPING, signer } = useEtherProviderContext()
    const { setTxMessageFollow } = useUserProviderContext()

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState<boolean>(false); 

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        setError(null)
        setTxMessageFollow(null)
        setLoading(true)
        try{
            if(userFollow && userFollow !== undefined){
                const tx = await alphaPING?.connect(signer).addToPersonalFollowList(userFollow)
                await tx?.wait()
                setTxMessageFollow(tx?.hash)
            }
        }catch(error: unknown){
            if((error as ErrorType).message)
            setError((error as ErrorType).message)
        }finally{
            setLoading(false)
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
                    variant="outline"
                >
                    Follow Back
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
                                    { "Follow" } 
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
                                    {"back?"}
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
                        Their messages will show up when your Chat is in Follow Mode. 
                    </DialogDescription>
                    <Separator/>
                    <form
                        onSubmit={(e) => handleSubmit(e)}
                        className="flex flex-col items-center justify-center gap-4"
                    >
                        <Button 
                            type="submit"
                            variant="secondary" 
                            className="w-[200px]"
                        >
                            Follow Back
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

export default UserFollowsFollowBack