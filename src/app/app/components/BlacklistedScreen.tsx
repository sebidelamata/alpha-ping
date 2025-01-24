import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/components/ui/dialog"
import { Separator } from "@radix-ui/react-separator";

const BlacklistedScreen:React.FC= () => {

    return(
        <Dialog open={true}>
            <DialogContent className="items-center justify-center align-middle">
                <DialogHeader className="items-center justify-center align-middle">
                    <DialogTitle className="items-center justify-center align-middle text-3xl">
                        Access Denied
                    </DialogTitle>
                    <Separator className="h-2"/>
                    <DialogDescription className="flex flex-col items-center justify-center space-y-4">
                        <div className="object-contain">
                            <img 
                                src="../Apes.svg" 
                                alt="AlphaPING Logo" 
                                className="size-80"
                                loading="lazy"
                            />
                        </div>
                        <Separator className="w-64 border border-secondary"/>
                        <h3 className="text-lg">
                            You have been Blacklisted from AlphaPING 
                        </h3>
                        <Separator className="h-2"/>
                        <p>
                            Contact Admin for Support
                        </p>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default BlacklistedScreen;