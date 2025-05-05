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
        <Card className="flex flex-col h-full w-[100%] bg-primary text-secondary">
            <CardHeader className="w-[100%]">
            </CardHeader>
            <CardContent>
                <Price
                    price={price}
                    setPrice={setPrice}
                    setFinalize={setFinalize}
                />
            </CardContent>
        </Card>
    )
} 

export default Trade;