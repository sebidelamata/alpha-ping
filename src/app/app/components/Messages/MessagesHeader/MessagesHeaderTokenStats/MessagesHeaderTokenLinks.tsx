'use client';

import React from "react";
import { Button } from "@/components/components/ui/button";
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/components/ui/avatar";
import { Badge } from "@/components/components/ui/badge";
import Link from "next/link";
import { 
    ScrollText, 
    Globe,
    Info,
    Telescope,
    SquareArrowUpRight 
} from "lucide-react";
import Image from "next/image";
import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from "@/components/components/ui/popover";
import { ScrollArea } from "@/components/components/ui/scroll-area";
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem 
} from "@/components/components/ui/dropdown-menu";
import { CHAINS } from "src/lib/chainsInfo";
import CopyTextBlock from "./CopyTextBlock";


const MessagesHeaderTokenLinks:React.FC = () => {

    const { 
        currentChannel, 
        selectedChannelMetadata
    } = useChannelProviderContext()
    
    if(selectedChannelMetadata){
        return(
            <ul className="flex flex-row flex-wrap gap-2">
                {
                    selectedChannelMetadata.urls.technical_doc.length > 0 &&
                    <li key={"technical_doc"}>
                        <Badge variant="secondary" className="m-1 items-center">
                            <Link
                                href={selectedChannelMetadata.urls.technical_doc[0]}
                                target="_blank"
                                className="flex items-center"
                            >
                                <ScrollText className="h-4 w-4" />
                            </Link>
                        </Badge>
                    </li>
                }
                {
                    selectedChannelMetadata.urls.website.length > 0 &&
                    <li key={"website"}>
                        <Badge variant="secondary" className="m-1 items-center">
                            <Link
                                href={selectedChannelMetadata.urls.website[0]}
                                target="_blank"
                                className="flex items-center"
                            >
                                <Globe className="h-4 w-4" />
                            </Link>
                        </Badge>
                    </li>
                }
                {
                    selectedChannelMetadata.urls.source_code.length > 0 &&
                    <li key={"source_code"}>
                        <Badge variant="secondary" className="m-1 items-center">
                            <Link
                                href={selectedChannelMetadata.urls.source_code[0]}
                                target="_blank"
                                className="flex items-center"
                            >
                                <Image 
                                    src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" 
                                    alt="Github Icon"
                                    loading="lazy"
                                    width={18}
                                    height={18}
                                />
                            </Link>
                        </Badge>
                    </li>
                }
                {
                    selectedChannelMetadata.urls.twitter.length > 0 &&
                    <li key={"x"}>
                        <Badge variant="secondary" className="m-1 items-center">
                            <Link
                                href={selectedChannelMetadata.urls.twitter[0]}
                                target="_blank"
                                className="flex items-center"
                            >
                                <Image 
                                    src="x.svg" 
                                    alt="X Icon"
                                    loading="lazy"
                                    width={18}
                                    height={18}
                                />
                            </Link>
                        </Badge>
                    </li>
                }
                {
                    (
                        selectedChannelMetadata.description !== undefined &&
                        selectedChannelMetadata.description !== ""
                    ) &&
                    <Popover>
                        <PopoverTrigger>
                            <Info/>
                        </PopoverTrigger>
                        <PopoverContent className="bg-primary text-secondary">
                            <ScrollArea>
                                {selectedChannelMetadata.description}
                            </ScrollArea>
                        </PopoverContent>
                    </Popover>
                }
                {
                    currentChannel &&
                    <li>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"ghost"} className="h-8 w-8 p-0">
                                    <Telescope className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-primary text-secondary max-h-64">
                                {
                                    (
                                        (
                                            selectedChannelMetadata &&
                                            selectedChannelMetadata.contract_address.length > 0
                                        )
                                    ) ?
                                    <DropdownMenuGroup>
                                        {
                                            selectedChannelMetadata.contract_address.filter((contract_address) => {
                                                return contract_address.platform.coin.slug === 'arbitrum'
                                            }).length === 0 &&
                                            <DropdownMenuItem key={currentChannel.tokenAddress}>
                                                <div className="flex flex-row gap-2 items-center">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={
                                                                CHAINS.find(chain => chain.chainId?.toString() === (42161).toString())?.icon ||
                                                                '/default_chain_icon.svg'
                                                            }
                                                            alt={'Arbitrum Icon'}
                                                            loading="lazy"
                                                        />
                                                        <AvatarFallback>
                                                            Arb
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        Arbitrum
                                                    </div>
                                                    <Button
                                                        variant="default"
                                                        className="h-6 w-6 p-0"
                                                        >
                                                            <Link
                                                                href={`https://arbiscan.io/address/${currentChannel.tokenAddress}`}
                                                                target="_blank"
                                                            >
                                                                <SquareArrowUpRight className="w-4 h-4"/>
                                                            </Link>
                                                    </Button>
                                                    <CopyTextBlock text={currentChannel.tokenAddress}/>
                                                </div>
                                            </DropdownMenuItem>
                                        }
                                        {
                                            selectedChannelMetadata.contract_address.map((address) => {
                                                return(
                                                    // some tokens have same contract address on different chains so to
                                                    // maintain uniqueness we use contract address concatted with chain id
                                                <DropdownMenuItem key={address.contract_address + address.platform.coin.id}>
                                                    <div className="flex flex-row gap-2 items-center">
                                                        <Avatar>
                                                        <AvatarImage
                                                                src={
                                                                    // find the chain icon based on the chainId in the metadata
                                                                    CHAINS.find(chain => chain.coinId?.toString() === (address.platform.coin.id).toString())?.icon ||
                                                                    '/erc20Icon.svg'
                                                                }
                                                                alt={`${address.platform.coin.name} Icon`}
                                                                loading="lazy"
                                                            />
                                                            <AvatarFallback>
                                                                {address.platform.name.slice(0, 2)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            {
                                                                `${address.platform.name}`
                                                            }
                                                        </div>
                                                        <Button
                                                            variant="default"
                                                            className="h-6 w-6 p-0"
                                                        >
                                                            <Link
                                                                href={`${
                                                                    CHAINS.find(chain => chain.coinId?.toString() === (address.platform.coin.id).toString())?.explorer || ""
                                                                }/address/${address.contract_address}`}
                                                                target="_blank"
                                                            >
                                                                <SquareArrowUpRight className="w-4 h-4"/>
                                                            </Link>
                                                        </Button>
                                                        <CopyTextBlock text={address.contract_address}/>
                                                    </div>
                                                </DropdownMenuItem>
                                                )
                                            })
                                        }
                                    </DropdownMenuGroup> :
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem key={currentChannel.tokenAddress}>
                                            <div className="flex flex-row gap-2 items-center">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={
                                                            CHAINS.find(chain => chain.chainId?.toString() === (42161).toString())?.icon ||
                                                            '/default_chain_icon.svg'
                                                        }
                                                        alt={'Arbitrum Icon'}
                                                        loading="lazy"
                                                    />
                                                    <AvatarFallback>
                                                        Arb
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    Arbitrum
                                                </div>
                                                <Button
                                                    variant="default"
                                                    className="h-6 w-6 p-0"
                                                    >
                                                        <Link
                                                            href={`https://arbiscan.io/address/${currentChannel.tokenAddress}`}
                                                            target="_blank"
                                                        >
                                                            <SquareArrowUpRight className="w-4 h-4"/>
                                                        </Link>
                                                </Button>
                                                <CopyTextBlock text={currentChannel.tokenAddress}/>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup> 
                                }   
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </li>
                }
            </ul>
        )
    }else{
        return
    }
}

export default MessagesHeaderTokenLinks