import React, {
    useState,
    MouseEventHandler,
    KeyboardEventHandler,
    useRef,
    useEffect
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
    const inputRef = useRef<HTMLInputElement>(null);

    const sendMessage = async () => {
    
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
        inputRef.current?.focus()
      }

      const sendMessageMouse: MouseEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()

        sendMessage();
    }

    const sendMessageKeyboard: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [iframeStrings, setIframeStrings] = useState<string[]>([])
    const [cleanMessageText, setCleanMessageText] = useState<string>("")
    
    const cleanMessage = (message: string) => {

      // Function to extract image URLs from message text
      const extractImageUrls = (text: string): string[] => {
        const regex = /!\[image\]\((.*?)\)/g;
        let match;
        const urls: string[] = [];
        while ((match = regex.exec(text)) !== null) {
            urls.push(match[1]);
        }
        return urls;
      };
      const imageUrls = extractImageUrls(message);
      setImageUrls(imageUrls)

      // Function to extract iframe strings from message text
      const extractIframeStrings = (text: string): string[] => {
        const regex = /<iframe src="(.*?)"/g;
        let match;
        const urls: string[] = [];
        while ((match = regex.exec(text)) !== null) {
          urls.push(match[1]);
        }
        return urls;
      };

      const iframeStrings = extractIframeStrings(message);
      setIframeStrings(iframeStrings)

      // Remove all image markdowns from message text
      const cleanMessageText = message
        .replace(/!\[image\]\(.*?\)/g, '')
        .replace(/<iframe src="(.*?)"/g, "")
        .replace(/\/>/g, "")
      setCleanMessageText(cleanMessageText)
    }

    useEffect(() => {
      cleanMessage(message)
    }, [message])


    return(
        <form onSubmit={sendMessageMouse} className='message-submit-form'>
        {
          currentChannel && 
          account ? (
            <>
              <MessageAttachments
                message={message}
                setMessage={setMessage}
                inputRef={inputRef}
              />
              <input 
                type="text" 
                value={message} 
                placeholder={`Message #${currentChannel.name}`} 
                onChange={(e) => setMessage(e.target.value)} 
                className='message-form-input'
                ref={inputRef}
                onKeyDown={sendMessageKeyboard}
              />
              {
                imageUrls.length > 0 &&
                imageUrls.map((url, idx) => (
                  <img 
                    key={idx} 
                    src={url} 
                    alt={`Linked content ${idx}`} 
                    className='image-preview' 
                  />
                ))
              }
              {
                iframeStrings.length > 0 &&
                iframeStrings.map((iframeString, idx) => (
                  <iframe
                    key={idx}
                    src={iframeString}
                    title={`Embedded content ${idx}`}
                    className="image-preview"
                  />
                ))
              }
            </>
          ) : (
            <>
              <div className="attach-button-container">
                <button 
                    className="attach-button disabled"
                    type="button"
                    disabled
                >
                +
                </button>
              </div>
              <input 
                type="text" 
                value="" 
                placeholder={`Please Connect Wallet / Join the Channel`} 
                disabled 
                className='message-form-input disabled'
              />
            </>
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