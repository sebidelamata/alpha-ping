'use client';

import React, {
    useState
} from "react";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import ModBannerListItem from "./ModBannerListItem";
import {
    Card,
    CardHeader
  } from "@/components/components/ui/card"
import { ScrollArea } from "@/components/components/ui/scroll-area";


const ModBanner:React.FC = () => {

    const { mod } = useUserProviderContext()

    const [txMessageMod, setTxMessageMod] = useState<string | null | undefined>(null)

    return(
        <Card className="bg-primary text-secondary">
            <CardHeader>
                {
                    mod &&
                    mod.length === 0 &&
                    "You currently have Moderator admin role for:"
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
                                                txMessageMod={txMessageMod}
                                                setTxMessageMod={setTxMessageMod}
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