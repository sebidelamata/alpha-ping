'use client';

import React, {
    useState,
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription
} from '@/components/components/ui/form'
import { 
    RadioGroup, 
    RadioGroupItem
} from "@/components/components/ui/radio-group"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/components/ui/input";
import { Button } from "@/components/components/ui/button";
import { Separator } from "@/components/components/ui/separator";
import Loading from "../Loading"
import { useToast } from "@/components/hooks/use-toast"
import Link from "next/link";
import { 
    ShieldCheck, 
    CircleX 
} from "lucide-react";

interface ErrorType {
    reason: string
}

const formSchema = z.object({
    usernamepic: z.enum(["username", "picture"], {
        required_error: "You need to select a notification type.",
    }),
    textInput: z.string().min(1, { 
        message: "Text input must be longer than 0 letters." 
    }),
  })  
type FormValues = z.infer<typeof formSchema>;

const UsernameAndPFP:React.FC = () => {

    const { 
        signer, 
        alphaPING 
    } = useEtherProviderContext()
    const {
        setUserUsername,
        setUserProfilePic 
    } = useUserProviderContext()
    const { toast } = useToast()

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [txMessage, setTxMessage] = useState<null | string>(null)

    const onSubmit = async (values: FormValues) => {
        const { usernamepic, textInput } = values;
        try{
            setLoading(true)
            setError(null);
            setTxMessage(null)
            if(signer !== null){
                // set pic
                if(usernamepic === 'picture'){
                    // Validate image URL
                    const isValidImageURL = /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(textInput)
                    if (!isValidImageURL) {
                        setError(
                            "Invalid image URL. Please enter a URL ending with .jpg, .jpeg, .png, .gif., or .webp"
                        )
                        return
                    }
                    const tx = await alphaPING?.connect(signer).setProfilePic(textInput)
                    await tx?.wait()
                    if(tx !== undefined && tx.hash !== undefined){
                        setTxMessage(tx?.hash)
                        setUserProfilePic(textInput)
                    }
                }
                // set username
                if(usernamepic === 'username'){
                    const tx = await alphaPING?.connect(signer).setUsername(textInput)
                    await tx?.wait()
                    if(tx !== undefined && tx.hash !== undefined){
                        setTxMessage(tx?.hash)
                        setUserUsername(textInput)
                    }
                }
            }
        }catch(error: unknown){
            if((error as ErrorType).reason){
                setError((error as ErrorType).reason)
            }
            // display error
            if(error !== null && (error as ErrorType).reason !== undefined){
                toast({
                    title: "Transaction Error!",
                    description: usernamepic === "username" ?
                        "Username Not Updated" :
                        "Profile Picture Not Updated",
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
                    description: usernamepic === "username" ?
                        "Username Updated" :
                        "Profile Picture Updated",
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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            usernamepic: "username",
        },
    })
    // Use the watch method to observe the current value of "usernamepic"
    const selectedOption = form.watch("usernamepic");

    return(
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-4 space-y-6 items-center">
                    <FormField
                        control={form.control}
                        name="usernamepic"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-y-3 gap-4">
                                <FormLabel>I want to change my...</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem 
                                                    value="username" 
                                                    checked={field.value === "username"} 
                                                    className="cursor-pointer border border-secondary bg-primary p-2 data-[state=checked]:bg-secondary"
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal" htmlFor="username">
                                                Username
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem 
                                                    value="picture" 
                                                    checked={field.value === "picture"} 
                                                    className="cursor-pointer border border-secondary bg-primary p-2 data-[state=checked]:bg-secondary"
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal" htmlFor="picture">
                                                Profile Picture
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Separator/>
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
                                   {
                                    selectedOption === 'username' ?
                                    "Enter Username" :
                                    "Paste Image URL (ends in .jpg, .jpeg, .png, .gif., or .webp)"
                                   }
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
        </div>
    )
}

export default UsernameAndPFP