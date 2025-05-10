import React from "react";
import { Badge } from "@/components/components/ui/badge";

const AlphaPingFee: React.FC = () => { 

    return(
        <div>
            <Badge variant={"default"}>
                {
                    `AlphaPING Fee: FREE! ($0.00)`
                }
            </Badge>
        </div>
    )
}

export default AlphaPingFee;