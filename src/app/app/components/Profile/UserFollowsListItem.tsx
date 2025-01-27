'use client';

import React, {
    useState,
    useEffect
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import UserFollowsFollowBack from "./UserFollowsFollowBack";
import UserFollowsUnfollow from "./UserFollowsUnfollow";
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

interface UserFollowsListItemProps{
    userFollow: string;
    followingUserFollow: boolean;
}

const UserFollowsListItem:React.FC<UserFollowsListItemProps> = ({userFollow, followingUserFollow}) => {

    const { alphaPING } = useEtherProviderContext()

    const [loading, setLoading] = useState<boolean>(false)
    const [username, setUsername] = useState<string | null>(null)
    const [userPFP, setUserPFP] = useState<string | null>(null)
    useEffect(() => {
        const fetchUserMetaData = async () => {
            try{
                setLoading(true)
                const usernameResult = await alphaPING?.username(userFollow) || null
                setUsername(usernameResult)
                const pfpResult = await alphaPING?.profilePic(userFollow) || null
                setUserPFP(pfpResult)
            }catch(error){
                console.error(error)
            }finally{
                setLoading(false)
            }
        }
        fetchUserMetaData()
    }, [userFollow, alphaPING])

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
                        )
                    }
                    <div className="">
                        <Link 
                            href={`https://arbiscan.io/address/${userFollow}`} 
                            target="_blank"
                        >
                            {
                                (username !== null && username !== '') ?
                                username :
                                userFollow.slice(0, 6) + '...' + userFollow.slice(38, 42)
                            }
                        </Link>
                    </div>
                    {
                        followingUserFollow === false &&
                        <UserFollowsFollowBack 
                            userFollow={userFollow} 
                            userPFP={userPFP}
                            username={username}
                        />
                    }
                    {
                        followingUserFollow === true &&
                        <UserFollowsUnfollow userFollow={userFollow}/>
                    }
                </CardTitle>
            </CardHeader>
        </Card>
    )
}

export default UserFollowsListItem;