'use client';

import React, {
    useState,
    useEffect,
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import DeleteBlacklistPosts from "./DeleteBlacklistPosts";
import BlacklistPardonUser from "./BlacklistPardonUser";
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
import Link from "next/link";
import { Separator } from "@/components/components/ui/separator";

interface BlacklistListItemProps{
    user: string;
    setTxMessageUnblacklist: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

const BlacklistListItem:React.FC<BlacklistListItemProps> = ({
    user,
    setTxMessageUnblacklist
}) => {

    const { alphaPING } = useEtherProviderContext()

    const [username, setUsername] = useState<string | null>(null)
    const [userPFP, setUserPFP] = useState<string | null>(null)
    const fetchUserMetaData = async () => {
        try{
            const usernameResult = await alphaPING?.username(user) || null
            setUsername(usernameResult)
            const pfpResult = await alphaPING?.profilePic(user) || null
            setUserPFP(pfpResult)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchUserMetaData()
    }, [user])

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
                    </div>
                </CardTitle>
                <Separator/>
            <BlacklistPardonUser
                user={user}
                userPFP={userPFP}
                username={username}
            />
            <Separator/>
            <DeleteBlacklistPosts user={user}/>
            </CardHeader>
        </Card>
    )
}

export default BlacklistListItem