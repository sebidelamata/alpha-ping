'use client';

import React, {
    useState
} from "react";
import TransferMod from "./TransferMod";
import ChannelBans from "./ChannelBans";
import { AlphaPING } from "typechain-types";
import {
    Card,
    CardContent,
    CardHeader
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
        <Card className="bg-primary text-secondary w-[100%]">
            <CardHeader className="flex flex-row items-center justify-center gap-4 w-[100%]">
                <Dialog
                    open={open} 
                    onOpenChange={setOpen}
                >
                    <DialogTrigger asChild className="flex flex-row">
                        <Button variant="secondary">
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
                <ChannelBans channel={channel}/>
            </CardContent>
        </Card>
    )
}

export default ModBannerListItem