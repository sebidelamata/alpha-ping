'use client';

import React from "react";
import Link from "next/link";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent, 
    CardDescription 
} from "@/components/components/ui/card";
import MessageHoverOptions from "./MessageHoverOptions";

interface IPfpPopover{
    profilePic: string | null;
    username: string | null;
    message: Message;
}

const PfpPopover:React.FC<IPfpPopover> = ({
    profilePic,
    username,
    message
}) => {
    return(
       <Card className="flex bg-primary text-secondary">
        <CardHeader className="flex bg-primary text-secondary">
            <CardTitle className="flex bg-accent text-secondary justify-center items-center gap-4 px-2 rounded-lg">
               <Avatar>
                    {
                        (profilePic !== null && profilePic !== '' && profilePic !== undefined) ?
                        <AvatarImage
                        src={profilePic} 
                        alt="User Icon"
                        loading="lazy"
                        /> :
                        <AvatarImage
                        src={"/monkey.svg"} 
                        alt="User Icon"
                        loading="lazy"
                        />
                    }
                    {
                        (username !== null && username !== '' && username !== undefined) ?
                        <AvatarFallback>
                        {username.slice(0, 2)}
                        </AvatarFallback> :
                        <AvatarFallback>
                        {message.account.slice(0, 2)}
                        </AvatarFallback>
                    }
                </Avatar>
                <Link
                    href={`https://arbiscan.io/address/${message.account}`}
                    target='_blank'
                    >
                    <h4>
                        {
                        username === null ?
                        message.account.slice(0, 6) + '...' + message.account.slice(38, 42) :
                            (username !== null && username !== '') ?
                            username :
                            message.account.slice(0, 6) + '...' + message.account.slice(38, 42)
                        }
                    </h4>
                </Link>
            </CardTitle>
        </CardHeader>
        <CardContent>
            
        </CardContent>
       </Card>
    )
}

export default PfpPopover;