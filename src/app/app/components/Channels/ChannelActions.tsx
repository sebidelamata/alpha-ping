'use client';

import React,
  { MouseEventHandler } from "react";
import { useUserProviderContext } from "../../../../contexts/UserContext";

interface ChannelActionsProps{
    channelAction: string;
    setChannelAction: React.Dispatch<React.SetStateAction<string>>;
}

const ChannelActions: React.FC<ChannelActionsProps> = ({channelAction, setChannelAction}) => {

  const { userProfilePic } = useUserProviderContext()

  const channelActionHandler:MouseEventHandler<HTMLElement> = async (e) => {
    const action = (e.target as HTMLElement).id
    setChannelAction(action)
  }

    return(
        <div className="channel-actions">
          <h2>Channel Actions</h2>
          <ul className="channel-actions-list">
            <li 
              className= {
                channelAction ==  "chat" ? (
                  "channel-action-items channel-action-active"
                ) : (
                  "channel-action-items"
                )
              }
              id="chat"
              onClick={(e) => channelActionHandler(e)}
            >
              Chat
            </li>
            <li 
              className= {
                channelAction ==  "analyze" ? (
                  "channel-action-items channel-action-active"
                ) : (
                  "channel-action-items"
                )
              }
              id="analyze"
              onClick={(e) => channelActionHandler(e)}
            >
              Analyze
            </li>
            <li 
              className= {
                channelAction ==  "trade" ? (
                  "channel-action-items channel-action-active"
                ) : (
                  "channel-action-items"
                )
              }
              id="trade"
              onClick={(e) => channelActionHandler(e)}
            >
              Trade
            </li>
            <li 
              className= {
                channelAction ==  "profile" ? (
                  "channel-action-items channel-action-active"
                ) : (
                  "channel-action-items"
                )
              }
              id="profile"
              onClick={(e) => channelActionHandler(e)}
            >
              Profile 
              <div className="edit-profile-icon">
                {
                    ( 
                        userProfilePic !== null &&
                        userProfilePic !== "" &&
                        userProfilePic !== undefined 
                    ) ?
                    <img 
                        src={userProfilePic} 
                        alt="user profile picture" 
                        className="edit-profile-image"
                    /> :
                    <img 
                        src="/monkey.svg" 
                        alt="default profile picture" 
                        className="edit-profile-image"
                    />
                }
              </div>
            </li>
          </ul>
        </div>
    )
}

export default ChannelActions