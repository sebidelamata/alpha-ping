'use client';

import React, {
    useState,
    FormEvent,
    MouseEvent
} from "react";
import { useEtherProviderContext } from "../../../../../contexts/ProviderContext";
import Loading from "../../Loading";
import { UserRoundPlus } from "lucide-react";
import { Button } from "@/components/components/ui/button";
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
import { Separator } from "@/components/components/ui/separator";
import { useToast } from "@/components/hooks/use-toast"
import { 
    ShieldCheck, 
    CircleX 
} from "lucide-react";
import Link from "next/link";

interface ErrorType{
    message: string;
}

interface FollowUserProps{
    account: string;
    username: string | null;
    profilePic: string | null;
}

const FollowUser:React.FC<FollowUserProps> = ({
    account,
    username,
    profilePic
}) => {

    const { toast } = useToast()
    const { alphaPING, signer } = useEtherProviderContext()

    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [txMessage, setTxMessage] = useState<string | null>(null)

    const handleClick = async (e:FormEvent) => {
        e.preventDefault()
        try{
            setError(null)
            setLoading(true)
            const tx = await alphaPING?.connect(signer).addToPersonalFollowList(account)
            await tx?.wait()
            if(tx !== undefined && tx.hash !== undefined){
                setTxMessage(tx?.hash)
            }
        }catch(error: unknown){
            if((error as ErrorType).message){
                setError((error as ErrorType).message)
            }
            if(error !== null && (error as ErrorType).message !== undefined){
                toast({
                    title: "Transaction Error!",
                    description: (username !== null && username !== '') ?
                        `Follow ${username} Not Completed!` :
                        `Follow ${account.slice(0, 4)}...${account.slice(38,42)} Not Completed!`,
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
            if(txMessage !== null){
                toast({
                    title: "Transaction Confirmed!",
                    description: (username !== null && username !== '') ?
                        `Follow ${username} Completed!` :
                        `Follow ${account.slice(0, 4)}...${account.slice(38,42)} Completed!`,
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
                    variant={"outline"}
                >
                    <UserRoundPlus/>
                </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
                    <DialogTitle>
                        <div className="flex flex-row items-center justify-center gap-4 text-3xl">
                                <Link 
                                    className="flex flex-row gap-1"
                                    href={`https://arbiscan.io/address/${account}`}
                                    target="_blank"
                                >
                                        { "Follow " } 
                                        {
                                            username !== null ? 
                                            <span 
                                                className="text-accent">
                                                    {username}
                                            </span> : 
                                            <span 
                                                className="text-accent">
                                                    {`${account.slice(0,4)}...${account.slice(38,42)}`}
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
                                                account.slice(0, 2)
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
                        Their messages and input will appear when you turn your Follows Filter ON. 
                    </DialogDescription>
                    <Separator/>
                    <form
                        onSubmit={(e) => handleClick(e)}
                        className="flex flex-col items-center justify-center gap-4"
                    >
                        <Button 
                            type="submit"
                            variant="secondary" 
                            className="w-[200px]"
                        >
                            Follow
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

export default FollowUser