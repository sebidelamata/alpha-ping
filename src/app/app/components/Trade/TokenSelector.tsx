'use client';

import React, {
    useState,
    useEffect
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/components/ui/tabs";
import { Input } from "@/components/components/ui/input";
import { ethers } from "ethers";
import ERC20Faucet from '../../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { TriangleAlert } from "lucide-react";

type TokenObject = {
    address: string | null;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string | null;
};

interface ITokenSelector {
    tokenObject: TokenObject;
    setToken: (value: string) => void;
    tradeSide: string;
}

const TokenSelector:React.FC<ITokenSelector> = ({
    tokenObject,
    setToken,
    tradeSide
}) => {

    const { chainId, provider } = useEtherProviderContext()

    const [open, setOpen] = useState<boolean>(false)
    const [searchValue, setSearchValue] = useState<string>("");
    const [customToken, setCustomToken] = useState<TokenObject | null>(null);
    const [error, setError] = useState<string>("");

    // Reset states when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSearchValue("");
      setCustomToken(null);
      setError("");
    }
  }, [open]);

  // Fetch custom token when address is entered
  useEffect(() => {
    const fetchCustomToken = async () => {
      setError("");
      setCustomToken(null);

      const trimmedSearch = searchValue.trim();
      if (!ethers.isAddress(trimmedSearch)) {
        if (trimmedSearch) {
          setError("Invalid Ethereum address");
        }
        return;
      }

      if (!provider) {
        setError("No provider available");
        return;
      }

      try {
        const contract = new ethers.Contract(
            trimmedSearch, 
            ERC20Faucet.abi, 
            provider
        );
        const [name, symbol, decimals] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.decimals(),
        ]);

        const newToken: TokenObject = {
          address: trimmedSearch,
          name,
          symbol,
          decimals: Number(decimals),
          logoURI: null,
        };
        setCustomToken(newToken);
        console.log('TokenSelector: Custom token fetched', newToken);
      } catch (err) {
        console.error('TokenSelector: Error fetching token', err);
        setError("Failed to fetch token. Not an ERC-20 contract?");
      }
    };

    fetchCustomToken();
  }, [searchValue, provider]);

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
                <Tabs defaultValue="trending" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger 
                            value="trending" 
                            className="text-primary"
                        >
                            Trending
                        </TabsTrigger>
                        <TabsTrigger 
                            value="custom" 
                            className="text-primary"
                        >
                            Custom
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="trending">
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
                    </TabsContent>
                    <TabsContent value="custom">
                        <div className="flex flex-col gap-4">
                            <Input
                                placeholder="Enter token address (e.g., 0x6C2C...)"
                                value={searchValue}
                                onChange={(e) => {
                                console.log('TokenSelector: Custom address input', e.target.value);
                                setSearchValue(e.target.value);
                                }}
                                className="w-full"
                            />
                            <Command className="bg-primary text-secondary">
                                <CommandList>
                                {error ? (
                                    <CommandEmpty className="text-red-500">{error}</CommandEmpty>
                                ) : customToken ? (
                                    <CommandGroup>
                                    <CommandItem
                                        value={customToken.address || customToken.symbol.toLowerCase()}
                                        onSelect={() => {
                                        console.log('TokenSelector: Selected custom token', customToken);
                                        setToken(customToken.symbol.toLowerCase());
                                        setOpen(false);
                                        setSearchValue("");
                                        }}
                                    >
                                        <div className="flex flex-row items-center justify-start gap-4">
                                        <Avatar>
                                            <AvatarImage
                                            alt={customToken.symbol}
                                            src={customToken.logoURI || ""}
                                            className="h-12 w-12"
                                            />
                                            <AvatarFallback>{customToken.symbol}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            {`${customToken.name} (${customToken.symbol})`}
                                            <div className="text-sm text-muted-foreground">
                                            {customToken.address}
                                            </div>
                                        </div>
                                        </div>
                                    </CommandItem>
                                    </CommandGroup>
                                ) : (
                                    <CommandEmpty>Enter a valid token address</CommandEmpty>
                                )}
                                </CommandList>
                            </Command>
                            </div>
                            <DialogFooter>
                                <div className="flex flex-row items-center justify-start gap-4">
                                    <TriangleAlert className="h-16 w-16 text-red-500"/>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Please ensure you trust the token contract before proceeding!
                                        </p>
                                        <h3 className="flex justify-center">
                                            ALWAYS VERIFY A TOKEN ADDRESS BEFORE INTERACTING WITH IT!
                                        </h3>
                                    </div>
                                </div>
                            </DialogFooter>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default TokenSelector;