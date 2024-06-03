import React, {
    useState,
    MouseEventHandler
} from "react"
import banana from '/Banana.svg'
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING'
import { io } from "socket.io-client"
import MessageAttachments from "./MessageAttachments"


interface SubmitMessageProps {
    currentChannel: AlphaPING.ChannelStructOutput | null;
    account: string | null;
    userBalance: string | null;
}

const SubmitMessage: React.FC<SubmitMessageProps> = ({ currentChannel, account, userBalance }) => {


    // Socket
    const socket = io('ws://localhost:3030')

    const [message, setMessage] = useState<string>("")

    const sendMessage:MouseEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
    
        const now: Date = new Date
    
        const messageObj = {
          channel: currentChannel?.id.toString(),
          account: account,
          text: message,
          timestamp: now,
          messageTimestampTokenAmount: userBalance
        }
        console.log(messageObj)
    
        if (message !== "") {
          socket.emit('new message', messageObj)
        }
    
        setMessage("")
      }

    return(
        <form onSubmit={sendMessage} className='message-submit-form'>
          <MessageAttachments
            message={message}
            setMessage={setMessage}
          />
        {
          currentChannel && 
          account ? (
            <input 
              type="text" 
              value={message} 
              placeholder={`Message #${currentChannel.name}`} 
              onChange={(e) => setMessage(e.target.value)} 
              className='message-form-input'
            />
          ) : (
            <input 
              type="text" 
              value="" 
              placeholder={`Please Connect Wallet / Join the Channel`} 
              disabled 
              className='message-form-input disabled'
            />
          )
        }
        <div className="submit-button-container">
          <button type="submit" className='message-form-submit-button'>
            <img src={banana} alt="Send Message" className='banana-send-icon'/>
          </button>
        </div>
      </form>
    )
}

export default SubmitMessage