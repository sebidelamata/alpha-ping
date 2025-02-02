'use client';

import React, {
    useState,
    useEffect,
    MouseEvent,
    FormEvent
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import Loading from "../Loading";
import { AddressLike } from "ethers";
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
import { Separator } from "@/components/components/ui/separator";
import { Badge } from "@/components/components/ui/badge";

interface ManageModsListItemProps{
    mod: { [mod: string]: number[] }
}

interface ErrorType{
    message: string;
}

const ManageModsListItem:React.FC<ManageModsListItemProps> = ({mod}) => {

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
        setLoading(true)
        try{
            if(mod && mod !== undefined){
                const tx = await alphaPING?.connect(signer).banMod(Object.keys(mod)[0] as unknown as AddressLike, Object.values(mod)[0])
                await tx?.wait()
                //setTxMessageUnblacklist(tx?.hash)
            }
        }catch(error: unknown){
            if((error as ErrorType).message)
            setError((error as ErrorType).message)
        }finally{
            setLoading(false)
        }

    }

    const [username, setUsername] = useState<string | null>(null)
    const [userPFP, setUserPFP] = useState<string | null>(null)
    const [channelNames, setChannelNames] = useState<(string | null)[]>([])
    const fetchUserMetaData = async () => {
        if(mod === undefined){
            console.error('Mod is undefined!')
            return
        }
        try{
            const usernameResult = await alphaPING?.username(Object.keys(mod)[0]) || null
            setUsername(usernameResult)
            const pfpResult = await alphaPING?.profilePic(Object.keys(mod)[0]) || null
            setUserPFP(pfpResult)
            const fetchedNames:string[] = []
            for(let i=0; i<Object.values(mod)[0].length; i++){
                const result = await alphaPING?.getChannel(Object.values(mod)[0][i])
                const channelname = result?.name || ''
                fetchedNames.push(channelname)
            }
            setChannelNames(fetchedNames)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchUserMetaData()
    }, [mod])

    return(
        <Card className="bg-primary text-secondary">
            <CardHeader>
                <CardTitle className="flex flex-col">
                    <div className="flex flex-row">
                        {
                            (userPFP !== null && userPFP !== '') ?
                            <Avatar>
                                <AvatarImage
                                    src={userPFP} 
                                    alt="User Icon" 
                                    loading="lazy"
                                />
                                <AvatarFallback>
                                    {Object.keys(mod)[0].slice(0,2)}
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
                            href={`https://arbiscan.io/address/${Object.keys(mod)[0]}`} 
                            target="_blank"
                            className="text-accent text-3xl"
                        >
                            {
                                (username !== null && username !== '') ?
                                username :
                                Object.keys(mod)[0].slice(0, 6) + '...' + Object.keys(mod)[0].slice(38, 42)
                            }
                        </Link>
                    </div>
                    <Separator/>
                    <div className="items-center justify-center align-middle">
                        Mod For:
                    </div>
                </CardTitle>
                <Separator/>
                <ul className="flex flex-row">
                {
                    channelNames.map((name) => {
                        return(
                            <li key={name} className="p-1">
                                <Badge variant={"secondary"}>
                                    {name}
                                </Badge>
                            </li>
                        )
                    })
                }
            </ul>
            <Dialog
                open={open} 
                onOpenChange={setOpen}
            >
                <DialogTrigger>
                    <Button
                        variant={"destructive"}
                    >
                        Ban Mod
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <span className="flex flex-row gap-1 items-center justify-center">
                                <span className="text-2xl">
                                    Ban 
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
                                            {Object.keys(mod)[0].slice(0,2)}
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
                                    href={`https://arbiscan.io/address/${Object.keys(mod)[0]}`} 
                                    target="_blank"
                                    className="text-accent text-3xl"
                                >
                                    {
                                        (username !== null && username !== '') ?
                                        username :
                                        Object.keys(mod)[0].slice(0, 6) + '...' + Object.keys(mod)[0].slice(38, 42)
                                    }
                                </Link>
                                <span className="text-2xl">
                                    ?
                                </span>
                            </span>
                        </DialogTitle>
                        <DialogDescription className="flex flex-row items-center justify-center">
                            This will remove them as mod from all channels and blacklist their account.
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
                                Ban Mod
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
            </CardHeader>
        </Card>
    )
}

export default ManageModsListItem