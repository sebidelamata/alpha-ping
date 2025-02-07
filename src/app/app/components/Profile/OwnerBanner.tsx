'use client';

import React,
{ 
    useState, 
    MouseEvent
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import { ethers } from 'ethers';
import Loading from "../Loading";
import BlacklistList from "./BlacklistList";
import ManageMods from "./ManageMods";
import {
    Card,
    CardHeader,
    CardTitle
  } from "@/components/components/ui/card"
import { Accordion } from "@/components/components/ui/accordion"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/components/ui/dialog"
import { Button } from "@/components/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
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
import { useToast } from "@/components/hooks/use-toast"
import { 
    ShieldCheck, 
    CircleX 
} from "lucide-react";
import Link from "next/link";

interface ErrorType {
    reason: string
}

const formSchema = z.object({
    textInput: z.string()
        .min(1, { 
            message: "New Owner address must be longer than 0 characters." 
        })
        .max(42, {
            message: "New Owner address must be shorter than 42 characters."
        }),
  })  
type FormValues = z.infer<typeof formSchema>;

const OwnerBanner:React.FC = () => {

    const { 
        alphaPING, 
        signer 
    } = useEtherProviderContext()
    const { setOwner } = useUserProviderContext()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            textInput: "",
        },
    })

    const [open, setOpen] = useState<boolean>(false)

    const handleCancel = (e:MouseEvent) => {
        e.preventDefault()
        setOpen(false)
    }

    const [username, setUsername] = useState<string | null>(null)
    const fetchUserMetaData = async (user:string) => {
        try{
            const usernameResult = await alphaPING?.username(user) || null
            setUsername(usernameResult)
        }catch(error){
            console.error(error)
        }
    }

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [txMessage, setTxMessage] = useState<string | null | undefined>(null)

    const handleSubmit = async (values: FormValues) => {
        const newOwnerAddress = values.textInput.trim();
            // Validate the input is a wallet address
            if (!ethers.isAddress(newOwnerAddress)) {
                setError("Invalid Ethereum address.");
                return;
            }
        try{
            setLoading(true)
            setError(null)
            setTxMessage(null)
            await fetchUserMetaData(newOwnerAddress)
            const tx = await alphaPING?.connect(signer).transferOwner(newOwnerAddress)
            await tx?.wait()
            if(tx !== undefined && tx.hash !== undefined){
                setTxMessage(tx?.hash)
            }
            setOwner(false)
        }catch(error: unknown){
            if((error as ErrorType).reason)
            setError((error as ErrorType).reason)
        // display error
                    if(error !== null && (error as ErrorType).reason !== undefined){
                        toast({
                            title: "Transaction Error!",
                            description: (username !== null && username !== '') ?
                                `Transfer Ownership to ${username} Not Completed!` :
                                `Transfer Ownership to ${newOwnerAddress.slice(0, 4)}...${newOwnerAddress.slice(38,42)} Not Completed!`,
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
            // display success
            if(txMessage !== null){
                toast({
                    title: "Transaction Confirmed!",
                    description: (username !== null && username !== '') ?
                        `Transfer Ownership to ${username} Completed!` :
                        `Transfer Ownership to ${newOwnerAddress.slice(0, 4)}...${newOwnerAddress.slice(38,42)} Completed!`,
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
        <Card className="bg-primary text-secondary">
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-center gap-4">
                    You have Owner Role
                </CardTitle>
                <Dialog
                    open={open} 
                    onOpenChange={setOpen}
                >
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                        >
                            Transfer Owner Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                <div className="flex flex-col items-center justify-center text-3xl">
                                    Are you sure you want to Transfer Your Owner Role?
                                </div>
                            </DialogTitle>
                                <DialogDescription className="flex flex-col items-center justify-center gap-4">
                                    You can not undo this once it has been done!
                                </DialogDescription>
                                <Separator/>
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
                                                        Enter new Owner Wallet Address
                                                    </FormLabel>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <Button 
                                                type="submit" 
                                                variant={"destructive"}
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
                            </DialogHeader>
                            {
                                loading === true &&
                                    <Loading/>
                            }
                        </DialogContent>
                </Dialog>
                    <Accordion type="single" collapsible>
                        <ManageMods/>
                        <BlacklistList/>
                    </Accordion>
            </CardHeader>
        </Card>
    )
}

export default OwnerBanner;