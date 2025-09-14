'use client';

import React from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/components/ui/sidebar"
import { ScrollArea } from "@/components/components/ui/scroll-area"
import { useTokenMetadataContext } from "src/contexts/TokenMetaDataContext";
import { Skeleton } from "@/components/components/ui/skeleton";
import SpotChannelGroup from "./SpotChannelGroup";
import AaveChannelGroup from "./AaveChannelGroup";
import NFTChannelGroup from "./NFTChannelGroup";
import BeefyChannelGroup from "./BeefyChannelGroup";
import useSetInitialCurrentChannel from "src/hooks/useSetInitialCurrentChannel";
import useTokenMetadata from "src/hooks/useTokenMetadata";
import useChannelGroups from "src/hooks/useChannelGroups";
import useUserAaveDetails from "src/hooks/useUserAaveDetails";
import Loading from "../Loading";


const Channels:React.FC = () => {
  const { tokenMetadataLoading } = useTokenMetadataContext()

  // fetch channel metadata
  useTokenMetadata()

  // set the default channel to the first in the list if one hasn't been selected yet
  useSetInitialCurrentChannel()

  // set the user aave details
  useUserAaveDetails()

  // grab our channel groups
  const {
    spotChannels,
    aaveChannels,
    nftChannels,
    beefyChannels
  } = useChannelGroups()

  return (
    <SidebarGroup className="flex flex-col h-full min-h-0">
      {
        tokenMetadataLoading === true &&
        <Loading text="Loading Your Channels..."/>
      }
      <SidebarGroupLabel>
          <h1 className="text-xl text-secondary flex-shrink-0 pb-2">
              Channels
          </h1>
      </SidebarGroupLabel>
      <SidebarGroupContent className="h-full">
          <ScrollArea className="h-full pr-2 overflow-y-auto">
              <SidebarMenu className="overflow-visible">
                  {
                      tokenMetadataLoading === true ? (
                        Array.from({ length: 10 }, (_, index) => (
                          <SidebarMenuItem key={index} className="flex flex-row items-center justify-between w-full pb-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="w-48 h-6"/>
                          </SidebarMenuItem>
                        ))
                      ) : (
                        // when we render the channels, we want three groups:
                        // spot tokens, tokens deposited in Aave (or other 
                        // protocols in the future), and NFTs
                        <>
                          {
                            spotChannels.length > 0 && 
                            <SpotChannelGroup channels={spotChannels} />
                          }
                          {
                            aaveChannels.length > 0 &&
                            <AaveChannelGroup channels={aaveChannels} />
                          }
                          {
                            beefyChannels.length > 0 &&
                            <BeefyChannelGroup channels={beefyChannels} />
                          }
                          {
                            nftChannels.length > 0 &&
                            <NFTChannelGroup channels={nftChannels} />
                          }
                        </>
                      )
                  }
              </SidebarMenu>
          </ScrollArea>
      </SidebarGroupContent>
    </SidebarGroup>   
  );
}

export default Channels;