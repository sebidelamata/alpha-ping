'use client';

import React, {
    useState
} from "react";
import { 
    Card, 
    CardContent 
} from "@/components/components/ui/card";
import Price from "./Price";
import Quote from "./Quote";
import { ScrollArea } from "@/components/components/ui/scroll-area";

const Trade:React.FC = () => {

    const [finalize, setFinalize] = useState<boolean>(false);
    const [price, setPrice] = useState<PriceResponse | null>();
    const [quote, setQuote] = useState<QuoteResponse | null>();
    // slippage settings
    const [slippage, setSlippage] = useState<string>("1.00");

    return(
        <Card 
            className="flex flex-col w-full h-full bg-primary text-secondary"
            onWheel={(e) => e.stopPropagation()}
        >
            <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                <ScrollArea className="h-full w-full overflow-y-auto p-4">
                    <div >
                        {finalize && price ? (
                            <Quote
                            price={price}
                            quote={quote}
                            setQuote={setQuote}
                            slippage={slippage}
                            setFinalize={setFinalize}
                            />
                        ) : (
                            <Price
                            price={price}
                            setPrice={setPrice}
                            setFinalize={setFinalize}
                            slippage={slippage}
                            setSlippage={setSlippage}
                            />
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
} 

export default Trade;