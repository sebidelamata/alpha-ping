'use client';

import React from "react";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import ModBannerListItem from "./ModBannerListItem";
import {
    Card,
    CardHeader,
    CardTitle
  } from "@/components/components/ui/card"
import { ScrollArea } from "@/components/components/ui/scroll-area";


const ModBanner:React.FC = () => {

    const { mod } = useUserProviderContext()

    return(
        <Card className="bg-primary text-secondary">
            <CardHeader>
                {
                    mod &&
                    mod.length === 0 &&
                    <CardTitle className="flex flex-row items-center justify-center gap-4">
                        You do not have any Moderator roles
                    </CardTitle>
                }
                {
                    mod &&
                    mod.length !== 0 &&
                    <CardTitle className="flex flex-row items-center justify-center gap-4">
                        You have Moderator role for:
                    </CardTitle>
                }
                {
                    mod &&
                    mod.length > 0 &&
                    <ScrollArea className="h-64 rounded-md border">
                        <ul>
                            {
                                mod.map((channel) => {
                                    return(
                                        <li key={channel.id}> 
                                            <ModBannerListItem 
                                                channel={channel}
                                            />
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </ScrollArea>
                }
            </CardHeader>
        </Card>
    )
}

export default ModBanner;