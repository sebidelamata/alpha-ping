import React, {
    useEffect,
    useState,
    ChangeEvent
} from "react";
import { 
    formatUnits, 
    parseUnits,
    erc20ABI, 
    Address,
} from "ethers";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent, 
    CardFooter 
} from "@/components/components/ui/card";
import ERC20Faucet from '../../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { permit2Abi } from "src/lib/permit2abi";
import qs from 'qs'
import ZeroExLogo from "../../../../../public/dark-0x-logo.png";
import tokenList from "../../../../../public/tokenList.json";
import { ethers } from 'ethers'
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "src/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import tokensByChain from "src/lib/tokensByChain";
import { token } from "typechain-types/@openzeppelin/contracts";

export const DEFAULT_BUY_TOKEN = (chainId: number) => {
    if (chainId === 42161) {
      return "weth";
    }
  };

interface IPrice {
    price: any;
  setPrice: (price: any) => void;
  setFinalize: (finalize: boolean) => void;
  chainId: number;
}

const Price:React.FC = ({
    price,
    setPrice,
    setFinalize,
}: {
    price: any;
    setPrice: (price: any) => void;
    setFinalize: (finalize: boolean) => void;
  }) => {

    const { chainId, signer } = useEtherProviderContext()
    const { account } = useUserProviderContext()

    const [sellToken, setSellToken] = useState("weth");
    const [buyToken, setBuyToken] = useState("usdc");
    const [sellAmount, setSellAmount] = useState("");
    const [buyAmount, setBuyAmount] = useState("");
    const [tradeDirection, setTradeDirection] = useState("sell");
    const [error, setError] = useState([]);
    const [buyTokenTax, setBuyTokenTax] = useState({
      buyTaxBps: "0",
      sellTaxBps: "0",
    });
    const [sellTokenTax, setSellTokenTax] = useState({
      buyTaxBps: "0",
      sellTaxBps: "0",
    });

    const handleSellTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSellToken(e.target.value);
    };
    function handleBuyTokenChange(e: ChangeEvent<HTMLSelectElement>) {
    setBuyToken(e.target.value);
    }
    const sellTokenObject = tokensByChain(tokenList, Number(chainId)).
        filter((token) => token.symbol.toLowerCase() === sellToken)[0];
    const buyTokenObject = tokensByChain(tokenList, Number(chainId)).
        filter((token) => token.symbol.toLowerCase() === buyToken)[0];

    const sellTokenDecimals = sellTokenObject.decimals;
    const buyTokenDecimals = buyTokenObject.decimals;
    const sellTokenAddress = sellTokenObject.address;

    const parsedSellAmount =
        sellAmount && tradeDirection === "sell"
        ? parseUnits(sellAmount, sellTokenDecimals).toString()
        : undefined;

    const parsedBuyAmount =
        buyAmount && tradeDirection === "buy"
        ? parseUnits(buyAmount, buyTokenDecimals).toString()
        : undefined;
    
    // Fetch price data and set the buyAmount whenever the sellAmount changes
    useEffect(() => {
        const params = {
        chainId: chainId,
        sellToken: sellTokenObject.address,
        buyToken: buyTokenObject.address,
        sellAmount: parsedSellAmount,
        buyAmount: parsedBuyAmount,
        signer: signer,
        swapFeeRecipient: process.env.NEXT_PUBLIC_FEE_RECIPIENT,
        swapFeeBps: process.env.NEXT_PUBLIC_AFFILIATE_FEE,
        swapFeeToken: buyTokenObject.address,
        tradeSurplusRecipient: process.env.NEXT_PUBLIC_FEE_RECIPIENT,
        };

        async function main() {
        const response = await fetch(`/api/price?${qs.stringify(params)}`);
        const data = await response.json();

        if (data?.validationErrors?.length > 0) {
            // error for sellAmount too low
            setError(data.validationErrors);
        } else {
            setError([]);
        }
        if (data.buyAmount) {
            setBuyAmount(formatUnits(data.buyAmount, buyTokenDecimals));
            setPrice(data);
        }
        // Set token tax information
        if (data?.tokenMetadata) {
            setBuyTokenTax(data.tokenMetadata.buyToken);
            setSellTokenTax(data.tokenMetadata.sellToken);
        }
        }

        if (sellAmount !== "") {
        main();
        }
    }, [
        sellTokenObject.address,
        buyTokenObject.address,
        parsedSellAmount,
        parsedBuyAmount,
        chainId,
        sellAmount,
        setPrice,
        buyTokenDecimals,
        signer
    ]);

  // Hook for fetching balance information for specified token for a specific taker address
  const [ userBalance, setUserBalance ] = useState<string | null>(null)
  useEffect(() => {
    const getUserBalance = async () => {
        if(sellTokenObject.address !== null){
            const token = new ethers.Contract(
                sellTokenObject.address,
                ERC20Faucet.abi,
                signer
            )
            const userBalance = await token.balanceOf(account)
            setUserBalance(userBalance.toString())
        }
    }
    getUserBalance()
}, [ sellTokenObject.address, signer, account])

  console.log("taker sellToken balance: ", userBalance);

  const inSufficientBalance =
  userBalance && sellAmount
      ? parseUnits(sellAmount, sellTokenDecimals) > BigInt(userBalance)
      : true;

  // Helper function to format tax basis points to percentage
  const formatTax = (taxBps: string) => (parseFloat(taxBps) / 100).toFixed(2);


    return(
        <Card className="flex flex-col h-full w-[100%] bg-primary text-secondary">
            <CardHeader className="w-[100%]">
                <CardTitle>
                   <Avatar>
                    <AvatarImage src={ZeroExLogo.src} className="w-[100%] h-[100%]"></AvatarImage>
                    <AvatarFallback>
                        0x
                    </AvatarFallback>
                   </Avatar>
                </CardTitle>
            </CardHeader>
            <CardContent>
                lipsem oreem
            </CardContent>
            <CardFooter>
                <div className="flex flex-col gap-1">
                    <div>
                        Swap at the best prices using 0x aggregator
                    </div>
                    <div>
                        0x collects a fee of 0.15% on each swap, AlphaPING collects 0.05% on each swap, for a total of 0.2% fee
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
export default Price;