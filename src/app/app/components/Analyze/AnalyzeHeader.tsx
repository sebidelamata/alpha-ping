import React from "react";
import { 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/components/components/ui/card";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
import { Switch } from "@/components/components/ui/switch";
import { Label } from "@/components/components/ui/label";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useUserProviderContext } from "src/contexts/UserContext";
import { 
    Select, 
    SelectTrigger, 
    SelectValue, 
    SelectContent, 
    SelectItem 
} from "@/components/components/ui/select";

interface IAnalyzeHeader{
    blocksFilter: boolean;
    setBlocksFilter: (value: boolean) => void;
    messageWeighting: Weighting;
    setMessageWeighting: (value: Weighting) => void;
    timeRange: TimeFrame;
    setTimeRange: (value: TimeFrame) => void;
}

const AnalyzeHeader:React.FC<IAnalyzeHeader> = ({ 
    blocksFilter, 
    setBlocksFilter,
    messageWeighting,
    setMessageWeighting,
    timeRange,
    setTimeRange 
}) => {

    const { currentChannel, selectedChannelMetadata } = useChannelProviderContext()
    const { 
            followFilter,
            setFollowFilter 
    } = useUserProviderContext()

    return(
        <CardHeader className="sticky top-0 z-10 flex flex-row justify-between gap-2">
            <div className="flex flex-col gap-2">
                <CardTitle className="flex flex-row text-3xl gap-4">
                    Analyze {currentChannel?.name || ""}
                    {
                        currentChannel &&
                        selectedChannelMetadata &&
                        <div className="flex flex-row gap-2">
                            <Avatar className="size-10">
                                <AvatarImage
                                    src={
                                        selectedChannelMetadata.logo !== '' ? 
                                        selectedChannelMetadata.logo : 
                                        (
                                            currentChannel.tokenType === 'ERC20' ?
                                            '/erc20Icon.svg' :
                                            '/blank_nft.svg'
                                        )
                                    }
                                    loading="lazy"
                                    alt="AlphaPING Logo"
                                />
                                <AvatarFallback>AP</AvatarFallback>
                            </Avatar>
                        </div>
                    }
                </CardTitle>
                <CardDescription>
                    Dive into user sentiments, drill down to your follow list.
                </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <div className="flex items-center space-x-2">
                    <Switch 
                        id="follows-filter" 
                        className="data-[state=checked]:bg-accent"
                        checked={followFilter} 
                        onCheckedChange={() => setFollowFilter(!followFilter)}
                    />
                    <Label htmlFor="follows-filter">Follows</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch 
                        id="blocks-filter" 
                        className="data-[state=checked]:bg-accent"
                        checked={blocksFilter} 
                        onCheckedChange={() => setBlocksFilter(!blocksFilter)}
                    />
                    <Label htmlFor="blocks-filter">Blocks</Label>
                </div>
            </div>
            <div className="flex flex-row justify-start gap-4">
                <Select 
                    value={messageWeighting} 
                    onValueChange={(value: string) => setMessageWeighting(value as Weighting)}
                >
                    <SelectTrigger
                        className="w-[220px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Unweighted" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="unweighted" className="rounded-lg">
                            Unweighted
                        </SelectItem>
                        <SelectItem value="post" className="rounded-lg">
                            Post Balance Weighted
                        </SelectItem>
                        <SelectItem value="current" className="rounded-lg">
                            Current Balance Weighted
                        </SelectItem>
                        <SelectItem value="delta" className="rounded-lg">
                            Balance Delta Weighted
                            </SelectItem>
                        <SelectItem value="inverse" className="rounded-lg">
                            Inverse Balance Weighted
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Select 
                    value={timeRange} 
                    onValueChange={(value: string) => setTimeRange(value as TimeFrame)}
                >
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        {/* <SelectItem value="all" className="rounded-lg">
                            All Time
                        </SelectItem> */}
                        <SelectItem value="1y" className="rounded-lg">
                            Last Year
                        </SelectItem>
                        <SelectItem value="6m" className="rounded-lg">
                            Last 6 months
                        </SelectItem>
                        <SelectItem value="3m" className="rounded-lg">
                            Last 3 months
                            </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                        <SelectItem value="1d" className="rounded-lg">
                            Last 24 hours
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
    )
}

export default AnalyzeHeader;