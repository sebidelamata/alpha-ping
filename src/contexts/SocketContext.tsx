'use client';

import React, {
    type ReactNode,
    createContext,
    useContext,
    useState,
    useEffect
} from "react"
import DefaultEventsMap, 
{ 
    io,
    type Socket
} from "socket.io-client"


interface SocketProviderType{
    socket: Socket | null
}

// create context
const SocketContext = createContext<SocketProviderType | undefined>(undefined)

export const useSocketProviderContext = (): SocketProviderType => {
    const context = useContext(SocketContext)
    if (context === null || context === undefined) {
        throw new Error('useSocketProviderContext must be used within a SocketProvider')
    }
    return context
    }

const SocketProvider: React.FC<{ children: ReactNode }> = ({children}) => {

    const [socket, setSocket] = useState<Socket<typeof DefaultEventsMap, typeof DefaultEventsMap> | null>(null)
    useEffect(() => {
         // Socket
        const webSocket = io('ws://localhost:3030');
        setSocket((webSocket))
    }, [])

    return (
        <SocketContext.Provider value={{ 
            socket
        }}>
            {children}
        </SocketContext.Provider>
  )
    

}

export default SocketProvider