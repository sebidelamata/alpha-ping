'use client';

import React from "react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenuButton,
  } from "@/components/components/ui/sidebar"
import { 
    Dialog, 
    DialogTrigger 
} from "@/components/components/ui/dialog";
import { Plus } from "lucide-react";
import AddChannelModal from "./AddChannelModal";

const AddChannel:React.FC = () => {

    return(
        <>
            <SidebarGroup className="gap-14 pt-4">
                <SidebarGroupContent>
                        <Dialog>
                            <DialogTrigger asChild>
                                <SidebarMenuButton>
                                    <Plus/> 
                                    <p>Channel</p>
                                </SidebarMenuButton>
                            </DialogTrigger>
                            <AddChannelModal/>
                        </Dialog>
                </SidebarGroupContent>
            </SidebarGroup>
        </>
    )
}

export default AddChannel;