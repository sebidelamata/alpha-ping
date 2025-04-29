import React, {
    useEffect,
    useState,
    ChangeEvent
} from "react";
import { 
    formatUnits, 
    parseUnits 
} from "ethers";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent, 
    CardFooter 
} from "@/components/components/ui/card";

const Price:React.FC = () => {
    return(
        <Card className="flex flex-col h-full w-[100%] bg-primary text-secondary">
            <CardHeader className="w-[100%]">
                <CardTitle>
                    Price
                </CardTitle>
            </CardHeader>
            <CardContent>
                lipsem oreem
            </CardContent>
            <CardFooter>
                <div className="flex flex-col gap-1">
                    <div>
                        Swap at the best prices using 0x aggregator
                    </div>
                    <div>
                        0x collects a fee of 0.15% on each swap, AlphaPING collects 0.05% on each swap, for a total of 0.2% fee
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
export default Price;