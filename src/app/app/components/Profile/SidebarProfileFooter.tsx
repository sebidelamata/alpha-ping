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

const SidebarProfileFooter:React.FC = () => {

    const { 
        userProfilePic, 
        userUsername 
    } = useUserProviderContext()

    return(
        <SidebarFooter
            className="bg-primary text-accent"
        >
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
                            <Avatar>
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
                            {userUsername}
                        </h2>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    )
}

export default SidebarProfileFooter;