'use client';

import React from 'react'
import { CardTitle } from "@/components/components/ui/card";
import MessagesHeaderAaveStats from "./MessagesHeaderAaveStats";
import MessagesHeaderTokenStats from "./MessagesHeaderTokenStats";
import MessagesHeaderBeefyStats from "./MessagesHeaderBeefyStats"

const MessagesHeader: React.FC = () => {

    return (
        <CardTitle className="flex flex-col w-full bg-primary text-secondary justify-start">
                <MessagesHeaderAaveStats/>
                <MessagesHeaderBeefyStats/>
                <MessagesHeaderTokenStats/>
        </CardTitle>
    );
}
export default MessagesHeader;