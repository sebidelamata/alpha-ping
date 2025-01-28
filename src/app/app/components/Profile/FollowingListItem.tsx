'use client';

import React, {
    useState,
    useEffect,
    MouseEvent,
    FormEvent
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "../../../../contexts/UserContext";
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

interface FollowingListItemProps{
    follow: string;
}

interface ErrorType{
    message: string;
}

const FollowingListItem:React.FC<FollowingListItemProps> = ({follow}) => {


    const { alphaPING, signer } = useEtherProviderContext()
    const { setTxMessageFollow } = useUserProviderContext()

    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        setError(null)
        setTxMessageFollow(null)
        setLoading(true)
        try{
            if(follow && follow !== undefined){
                const tx = await alphaPING?.connect(signer).removeFromPersonalFollowList(follow)
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

    const [username, setUsername] = useState<string | null>(null)
    const [userPFP, setUserPFP] = useState<string | null>(null)
    const fetchUserMetaData = async () => {
        try{
            const usernameResult = await alphaPING?.username(follow) || null
            setUsername(usernameResult)
            const pfpResult = await alphaPING?.profilePic(follow) || null
            setUserPFP(pfpResult)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchUserMetaData()
    }, [follow])

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
                                        follow.slice(0, 2)
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
                            href={`https://arbiscan.io/address/${follow}`} 
                            target="_blank"
                        >
                            {
                                (username !== null && username !== '') ?
                                username :
                                follow.slice(0, 6) + '...' + follow.slice(38, 42)
                            }
                        </Link>
                    </div>
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
                                href={`https://arbiscan.io/address/${follow}`}
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
                                                {follow.slice(0,4)}...${follow.slice(37,41)}
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
                                            follow.slice(0, 2)
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
                    {/* {
                        followingUserFollow === false &&
                        <UserFollowsFollowBack 
                            userFollow={userFollow} 
                            userPFP={userPFP}
                            username={username}
                        />
                    }
                    {
                        followingUserFollow === true &&
                        <UserFollowsUnfollow 
                            userFollow={userFollow}
                            userPFP={userPFP}
                            username={username}
                        />
                    } */}
                </CardTitle>
            </CardHeader>
        </Card>
        // <Card className="bg-primary text-secondary">
        //     { <div className="follow-pfp">
        //         {
        //             (userPFP !== null && userPFP !== '') ?
        //             <img 
        //                 src={userPFP} 
        //                 alt="User Icon" 
        //                 className='monkey-icon'
        //                 loading="lazy"
        //             /> :
        //             <img 
        //                 src='/monkey.svg' 
        //                 alt="User Icon" 
        //                 className='monkey-icon'
        //                 loading="lazy"
        //             />
        //         }
        //     </div>
        //     <div className="follow-username">
        //         {
        //             (username !== null && username !== '') ?
        //             username :
        //             follow.slice(0, 6) + '...' + follow.slice(38, 42)
        //         }
        //     </div>
        //     {
        //         showModal === false &&
        //             <button
        //                 onClick={(e) => handleClick(e)}
        //                 className="followlist-unfollow-button"
        //             >
        //                 Unfollow
        //             </button>
        //     }
        //     {
        //         showModal === true &&
        //         <form 
        //             action=""
        //             onSubmit={(e) => handleSubmit(e)}
        //             className="pardon-form"
        //         >
        //             <input 
        //                 type="submit" 
        //             />
        //             <button 
        //                 onClick={(e) => handleCancel(e)}
        //             >
        //                 Cancel
        //             </button>
        //         </form>
        //     }
        //     {
        //         loading === true &&
        //             <Loading/>
        //     }
        //     {
        //         error !== null &&
        //             <p>{error}</p>
        //     }
        // </Card> */}
    )
}

export default FollowingListItem