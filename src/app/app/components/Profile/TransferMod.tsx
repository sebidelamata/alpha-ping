'use client';

import React, {
    useState
} from "react";
import { ethers } from 'ethers';
import { AlphaPING } from "../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { useUserProviderContext } from "src/contexts/UserContext";
import Loading from "../Loading";
import {
    Card,
    CardHeader,
    CardTitle,
  } from "@/components/components/ui/card"
  import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription
} from '@/components/components/ui/form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/components/ui/input";
import { Button } from "@/components/components/ui/button";

interface TransferModProps {
    channel: AlphaPING.ChannelStructOutput;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
    textInput: z.string()
        .min(1, { 
            message: "New Mod address must be longer than 0 characters." 
        })
        .max(42, {
            message: "New Mod address must be shorter than 42 characters."
        }),
  })  
type FormValues = z.infer<typeof formSchema>;

interface ErrorType {
    reason: string
}

const TransferMod:React.FC<TransferModProps> = ({
    channel,
    setOpen
}) => {

    const { 
        signer, 
        alphaPING 
    } = useEtherProviderContext()
    const { 
        mod, 
        setMod 
    } = useUserProviderContext()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            textInput: "",
        },
    })

    // transfer mod
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [txMessageMod, setTxMessageMod] = useState<string | null | undefined>(null)
    const handleSubmit = async (values: FormValues) => {
        setError(null)
        setTxMessageMod(null)
        setLoading(true)
        try{
            const newModAddress = values.textInput.trim();
            // Validate the input is a wallet address
            if (!ethers.isAddress(newModAddress)) {
                setError("Invalid Ethereum address.");
                return;
            }
            if(channel && channel.id !== undefined){
                const tx = await alphaPING?.connect(signer).transferMod(newModAddress, channel?.id)
                await tx?.wait()
                console.log(tx?.hash)
                setTxMessageMod(tx?.hash)
                const updatedMod = mod.filter(item => item.id !== channel?.id);
                setMod(updatedMod)
            }
        }catch(error: unknown){
            if((error as ErrorType).reason){
                setError((error as ErrorType).reason)
            }
            if(error){
                console.log(error)
            }
        }finally{
            setLoading(false)
        }

    }
    const handleCancel = (e:MouseEvent) => {
        e.preventDefault()
        setOpen(false)
    }

    return(
        <Card className="bg-primary text-secondary">
            <CardHeader>
                <CardTitle>
                    {`Transfer Mod Role for ${channel.name}`} 
                </CardTitle>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full p-4 space-y-6 items-center">
                    <FormField
                        control={form.control}
                        name="textInput"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-y-3 gap-4">
                                <FormControl>
                                    <Input  
                                        placeholder="rustyShackleford..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormLabel className="flex flex-col items-center justify-center gap-4">
                                   Enter new Mod Wallet Address
                                </FormLabel>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col items-center justify-center gap-4">
                        <Button 
                            type="submit" 
                            variant={"secondary"}
                            className="w-[200px]"
                        >
                            Submit
                        </Button>
                        <Button 
                            type="button" 
                            variant={"outline"}
                            className="w-[200px]"
                            onClick={(e) => handleCancel(e)} 
                        >
                            Cancel
                        </Button>
                    </div>
                    {
                        error !== null &&
                        <FormDescription className="text-xl">
                            {
                                error.length > 50 ?
                                `${error.slice(0,50)}...` :
                                error
                            }
                        </FormDescription>
                    }
                </form>
            </Form>
            {
                loading === true &&
                <Loading/>
            }
        </Card>
    )
}

export default TransferMod;