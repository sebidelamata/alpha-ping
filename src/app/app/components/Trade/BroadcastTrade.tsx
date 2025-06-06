import React, {
    useState
} from "react";
import { Switch } from "@/components/components/ui/switch";
import { Label } from "@/components/components/ui/label";

const BroadcastTrade: React.FC = () => {

    const [isBroadcasting, setIsBroadcasting] = useState(false);

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