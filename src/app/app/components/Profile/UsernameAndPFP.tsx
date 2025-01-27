'use client';

import React, {
    useState,
    FormEvent
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import UserRelations from "./UserRelations";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage
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

const UsernameAndPFP:React.FC = () => {

    const { signer, alphaPING } = useEtherProviderContext()
    const { 
        account,
        userUsername,
        setUserUsername,
        userProfilePic,
        setUserProfilePic 
    } = useUserProviderContext()

    const [editPicOrName, setEditPicOrName] = useState<string>('picture')
    const [editProfileFormString, setEditProfileFormString] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const onSubmit = async (values: FormValues) => {
        const { usernamepic, textInput } = values;
        setError(null);
        try{
            if(signer !== null){
                if(usernamepic === 'picture'){
                    // Validate image URL
                    const isValidImageURL = /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(editProfileFormString)
                    if (!isValidImageURL) {
                        setError(
                            "Invalid image URL. Please enter a URL ending with .jpg, .jpeg, .png, .gif., or .webp"
                        )
                        return
                    }
                    const tx = await alphaPING?.connect(signer).setProfilePic(editProfileFormString)
                    await tx?.wait()
                    setUserProfilePic(editProfileFormString)
                }
                if(editPicOrName === 'username'){
                    const tx = await alphaPING?.connect(signer).setUsername(editProfileFormString)
                    await tx?.wait()
                    setUserUsername(editProfileFormString)
                }
            }
        }catch(error: unknown){
            if((error as ErrorType).reason){
                setError((error as ErrorType).reason)
            }
            if(error){
                console.log(error)
            }
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            usernamepic: "username",
        },
      })

    return(
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                    <FormField
                        control={form.control}
                        name="usernamepic"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-y-3">
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
                    <FormField
                        control={form.control}
                        name="textInput"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-y-3">
                                <FormControl>
                                    <Input  
                                        placeholder="rustyShackleford..."
                                        {...field}
                                    />
                                </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
        // <div className="current-username-and-pic-container">
        //     <div className="row-one">
        //             <div className="edit-profile-row-two">
        //                 <div className="edit-profile-pic-container">
        //                     <button
        //                         type="button"
        //                         className={
        //                             editPicOrName !== 'picture'?
        //                             "edit-button" :
        //                             "edit-button edit-button-selected"
        //                         }
        //                         onClick={() => setEditPicOrName("picture")}
        //                     >
        //                         Edit Profile Picture
        //                     </button>
        //                 </div>
        //                 <div className="edit-username-container">
        //                     <button
        //                         type="button"
        //                         className={
        //                             editPicOrName !== 'username'?
        //                             "edit-button" :
        //                             "edit-button edit-button-selected"
        //                         }
        //                         onClick={() => setEditPicOrName('username')}
        //                     >
        //                         Edit Username
        //                     </button>
        //                 </div>
        //             </div>
        //             <form 
        //                 action="" 
        //                 className="edit-profile-form"
        //                 onSubmit={(e) => handleEditProfileSubmit(e)}
        //             >
        //             <input 
        //                 type="text" 
        //                 placeholder={
        //                     editPicOrName === "picture" ?
        //                     "Enter Image URL..." :
        //                     "Enter New Username"
        //                 }
        //                 value={editProfileFormString}
        //                 onChange={(e) => handleProfileEditFormChange(e)}
        //             />
        //             <button 
        //                 className="edit-profile-form-submit-button"
        //                 type="submit"
        //             >
        //                 Submit
        //             </button>
        //             {
        //                 error && 
        //                 <div className="error-message">
        //                     {error}
        //                 </div>
        //             }
        //         </form>
        //     </div>
        //     <div className="following-block-container">
        //         <UserRelations/>
        //     </div>
        // </div>
    )
}

export default UsernameAndPFP