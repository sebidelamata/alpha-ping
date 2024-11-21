'use client';

import React, {
    useState,
    MouseEvent
} from "react";
import FollowingList from "./FollowingList";
import BlockedList from "./BlockedList";
import UserFollowsList from "./UserFollowsList";

const UserRelations:React.FC = () => {

    const [selector, setSelector] = useState<string>('following')

    const handleClick = (e: MouseEvent) => {
        e.preventDefault()
        setSelector((e.target as HTMLElement).id)
    }

    return(
        <div className="user-relations-container">
            <ul className="user-relations-selector">
                <li 
                    className={`user-relations-selector-item ${selector === 'following' ? 'active' : ''}`} 
                    id="following"
                    onClick={(e) => handleClick(e)}
                >
                    Following
                </li>
                <li 
                    className={`user-relations-selector-item ${selector === 'follows' ? 'active' : ''}`} 
                    id="follows"
                    onClick={(e) => handleClick(e)}
                >
                    Follows
                </li>
                <li 
                    className={`user-relations-selector-item ${selector === 'blocked' ? 'active' : ''}`} 
                    id="blocked"
                    onClick={(e) => handleClick(e)}
                >
                    Blocked
                </li>
            </ul>
            {
                selector === 'following' ?
                <FollowingList/> :
                selector === 'follows' ?
                <UserFollowsList/> :
                <BlockedList/>
            }
        </div>
    )
}

export default UserRelations;