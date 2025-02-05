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
  import { ScrollArea } from "@/components/components/ui/scroll-area";

const UserRelations:React.FC = () => {

    return(
        <Accordion 
            type="single" 
            collapsible 
            className="w-full p-4" 
            defaultValue="following"
        >
            <AccordionItem value="following">
                <AccordionTrigger>
                    Following
                </AccordionTrigger>
                <AccordionContent
                    className='max-h-64 overflow-y-auto' 
                    onWheel={(e) => {
                        e.stopPropagation(); 
                    }}
                >
                    <ScrollArea className="max-h-64 rounded-md border">
                        <FollowingList/>
                    </ScrollArea>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="follows">
                <AccordionTrigger>
                    Follows
                </AccordionTrigger>
                <AccordionContent
                    className='max-h-64 overflow-y-auto' 
                    onWheel={(e) => {
                        e.stopPropagation(); 
                    }}
                >
                    <ScrollArea className="max-h-64 rounded-md border">
                        <UserFollowsList/>
                    </ScrollArea>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="blocked">
                <AccordionTrigger>
                    Blocked
                </AccordionTrigger>
                <AccordionContent
                    className='max-h-64 overflow-y-auto' 
                    onWheel={(e) => {
                        e.stopPropagation(); 
                    }}
                >
                    <ScrollArea className="max-h-64 rounded-md border">
                        <BlockedList/>
                    </ScrollArea>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default UserRelations;