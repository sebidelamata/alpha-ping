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


interface ISpotChannelGroup{
    channels: {
      channel: AlphaPING.ChannelStructOutput,
      metadata: tokenMetadata
    }[]
}

const SpotChannelGroup:React.FC<ISpotChannelGroup> = ({ channels }) => {
  const [hoverToken, setHoverToken] = useState(false);
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            onMouseEnter={() => setHoverToken(true)}
            onMouseLeave={() => setHoverToken(false)}
          >
            <div className="flex items-center gap-4">
              <Avatar className="size-4">
                <AvatarImage
                  src={hoverToken ? 'erc20IconAlt.svg' : 'erc20Icon.svg'}
                  alt="Token Logo"
                />
                <AvatarFallback>Tokens</AvatarFallback>
              </Avatar>
              <p>Tokens</p>
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
  );
};

export default SpotChannelGroup;