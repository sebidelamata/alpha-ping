'use client';

import React,
{
    useState,
} from "react"
import { useEtherProviderContext } from "../../../../contexts/ProviderContext.tsx"
import { useChannelProviderContext } from "../../../../contexts/ChannelContext.tsx"
import { type AlphaPING } from '../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING.ts'
import { ethers } from 'ethers'
import Loading from "../Loading.tsx"
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/components/ui/command"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/components/ui/popover"
  import { Button } from "@/components/components/ui/button.tsx";
  import { ChevronsUpDown } from "lucide-react";

interface SearchChannelsProps {
    joinChannelLoading: boolean;
    setJoinChannelLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchChannels: React.FC<SearchChannelsProps> = ({ 
    joinChannelLoading,
    setJoinChannelLoading
}) => {

    const { channels, alphaPING, signer } = useEtherProviderContext()
    const { setCurrentChannel } = useChannelProviderContext()

    const [openSearch, setOpenSearch] = useState(false)

    const handleChannelClick = async (channel: AlphaPING.ChannelStructOutput) => {
        const account = await signer?.getAddress()
        // Check if user has joined already
        const hasJoined = await alphaPING?.hasJoinedChannel(
            BigInt(channel.id), 
            account || ethers.ZeroAddress
        )
        // If they haven't allow them to mint.
        if (hasJoined) {
            setCurrentChannel(channel)
        } else {
            setJoinChannelLoading(true)
            const transaction = await alphaPING?.connect(signer).joinChannel(BigInt(channel.id))
            await transaction?.wait()
            setCurrentChannel(channel)
            setJoinChannelLoading(false)
        }
    }

    return(
        <div className='flex justify-center align-middle'>
            <Popover open={openSearch} onOpenChange={setOpenSearch}>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSearch === true ? "true" : "false"}
                    className="w-[200px] justify-between"
                    >
                    Search Token or NFT...
                    <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search Token or NFT..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No token found.</CommandEmpty>
                            {channels.map((channel) => (
                                <CommandItem
                                key={channel.tokenAddress}
                                value={channel.name}
                                onSelect={() => {
                                    handleChannelClick(channel)
                                    setOpenSearch(false)
                                }}
                                >
                                <span>{channel.name} - {channel.tokenAddress.slice(0,4)}...{channel.tokenAddress.slice(-4)}</span>
                                </CommandItem>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {
                joinChannelLoading === false &&
                    <Loading/>
            }
        </div>
    )
}

export default SearchChannels