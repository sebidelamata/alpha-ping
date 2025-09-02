import React from "react";
import { Separator } from "@/components/components/ui/separator";
import { Button } from "@/components/components/ui/button";
import { ArrowDownUp } from "lucide-react";

interface IPriceFlipTokens {
    flipTokens: (
        sellToken: string,
        buyToken: string,
        sellAmount: string,
        buyAmount: string
    ) => void;
    sellToken: string;
    buyToken: string;
    sellAmount: string;
    buyAmount: string;
}

const PriceFlipTokens: React.FC<IPriceFlipTokens> = ({
    flipTokens, 
    sellToken,
    buyToken,
    sellAmount,
    buyAmount
}) => {
    return (
        <section className="flex flex-col items-center justify-center gap-2">
            <Separator color="accent"/>
            <Button 
                onClick={() => flipTokens(
                    sellToken,
                    buyToken,
                    sellAmount,
                    buyAmount
                )} 
                className="h-18 w-18 text-xl justify-center align-middle items-center scale-120" 
                variant={"outline"}
            >
                <ArrowDownUp size={48}/>
            </Button>
            <Separator color="accent"/>
        </section>
        );
    }
export default PriceFlipTokens;          