'use client';

import React, {
    useState,
    useEffect
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import monkey from '/monkey.svg'
import UserFollowsFollowBack from "./UserFollowsFollowBack";
import UserFollowsUnfollow from "./UserFollowsUnfollow";

interface UserFollowsListItemProps{
    userFollow: string;
    followingUserFollow: boolean;
}

const UserFollowsListItem:React.FC<UserFollowsListItemProps> = ({userFollow, followingUserFollow}) => {

    const { alphaPING } = useEtherProviderContext()

    const [username, setUsername] = useState<string | null>(null)
    const [userPFP, setUserPFP] = useState<string | null>(null)
    const fetchUserMetaData = async () => {
        try{
            const usernameResult = await alphaPING?.username(userFollow) || null
            setUsername(usernameResult)
            const pfpResult = await alphaPING?.profilePic(userFollow) || null
            setUserPFP(pfpResult)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchUserMetaData()
    }, [userFollow])

    return(
        <div className="user-follows-list-item-container">
            <div className="user-follows-pfp">
                {
                    (userPFP !== null && userPFP !== '') ?
                    <img src={userPFP} alt="User Icon" className='monkey-icon'/> :
                    <img src={monkey} alt="User Icon" className='monkey-icon'/>
                }
            </div>
            <div className="user-follows-username">
                <a href={`https://arbiscan.io/address/${userFollow}`} target="_blank">
                    {
                        (username !== null && username !== '') ?
                        username :
                        userFollow.slice(0, 6) + '...' + userFollow.slice(38, 42)
                    }
                </a>
            </div>
            {
                followingUserFollow === false &&
                <UserFollowsFollowBack userFollow={userFollow}/>
            }
            {
                followingUserFollow === true &&
                <UserFollowsUnfollow userFollow={userFollow}/>
            }
        </div>
    )
}

export default UserFollowsListItem;