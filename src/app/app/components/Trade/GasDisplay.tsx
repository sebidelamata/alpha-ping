import React, {
    useState, 
    useEffect
} from "react";
import { Fuel } from "lucide-react";
import { Skeleton } from "@/components/components/ui/skeleton";
import qs from "qs";

interface CMCQuoteUSD {
    quote: {
        USD: {
            price: number;
        };
    }
}

interface IGasDisplay {
    gasEstimate: string | null;
}

const GasDisplay: React.FC<IGasDisplay> = ({gasEstimate}) => {
    // get latest quote in USD
    const [ethUSDPrice, setEthUSDPrice] = useState<string>("");
    const [cmcError, setCmcError] = useState<string | null>(null);
    useEffect(() => {
        const params = {
            symbol: "eth",
        }
        async function main() {
            const response = await fetch(`/api/CMCquoteLatest?${qs.stringify(params)}`);
            const data = await response.json();
            // Get the first token's data dynamically
            const tokenDataArray = Object.values(data.data)[0] as CMCQuoteUSD[];
            if (!tokenDataArray?.length || !tokenDataArray[0]?.quote?.USD?.price) {
                throw new Error("USD price not found in response");
            }
        
            const usdPrice = tokenDataArray[0].quote.USD.price;
            setEthUSDPrice(usdPrice.toString());
            setCmcError(null);
        }
        main();
    },[gasEstimate]);

    return(
        <div className="flex flex-row items-center justify-end w-full p-2 bg-primary text-secondary rounded-lg gap-4">
            <Fuel className="text-secondary h-6"/>
            {
                ethUSDPrice !== "" && gasEstimate !== null && !cmcError ?
                    <div>
                        {
                            `${gasEstimate} ETH (${
                                // if its less than a penny just display that
                                (Number(ethUSDPrice) * Number(gasEstimate)).toFixed(2) !==  "0.00" ?
                                "$" + (Number(ethUSDPrice) * Number(gasEstimate)).toFixed(2) :
                                "< $0.01"
                            } USD)`
                        }
                    </div> :
                    <Skeleton className="h-4 w-48 bg-secondary rounded-md" />
            }
        </div>
    )
}

export default GasDisplay;