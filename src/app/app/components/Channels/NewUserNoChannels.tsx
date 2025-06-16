'use client';

import React, { useState } from "react";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogDescription, 
    DialogFooter 
} from "@/components/components/ui/dialog";
import { Button } from "@/components/components/ui/button";
import SearchChannels from "./SearchChannels";

const NewUserNoChannels: React.FC = () => {
  const { currentChannel } = useChannelProviderContext();

  const [open, setOpen] = useState<boolean>(currentChannel === null);

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Welcome to AlphaPING!</DialogTitle>
                        <DialogDescription>
                            <p>
                                You haven't joined any channels yet.
                            </p>
                            <p>
                                Join a channel to start chatting, analyzing, and trading.
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col items-center gap-4">
                        <SearchChannels/>
                        <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            Maybe Later
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
}

export default NewUserNoChannels;