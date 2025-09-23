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
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
  import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
  } from "@/components/components/ui/dialog"
  import { Button } from "@/components/components/ui/button.tsx";
  import { ChevronsUpDown, SearchCode } from "lucide-react";
  import { useTokenMetadataContext } from "src/contexts/TokenMetaDataContext.tsx";
  import useAllChannelsMetadata from 'src/hooks/useAllChannelsMetadata.ts'

const SearchChannels: React.FC = () => {

    const { 
        alphaPING, 
        signer,
        channels
    } = useEtherProviderContext()
    const { tokenMetaData } = useTokenMetadataContext()
    const { 
        setCurrentChannel,
        joinChannelLoading, 
        setJoinChannelLoading ,
        setSelectedChannelMetadata
    } = useChannelProviderContext()

    const [openSearch, setOpenSearch] = useState(false)

    // if the user has no channels yet we will fetch all and display
    const { allChannels, allChannelsMetadata, allChannelsMetadataLoading } = useAllChannelsMetadata()


    const handleChannelClick = async (channel: AlphaPING.ChannelStructOutput, index: number) => {
        const account = await signer?.getAddress()
        // Check if user has joined already
        const hasJoined = await alphaPING?.hasJoinedChannel(
            BigInt(channel.id), 
            account || ethers.ZeroAddress
        )
        // If they haven't allow them to mint.
        if (hasJoined) {
            setCurrentChannel(channel)
            setSelectedChannelMetadata(allChannelsMetadata[index])
        } else {
            setJoinChannelLoading(true)
            const transaction = await alphaPING?.connect(signer).joinChannel(BigInt(channel.id))
            await transaction?.wait()
            setCurrentChannel(channel)
            setSelectedChannelMetadata(tokenMetaData[index])
            setJoinChannelLoading(false)
        }
        setOpenSearch(false)
    }

    if(allChannelsMetadataLoading == true){
        return(<Loading text="Fetching Channels"/>)
    } 

    return(
        <div className='flex justify-center align-middle'>
            <Dialog open={openSearch} onOpenChange={setOpenSearch}>
                <DialogTrigger asChild>
                    <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={openSearch === true ? "true" : "false"}
                    className="flex flex-row gap-4 justify-between h-16"
                    >
                    <SearchCode size={18}/>
                    Search Channels
                    <ChevronsUpDown size={18}/>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogTitle>
                        Search Channels
                    </DialogTitle>
                    <Command className="bg-primary text-secondary">
                        <CommandInput placeholder="Search Token or NFT..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No token found.</CommandEmpty>
                            {
                                channels.length > 0 ?
                                channels.map((channel, index) => (
                                    <CommandItem
                                    key={channel.tokenAddress}
                                    value={channel.name}
                                    onSelect={() => {
                                        handleChannelClick(channel, index)
                                    }}
                                    >
                                    <span>{channel.name} - {channel.tokenAddress.slice(0,4)}...{channel.tokenAddress.slice(-4)}</span>
                                    <Avatar>
                                        <AvatarImage 
                                            alt={channel.name}
                                            src={
                                                    // Check if the token exists in the tokenList and has a logoURI//   
                                                    tokenMetaData[index]?.logo || '/erc20Icon.svg'
                                                } 
                                        />
                                        <AvatarFallback>
                                            {channel.tokenAddress.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    </CommandItem>
                                )) :
                                // this runs when user has no channels
                                allChannels.map((channel, index) => (
                                    <CommandItem
                                    key={channel.tokenAddress}
                                    value={channel.name}
                                    onSelect={() => {
                                        handleChannelClick(channel, index)
                                    }}
                                    >
                                    <span>{channel.name} - {channel.tokenAddress.slice(0,4)}...{channel.tokenAddress.slice(-4)}</span>
                                    <Avatar>
                                        <AvatarImage 
                                            alt={channel.name}
                                            src={
                                                    // Check if the token exists in the tokenList and has a logoURI//   
                                                    allChannelsMetadata[index]?.logo || '/erc20Icon.svg'
                                                } 
                                        />
                                        <AvatarFallback>
                                            {channel.tokenAddress.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    </CommandItem>
                                ))
                            }
                        </CommandList>
                    </Command>
                </DialogContent>
            </Dialog>
            {
                joinChannelLoading === true &&
                    <Loading/>
            }
        </div>
    )
}

export default SearchChannels