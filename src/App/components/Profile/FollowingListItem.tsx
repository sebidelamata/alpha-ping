import React from "react";

interface FollowingListItemProps{
    follow: string;
}

const FollowingListItem:React.FC<FollowingListItemProps> = ({follow}) => {
    return(
        <div className="follow-list-item-container">
            {follow}
        </div>
    )
}

export default FollowingListItem