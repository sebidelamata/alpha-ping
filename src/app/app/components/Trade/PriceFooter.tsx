import React from "react";
import { CardFooter } from "@/components/components/ui/card";

const PriceFooter: React.FC = () => {
    return (
        <CardFooter>
            <div className="flex flex-col gap-1 text-accent text-sm">
                <div className="text-secondary">
                    Swap at the best prices using 0x aggregator
                </div>
                <div>
                    0x collects a fee of 0.15% on each swap,
                </div>
                <div>
                    AlphaPING collects 0% on each swap, for a total of a 0.15% fee.
                </div>
            </div>
        </CardFooter>
    );
}

export default PriceFooter;