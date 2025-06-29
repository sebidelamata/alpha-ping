'use client';

import React from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { CardTitle } from "@/components/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/components/ui/avatar";

const MessagesHeader: React.FC = () => {

    const { currentChannel, selectedChannelMetadata } = useChannelProviderContext();

    return (
        <CardTitle className="flex flex-row flex-wrap w-full bg-primary text-secondary gap-4 items-center justify-start p-4">
            {
                currentChannel &&
                <div className="text-3xl">
                    {currentChannel.name}
                </div>
            }
            {
                currentChannel &&
                selectedChannelMetadata &&
                <div className="flex flex-row gap-2">
                    <Avatar className="size-8">
                        <AvatarImage
                            src={
                                selectedChannelMetadata.logo !== '' ? 
                                selectedChannelMetadata.logo : 
                                (
                                    currentChannel.tokenType === 'ERC20' ?
                                    '/erc20Icon.svg' :
                                    '/blank_nft.svg'
                                )
                            }
                            loading="lazy"
                            alt="AlphaPING Logo"
                        />
                        <AvatarFallback>AP</AvatarFallback>
                    </Avatar>
                </div>
            }
        </CardTitle>
    );
}
export default MessagesHeader;