import React from "react";
import monkey from '/monkey.svg'
import follow from '/follow.svg'
import unfollow from '/unfollow.svg'

interface AvatarProps{
    profilePic: string | null;
    profilePicsLoading: boolean;
    following: boolean;
}

const Avatar:React.FC<AvatarProps> = ({ profilePic, profilePicsLoading, following }) => {
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
                    <img src={follow} alt="follow-user" className="follow-user-icon"/>   
                }
                {
                    following === true &&
                    <img src={unfollow} alt="unfollow-user" className="unfollow-user-icon"/>   
                }
            </div>
        </div>
    )
}

export default Avatar