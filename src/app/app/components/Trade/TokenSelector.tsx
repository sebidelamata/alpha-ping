import React, {
    useState
} from "react";
import { 
    Dialog, 
    DialogTrigger, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter 
} from "@/components/components/ui/dialog";
import { Button } from "@/components/components/ui/button";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { 
    Command, 
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList 
} from "@/components/components/ui/command";
import tokenList from "../../../../../public/tokenList.json";
import tokensByChain from "src/lib/tokensByChain";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

interface ITokenSelector {
    tokenObject: {
        address: string | null;
        symbol: string;
        decimals: number;
        logoURI: string | null;
        name: string;
    };
    setToken: (value: string) => void;
    tradeSide: string;
}

const TokenSelector:React.FC<ITokenSelector> = ({
    tokenObject,
    setToken,
    tradeSide
}) => {

    const { chainId } = useEtherProviderContext()

    const [open, setOpen] = useState<boolean>(false)

    return(
        <Dialog 
            open={open} 
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                {
                    tokenObject.symbol !== undefined ? 
                    <Button
                        className="text-xl h-16 w-96 gap-4"
                        variant="outline"
                        aria-expanded={open}
                    >
                        <Avatar>
                            <AvatarImage 
                                alt={tokenObject.symbol}
                                src={
                                    (
                                        tokenObject !== null && 
                                        tokenObject.logoURI !== null
                                    ) ? 
                                    tokenObject.logoURI : 
                                    ""
                                } 
                                className="h-12 w-12"
                            />
                            <AvatarFallback>
                                {tokenObject.symbol}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            {tokenObject.symbol}
                        </div>
                        <ChevronDown className="h-4 w-4 ml-2" /> 
                    </Button> : 
                    <Button
                        className="text-xl gap-4 h-16 w-96"
                        variant="outline"
                        aria-expanded={open}
                    >
                        <div>
                            Select Token
                        </div>
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {
                            tradeSide === "buy" ?
                            'Select Buy Token' :
                            'Select Sell Token'
                        }
                    </DialogTitle>
                    <DialogDescription>
                        {
                            tradeSide === "buy" ? 
                            "Choose a token to buy." : 
                            "Choose a token to sell."
                        }
                    </DialogDescription>
                </DialogHeader>
                <Command className="bg-primary text-secondary">
                    <CommandInput placeholder="Search token..." />
                    <CommandList>
                        <CommandEmpty>No tokens found.</CommandEmpty>
                        <CommandGroup>
                            {
                                tokensByChain(tokenList, Number(chainId))
                                .map((token) => (
                                    <CommandItem
                                        key={token.address}
                                        value={token.name.toLowerCase()}
                                        onSelect={() => {
                                            setToken(token.symbol.toLowerCase());
                                            setOpen(false)
                                        }}
                                    >
                                        <div className="flex flex-row items-center justify-start gap-4">
                                            <Avatar>
                                                <AvatarImage 
                                                    alt={token.symbol}
                                                    src={
                                                        (token !== null && 
                                                        token.logoURI !== null) ? 
                                                        token.logoURI : 
                                                        ""
                                                    } 
                                                    className="h-12 w-12"
                                                />
                                                <AvatarFallback>
                                                    {token.symbol}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                {
                                                    `${token.name} (${token.symbol})`
                                                }
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))
                            }
                        </CommandGroup>
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    )
}

export default TokenSelector;