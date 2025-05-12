'use client';

import React, {
    useState
} from "react";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent 
} from "@/components/components/ui/card";
import Price from "./Price";
import { Message, PriceResponse } from "src/types/global";
import Quote from "./Quote";

const Trade:React.FC = () => {

    const [finalize, setFinalize] = useState<boolean>(false);
    const [price, setPrice] = useState<PriceResponse | undefined>();
    const [quote, setQuote] = useState();
    // slippage settings
    const [slippage, setSlippage] = useState<string>("1.00");

    return(
        <Card className="flex flex-col w-full h-full bg-primary text-secondary">
            <CardContent className="flex-1 w-full">
                {
                    finalize && price ?
                    <Quote
                        price={price}
                        quote={quote}
                        setQuote={setQuote}
                        slippage={slippage}
                    /> :
                    <Price
                        price={price}
                        setPrice={setPrice}
                        setFinalize={setFinalize}
                        slippage={slippage}
                        setSlippage={setSlippage}
                    />
                }
            </CardContent>
        </Card>
    )
} 

export default Trade;