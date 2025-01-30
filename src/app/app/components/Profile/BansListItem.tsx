'use client';

import React, {
    useState,
    useEffect,
    MouseEvent,
    FormEvent
} from "react";
import { AlphaPING } from "../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import Loading from "../Loading";
import {
    Card,
    CardContent,
    CardHeader
  } from "@/components/components/ui/card"
  import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "@/components/components/ui/dialog"
import { Button } from "@/components/components/ui/button";
import { Separator } from "@/components/components/ui/separator";
import Link from "next/link";

interface ErrorType {
    reason: string
}

interface BansListItemProps{
    ban: string;
    channel: AlphaPING.ChannelStructOutput;
    setTxMessageUnban: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

const BansListItem:React.FC<BansListItemProps> = ({
    ban, 
    channel, 
    setTxMessageUnban
}) => {

    const { alphaPING, signer } = useEtherProviderContext()

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
        setTxMessageUnban(null)
        setLoading(true)
        try{
            if(channel && channel.id !== undefined){
                const tx = await alphaPING?.connect(signer).channelUnban(ban, channel?.id)
                await tx?.wait()
                setTxMessageUnban(tx?.hash)
            }
        }catch(error: unknown){
            if((error as ErrorType).reason)
            setError((error as ErrorType).reason)
        }finally{
            setLoading(false)
        }

    }

    const [username, setUsername] = useState<string | null>(null)
    const [userPFP, setUserPFP] = useState<string | null>(null)
    const fetchUserMetaData = async () => {
        try{
            const usernameResult = await alphaPING?.username(ban) || null
            setUsername(usernameResult)
            const pfpResult = await alphaPING?.profilePic(ban) || null
            setUserPFP(pfpResult)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchUserMetaData()
    }, [ban])

    return(
        <Card className="bg-primary text-secondary">
            <CardHeader className="flex flex-row justify-center items-center gap-4">
                <Avatar>
                    {
                        (userPFP !== null && userPFP !== '') ?
                        <>
                            <AvatarImage
                                src={userPFP} 
                                alt="User Icon" 
                                loading="lazy"
                            />
                            <AvatarFallback>
                                {ban.slice(0,2)}
                            </AvatarFallback>
                        </> :
                        <AvatarImage
                            src='/monkey.svg' 
                            alt="User Icon" 
                            loading="lazy"
                        />
                    }
                </Avatar>
                <Link
                    href={`https://arbiscan.io/address/${ban}`}
                    target='_blank'
                >
                    {
                        (username !== null && username !== '') ?
                        username :
                        ban.slice(0, 6) + '...' + ban.slice(38, 42)
                    }
                </Link>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
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
                            className="flex justify-center items-center w-[200px]"
                        >
                            Unban
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                <div className="flex flex-row items-center justify-center gap-4 text-3xl">
                                    <Link 
                                        className="flex flex-row gap-1"
                                        href={`https://arbiscan.io/address/${ban}`}
                                        target="_blank"
                                    >
                                            { "Unban" } 
                                            {
                                                username !== null ? 
                                                <span 
                                                    className="text-accent">
                                                        {username}
                                                </span> : 
                                                <span 
                                                    className="text-accent">
                                                        {ban.slice(0,4)}...${ban.slice(37,41)}
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
                                                    ban.slice(0, 2)
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
                                Their messages will show up again when your is in any Mode. 
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
                                    Unban
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
            </CardContent>
        </Card>
    )
}

export default BansListItem