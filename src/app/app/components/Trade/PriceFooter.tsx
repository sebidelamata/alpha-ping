'use client';

import React from "react";
import { CardFooter } from "@/components/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/components/ui/badge";
import { ChartCandlestick } from "lucide-react";

const PriceFooter: React.FC = () => {
    return (
        <CardFooter>
            <div className="flex flex-col gap-1 text-accent text-sm justify-center w-full">
                <Badge
                    variant={"outline"}
                    className="flex flex-row justify-center gap-4"
                >
                    <Link
                        href={'https://0x.org/'}
                        target="_blank"
                        className="text-secondary"
                    >
                        Swap at the best prices using 0x protocol market aggregation from over 130 exchanges
                    </Link>
                    <ChartCandlestick className="text-secondary"/>
                </Badge>
                <div>
                    0x collects a fee of 0.15% on each swap,
                </div>
                <div>
                    AlphaPING collects 0.00% on each swap, for a total of a 0.15% swap fee.
                </div>
            </div>
        </CardFooter>
    );
}

export default PriceFooter;