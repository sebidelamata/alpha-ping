import React from "react";
import monkey from '/monkey.svg'
import UnfollowUser from "./UnfollowUser";
import FollowUser from "./FollowUser";

interface AvatarProps{
    profilePic: string | null;
    profilePicsLoading: boolean;
    following: boolean;
    account: string;
}

const Avatar:React.FC<AvatarProps> = ({ 
    profilePic, 
    profilePicsLoading, 
    following, 
    account 
}) => {
    return(
        <div className="avatar">
            {
                profilePicsLoading === true ?
                <img src={monkey} alt="User Icon" className='monkey-icon'/> :
                    (profilePic !== null && profilePic !== '') ?
                    <img src={profilePic} alt="User Icon" className='monkey-icon'/> :
                    <img src={monkey} alt="User Icon" className='monkey-icon'/>
            }
            <div className="follow-unfollow-container">
                {
                    following === false &&
                    <FollowUser account={account}/>
                }
                {
                    following === true &&
                    <UnfollowUser account={account}/> 
                }
            </div>
        </div>
    )
}

export default Avatar