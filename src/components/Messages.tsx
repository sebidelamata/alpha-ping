import React, 
{ 
    useEffect, 
    useState, 
    useRef
} from 'react'
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING'
import { 
  ethers, 
  Contract 
} from 'ethers'
import ERC20Faucet from '../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { useEtherProviderContext } from '../contexts/ProviderContext'
import Message from './Message'
import SubmitMessage from './SubmitMessage'


interface MessagesProps {
    account: string | null;
    messages: Message[];
    currentChannel: AlphaPING.ChannelStructOutput | null;
  }

const Messages:React.FC<MessagesProps> = ({ account, messages, currentChannel }) => {

  const { signer } = useEtherProviderContext()

  const [token, setToken] = useState<Contract | null>(null)
  const [tokenDecimals, setTokenDecimals] = useState<number | null>(null)
  const [userBalance, setUserBalance] = useState<string | null>(null)

  useEffect(() => {
    if(currentChannel?.tokenAddress !== undefined){
      const token = new ethers.Contract(
        currentChannel?.tokenAddress,
        ERC20Faucet.abi,
        signer
      )
      setToken(token)
    }
  }, [currentChannel])

  const fetchTokenDecimals = async () => {
    if(token !== null){
      const tokenDecimals = await token.decimals()
      setTokenDecimals(tokenDecimals as number)
    }
  }
  useEffect(() => {
    fetchTokenDecimals()
  }, [token])

  const getUserBalance = async () => {
    if(token !== null){
      const userBalance = await token.balanceOf(signer)
      setUserBalance(userBalance.toString())
    }
  }
  useEffect(() => {
    getUserBalance()
  }, [token])


  const messageEndRef = useRef<HTMLDivElement | null>(null)


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
          <Message
            key={index}
            message={message}
            index={index}
            tokenDecimals={tokenDecimals}
            tokenAddress={currentChannel?.tokenAddress}
          />
        ))}

        <div ref={messageEndRef} />
      </div>
      <SubmitMessage
        currentChannel={currentChannel}
        account={account}
        userBalance={userBalance}
      />
    </div>
  );
}

export default Messages;