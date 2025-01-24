'use client';

import React,
  { MouseEventHandler } from "react";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import { useChannelProviderContext } from "../../../../contexts/ChannelContext";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/components/ui/sidebar"

const ChannelActions: React.FC = () => {

  const { userProfilePic } = useUserProviderContext()
  const { 
          channelAction, 
          setChannelAction  
        } = useChannelProviderContext()

  const channelActionHandler:MouseEventHandler<HTMLElement> = async (e) => {
    const action = (e.target as HTMLElement).id
    setChannelAction(action)
  }

  const actions = [
    'Chat',
    'Analyze',
    'Trade'
  ]

    return(
      <SidebarGroup className="gap-14 pt-4">
                    <SidebarGroupLabel>
                        <h1 className="text-xl text-secondary">
                            Channel Actions
                        </h1>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                              actions.map((action, index) => (
                                  <SidebarMenuItem key={action}>
                                      {action}
                                  </SidebarMenuItem>
                              ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
        // <div className="channel-actions">
        //   <h2>Channel Actions</h2>
        //   <ul className="channel-actions-list">
        //     <li 
        //       className= {
        //         channelAction ==  "chat" ? (
        //           "channel-action-items channel-action-active"
        //         ) : (
        //           "channel-action-items"
        //         )
        //       }
        //       id="chat"
        //       onClick={(e) => channelActionHandler(e)}
        //     >
        //       Chat
        //     </li>
        //     <li 
        //       className= {
        //         channelAction ==  "analyze" ? (
        //           "channel-action-items channel-action-active"
        //         ) : (
        //           "channel-action-items"
        //         )
        //       }
        //       id="analyze"
        //       onClick={(e) => channelActionHandler(e)}
        //     >
        //       Analyze
        //     </li>
        //     <li 
        //       className= {
        //         channelAction ==  "trade" ? (
        //           "channel-action-items channel-action-active"
        //         ) : (
        //           "channel-action-items"
        //         )
        //       }
        //       id="trade"
        //       onClick={(e) => channelActionHandler(e)}
        //     >
        //       Trade
        //     </li>
        //     <li 
        //       className= {
        //         channelAction ==  "profile" ? (
        //           "channel-action-items channel-action-active"
        //         ) : (
        //           "channel-action-items"
        //         )
        //       }
        //       id="profile"
        //       onClick={(e) => channelActionHandler(e)}
        //     >
        //       Profile 
        //       <div className="edit-profile-icon">
        //         {
        //             ( 
        //                 userProfilePic !== null &&
        //                 userProfilePic !== "" &&
        //                 userProfilePic !== undefined 
        //             ) ?
        //             <img 
        //                 src={userProfilePic} 
        //                 alt="user profile picture" 
        //                 className="edit-profile-image"
        //                 loading="lazy"
        //             /> :
        //             <img 
        //                 src="/monkey.svg" 
        //                 alt="default profile picture" 
        //                 className="edit-profile-image"
        //                 loading="lazy"
        //             />
        //         }
        //       </div>
        //     </li>
        //   </ul>
        // </div>
    )
}

export default ChannelActions