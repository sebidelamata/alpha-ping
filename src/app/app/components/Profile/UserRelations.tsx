'use client';

import React from "react";
import FollowingList from "./FollowingList";
import BlockedList from "./BlockedList";
import UserFollowsList from "./UserFollowsList";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/components/ui/accordion"

const UserRelations:React.FC = () => {

    return(
        <Accordion 
            type="single" 
            collapsible 
            className="w-1/2 p-4 items-center" 
            defaultValue="following"
        >
            <AccordionItem value="following">
                <AccordionTrigger>
                    Following
                </AccordionTrigger>
                <AccordionContent>
                    <FollowingList/>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="follows">
                <AccordionTrigger>
                    Follows
                </AccordionTrigger>
                <AccordionContent>
                    <UserFollowsList/>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="blocked">
                <AccordionTrigger>
                    Blocked
                </AccordionTrigger>
                <AccordionContent>
                    <BlockedList/>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default UserRelations;