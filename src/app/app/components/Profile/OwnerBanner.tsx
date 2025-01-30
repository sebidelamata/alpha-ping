'use client';

import React,
{ 
    useState, 
    MouseEvent, 
    FormEvent 
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
import { ScrollArea } from "@/components/components/ui/scroll-area";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/components/ui/accordion"
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

    const { alphaPING, signer } = useEtherProviderContext()
    const { setOwner } = useUserProviderContext()

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

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    // pass tx message state to transferOwner
    const [txMessageOwner, setTxMessageOwner] = useState<string | null | undefined>(null)

    const handleSubmit = async (values: FormValues) => {
        const newOwnerAddress = values.textInput.trim();
            // Validate the input is a wallet address
            if (!ethers.isAddress(newOwnerAddress)) {
                setError("Invalid Ethereum address.");
                return;
            }
        setError(null)
        setTxMessageOwner(null)
        setLoading(true)
        try{
            const tx = await alphaPING?.connect(signer).transferOwner(newOwnerAddress)
            await tx?.wait()
            console.log(tx?.hash)
            setTxMessageOwner(tx?.hash)
            setOwner(false)
        }catch(error: unknown){
            if((error as ErrorType).reason)
            setError((error as ErrorType).reason)
        }finally{
            setLoading(false)
            console.log(txMessageOwner)
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
                {/* {
                    mod &&
                    mod.length > 0 &&
                    <ScrollArea className="h-64 rounded-md border">
                        <Accordion type="single" collapsible>
                            {
                                mod.map((channel) => {
                                    return(
                                        <AccordionItem 
                                            key={channel.tokenAddress} 
                                            value={channel.tokenAddress}
                                        > 
                                            <AccordionTrigger>
                                                {channel.name}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <ModBannerListItem 
                                                    channel={channel}
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })
                            }
                        </Accordion>
                    </ScrollArea>
                }
                {
                    mod &&
                    mod.length > 0 &&
                    <ScrollArea className="h-64 rounded-md border">
                        <Accordion type="single" collapsible>
                            {
                                mod.map((channel) => {
                                    return(
                                        <AccordionItem 
                                            key={channel.tokenAddress} 
                                            value={channel.tokenAddress}
                                        > 
                                            <AccordionTrigger>
                                                {channel.name}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <ModBannerListItem 
                                                    channel={channel}
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })
                            }
                        </Accordion>
                    </ScrollArea>
                } */}
            </CardHeader>
        </Card>
        // <div className="owner-banner">
        //     <h3 className="owner-banner-header">
        //         You currently have Owner admin role
        //     </h3>
        //     {
        //         showModal === false &&
        //             <button
        //                 onClick={(e) => handleClick(e)}
        //                 className="owner-banner-button"
        //             >
        //                 Transfer Owner Role
        //             </button>
        //     }
        //     {
        //         showModal === true &&
        //         <form 
        //             action=""
        //             onSubmit={(e) => handleSubmit(e)}
        //             className="owner-banner-form"
        //         >
        //             <label 
        //                 htmlFor="newOwner"
        //             >
        //                 New Owner
        //             </label>
        //             <input 
        //                 type="text" 
        //                 name="newOwner" 
        //                 placeholder="0x..."
        //             />
        //             <input 
        //                 type="submit" 
        //             />
        //             <button 
        //                 onClick={(e) => handleCancel(e)}
        //             >
        //                 Cancel
        //             </button>
        //         </form>
        //     }
        //     {
        //         loading === true &&
        //             <Loading/>
        //     }
        //     {
        //         error !== null &&
        //             <p>{error}</p>
        //     }
        //     <ManageMods/>
        //     <BlacklistList/>
        // </div>
    )
}

export default OwnerBanner;