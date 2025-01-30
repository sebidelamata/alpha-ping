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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/components/ui/accordion"


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
                        <Accordion type="single" collapsible>
                            {
                                mod.map((channel) => {
                                    return(
                                        <AccordionItem 
                                            key={channel.tokenAddress} 
                                            value={channel.tokenAddress}
                                        > 
                                            <AccordionTrigger>
                                                {channel.name}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <ModBannerListItem 
                                                    channel={channel}
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })
                            }
                        </Accordion>
                    </ScrollArea>
                }
            </CardHeader>
        </Card>
    )
}

export default ModBanner;