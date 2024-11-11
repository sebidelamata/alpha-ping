'use client';

import React from "react";
import UnfollowUser from "./UnfollowUser";
import FollowUser from "./FollowUser";
import BlockUser from "./BlockUser";

interface AvatarProps{
    profilePic: string | null;
    profilePicsLoading: boolean;
    following: boolean;
    account: string;
    hoverOptions: boolean;
    blocked: boolean;
}

const Avatar:React.FC<AvatarProps> = ({ 
    profilePic, 
    profilePicsLoading, 
    following, 
    account,
    hoverOptions,
    blocked
}) => {
    return(
        <div className="avatar">
            {
                profilePicsLoading === true ?
                <img 
                    src='/monkey.svg' 
                    alt="User Icon" 
                    className='monkey-icon'
                    loading="lazy"
                /> :
                    (profilePic !== null && profilePic !== '' && profilePic !== undefined) ?
                    <img 
                        src={profilePic} 
                        alt="User Icon" 
                        className='monkey-icon'
                        loading="lazy"
                    /> :
                    <img 
                        src='/monkey.svg' 
                        alt="User Icon" 
                        className='monkey-icon'
                        loading="lazy"
                    />
            }
            <div className="follow-unfollow-container">
                {
                    following === false &&
                    hoverOptions === true &&
                    <FollowUser account={account}/>
                }
                {
                    following === true &&
                    hoverOptions === true &&
                    <UnfollowUser account={account}/> 
                }
                {
                    blocked === false &&
                    hoverOptions === true &&
                    <BlockUser user={account}/> 
                }
            </div>
        </div>
    )
}

export default Avatar