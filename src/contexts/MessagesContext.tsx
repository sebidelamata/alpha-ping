'use client';

import React, {
    type ReactNode,
    createContext,
    useContext,
    useState,
    useEffect
} from "react"
import { useSocketProviderContext } from "./SocketContext"
import { ethers } from 'ethers'
import { useEtherProviderContext } from "./ProviderContext";
import ERC20Faucet from '../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { Message } from "src/types/global";

interface MessagesProviderType{
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    authorCurrentTokenBalances: Record<string, Record<string, Record<string, number>>>;
}

// create context
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

    // list of all messages
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        if(socket !== null){
          // --> https://socket.io/how-to/use-with-react-hooks
    
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

      // create a mapping of current balances for eaxch token channel
      const { signer, alphaPING } = useEtherProviderContext()
      const [authorCurrentTokenBalances, setAuthorCurrentTokenBalances] = useState<Record<string, Record<string, Record<string, number>>>>({});
      useEffect(() => {
        if (!messages || !alphaPING || !signer) return;
    
        const fetchChannelAndBuildMap = async () => {
            const map: Record<string, Record<string, Record<string, number>>> = {};
    
            for (const message of messages) {
                const { account, channel } = message;
    
                // Fetch channel struct from AlphaPING contract using channelId
                try {
                    const channelStruct = await alphaPING.channels(channel);
                    const tokenAddress = channelStruct.tokenAddress
                    // If the account already has a balance for this token, skip the fetching process
                    if (map[channel] && map[channel][tokenAddress] && map[channel][tokenAddress][account] !== undefined) {
                      continue; // Skip if balance already exists
                    }
                    let balance = 0
                    if(tokenAddress !== null){
                      const token = new ethers.Contract(
                          tokenAddress,
                          ERC20Faucet.abi,
                          signer
                      )
                      balance = await token.balanceOf(message.account)
                    }
    
                    if (!map[channel]) {
                        map[channel] = {};
                    }
                    if (!map[channel][tokenAddress]) {
                      map[channel][tokenAddress] = {}; // Initialize tokenAddress if not already initialized
                    }
    
                    // We can store multiple token addresses per account in case there's logic related to multiple tokens
                    // In this case, we only use the tokenAddress from the message
                    map[channel][tokenAddress][account] = balance;
    
                } catch (error) {
                    console.error("Error fetching channel details", error);
                }
            }
            setAuthorCurrentTokenBalances(map);
        };
    
        fetchChannelAndBuildMap();
    }, [messages, alphaPING, signer]);
    
    return (
        <MessagesContext.Provider value={{ 
            messages,
            setMessages,
            authorCurrentTokenBalances
        }}>
            {children}
        </MessagesContext.Provider>
  )
    

}

export default MessagesProvider
