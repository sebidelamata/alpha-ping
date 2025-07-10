'use client';

import React, {
    useState
} from "react";
import { 
    Collapsible, 
    CollapsibleTrigger, 
    CollapsibleContent 
} from "@radix-ui/react-collapsible";
import { 
    SidebarMenuButton, 
    SidebarMenuItem,
    SidebarMenuSub, 
} from "@/components/components/ui/sidebar";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/components/ui/avatar";
import Channel from "./Channel";
import { AlphaPING } from "typechain-types";


interface INFTChannelGroup{
    channels: {
        channel: AlphaPING.ChannelStructOutput,
        metadata: tokenMetadata
    }[]
}

const NFTChannelGroup:React.FC<INFTChannelGroup> = ({ channels }) => {
    const [hoverToken, setHoverToken] = useState(false);
    return(
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
            <CollapsibleTrigger 
                asChild
                onMouseEnter={() => setHoverToken(true)}
                onMouseLeave={() => setHoverToken(false)}
            >
                <SidebarMenuButton>  
                <div className="flex items-center justify-start gap-4">
                    <Avatar className="size-4">
                    <AvatarImage 
                        src={ hoverToken ? 'blank_nftAlt.svg' : 'blank_nft.svg'}
                        alt="NFT Logo"
                        loading="lazy"
                    />
                    <AvatarFallback>
                        NFTs
                    </AvatarFallback>
                    </Avatar>
                    <p>
                        NFTs
                    </p>
                </div> 
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <SidebarMenuSub>
                {
                    channels.map(({ channel, metadata }) => {
                        return <SidebarMenuItem key={channel.tokenAddress}>
                                <Channel
                                    channel={channel}
                                    tokenMetadata={metadata}
                                />
                                </SidebarMenuItem>
                    })
                }
                </SidebarMenuSub>
            </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}

export default NFTChannelGroup;