'use client';

import React from "react";
import { 
    Collapsible, 
    CollapsibleTrigger, 
    CollapsibleContent 
} from "@/components/components/ui/collapsible";
import { 
    SidebarMenuButton, 
    SidebarMenuItem,
    SidebarMenuSub 
} from "@/components/components/ui/sidebar";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/components/ui/avatar";
// import humanReadableNumbers from "src/lib/humanReadableNumbers";
// import Link from "next/link";
// import { ExternalLink } from "lucide-react";
import Channel from "./Channel";
import { AlphaPING } from "typechain-types";

interface IBeefyChannelGroup{
    channels: {
        channel: AlphaPING.ChannelStructOutput,
        metadata: tokenMetadata
    }[]
}

const BeefyChannelGroup:React.FC<IBeefyChannelGroup> = ({ channels }) => {

    // will need to do something similar for beefy channels later
    // const { aaveAccount } = useAaveDetailsContext()

    return(
            <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                        <SidebarMenuButton >
                            <div className="flex items-center justify-start gap-4">
                            <Avatar className="size-4">
                                <AvatarImage 
                                    src='https://s2.coinmarketcap.com/static/img/coins/64x64/7311.png' 
                                    alt="Beefy Logo"
                                    loading="lazy"
                                />
                                <AvatarFallback>
                                    Beefy
                                </AvatarFallback>
                            </Avatar>
                            <p>
                                Beefy
                            </p>
                            </div>  
                        </SidebarMenuButton>    
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                        {
                            channels.map(({ channel, metadata }) => (
                                <SidebarMenuItem key={channel.tokenAddress}>
                                <Channel 
                                    channel={channel} 
                                    tokenMetadata={metadata} 
                                />
                                </SidebarMenuItem>
                            ))
                        }
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
                </Collapsible>
    )
}

export default BeefyChannelGroup;