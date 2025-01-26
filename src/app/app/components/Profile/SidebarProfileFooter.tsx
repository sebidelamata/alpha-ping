import React from "react";
import { SidebarFooter } from "@/components/components/ui/sidebar";
import { 
    Avatar,
    AvatarImage
} from "@/components/components/ui/avatar";
import { useUserProviderContext } from "src/contexts/UserContext";

const SidebarProfileFooter:React.FC = () => {

    const { userProfilePic } = useUserProviderContext()

    return(
        <SidebarFooter className="flex flex-row items-center justify-start bg-primary text-secondary">
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
            Profile
        </SidebarFooter>
    )
}

export default SidebarProfileFooter;