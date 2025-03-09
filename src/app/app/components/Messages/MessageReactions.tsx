'use client';

import React, {
    useState,
    useEffect
} from "react";
import Link from "next/link";
import { 
    HoverCard, 
    HoverCardTrigger, 
    HoverCardContent 
} from "@radix-ui/react-hover-card";
import { Badge } from "@/components/components/ui/badge";
import { useEtherProviderContext } from "src/contexts/ProviderContext";
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from "@/components/components/ui/avatar";

interface IMessageReactions{
    reaction: string;
    count: string;
    message: Message;
}

const MessageReactions:React.FC<IMessageReactions> = ({reaction, count, message}) => {

    const { alphaPING } = useEtherProviderContext()

    // the reaction the user is hovering over
    const [hoverReaction, sethoverReaction] = useState<string | null>(null)

    const [reactionPFPs, setReactionPFPs] = useState<(string | null)[]>([])
    const [reactionUsernames, setReactionUsernames] = useState<(string | null)[]>([])

    // if there is a reply get username and profile pic to original post
    useEffect(() => {
        const fetchReactionPFP = async () => {
            if(hoverReaction !== null){
                const pfpArray = []
                for(let i=0; i<message.reactions[hoverReaction].length; i++){
                    const address = message.reactions[hoverReaction]
                    const pfp = await alphaPING?.profilePic(address.toString()) || null
                    pfpArray.push(pfp)
                }
                setReactionPFPs(pfpArray)
            }
        }
        fetchReactionPFP()
        const fetchReactionUsername = async () => {
        if(hoverReaction !== null){
            const usernameArray = []
            for(let i=0; i<message.reactions[hoverReaction].length; i++){
                const address = message.reactions[hoverReaction]
                const username = await alphaPING?.username(address.toString()) || null
                usernameArray.push(username)
            }
            setReactionUsernames(usernameArray)
        }
        }
        fetchReactionUsername()
    }, [alphaPING, hoverReaction, message])

    return(
        <HoverCard>
            <HoverCardTrigger asChild>
            <Badge 
                className="border-secondary text-lg" 
                onMouseEnter={() => sethoverReaction(reaction)}
            >
                {`${reaction} ${count}`}
            </Badge>
            </HoverCardTrigger>
            <HoverCardContent className="bg-primary text-secondary border border-accent border-solid p-2 rounded-lg shadow-md">
            {
                hoverReaction !== null &&
                <div className="bg-primary text-secondary p-4">
                    <div className="flex items-center justify-center text-lg">
                        {hoverReaction}
                    </div>
                    <ul>
                        {
                            message.reactions[hoverReaction].length > 0 &&
                            message.reactions[hoverReaction].map((address, index) => (
                                <li key={address} className="flex flex-row gap-4 justify-center items-center">
                                    <Avatar>
                                        {
                                            (reactionPFPs[index] !== null && reactionPFPs[index] !== '' && reactionPFPs[index] !== undefined) ?
                                            <AvatarImage
                                            src={reactionPFPs[index]} 
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
                                            (
                                                reactionUsernames[index] !== null && 
                                                reactionUsernames[index] !== '' && 
                                                reactionUsernames[index] !== undefined
                                            ) ?
                                            <AvatarFallback>
                                            {reactionUsernames[index].slice(0, 2)}
                                            </AvatarFallback> :
                                            <AvatarFallback>
                                            {address.slice(0, 2)}
                                            </AvatarFallback>
                                        }
                                    </Avatar>
                                    <Link
                                        href={`https://arbiscan.io/address/${address}`}
                                        target='_blank'
                                    >
                                        {
                                            (
                                                reactionUsernames[index] === null ||
                                                reactionUsernames[index] === '' ||
                                                reactionUsernames[index] === undefined
                                            ) ?
                                            address.slice(0, 6) + '...' + address.slice(38, 42) :
                                            (reactionUsernames[index] !== null && reactionUsernames[index] !== '') ?
                                            reactionUsernames[index] :
                                            address.slice(0, 6) + '...' + address.slice(38, 42)
                                        }
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div> 
            }
            </HoverCardContent>
        </HoverCard>
    )
}

export default MessageReactions;