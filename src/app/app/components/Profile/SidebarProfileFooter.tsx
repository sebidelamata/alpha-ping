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
                    className="flex flex-row items-center justify-start gap-4 overflow-hidden"
                >
                    <SidebarMenuButton
                    >
                        {
                            (
                                userProfilePic !== null &&
                                userProfilePic !== "" &&
                                userProfilePic !== undefined
                            ) ?
                            <Avatar>
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