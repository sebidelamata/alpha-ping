import React, 
{ 
    useEffect, 
    useState, 
    useRef, 
    MouseEventHandler
} from 'react'
import { io } from "socket.io-client"
import banana from '/Banana.svg'
import monkey from '/monkey.svg'
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING'
import { DateTime } from 'luxon';
import { ethers } from 'ethers'
import ERC20Faucet from '../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { useEtherProviderContext } from '../contexts/ProviderContext'



// Socket
const socket = io('ws://localhost:3030')

interface MessagesProps {
    account: string | null;
    messages: Message[];
    currentChannel: AlphaPING.ChannelStructOutput | null;
  }

const Messages:React.FC<MessagesProps> = ({ account, messages, currentChannel }) => {

  const { signer } = useEtherProviderContext()

  const [message, setMessage] = useState<string>("")
  const [tokenDecimals, setTokenDecimals] = useState<number | null>(null)

  const fetchTokenDecimals = async () => {
    if(currentChannel?.tokenAddress !== undefined){
      const token = new ethers.Contract(
        currentChannel?.tokenAddress,
        ERC20Faucet.abi,
        signer
      )
      const tokenDecimals = await token.decimals()
      setTokenDecimals(tokenDecimals as number)
    }
  }
  useEffect(() => {
    fetchTokenDecimals()
  }, [currentChannel])

  const messageEndRef = useRef<HTMLDivElement | null>(null)

  const sendMessage:MouseEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const now: Date = new Date

    const messageObj = {
      channel: currentChannel?.id.toString(),
      account: account,
      text: message,
      timestamp: now
    }
    console.log(messageObj)

    if (message !== "") {
      socket.emit('new message', messageObj)
    }

    setMessage("")
  }

  const scrollHandler = () => {
    setTimeout(() => {
        if(messageEndRef.current){
            (messageEndRef.current as HTMLDivElement)?.scrollIntoView({ behavior: 'smooth' })
        }
    }, 500)
  }

  useEffect(() => {
    scrollHandler()
  })

  return (
    <div className="messages">
      <div className="messages-feed">

        {
        currentChannel && 
        messages.filter(message => message.channel === currentChannel.id.toString()).map((message, index) => (
          <div className="message" key={index}>
            <div className='message-header'>
              <img src={monkey} alt="User Icon" className='monkey-icon'/>
            </div>
            <div className="message-content">
              <div className='message-content-row-one'>
                 <h3 className='message-poster-address'>
                  {message.account.slice(0, 6) + '...' + message.account.slice(38, 42)}
                </h3>
                <div className='post-timestamp-token-amount'>
                  <div className='post-timestamp-token-amount-title'>
                    Message Timestamp {currentChannel.name} Balance:
                  </div>
                  <div className='post-timestamp-token-amount-value'>
                    {
                      tokenDecimals !== null &&
                        ethers.formatUnits(
                          message.messageTimestampTokenAmount.toString(), 
                          tokenDecimals
                        )
                    }
                  </div>
                </div>
                <div className='message-timestamp'>
                  {DateTime.fromISO(message.timestamp.toString()).toLocaleString(DateTime.DATETIME_MED)}
                </div>
              </div>
              <div className='message-content-row-two'>
                <p className='message-content-text'>
                  {message.text}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div ref={messageEndRef} />
      </div>
      <form onSubmit={sendMessage} className='message-submit-form'>
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
        <button type="submit" className='message-form-submit-button'>
          <img src={banana} alt="Send Message" className='banana-send-icon'/>
        </button>
        <button type="button">
          Trade
        </button>
      </form>
    </div>
  );
}

export default Messages;