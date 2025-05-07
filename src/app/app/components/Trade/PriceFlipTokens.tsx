import React from "react";
import { Separator } from "@/components/components/ui/separator";
import { Button } from "@/components/components/ui/button";
import { ArrowDownUp } from "lucide-react";

interface IPriceFlipTokens {
    flipTokens: () => void;
}

const PriceFlipTokens: React.FC<IPriceFlipTokens> = ({flipTokens}) => {
    return (
        <section className="flex flex-col items-center justify-center gap-4">
            <Separator color="accent"/>
            <Button 
                onClick={flipTokens} 
                className="mt-4 h-30 w-30 text-4xl justify-center align-middle items-center scale-150" 
                variant={"outline"}
            >
                <ArrowDownUp size={48}/>
            </Button>
            <Separator color="accent"/>
        </section>
        );
    }
export default PriceFlipTokens;          