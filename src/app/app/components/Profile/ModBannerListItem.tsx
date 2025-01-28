'use client';

import React, {
    useState,
    FormEvent,
    MouseEvent
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import { AlphaPING } from "../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING";
import Loading from "../Loading";
import ChannelBans from "./ChannelBans";
import TransferMod from "./TransferMod";
import {
    Card,
    CardHeader,
    CardTitle,
  } from "@/components/components/ui/card"
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

interface ErrorType {
    reason: string
}

interface ModBannerListItemProps{
    channel: AlphaPING.ChannelStructOutput;
}

const ModBannerListItem:React.FC<ModBannerListItemProps> = ({ channel }) => {

    const { alphaPING, signer } = useEtherProviderContext()
    const { mod, setMod } = useUserProviderContext()

    const [open, setOpen] = useState<boolean>(false)
    const handleCancel = (e:MouseEvent) => {
        e.preventDefault()
        setOpen(false)
    }

    // transfer mod
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [txMessageMod, setTxMessageMod] = useState<string | null | undefined>(null)
    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        const value = ((e.target as HTMLFormElement).elements.namedItem("newMod") as HTMLInputElement).value;
        setError(null)
        setTxMessageMod(null)
        setLoading(true)
        try{
            if(channel && channel.id !== undefined){
                const tx = await alphaPING?.connect(signer).transferMod(value, channel?.id)
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

    return(
        <Card className="bg-primary text-secondary">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle className="flex flex-row items-center gap-4">
                    {
                        channel &&
                        channel?.name
                    }
                </CardTitle>
                <Dialog>
                    <DialogTrigger>
                        <Button variant={"outline"}>
                            Transfer Mod Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                <TransferMod channel={channel}/>
                            </DialogTitle>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </CardHeader>
        </Card>
        // <div className="mod-banner-li">
        //     <div className="mod-banner-row-one">
        //         <h4 className="mod-banner-li-title">
        //             {
        //                 channel &&
        //                 channel?.name
        //             }
        //         </h4>
        //         {
        //             showModal === false &&
        //                 <button
        //                     onClick={(e) => handleClick(e)}
        //                     className="mod-banner-button"
        //                 >
        //                     {`Transfer Mod Role`}
        //                 </button>
        //         }
        //         {
        //             showModal === true &&
        //             <form 
        //                 action=""
        //                 onSubmit={(e) => handleSubmit(e)}
        //                 className="mod-banner-form"
        //             >
        //                 <label 
        //                     htmlFor="newMod"
        //                 >
        //                     New Mod
        //                 </label>
        //                 <input 
        //                     type="text" 
        //                     name="newMod" 
        //                     placeholder="0x..."
        //                 />
        //                 <input 
        //                     type="submit" 
        //                 />
        //                 <button 
        //                     onClick={(e) => handleCancel(e)}
        //                 >
        //                     Cancel
        //                 </button>
        //             </form>
        //         }
        //     </div>
        //     {
        //         loading === true &&
        //             <Loading/>
        //     }
        //     {
        //         error !== null &&
        //             <p>{error}</p>
        //     }
        //     <ChannelBans channel={channel}/>
        // </div>
    )
}

export default ModBannerListItem