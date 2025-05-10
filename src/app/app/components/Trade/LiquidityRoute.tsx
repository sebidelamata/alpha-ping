import React from "react";
import { 
    Dialog, 
    DialogTrigger, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription
} from "@/components/components/ui/dialog";
import { Button } from "@/components/components/ui/button";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
import { ArrowBigRightDash } from "lucide-react";

interface ILiquidityRoute {
    route: string[];
    buyTokenObject: {
        address: string | null;
        symbol: string;
        decimals: number;
        logoURI: string | null;
    }
    sellTokenObject: {
        address: string | null;
        symbol: string;
        decimals: number;
        logoURI: string | null;
    };
}

const LiquidityRoute: React.FC<ILiquidityRoute> = ({
    route,
    buyTokenObject,
    sellTokenObject
}) => {
    return (
        <div className="flex flex-col w-full h-full">
            <Dialog>
                <DialogTrigger asChild>
                    <Button 
                        variant={"outline"} 
                        className="w-full h-full"
                        disabled={route.length === 0}
                    >
                        Liquidity Route
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-3xl">
                            Liquidity Route
                        </DialogTitle>
                        <DialogDescription>
                            0x Protocol determines the best route for your trade.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <ul className="flex flex-col justify-center items-center w-full gap-2">
                            <li
                                className="text-secondary gap-1 flex flex-row items-center justify-center"
                            >
                                <Avatar
                                    className="h-8 w-8"
                                >
                                    <AvatarImage
                                        src={sellTokenObject.logoURI || ""}
                                        alt={sellTokenObject.symbol}
                                    />
                                    <AvatarFallback>
                                        {sellTokenObject.symbol}
                                    </AvatarFallback>
                                </Avatar>
                                <ArrowBigRightDash className="text-accent" />
                            </li>
                            {
                                route.map((exchange, index) => {
                                    const exchangeString = exchange.replace(/_/g, " ");
                                    return(
                                        <li
                                            key={index}
                                            className="text-secondary gap-1 flex flex-row items-center justify-center"
                                        >
                                            <div>
                                                {exchangeString}
                                            </div>
                                            <ArrowBigRightDash className="text-accent" />
                                        </li>
                                    )                              
                                })
                            }
                            <li
                                className="text-secondary gap-1 flex flex-row items-center justify-center"
                            >
                                <Avatar
                                    className="h-8 w-8"
                                >
                                    <AvatarImage
                                        src={buyTokenObject.logoURI || ""}
                                        alt={buyTokenObject.symbol}
                                    />
                                    <AvatarFallback>
                                        {buyTokenObject.symbol}
                                    </AvatarFallback>
                                </Avatar>
                            </li>
                        </ul>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default LiquidityRoute;