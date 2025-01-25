'use client';

import React from "react";
import { useChannelProviderContext } from "../../../../contexts/ChannelContext";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { Button } from "@/components/components/ui/button";
import { LogOut } from "lucide-react";

interface LeaveConnectProps{
    isHovered: boolean;
    channelID: string | null;
}

const LeaveChannel:React.FC<LeaveConnectProps> = ({ isHovered, channelID }) => {

    const { setCurrentChannel } = useChannelProviderContext()
    const { signer, alphaPING } = useEtherProviderContext()

    const handleClick = async (e) => {
        e.stopPropagation();
        if(channelID){
            const transaction = await alphaPING?.connect(signer).leaveChannel(BigInt(channelID))
            await transaction?.wait()
            setCurrentChannel(null)
        }
    }

    return(
        <>
            {
                isHovered === true ?
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={(e) => handleClick(e)}
                    className="hover:bg-accent"
                    aria-label="Leave Channel"
                >
                    <LogOut/>
                </Button> :
                ''
            }
        </>
    )
}

export default LeaveChannel