import React from "react";
import monkey from '/monkey.svg'

interface AvatarProps{
    profilePic: string | null;
    profilePicsLoading: boolean;
}

const Avatar:React.FC<AvatarProps> = ({profilePic, profilePicsLoading,}) => {
    return(
        <div className="avatar">
            {
                profilePicsLoading === true ?
                <img src={monkey} alt="User Icon" className='monkey-icon'/> :
                    (profilePic !== null && profilePic !== '') ?
                    <img src={profilePic} alt="User Icon" className='monkey-icon'/> :
                    <img src={monkey} alt="User Icon" className='monkey-icon'/>
            }
        </div>
    )
}

export default Avatar