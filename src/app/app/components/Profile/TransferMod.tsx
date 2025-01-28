'use client';

import React, {
    useState
} from "react";
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

const TransferMod:React.FC<TransferModProps> = ({channel}) => {

    const { 
        signer, 
        alphaPING 
    } = useEtherProviderContext()
    const { 
        mod, 
        setMod 
    } = useUserProviderContext()

    // transfer mod
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [txMessageMod, setTxMessageMod] = useState<string | null | undefined>(null)
    const handleSubmit = async (values: FormValues) => {
        setError(null)
        setTxMessageMod(null)
        setLoading(true)
        try{
            if(channel && channel.id !== undefined){
                const tx = await alphaPING?.connect(signer).transferMod(values.textInput, channel?.id)
                await tx?.wait()
                console.log(tx?.hash)
                setTxMessageMod(tx?.hash)
                const updatedMod = mod.filter(item => item.id !== channel?.id);
                setMod(updatedMod)
            }
        }catch(error: unknown){
            if((error as ErrorType).reason)
            setError((error as ErrorType).reason)
        }finally{
            setLoading(false)
            console.log(txMessageMod)
        }

    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            textInput: "0x...000",
        },
    })

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
                                <FormLabel>
                                   Enter new Mod Wallet Address
                                </FormLabel>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button 
                        type="submit" 
                        variant={"secondary"}
                    >
                        Submit
                    </Button>
                    {
                        error !== null &&
                        <FormDescription className="text-xl">
                            {error}
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