'use client';

import React, {
    useState,
    useEffect
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import UserFollowsListItem from "./UserFollowsListItem";

const UserFollowsList:React.FC = () => {

    const { alphaPING } = useEtherProviderContext()
    const { txMessageFollow, account } = useUserProviderContext()

    const [allUsers, setAllUsers] = useState<string[]>([])
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
    useEffect(() => {
        fetchAllUsers()
    }, [])

    const [userFollows, setUserFollows] = useState<string[]>([])
    const fetchUserFollows = async () => {
        try{
            const followList = []
            for(let i=0; i<(allUsers?.length || 0); i++){
                const result = await alphaPING?.personalFollowList(allUsers[i], account) || false
                if(result === true){
                    followList.push(allUsers[i])
                }
            }
            setUserFollows(followList)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchUserFollows()
    },[allUsers, txMessageFollow])

    const [followingUserFollows, setFollowingUserFollows] = useState<boolean[]>([])
    const fetchFollowingUserFollows = async () => {
        try{
            const followList = []
            for(let i=0; i<(userFollows?.length || 0); i++){
                const result = await alphaPING?.personalFollowList(account, userFollows[i]) || false
                followList.push(result)
            }
            setFollowingUserFollows(followList)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchFollowingUserFollows()
    },[userFollows])


    return(
        <div className="user-follows-list-container">
            {
                userFollows &&
                userFollows.length === 0 &&
                <p>
                    No one is following you.
                </p>
            }
            {
                userFollows &&
                userFollows.length > 0 &&
                <ul className="user-follows-list">
                    {
                        userFollows.map((userFollow, index) => {
                            return(
                                <li key={userFollow}>
                                    <UserFollowsListItem userFollow={userFollow} followingUserFollow={followingUserFollows[index]}/>
                                </li>
                            )
                        })
                    }
                </ul>
            }
        </div>
    )
}

export default UserFollowsList;