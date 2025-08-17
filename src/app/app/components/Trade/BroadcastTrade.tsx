'use client';

import React, { useMemo, useEffect } from "react";
import { Switch } from "@/components/components/ui/switch";
import { Label } from "@/components/components/ui/label";
import { AlphaPING } from '../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import useUserChannels from "src/hooks/useUserChannels";

interface IBroadcastTrade {
    buyTokenAddress: string;
    isBroadcasting: boolean;
    setIsBroadcasting: (isBroadcasting: boolean) => void;
    setBuyTokenChannel: (channel: AlphaPING.ChannelStructOutput) => void;
}

const BroadcastTrade: React.FC<IBroadcastTrade> = ({
    buyTokenAddress,
    isBroadcasting,
    setIsBroadcasting,
    setBuyTokenChannel
}) => {

    const { userChannels } = useUserChannels();

    const matchedChannel = useMemo(() => {
    return userChannels.find(
      (channel) =>
        channel.tokenAddress.toLowerCase() === buyTokenAddress.toLowerCase()
    );
  }, [userChannels, buyTokenAddress]);

    useEffect(() => {
        if (matchedChannel) {
            setBuyTokenChannel(matchedChannel);
        }
    }, [matchedChannel, setBuyTokenChannel]);

    if(matchedChannel){
        // set the channel id to broadcast to
        setBuyTokenChannel(
            userChannels.filter((channel) => {
                return channel.tokenAddress.toLowerCase() === buyTokenAddress.toLowerCase()
            })[0]
        )
    }

    return (
        <div className="flex items-center space-x-2 justify-end">
            <Switch 
                className="data-[state=checked]:bg-accent"
                checked={isBroadcasting} 
                onCheckedChange={() => setIsBroadcasting(!isBroadcasting)}
            />
            <Label htmlFor="airplane-mode">Broadcast Trade</Label>
        </div>
    );
}
export default BroadcastTrade;