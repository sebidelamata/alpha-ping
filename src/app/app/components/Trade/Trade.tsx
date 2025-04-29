import React from "react";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent 
} from "@/components/components/ui/card";
import Price from "./Price";

const Trade:React.FC = () => {
    return(
        <Card className="flex flex-col h-full w-[100%] bg-primary text-secondary">
            <CardHeader className="w-[100%]">
                <CardTitle>
                    Trade with 0x
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Price/>
            </CardContent>
        </Card>
    )
} 

export default Trade;