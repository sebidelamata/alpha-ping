'use client';

import React, {
    useState,
    useEffect,
    MouseEvent,
    FormEvent
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import Loading from "../Loading";
import {
    Card,
    CardHeader,
    CardTitle,
  } from "@/components/components/ui/card"
  import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/components/ui/avatar"
import { Skeleton } from "@/components/components/ui/skeleton";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/components/ui/dialog"
import { Button } from "@/components/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { useToast } from "@/components/hooks/use-toast"
import { 
    ShieldCheck, 
    CircleX 
} from "lucide-react";

interface BlockedListItemProps{
    block: string;
}

interface ErrorType{
    message: string;
}

const BlockedListItem:React.FC<BlockedListItemProps> = ({block}) => {


    const { 
        alphaPING, 
        signer 
    } = useEtherProviderContext()
    const { toast } = useToast()

    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [txMessage, setTxMessage] = useState<null | string>(null)

    const handleCancel = (e:MouseEvent) => {
        e.preventDefault()
        setOpen(false)
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        try{
            setLoading(true)
            setError(null)
            setTxMessage(null)
            if(block && block !== undefined){
                const tx = await alphaPING?.connect(signer).removeFromPersonalBlockList(block)
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
                        `Unblock ${username} Not Completed!` :
                        `Unblock ${block.slice(0, 4)}...${block.slice(38,42)} Not Completed!`,
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
                        `Unblock ${username} Completed!` :
                        `Unblock ${block.slice(0, 4)}...${block.slice(38,42)} Completed!`,
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

    const [username, setUsername] = useState<string | null>(null)
    const [userPFP, setUserPFP] = useState<string | null>(null)
    useEffect(() => {
        const fetchUserMetaData = async () => {
            try{
                const usernameResult = await alphaPING?.username(block) || null
                setUsername(usernameResult)
                const pfpResult = await alphaPING?.profilePic(block) || null
                setUserPFP(pfpResult)
            }catch(error){
                console.error(error)
            }
        }
        fetchUserMetaData()
    }, [block, alphaPING])

    return(
        <Card className="bg-primary text-secondary">
            <CardHeader>
                <CardTitle className="flex flex-row items-center gap-4">
                    {
                        loading === true ?
                        <Skeleton className=" rounded-full"/> :
                        (
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
                                        block.slice(0, 2)
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
                        )
                    }
                    <div className="">
                        <Link 
                            href={`https://arbiscan.io/address/${block}`} 
                            target="_blank"
                        >
                            {
                                (username !== null && username !== '') ?
                                username :
                                block.slice(0, 6) + '...' + block.slice(38, 42)
                            }
                        </Link>
                    </div>
                    <Dialog 
                        open={open} 
                        onOpenChange={setOpen}
                    >
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                            >
                                Unblock
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    <div className="flex flex-row items-center justify-center gap-4 text-3xl">
                                        <Link 
                                            className="flex flex-row gap-1"
                                            href={`https://arbiscan.io/address/${block}`}
                                            target="_blank"
                                        >
                                                { "Unblock" } 
                                                {
                                                    username !== null ? 
                                                    <span 
                                                        className="text-accent">
                                                            {username}
                                                    </span> : 
                                                    <span 
                                                        className="text-accent">
                                                            {block.slice(0,4)}...${block.slice(37,41)}
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
                                                        block.slice(0, 2)
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
                                            Their messages will show up in your Chat is in Everyone Mode. 
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
                                                Unblock
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
                </CardTitle>
            </CardHeader>
        </Card>
    )
}

export default BlockedListItem;