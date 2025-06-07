import React, {
    useEffect,
    useState
} from "react";
import { Switch } from "@/components/components/ui/switch";
import { Label } from "@/components/components/ui/label";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { AlphaPING } from '../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import { useUserProviderContext } from "src/contexts/UserContext";
import { Skeleton } from "@/components/components/ui/skeleton";

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
    const { alphaPING } = useEtherProviderContext()
    const { account } = useUserProviderContext()
    const [userChannels, setUserChannels] = useState<AlphaPING.ChannelStructOutput[]>([]);
    useEffect(() => {
        const fetchChannels = async () => {
            if (alphaPING) {
                let channels: AlphaPING.ChannelStructOutput[] = []
                const totalChannels = await alphaPING.totalChannels();
                for(let i = 1; i <= totalChannels; i++) {
                    const channel = await alphaPING.channels(i);
                    const hasJoined = await alphaPING.hasJoinedChannel(channel.id, account)
                    if(hasJoined === true){
                        channels = [...channels, channel]
                    }
                }
                setUserChannels(channels);
            }
        };
        fetchChannels();
    }, [alphaPING, account]);

    if(
        userChannels.filter((channel) => {
            return channel.tokenAddress.toLowerCase() === buyTokenAddress.toLowerCase()
        }).length !== 0
    ){
        // set the channel id to broadcast to
        setBuyTokenChannel(
            userChannels.filter((channel) => {
                return channel.tokenAddress.toLowerCase() === buyTokenAddress.toLowerCase()
            })[0]
        );
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
    } else {
        return(
            <div className="flex items-center space-x-2 justify-end">
                <Skeleton className="w-64 h-6" />
            </div>
        )
    }
}
export default BroadcastTrade;