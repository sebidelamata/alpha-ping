import React, {
    useState,
    MouseEvent
} from "react";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/components/ui/dialog"
import { Button } from "@/components/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/components/ui/form"
import { Input } from "@/components/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/components/ui/select"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEtherProviderContext } from "../../../../../contexts/ProviderContext";
import Loading from "../../Loading";
import Link from "next/link";
import { useToast } from "@/components/hooks/use-toast"
import { 
    ShieldCheck, 
    CircleX 
} from "lucide-react";
import { type AlphaPING } from '../../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING.ts'
import JoinChannelDialog from "./JoinChannelModal.tsx"

const formSchema = z.object({
    tokenAddress: z.string().min(42).max(42),
    tokenType: z.enum(["ERC20", "ERC721"], {
        required_error: "Token type is required",
    }),
})

type FormValues = z.infer<typeof formSchema>;

interface ErrorType {
    reason: string;
    message: string;
}

interface IAddChannelModal {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddChannelModal:React.FC<IAddChannelModal> = ({ setOpen }) => {

    const { 
        alphaPING, 
        signer, 
        setChannels 
    } = useEtherProviderContext()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tokenAddress: "",
            tokenType: "ERC20"
        },
    })

    const [loading, setLoading] = useState<boolean>(false)
    const[error, setError] = useState<string | null>(null)
    const [txMessage, setTxMessage] = useState<null | string>(null)
    const [showJoinDialog, setShowJoinDialog] = useState<boolean>(false)
    const [createdChannel, setCreatedChannel] = useState<AlphaPING.ChannelStructOutput | null>(null)
    

    const onSubmit = async (values: FormValues) => {
    
        const { tokenAddress, tokenType } = values;
    
        try {
            setLoading(true)
            setError(null);
            setTxMessage(null)
            const tx = await alphaPING?.connect(signer).createChannel(
                tokenAddress,
                tokenType
            );
            await tx?.wait();
            if(tx !== undefined && tx.hash !== undefined){
                setTxMessage(tx?.hash)
            }
    
            if (alphaPING !== null) {
                const totalChannels: bigint = await alphaPING.totalChannels();
                const channels = [];
    
                for (let i = 1; i <= Number(totalChannels); i++) {
                    const channel = await alphaPING.getChannel(i);
                    channels.push(channel);
                }
    
                setChannels(channels);
                
                // Get the newly created channel and show join dialog
                const newChannel = channels[channels.length - 1];
                console.log("new channel: ", newChannel.name)
                setCreatedChannel(newChannel);
                setShowJoinDialog(true);
            }
        }
        catch(error:unknown){
            if((error as ErrorType).message){
                setError((error as ErrorType).message)
            }
            // display error
            if(error !== null && (error as ErrorType).message !== undefined){
                toast({
                    title: "Transaction Error!",
                    description: `Create Channel ${tokenAddress.slice(0, 4)}...${tokenAddress.slice(38,42)} Not Completed!`,
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
        }
        finally{
            setLoading(false)
            // display success
            if(txMessage !== null){
                toast({
                    title: "Transaction Confirmed!",
                    description: `Create Channel ${tokenAddress.slice(0, 4)}...${tokenAddress.slice(38,42)} Completed!`,
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

    const handleJoinDialogClose = () => {
        setShowJoinDialog(false);
        setOpen(false);
    };

    // Show join dialog after successful channel creation
    if (showJoinDialog && createdChannel) {
        return (
            <JoinChannelDialog 
                channel={createdChannel}
                txHash={txMessage}
                onClose={handleJoinDialogClose}
            />
        );
    }

    return(
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Add Channel
                </DialogTitle>
                <DialogDescription>
                    Enter the address of any Token (ERC-20) or NFT (ERC-721).
                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)} 
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="tokenAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="0x0000000000000000000000000000000000000000"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            You can grab this from the project website,{' '} 
                                            <Link 
                                                href={"https://coinmarketcap.com/"}
                                                target="_blank"
                                                className="text-accent"
                                            >
                                                CoinmarketCap
                                            </Link>,{' '}
                                            <Link 
                                                href={"https://arbiscan.io/"}
                                                target="_blank"
                                                className="text-accent"
                                            >
                                                Arbiscan
                                            </Link>, or{' '} 
                                            <Link 
                                                href={"https://opensea.io/"}
                                                target="_blank"
                                                className="text-accent"
                                            >
                                                OpenSea
                                            </Link>.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tokenType"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col justify-center items-center">
                                        <FormLabel>Token Type</FormLabel>
                                        <FormControl
                                        className="flex justify-center items-center"
                                        >
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger className="w-[200px]">
                                                    <SelectValue placeholder="ERC-20" />
                                                    <SelectContent>
                                                        <SelectItem 
                                                            value="ERC20"
                                                        >
                                                            ERC-20
                                                        </SelectItem>
                                                        <SelectItem 
                                                            value="ERC721"
                                                        >
                                                            ERC-721
                                                        </SelectItem>
                                                    </SelectContent>
                                                </SelectTrigger>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Is this a Token (ERC-20) or NFT (ERC-721)?
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col gap-4 items-center justify-center">
                                <Button 
                                    type="submit" 
                                    variant="secondary"
                                    className="w-[200px]"
                                >
                                    Submit
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-[200px]"
                                    onClick={(e) => handleCancel(e)} 
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                    {
                        error !== null &&
                        <DialogFooter className="text-accent">
                            {
                                error.length > 140 ?
                                `${error.slice(0,140)}...` :
                                error
                            }
                        </DialogFooter>
                    }
                    {
                        loading === true &&
                        <Loading/>
                    }
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    )
}

export default AddChannelModal;