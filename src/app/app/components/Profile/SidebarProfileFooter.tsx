'use client';
import React from "react";
import { 
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem 
} from "@/components/components/ui/sidebar";
import { 
    Avatar,
    AvatarImage
} from "@/components/components/ui/avatar";
import { useUserProviderContext } from "src/contexts/UserContext";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/components/ui/drawer";
import Profile from "./Profile";

const SidebarProfileFooter:React.FC = () => {

    const { 
        userProfilePic, 
        userUsername ,
        account
    } = useUserProviderContext()

    return(
        <SidebarFooter
            className="flex flex-col bg-primary text-accent"
        >
            <Drawer>
                <DrawerTrigger>
                    <SidebarMenu>
                        <SidebarMenuItem
                        >
                            <SidebarMenuButton
                                className="flex h-10 flex-row items-center justify-between overflow-hidden hover:bg-accent hover:text-secondary"
                            >
                                {
                                    (
                                        userProfilePic !== null &&
                                        userProfilePic !== "" &&
                                        userProfilePic !== undefined
                                    ) ?
                                    <Avatar className="relative right-1 size-6 justify-center object-contain">
                                        <AvatarImage 
                                        src={userProfilePic} 
                                        alt="user profile picture" 
                                        loading="lazy"
                                        />
                                    </Avatar> :
                                    <Avatar className="relative right-1 size-6 justify-center object-contain">
                                        <AvatarImage 
                                        src="/monkey.svg" 
                                        alt="default profile picture" 
                                        loading="lazy"
                                        />
                                    </Avatar>
                                }
                                <h2
                                    className="text-lg"
                                >
                                    {
                                        userUsername ?
                                        userUsername :
                                        `${account.slice(0,4)}...${account.slice(37,41)}`
                                    }
                                </h2>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </DrawerTrigger>
                <DrawerContent style={{ zIndex: 3 }}>
                    <Profile/>
                </DrawerContent>
            </Drawer>
        </SidebarFooter>
    )
}

export default SidebarProfileFooter;