import React, {
    useState
} from "react";
import {
    Dialog,
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
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useChannelProviderContext } from "../../../../contexts/ChannelContext";
import Loading from "../Loading";
import Link from "next/link";

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



const AddChannelModal:React.FC = () => {

    const { 
        alphaPING, 
        signer, 
        setChannels 
    } = useEtherProviderContext()
    const { 
            addChannelLoading, 
            setAddChannelLoading, 
    } = useChannelProviderContext()

    const[error, setError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tokenAddress: "",
            tokenType: "ERC20"
        },
    })

    const onSubmit = async (values: FormValues) => {
        setAddChannelLoading(true);
    
        const { tokenAddress, tokenType } = values;
    
        try {
          const transaction = await alphaPING?.connect(signer).createChannel(
            tokenAddress,
            tokenType
          );
          await transaction?.wait();
    
          if (alphaPING !== null) {
            const totalChannels: bigint = await alphaPING.totalChannels();
            const channels = [];
    
            for (let i = 1; i <= Number(totalChannels); i++) {
              const channel = await alphaPING.getChannel(i);
              channels.push(channel);
            }
    
            setChannels(channels);
          }
        }
        catch(e:unknown){
            const result = (e as ErrorType).reason || (e as ErrorType).message;
            setError(result)
        }
        finally{
            setAddChannelLoading(false)
        }
    }

    return(
        <Dialog open={true}>
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
                                        <FormItem>
                                            <FormLabel>Token Type</FormLabel>
                                            <FormControl>
                                                <Select>
                                                    <SelectTrigger className="w-[180px]">
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
                                <Button type="submit" variant="secondary">
                                    Submit
                                </Button>
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
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
            {
                addChannelLoading === true &&
                <Loading/>
            }
        </Dialog>
    )
}

export default AddChannelModal;