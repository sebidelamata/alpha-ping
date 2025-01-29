'use client';

import React, {
    useState,
    MouseEvent
} from "react";
import TransferMod from "./TransferMod";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/components/ui/dialog"
import { Button } from "@/components/components/ui/button";

interface ModBannerListItemProps{
    channel: AlphaPING.ChannelStructOutput;
}

const ModBannerListItem:React.FC<ModBannerListItemProps> = ({ channel }) => {

    const [open, setOpen] = useState<boolean>(false)

    return(
        <Card className="bg-primary text-secondary">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle className="flex flex-row items-center gap-4">
                    {
                        channel &&
                        channel?.name
                    }
                </CardTitle>
                <Dialog
                    open={open} 
                    onOpenChange={setOpen}
                >
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            Transfer Mod Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                <TransferMod 
                                    channel={channel} 
                                    setOpen={setOpen}
                                />
                            </DialogTitle>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                
            </CardContent>
        </Card>
        // <div className="mod-banner-li">
        //     <ChannelBans channel={channel}/>
        // </div>
    )
}

export default ModBannerListItem