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

const Trade:React.FC = () => {

    const [finalize, setFinalize] = useState<boolean>(false);
    const [price, setPrice] = useState<PriceResponse | undefined>();
    const [quote, setQuote] = useState();

    return(
        <Card className="flex flex-col w-full h-full bg-primary text-secondary">
            <CardContent className="flex-1 w-full">
                {
                    finalize && price ?
                    <div
                    className="w-full h-full flex items-center justify-center"
                    >
                        Quote</div> :
                    <Price
                        price={price}
                        setPrice={setPrice}
                        setFinalize={setFinalize}
                    />
                }
            </CardContent>
        </Card>
    )
} 

export default Trade;