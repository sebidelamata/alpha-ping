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
import { Separator } from "@radix-ui/react-separator";

interface ManageModsListItemProps{
    mod: { [mod: string]: number[] }
}

interface ErrorType{
    message: string;
}

const ManageModsListItem:React.FC<ManageModsListItemProps> = ({mod}) => {

    const { alphaPING, signer } = useEtherProviderContext()

    const [showModal, setShowModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const handleClick = (e:MouseEvent) => {
        e.preventDefault()
        setShowModal(true)
    }

    const handleCancel = (e:MouseEvent) => {
        e.preventDefault()
        setShowModal(false)
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        setError(null)
        //setTxMessageUnblacklist(null)
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
                        >
                            {
                                (username !== null && username !== '') ?
                                username :
                                Object.keys(mod)[0].slice(0, 6) + '...' + Object.keys(mod)[0].slice(38, 42)
                            }
                        </Link>
                    </div>
                    <div>
                        Mod For:
                    </div>
                </CardTitle>
                <ul className="ban-mod-channels-list">
                {
                    channelNames.map((name) => {
                        return(
                            <li key={name}>
                                <strong>{name}</strong>
                            </li>
                        )
                    })
                }
            </ul>
            {
                showModal === false &&
                    <button
                        onClick={(e) => handleClick(e)}
                        className="blacklist-pardon-button"
                    >
                        Ban Mod
                    </button>
            }
            {
                showModal === true &&
                <form 
                    action=""
                    onSubmit={(e) => handleSubmit(e)}
                    className="ban-mod-form"
                >
                    <input 
                        type="submit" 
                    />
                    <button 
                        onClick={(e) => handleCancel(e)}
                    >
                        Cancel
                    </button>
                </form>
            }
            {
                loading === true &&
                    <Loading/>
            }
            {
                error !== null &&
                    <p>{error}</p>
            }
            </CardHeader>
        </Card>
    )
}

export default ManageModsListItem