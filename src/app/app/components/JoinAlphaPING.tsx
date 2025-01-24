'use client';

import React from "react";
import { useEtherProviderContext } from '../../../contexts/ProviderContext';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/components/ui/dialog"
import { Button } from "@/components/components/ui/button";
import { Separator } from "@radix-ui/react-separator";

interface JoinAlphaPINGProps {
    setIsMember: React.Dispatch<React.SetStateAction<boolean>>;
  }

const JoinAlphaPING:React.FC<JoinAlphaPINGProps> = ({
    setIsMember
}) => {

    const { alphaPING, signer, provider } = useEtherProviderContext()

    const joinAlphaPING = async() => {
        if(provider){
            const tx = await alphaPING?.connect(signer).mint()
            await tx?.wait()
            setIsMember(true)
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
                            Mint a Membership and Swing into the Chat!
                        </DialogDescription>
                        <Separator className="h-2"/>
                        {
                            signer ? (
                                <Button 
                                    onClick={() => joinAlphaPING()}
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
            </DialogContent>
        </Dialog>
    )
}

export default JoinAlphaPING;