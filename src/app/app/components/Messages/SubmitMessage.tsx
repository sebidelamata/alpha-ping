'use client';

import React, {
    useState,
    MouseEventHandler,
    KeyboardEventHandler,
    useRef,
    useEffect
} from "react"
import MessageAttachments from "./MessageAttachments"
import { useSocketProviderContext } from "../../../../contexts/SocketContext"
import { useEtherProviderContext } from "../../../../contexts/ProviderContext"
import { useUserProviderContext } from "../../../../contexts/UserContext"
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { Button } from "@/components/components/ui/button";
import { Send, X } from "lucide-react";
import { Textarea } from "@/components/components/ui/textarea";
import { 
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent 
} from "@/components/components/ui/hover-card";


interface SubmitMessageProps {
    userBalance: string | null;
    replyId: string | null;
    setReplyId: React.Dispatch<React.SetStateAction<string | null>>;
}

const SubmitMessage: React.FC<SubmitMessageProps> = ({ 
  userBalance, 
  replyId, 
  setReplyId,
}) => {


    const { socket } = useSocketProviderContext()
    const { signer } = useEtherProviderContext()
    const { 
      banned, 
      blacklisted 
    } = useUserProviderContext()
    const { currentChannel } = useChannelProviderContext()

    const [message, setMessage] = useState<string>("")
    const [cleanedMessage, setCleanedMessage] = useState<string>("");
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const sendMessage = async () => {
        // post timestamp
        const now: Date = new Date
        // create message object
        const messageObj = {
          channel: currentChannel?.id.toString(),
          account: await signer?.getAddress(),
          text: message,
          timestamp: now,
          messageTimestampTokenAmount: userBalance?.toString(),
          reactions: {},
          replyId: replyId
        }
        // prevent blanks and only if there is a connection
        if (message !== "" && socket !== null) {
          socket.emit('new message', messageObj)
        }
        // reset
        setMessage("")
        setReplyId(null)
        inputRef.current?.focus()
    }

    // send a message if we click send
    const sendMessageMouse: MouseEventHandler<HTMLFormElement> = (e) => {
      e.preventDefault()
      sendMessage();
    }

    // send a message if we hit enter
    const sendMessageKeyboard: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [iframeStrings, setIframeStrings] = useState<string[]>([])
    
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

      setCleanedMessage(cleanMessageText)
    }

    useEffect(() => {
      cleanMessage(message)
    }, [message])

    // Function to remove an image preview and update the message
    const removeImage = (index: number) => {
      const updatedImages = imageUrls.filter((_, i) => i !== index);
      setImageUrls(updatedImages);
      
      const updatedMessage = message.replace(new RegExp(`!\\[image\\]\\(${imageUrls[index]}\\)`, 'g'), '');
      setMessage(updatedMessage);
    };

    // Function to remove an iframe preview and update the message
    const removeIframe = (index: number) => {
      const updatedIframes = iframeStrings.filter((_, i) => i !== index);
      setIframeStrings(updatedIframes);
      
      const updatedMessage = message.replace(new RegExp(`<iframe src="${iframeStrings[index]}"`, 'g'), '');
      setMessage(updatedMessage);
    };


    return(
        <form onSubmit={sendMessageMouse} className='flex flex-row justify-between items-center gap-4 w-full'>
        {
          (
            currentChannel && 
            signer &&
            (
              banned === false &&
              blacklisted === false
            )
          ) ? (
            <>
              <MessageAttachments
                message={message}
                setMessage={setMessage}
                inputRef={inputRef}
              />
              <Textarea 
                value={cleanedMessage} 
                placeholder={`Message #${currentChannel.name}`} 
                onChange={(e) => setMessage(e.target.value)} 
                className='flex flex-grow flex-wrap max-w-full text-wrap h-[120px]' 
                ref={inputRef}
                onKeyDown={sendMessageKeyboard}
                id="message-form-input"
              />
              {
                imageUrls.length > 0 &&
                <div className="flex gap-2">
                  {
                    imageUrls.map((url, index) => (
                      <HoverCard 
                        key={index} 
                      >
                        <div className="relative">
                          <HoverCardTrigger>
                            <img 
                              src={url} 
                              alt={`Linked content ${index}`} 
                              className='rounded-md w-24 h-24 object-cover' 
                              loading="lazy"
                            />
                          </HoverCardTrigger>
                          <HoverCardContent
                            className="bg-primary w-[8px] h-[8px] absolute bottom-24 right-12"
                          >
                            <Button 
                              onClick={() => removeImage(index)} 
                              variant={"destructive"}
                              size={"sm"}
                            >
                              <X size={1} />
                            </Button>
                          </HoverCardContent>
                        </div>
                      </HoverCard>
                    ))
                  }
                </div>
              }
              {
                iframeStrings.length > 0 &&
                <div className="flex gap-2">
                  {
                    iframeStrings.map((iframeString, index) => (
                      <HoverCard 
                        key={index} 
                      >
                        <div className="relative">
                          <HoverCardTrigger>
                            <iframe
                              src={iframeString}
                              title={`Embedded content ${index}`}
                              className="rounded-md w-24 h-24 object-cover"
                            />
                          </HoverCardTrigger>
                          <HoverCardContent 
                            className="bg-primary w-[8px] h-[8px] absolute bottom-24 right-12"
                          >
                            <Button 
                              onClick={() => removeIframe(index)} 
                              variant={"destructive"}
                              size={"sm"}
                            >
                              <X size={1} />
                            </Button>
                          </HoverCardContent>
                        </div>
                      </HoverCard>
                    ))
                  }
                </div>
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
              <Textarea 
                value="" 
                placeholder={
                  (
                    banned === true ||
                    blacklisted === true
                  ) ? 
                  `You have been Banned from the ${currentChannel?.name} Channel` : 
                  `Please Connect Wallet / Join the Channel`
                } 
                disabled 
                className='message-form-input disabled'
              />
            </>
          )
        }
        <div className="submit-button-container">
          <Button type="submit" variant={"outline"} className="border-accent">
            <Send/>
          </Button>
        </div>
      </form>
    )
}

export default SubmitMessage