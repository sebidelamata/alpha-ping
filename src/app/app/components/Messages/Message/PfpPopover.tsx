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
    CardContent
} from "@/components/components/ui/card";
import BanUser from "./BanUser";
import UnbanUser from "../UnbanUser";
import BlacklistUser from "./BlacklistUser";
import UnblacklistUser from "./UnblacklistUser";
import FollowUser from "./FollowUser";
import UnfollowUser from "../UnfollowUser";
import BlockUser from "./BlockUser";
import { useUserProviderContext } from "src/contexts/UserContext";


interface IPfpPopover{
    profilePic: string | null;
    username: string | null;
    message: Message;
    userBan: boolean;
    userBlacklist: boolean;
    following: boolean;
    blocked: boolean;
}

const PfpPopover:React.FC<IPfpPopover> = ({
    profilePic,
    username,
    message,
    userBan,
    userBlacklist,
    following,
    blocked
}) => {

    const { 
        owner, 
        currentChannelMod,
        account 
    } = useUserProviderContext()

    return(
       <Card className="flex flex-col bg-primary text-secondary mx-0">
        <CardHeader className="flex bg-primary text-secondary">
            <CardTitle 
                className="flex flex-col bg-accent text-secondary justify-center items-center gap-4 px-2 rounded-lg"
            >
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
        <CardContent className="flex flex-col gap-4">
            <ul className="flex flex-col gap-4">
                {
                    (
                    currentChannelMod === true ||
                    owner === true
                    ) &&
                    userBan === false &&
                    message.account !== account &&

                    <li>
                        test
                        <BanUser 
                            user={message.account}
                            username={username}
                            profilePic={profilePic}
                        />
                    </li>
                }
                {
                    (
                    currentChannelMod === true ||
                    owner === true
                    ) &&
                    userBan === true &&
                    message.account !== account &&
                    <li>
                        <UnbanUser 
                            user={message.account}
                            username={username}
                            profilePic={profilePic}
                        />
                    </li>
                }
                {
                    owner === true &&
                    userBlacklist === false &&
                    <li>
                        <BlacklistUser 
                            user={message.account}
                            username={username}
                            profilePic={profilePic}
                        />
                    </li>
                }
                {
                    owner === true &&
                    userBlacklist === true &&
                    <li>
                        <UnblacklistUser 
                            user={message.account}
                            username={username}
                            profilePic={profilePic}
                        />
                    </li>
                }
                <ul className="flex flex-row gap-8 justify-center items-center">
                    {
                        following === false &&
                        <li>
                            <FollowUser 
                                account={message.account}
                                username={username}
                                profilePic={profilePic}
                            />
                        </li>
                    }
                    {
                        following === true &&
                        <li>
                            <UnfollowUser 
                                account={message.account}
                                username={username}
                                profilePic={profilePic}
                            /> 
                        </li>
                    }
                    {
                        blocked === false &&
                        <li>
                            <BlockUser 
                                user={message.account}
                                username={username}
                                profilePic={profilePic}
                            /> 
                        </li>
                    }
                </ul>
            </ul>
        </CardContent>
       </Card>
    )
}

export default PfpPopover;