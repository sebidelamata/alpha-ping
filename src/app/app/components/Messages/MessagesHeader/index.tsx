'use client';

import React from 'react'
import { CardTitle } from "@/components/components/ui/card";
import MessagesHeaderAaveStats from "./MessagesHeaderAaveStats";
import MessagesHeaderTokenStats from "./MessagesHeaderTokenStats";

const MessagesHeader: React.FC = () => {

    return (
        <CardTitle className="flex flex-col w-full bg-primary text-secondary justify-start gap-2">
                <MessagesHeaderAaveStats/>
                <MessagesHeaderTokenStats/>
        </CardTitle>
    );
}
export default MessagesHeader;