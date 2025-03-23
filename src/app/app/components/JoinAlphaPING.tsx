'use client';

import React, {
    useState
} from "react";
import { useEtherProviderContext } from '../../../contexts/ProviderContext';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/components/ui/dialog"
import { Button } from "@/components/components/ui/button";
import { Separator } from "@/components/components/ui/separator";
import { useToast } from "@/components/hooks/use-toast"
import { 
    ShieldCheck,
    CircleX
} from "lucide-react";
import Link from "next/link";
import Loading from "./Loading";

interface ErrorType {
    reason: string
}

interface JoinAlphaPINGProps {
    setIsMember: React.Dispatch<React.SetStateAction<boolean>>;
  }

const JoinAlphaPING:React.FC<JoinAlphaPINGProps> = ({
    setIsMember
}) => {

    const { toast } = useToast()
    const { alphaPING, signer, provider } = useEtherProviderContext()

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [txMessage, setTxMessage] = useState<string | null>(null)

    const joinAlphaPING = async() => {
        try{
            if(provider){
                setError(null)
                setLoading(true)
                const tx = await alphaPING?.connect(signer).mint()
                await tx?.wait()
                if(tx !== undefined && tx.hash !== undefined){
                    setTxMessage(tx?.hash)
                }
                setIsMember(true)
            }
        }catch(error: unknown){
            if((error as ErrorType).reason){
                setError((error as ErrorType).reason)
            }
            if(error !== null && (error as ErrorType).reason !== undefined && signer){
                toast({
                    title: "Transaction Error!",
                    description: `Mint Membership for ${(await signer.getAddress())
                        .toString()
                        .slice(0, 4)}...
                        ${(await signer.getAddress())
                            .toString()
                            .slice(38,42)} Not Completed!`,
                    duration:5000,
                    action: (
                        <div className="flex flex-col gap-1 justify-center items-center">
                            <CircleX size={40}/>
                            <div className="flex flex-col gap-1 text-sm">
                            {
                                (error as ErrorType).reason.length > 100 ?
                                `${(error as ErrorType).reason.slice(0,100)}...` :
                                (error as ErrorType).reason
                            }
                            </div>
                        </div>
                    ),
                    variant: "destructive",
                })
            }
        }finally{
            setLoading(false)
            if(txMessage !== null && signer){
                toast({
                    title: "Transaction Confirmed!",
                    description: `Mint Membership for ${(await signer.getAddress())
                        .toString()
                        .slice(0, 4)}...
                        ${(await signer.getAddress())
                            .toString()
                            .slice(38,42)} Completed!`,
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

    return(
        <Dialog open={true}>
            <DialogContent className="items-center justify-center align-middle">
                <DialogHeader className="items-center justify-center align-middle">
                    <DialogTitle className="items-center justify-center align-middle text-3xl">
                        Quit Monkeying Around!
                    </DialogTitle>
                    <Separator className="h-2"/>
                        <div className="object-contain">
                            <img 
                                src="../Apes.svg" 
                                alt="AlphaPING Logo" 
                                className="size-80"
                                loading="lazy"
                            />
                        </div>
                        <Separator className="w-64 border border-secondary"/>
                        <DialogDescription>
                            Mint a Free Membership and Swing into the Chat!
                        </DialogDescription>
                        <Separator className="h-2"/>
                        {
                            signer ? (
                                <Button 
                                    onClick={() => joinAlphaPING()}
                                    variant={"outline"}
                                    className="w-[200px] text-3xl"
                                >
                                    Join
                                </Button>
                            ) : (
                                <w3m-button 
                                    balance='hide'
                                    label="Connect to Join"
                                />
                            )

                        }
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
        </Dialog>
    )
}

export default JoinAlphaPING;