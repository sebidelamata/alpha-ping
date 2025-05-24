'use client';

import React, { 
    useState, 
    useEffect 
} from "react";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/components/ui/dialog"
import { Button } from "@/components/components/ui/button"
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useChannelProviderContext } from "../../../../contexts/ChannelContext";
import Loading from "../Loading";
import Link from "next/link";
import { useToast } from "@/components/hooks/use-toast"
import { 
    CircleX,
    Users,
    CheckCircle
} from "lucide-react";
import { type AlphaPING } from '../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING.ts'
import { ethers } from 'ethers'
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar.tsx";
import tokenList from "../../../../../public/tokenList.json";
import tokensByChain from "src/lib/tokensByChain";
import ERC20Faucet from '../../../../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'


interface IJoinChannelDialog {
    channel: AlphaPING.ChannelStructOutput;
    txHash: string | null;
    onClose: () => void;
}

const JoinChannelDialog: React.FC<IJoinChannelDialog> = ({ 
    channel, 
    txHash, 
    onClose 
}) => {
    const { 
        alphaPING, 
        signer, 
        chainId 
    } = useEtherProviderContext();
    const { setCurrentChannel } = useChannelProviderContext();
    const { toast } = useToast();
    
    const [joiningChannel, setJoiningChannel] = useState<boolean>(false);

    const handleJoinChannel = async () => {
        if (!channel || !alphaPING || !signer) return;

        try {
            setJoiningChannel(true);
            const account = await signer.getAddress();
            
            const hasJoined = await alphaPING.hasJoinedChannel(
                BigInt(channel.id), 
                account || ethers.ZeroAddress
            );

            if (!hasJoined) {
                const transaction = await alphaPING.connect(signer).joinChannel(BigInt(channel.id));
                await transaction?.wait();
            }

            setCurrentChannel(channel);
            onClose();

            toast({
                title: "Channel Joined!",
                description: `You've successfully joined ${channel.name}`,
                duration: 3000,
                action: (
                    <div className="flex flex-row gap-1 items-center">
                        <CheckCircle size={20}/>
                        <span>Welcome!</span>
                    </div>
                )
            });

        } catch (error: unknown) {
            toast({
                title: "Join Channel Error!",
                description: "Failed to join the channel. Please try again.",
                duration: 5000,
                variant: "destructive",
                action: <CircleX size={20}/>
            });
        } finally {
            setJoiningChannel(false);
        }
    };

    // grab the token objects from the token list
    const [tokenImage, setTokenImage] = useState<string | null>(null)
    useEffect(() => {
        const loadTokenImage = async () => {
            if(channel.tokenAddress !== null){
                const token = new ethers.Contract(
                    channel.tokenAddress,
                    ERC20Faucet.abi,
                    signer
                );
                const channelSymbol = await token?.symbol()
                console.log(channelSymbol)
                const tokenObject = tokensByChain(tokenList, Number(chainId)).
                    filter((token) => token.symbol.toLowerCase() === channelSymbol.toLowerCase())[0];
                setTokenImage(tokenObject.logoURI)
            }
        }
        loadTokenImage()
    }, [chainId, signer, channel])

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <CheckCircle className="text-secondary" size={24} />
                    Channel Created Successfully!
                </DialogTitle>
                <DialogDescription className="space-y-4 bg-primary">
                    <div className="text-center flex flex-col justify-center gap-4 align-middle items-center">
                        <div className="flex flex-row gap-2">
                            <Avatar className="size-6">
                                <AvatarImage 
                                    src={
                                        tokenImage !== null ? 
                                        tokenImage : 
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
                            <p className="text-lg text-secondary">{channel.name}</p>
                        </div>
                        <Link href={`https://arbiscan.io/token/${channel.tokenAddress}`}
                            className="text-sm text-accent"
                            target="_blank"
                        >
                            {channel.tokenAddress.slice(0, 6)}...{channel.tokenAddress.slice(-4)}
                        </Link>
                    </div>
                    
                    <div className="bg-primary p-4 rounded-lg">
                        <p className="text-sm text-secondary">
                            Your channel has been created! Would you like to join it now to start chatting?
                        </p>
                    </div>

                    <div className="flex flex-col] gap-3 items-center justify-center">
                        <Button 
                            onClick={handleJoinChannel}
                            disabled={joiningChannel}
                            variant={"outline"}
                            className="w-48 text-secondary"
                        >
                            {joiningChannel ? (
                                <>
                                    <Loading />
                                    Joining...
                                </>
                            ) : (
                                <>
                                    <Users className="mr-2" size={16} />
                                    Join Channel
                                </>
                            )}
                        </Button>
                        
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={joiningChannel}
                            className="w-[200px]"
                        >
                            Skip for Now
                        </Button>
                    </div>

                    {txHash && (
                        <div className="text-center text-sm">
                            <Link 
                                href={`https://arbiscan.io/tx/${txHash}`} 
                                target="_blank"
                                className="text-accent hover:underline"
                            >
                                View transaction on Arbiscan →
                            </Link>
                        </div>
                    )}
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    );
};

export default JoinChannelDialog;