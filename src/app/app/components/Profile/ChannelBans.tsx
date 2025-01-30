'use client';

import React, {
    useState,
    useEffect
} from "react";
import { AlphaPING } from "../../../../../typechain-types/contracts/AlphaPING.sol/AlphaPING";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useMessagesProviderContext } from "../../../../contexts/MessagesContext";
import BansListItem from "./BansListItem";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/components/ui/card"

interface ErrorType {
    reason: string
}

interface ChannelBansProps{
    channel: AlphaPING.ChannelStructOutput;
}

const ChannelBans:React.FC<ChannelBansProps> = ({channel}) => {

    const { alphaPING } = useEtherProviderContext()
    const { messages } = useMessagesProviderContext()

    //hold tx message for a ban
    const [txMessageUnban, setTxMessageUnban] = useState<string | null | undefined>(null)

    const [channelAuthors, setChannelAuthors] = useState<string[]>([])
    const getChannelAuthors = () => {
        const authors = Array.from(
            new Set (
                messages
                    .filter((message) => {
                        return message.channel === channel.id.toString()
                    })
                    .map((message) => {
                        return message.account
                    })
            )
        )
        setChannelAuthors(authors)
    }
    useEffect(() => {
        getChannelAuthors()
    }, [messages])

    const [channelBans, setChannelBans] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const getChannelBans = async () => {
        try{
            if(channel && channel.id !== undefined){
                const result = await Promise.all(
                        channelAuthors.map(async (author) => {
                        return alphaPING?.channelBans(channel?.id, author)
                    })
                )
                const authors = channelAuthors.filter((_, index) => {
                    return result[index] === true
                })
                setChannelBans(authors)
            }
        }catch(error: unknown){
            if((error as ErrorType).reason)
            setError((error as ErrorType).reason)
        }finally{
            setLoading(false)
        }
    }
    useEffect(() => {
        getChannelBans()
    }, [messages, txMessageUnban, channelAuthors])

    return(
        <Card className="bg-primary text-secondary">
            <CardHeader>
                {
                    channelBans.length === 0 &&
                    <CardTitle className="text-lg">
                        The are currently no banned users for this channel.
                    </CardTitle>
                }
                <CardContent>
                    {
                        channelBans.length > 0 &&
                        <ul>
                            {
                                channelBans.map((ban, index) => {
                                    return(
                                        <li key={index}>
                                            <BansListItem 
                                                ban={ban}
                                                channel={channel}
                                                setTxMessageUnban={setTxMessageUnban}
                                            />
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    }
                </CardContent>
            </CardHeader>
        </Card>
    )
}

export default ChannelBans