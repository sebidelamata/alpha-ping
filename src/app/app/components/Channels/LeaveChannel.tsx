'use client';

import React from "react";
import { useChannelProviderContext } from "../../../../contexts/ChannelContext";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";

interface LeaveConnectProps{
    isHovered: boolean;
    channelID: string | null;
}

const LeaveChannel:React.FC<LeaveConnectProps> = ({ isHovered, channelID }) => {

    const { setCurrentChannel } = useChannelProviderContext()
    const { signer, alphaPING } = useEtherProviderContext()

    const handleClick = async () => {
        if(channelID){
            const transaction = await alphaPING?.connect(signer).leaveChannel(BigInt(channelID))
            await transaction?.wait()
            setCurrentChannel(null)
        }
    }

    return(
        <div className="leave-channel" onClick={() => handleClick()}>
            {
                isHovered === true ?
                <img 
                        src='leave-icon.svg'
                        alt="Leave Channel"
                        className='leave-channel-icon'
                        loading="lazy"
                    /> :
                ''
            }
        </div>
    )
}

export default LeaveChannel