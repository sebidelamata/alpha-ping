import React, {
    useEffect,
    useState
} from "react";
import { Switch } from "@/components/components/ui/switch";
import { Label } from "@/components/components/ui/label";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { AlphaPING } from '../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import { useUserProviderContext } from "src/contexts/UserContext";

interface IBroadcastTrade {
    buyTokenAddress: string;
}

const BroadcastTrade: React.FC<IBroadcastTrade> = ({buyTokenAddress}) => {console.log(buyTokenAddress);
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

    const [isBroadcasting, setIsBroadcasting] = useState(false);
    if(
        userChannels.filter((channel) => {
            return channel.tokenAddress.toString() === buyTokenAddress
        }).length !== 0
    ){
        console.log('hi')
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
}
export default BroadcastTrade;