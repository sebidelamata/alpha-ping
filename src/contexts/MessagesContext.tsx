'use client';

import React, {
    type ReactNode,
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo
} from "react"
import { useSocketProviderContext } from "./SocketContext"
import { ethers } from 'ethers'
import { useEtherProviderContext } from "./ProviderContext";
import ERC20Faucet from '../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { AlphaPING } from "../../typechain-types/contracts/AlphaPING.sol/AlphaPING";

interface MessagesProviderType{
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    authorCurrentTokenBalances: Record<string, Record<string, Record<string, bigint>>>;
}

const MessagesContext = createContext<MessagesProviderType | undefined>(undefined)

export const useMessagesProviderContext = (): MessagesProviderType => {
    const context = useContext(MessagesContext)
    if (context === null || context === undefined) {
        throw new Error('useMessagesProviderContext must be used within a SocketProvider')
    }
    return context
}

const MessagesProvider: React.FC<{ children: ReactNode }> = ({children}) => {

    const { socket } = useSocketProviderContext()
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        if(socket !== null){
            socket.on("connect", () => {
                socket.emit('get messages')
            })
            socket.on('new message', (messages) => {
                setMessages(messages)
            })
            socket.on('get messages', (messages) => {
                setMessages(messages)
            })
            socket.on('message update', (updatedMessage) => {
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg._id === updatedMessage._id ? { ...msg, reactions: updatedMessage.reactions } : msg
                    )
                )
            })
            socket.on("update reactions", ({ messageId, reactions }) => {
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg._id === messageId ? { ...msg, reactions: { ...reactions } } : msg
                    )
                );
            });
            socket.on('delete message', ({ id }) => {
                setMessages(prevMessages => prevMessages.filter(msg => msg._id !== id));
            });

            return () => {
                socket.off('connect')
                socket.off('new message')
                socket.off('get messages')
                socket.off('message update')
                socket.off('update reactions')
                socket.off('delete message');
            }
        }
    }, [socket])

    const { signer, alphaPING } = useEtherProviderContext()
    const [authorCurrentTokenBalances, setAuthorCurrentTokenBalances] = useState<Record<string, Record<string, Record<string, bigint>>>>({});

    useEffect(() => {
        if (!messages || !alphaPING || !signer) return;

        const fetchChannelAndBuildMap = async () => {
            const map: Record<string, Record<string, Record<string, bigint>>> = {};

            for (const message of messages) {
                const { account, channel } = message;

                // Guard against invalid channel values
                if (!channel || channel === '0' || channel === '') continue;

                try {
                    const channelStruct:AlphaPING.ChannelStructOutput = await alphaPING.channels(channel);
                    const tokenAddress = channelStruct?.tokenAddress;

                    // Guard against undefined/empty tokenAddress
                    if (!tokenAddress || tokenAddress === ethers.ZeroAddress) continue;

                    if (map[channel]?.[tokenAddress]?.[account] !== undefined) {
                        continue;
                    }

                    const token = new ethers.Contract(
                        tokenAddress,
                        ERC20Faucet.abi,
                        signer
                    )
                    const balance: bigint = await token.balanceOf(account)

                    if (!map[channel]) map[channel] = {};
                    if (!map[channel][tokenAddress]) map[channel][tokenAddress] = {};

                    map[channel][tokenAddress][account] = balance;

                } catch (error) {
                    console.error("Error fetching channel details", error);
                }
            }
            setAuthorCurrentTokenBalances(map);
        };

        fetchChannelAndBuildMap();
    }, [messages, alphaPING, signer]);

    const contextValue = useMemo(() => ({
        messages,
        setMessages,
        authorCurrentTokenBalances
    }), [messages, authorCurrentTokenBalances]);

    return (
        <MessagesContext.Provider value={contextValue}>
            {children}
        </MessagesContext.Provider>
    )
}

export default MessagesProvider