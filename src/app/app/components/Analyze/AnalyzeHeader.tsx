import React from "react";
import { 
    CardHeader, 
    CardTitle, 
} from "@/components/components/ui/card";
import { Switch } from "@/components/components/ui/switch";
import { Label } from "@/components/components/ui/label";
import { 
    Select, 
    SelectTrigger, 
    SelectValue, 
    SelectContent, 
    SelectItem 
} from "@/components/components/ui/select";
import MessagesHeaderTokenStats from "../Messages/MessagesHeader/MessagesHeaderTokenStats";
import MessagesHeaderAaveStats from "../Messages/MessagesHeader/MessagesHeaderAaveStats";

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

    return(
        <CardHeader className="sticky top-0 z-10 flex flex-row justify-between gap-2 p-0">
                <CardTitle className="flex flex-row flex-wrap mx-0">
                    <MessagesHeaderAaveStats/>
                    <MessagesHeaderTokenStats/>
                    <div className="flex flex-row items-center justify-end gap-4 text-xl">
                        <Label 
                            htmlFor="blocks-filter"
                            className="text-xl"
                        >
                            Blocks
                        </Label>
                        <Switch 
                            id="blocks-filter" 
                            className="data-[state=checked]:bg-accent"
                            checked={blocksFilter} 
                            onCheckedChange={() => setBlocksFilter(!blocksFilter)}
                        />
                        <Select 
                            value={messageWeighting} 
                            onValueChange={(value: string) => setMessageWeighting(value as Weighting)}
                        >
                            <SelectTrigger
                                className="w-[220px] rounded-lg"
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
                                className="w-[160px] rounded-lg"
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
                </CardTitle>
        </CardHeader>
    )
}

export default AnalyzeHeader;