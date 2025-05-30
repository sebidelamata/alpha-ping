'use client';

import React, {
    useState,
    useEffect
}  from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import FollowingListItem from "./FollowingListItem";
import {
    Card,
    CardHeader
  } from "@/components/components/ui/card"
import { ScrollArea } from "@/components/components/ui/scroll-area";

const FollowingList:React.FC = () => {

    const { alphaPING } = useEtherProviderContext()
    const { account } = useUserProviderContext()

    // need to grab all user addressess to see if they follow back
    const [allUsers, setAllUsers] = useState<string[]>([])
    useEffect(() => {
        const fetchAllUsers = async() => {
            try{
                const totalUsers = await alphaPING?.totalSupply() || 0
                const allUsers = []
                for(let i=1; i<=totalUsers; i++){
                    const address = await alphaPING?.ownerOf(i)
                    if(address !== undefined){
                        allUsers.push(address)
                    }
                }
                setAllUsers(allUsers)
            }catch(error){
                console.error(error)
            }
            
        }
        fetchAllUsers()
    }, [alphaPING])

    // find user follws
    const [follows, setFollows] = useState<string[]>([])
    useEffect(() => {
        const fetchFollows = async () => {
            try{
                const followList = []
                for(let i=0; i<(allUsers?.length || 0); i++){
                    const result = await alphaPING?.personalFollowList(account, allUsers[i]) || false
                    if(result === true){
                        followList.push(allUsers[i])
                    }
                }
                setFollows(followList)
            }catch(error){
                console.error(error)
            }
        }
        fetchFollows()
    },[allUsers, account, alphaPING])

    return(
        <Card
            className='max-h-64 overflow-y-auto bg-primary text-secondary' 
            onWheel={(e) => {
                e.stopPropagation(); 
            }}
        >
            {
                follows &&
                follows.length === 0 &&
                <CardHeader>
                    You are not following anyone.
                </CardHeader>
            }
            {
                follows &&
                follows.length > 0 &&
                <ScrollArea className="h-64 rounded-md border">
                    <ul>
                        {
                            follows.map((follow, index) => {
                                return(
                                    <li key={index}>
                                        <FollowingListItem follow={follow}/>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </ScrollArea>
            }
        </Card>
    )
}

export default FollowingList;