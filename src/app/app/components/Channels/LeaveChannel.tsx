'use client';

import React, {
    useState,
    MouseEvent,
    FormEvent
} from "react";
import { AlphaPING } from "typechain-types";
import { useChannelProviderContext } from "../../../../contexts/ChannelContext";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { LogOut } from "lucide-react";
import Loading from "../Loading";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/components/ui/dialog"
import { Button } from "@/components/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { useToast } from "@/components/hooks/use-toast"
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback
} from "@/components/components/ui/avatar";
import { 
    ShieldCheck, 
    CircleX 
} from "lucide-react";

interface ErrorType{
    message: string;
}

interface LeaveConnectProps{
    isHovered: boolean;
    channel: AlphaPING.ChannelStructOutput;
    tokenMetada: tokenMetadata;
}

const LeaveChannel:React.FC<LeaveConnectProps> = ({ isHovered, channel, tokenMetada }) => {

    const { setCurrentChannel } = useChannelProviderContext()
    const { 
        signer, 
        alphaPING 
    } = useEtherProviderContext()
    const { toast } = useToast()

    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [txMessage, setTxMessage] = useState<null | string>(null)

    const handleSubmit = async (e:FormEvent) => {
        e.stopPropagation();
        try{
            setLoading(true)
            setError(null);
            setTxMessage(null)
            if(channel && channel.id){
                const tx = await alphaPING?.connect(signer).leaveChannel(BigInt(channel.id))
                await tx?.wait()
                if(tx !== undefined && tx.hash !== undefined){
                    setTxMessage(tx?.hash)
                }
                setCurrentChannel(null)
            }
        }catch(error: unknown){
            if((error as ErrorType).message){
                setError((error as ErrorType).message)
            }
            // display error
            if(error !== null && (error as ErrorType).message !== undefined){
                toast({
                    title: "Transaction Error!",
                    description: "Leave Channel Not Completed!",
                    duration:5000,
                    action: (
                        <div className="flex flex-col gap-1 justify-center items-center">
                            <CircleX size={40}/>
                            <div className="flex flex-col gap-1 text-sm">
                            {
                                (error as ErrorType).message.length > 100 ?
                                `${(error as ErrorType).message.slice(0,100)}...` :
                                (error as ErrorType).message
                            }
                            </div>
                        </div>
                    ),
                    variant: "destructive",
                })
            }
        }finally{
            setLoading(false)
            // display success
            if(txMessage !== null){
                toast({
                    title: "Transaction Confirmed!",
                    description: "Leave Channel Completed!",
                    duration:5000,
                    action: (
                        <div className="flex flex-row gap-1">
                            <ShieldCheck size={80}/>
                            <div className="flex flex-col gap-1">
                                <p>View Transaction on</p>
                                <Link 
                                    href={`https://arbiscan.io/tx/${txMessage}`} 
                                    target="_blank"
                                    className="text-accent"
                                >
                                    Arbiscan
                                </Link>
                            </div>
                        </div>
                    )
                })
            }
        }
    }

    const handleCancel = (e:MouseEvent) => {
        e.preventDefault()
        setOpen(false)
    }

    return(
        <div>
            {
                isHovered === true ?
                <Dialog 
                        open={open} 
                        onOpenChange={setOpen}
                >
                    <DialogTrigger asChild>
                        <LogOut
                            className="bg-secondary hover:text-accent"
                            aria-label="Leave Channel"
                        />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                <div className="flex flex-row items-center justify-center gap-4 text-3xl">
                                    <p>
                                        { channel.name }
                                    </p>
                                    {
                                        <Avatar>
                                            <AvatarImage 
                                                src={
                                                    (
                                                        tokenMetada.logo !== '' && 
                                                        tokenMetada.logo !== undefined && 
                                                        tokenMetada.logo !== null
                                                    ) ? 
                                                    tokenMetada.logo : 
                                                    (
                                                        channel.tokenType === 'ERC20' ?
                                                        '/erc20Icon.svg' :
                                                        '/blank_nft.svg'
                                                    )
                                                }
                                                alt="Token Logo"
                                                loading="lazy"
                                            />
                                            <AvatarFallback>
                                                {channel.name.slice(0,2)}
                                            </AvatarFallback>
                                        </Avatar>
                                    }
                                </div>
                            </DialogTitle>
                                <DialogDescription className="flex flex-col items-center justify-center gap-4">
                                    You will no longer be a member of this Channel if you leave. 
                                </DialogDescription>
                                <Separator/>
                                <form
                                    onSubmit={(e) => handleSubmit(e)}
                                    className="flex flex-col items-center justify-center gap-4"
                                >
                                    <Button 
                                        type="submit"
                                        variant="destructive" 
                                        className="w-[200px]"
                                    >
                                        Leave Channel
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-[200px]"
                                        onClick={(e) => handleCancel(e)} 
                                    >
                                        Cancel
                                    </Button>
                                </form>
                            </DialogHeader>
                            {
                                loading === true &&
                                    <Loading/>
                            }
                            {
                                error !== null &&
                                <DialogFooter className="relative right-3 flex w-full flex-row items-center justify-center pr-16 text-sm text-accent">
                                    {
                                        error.length > 50 ?
                                        `${error.slice(0,50)}...` :
                                        error
                                    }
                                </DialogFooter>
                            }
                        </DialogContent>
                </Dialog> :
                ''
            }
        </div>
    )
}

export default LeaveChannel