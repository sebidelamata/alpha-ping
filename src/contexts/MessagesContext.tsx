'use client';

import React, {
    type ReactNode,
    createContext,
    useContext,
    useState,
    useEffect
} from "react"
import { useSocketProviderContext } from "./SocketContext"

interface MessagesProviderType{
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
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
              msg.id === updatedMessage.id ? { ...msg, reactions: updatedMessage.reactions } : msg
            )
          )
        })

        socket.on("update reactions", ({ messageId, reactions }) => {
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === messageId ? { ...msg, reactions: { ...reactions } } : msg
            )
          );
        });

        socket.on('delete message', ({ id }) => {
          setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
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
    
    return (
        <MessagesContext.Provider value={{ 
            messages,
            setMessages
        }}>
            {children}
        </MessagesContext.Provider>
  )
    

}

export default MessagesProvider
