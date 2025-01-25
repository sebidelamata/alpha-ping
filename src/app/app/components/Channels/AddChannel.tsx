'use client';

import React, {
    useState,
} from "react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenuButton,
  } from "@/components/components/ui/sidebar"
  import { Plus } from "lucide-react";
import AddChannelModal from "./AddChannelModal";

const AddChannel:React.FC = () => {

    const [showAddChannelModal, setShowAddChannelModal] = useState<boolean>(false)

    const addChannelModal = () => {
        setShowAddChannelModal(true)
    }

    return(
        <>
            <SidebarGroup className="gap-14 pt-4">
                <SidebarGroupContent>
                    <SidebarMenuButton onClick={() => addChannelModal()}>
                        <Plus/> 
                        <p>Channel</p>
                    </SidebarMenuButton>
                </SidebarGroupContent>
            </SidebarGroup>
            {
                showAddChannelModal === true &&
                <AddChannelModal/>
            }
        </>
    )
}

export default AddChannel;