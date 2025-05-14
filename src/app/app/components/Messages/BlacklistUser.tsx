'use client';

import React, 
    { 
        useState,
        MouseEvent, 
        FormEvent
    } from "react";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import Loading from "../Loading";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/components/ui/dialog"
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
import { Button } from "@/components/components/ui/button";
import { Separator } from "@/components/components/ui/separator";
import { useToast } from "@/components/hooks/use-toast"
import { 
    ShieldCheck, 
    CircleX 
} from "lucide-react";
import Link from "next/link";

interface ErrorType {
    reason: string
}

interface IBlacklistUser{
    user: string;
    username: string | null;
    profilePic: string | null;
}

const BlacklistUser:React.FC<IBlacklistUser> = ({
    user,
    username,
    profilePic
}) => {

    const { toast } = useToast()
    const { owner } = useUserProviderContext()
    const { alphaPING, signer } = useEtherProviderContext()

    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [txMessage, setTxMessage] = useState<string | null>(null)

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        try{
            setError(null)
            setLoading(true)
            if(
                owner === true
            ){
                const tx = await alphaPING?.connect(signer).blacklistUser(user)
                await tx?.wait()
                if(tx !== undefined && tx.hash !== undefined){
                    setTxMessage(tx?.hash)
                }
            }
        }catch(error: unknown){
            if((error as ErrorType).reason){
                setError((error as ErrorType).reason)
            }
            if(error !== null && (error as ErrorType).reason !== undefined){
                toast({
                    title: "Transaction Error!",
                    description: (username !== null && username !== '') ?
                        `Blacklist ${username} Not Completed!` :
                        `Blacklist ${user.slice(0, 4)}...${user.slice(38,42)} Not Completed!`,
                    duration:5000,
                    action: (
                        <div className="flex flex-col gap-1 justify-center items-center">
                            <CircleX size={40}/>
                            <div className="flex flex-col gap-1 text-sm">
                            {
                                (error as ErrorType).reason.length > 100 ?
                                `${(error as ErrorType).reason.slice(0,100)}...` :
                                (error as ErrorType).reason
                            }
                            </div>
                        </div>
                    ),
                    variant: "destructive",
                })
            }
        }finally{
            setLoading(false)
            if(txMessage !== null){
                toast({
                    title: "Transaction Confirmed!",
                    description: (username !== null && username !== '') ?
                        `Blacklist ${username} Completed!` :
                        `Blacklist ${user.slice(0, 4)}...${user.slice(38,42)} Completed!`,
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
            <DialogTrigger
                asChild 
                className="flex justify-center items-center"
            >
                <Button
                    variant={"destructive"}
                    className="flex justify-center items-center w-[200px]"
                >
                    Blacklist
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex flex-row items-center justify-center gap-4 text-3xl">
                                <Link 
                                    className="flex flex-row gap-1"
                                    href={`https://arbiscan.io/address/${user}`}
                                    target="_blank"
                                >
                                        { "Blacklist " } 
                                        {
                                            username !== null ? 
                                            <span 
                                                className="text-accent">
                                                    {username}
                                            </span> : 
                                            <span 
                                                className="text-accent">
                                                    {user.slice(0,4)}...${user.slice(37,41)}
                                            </span>
                                        }
                                        {"?"}
                                </Link>
                                {
                                    (profilePic !== null && profilePic !== '') ?
                                    <Avatar>
                                        <AvatarImage
                                            src={profilePic} 
                                            alt="User Icon" 
                                            loading="lazy"
                                        />
                                        <AvatarFallback>
                                            {
                                                (username !== null && username !== '') ?
                                                username.slice(0,2) :
                                                user.slice(0, 2)
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
                        They will no longer be able to use AlphaPING. 
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
                            Blacklist
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

export default BlacklistUser;