import React, {
    useState, 
    useEffect
} from "react"
import monkey from '/monkey.svg'
import { DateTime } from 'luxon';
import { ethers } from 'ethers'
import ERC20Faucet from '../../artifacts/contracts/ERC20Faucet.sol/ERC20Faucet.json'
import { useEtherProviderContext } from '../contexts/ProviderContext'

interface MessageProps {
    message: Message;
    index: number;
    tokenDecimals: number | null;
    tokenAddress: string | null;
}

const Message: React.FC<MessageProps> = ({message, index, tokenDecimals, tokenAddress}) => {

    const { signer } = useEtherProviderContext()

    const [userBalance, setUserBalance] = useState<string | null>(null)

    const getUserBalance = async () => {
        if(tokenAddress !== null){
            const token = new ethers.Contract(
                tokenAddress,
                ERC20Faucet.abi,
                signer
            )
            const userBalance = await token.balanceOf(message.account)
            setUserBalance(userBalance.toString())
        }
    }
    useEffect(() => {
        getUserBalance()
    }, [tokenAddress])

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

    const imageUrls = extractImageUrls(message.text);

    // Remove all image markdowns from message text
    const cleanMessageText = message.text.replace(/!\[image\]\(.*?\)/g, '');

    return(
        <div className="message" key={index}>
            <div className='message-header'>
              <img src={monkey} alt="User Icon" className='monkey-icon'/>
            </div>
            <div className="message-content">
              <div className='message-content-row-one'>
                <a 
                  href={`https://arbiscan.io/address/${message.account}`}
                  className='message-poster-address'
                  target='_blank'
                  >
                    <h3>
                      {message.account.slice(0, 6) + '...' + message.account.slice(38, 42)}
                    </h3>
                  </a>
                <div className='post-timestamp-token-amount'>
                  <div className='post-timestamp-token-amount-title'>
                    Post Balance:
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
                <div className='current-token-amount'>
                  <div className='current-token-amount-title'>
                    Current Balance:
                  </div>
                  <div className='current-token-amount-value'>
                    {
                      tokenDecimals !== null &&
                      userBalance !== null &&
                        ethers.formatUnits(
                            userBalance.toString(), 
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
                  {cleanMessageText}
                </p>
                {
                  imageUrls.map((url, idx) => (
                    <img 
                      key={idx} 
                      src={url} 
                      alt={`Linked content ${idx}`} 
                      className='message-image' 
                    />
                  ))
                }
              </div>
            </div>
          </div>
    )
}

export default Message