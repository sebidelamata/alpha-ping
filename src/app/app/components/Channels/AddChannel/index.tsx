'use client';

import React, 
{
    useState
} from "react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenuButton,
  } from "@/components/components/ui/sidebar"
import { 
    Dialog, 
    DialogTrigger 
} from "@/components/components/ui/dialog";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/components/ui/hover-card"
import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/components/ui/avatar"
import { Plus } from "lucide-react";
import AddChannelModal from "./AddChannelModal";

const AddChannel:React.FC = () => {

    const [open, setOpen] = useState<boolean>(false)

    return(
        <>
            <SidebarGroup className="gap-14 pt-4">
                <SidebarGroupContent>
                    <HoverCard>
                        <HoverCardTrigger>
                            <Dialog
                                open={open} 
                                onOpenChange={setOpen}
                            >
                                <DialogTrigger asChild>
                                    <SidebarMenuButton>
                                        <Plus/> 
                                        <p>Channel</p>
                                    </SidebarMenuButton>
                                </DialogTrigger>
                                <AddChannelModal setOpen={setOpen}/>
                            </Dialog>
                        </HoverCardTrigger>
                        <HoverCardContent className="bg-primary text-secondary">
                            <div
                                className="flex justify-between space-x-4"
                            >
                                <Avatar>
                                    <AvatarImage
                                        src="/Apes.svg"
                                        loading="lazy"
                                        alt="AlphaPING Logo"
                                    />
                                    <AvatarFallback>AP</AvatarFallback>
                                </Avatar>
                                <h4>
                                    Create a new <span className="text-accent">Channel</span> for any <span className="text-accent">Token</span> or <span className="text-accent">NFT</span> on Arbitrum.
                                </h4>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </SidebarGroupContent>
            </SidebarGroup>
        </>
    )
}

export default AddChannel;