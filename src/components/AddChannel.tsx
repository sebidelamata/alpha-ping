import React, {useState} from "react";
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import {ethers} from 'ethers'

interface AddChannelProps{
    alphaPING:AlphaPING | null;
    provider: ethers.BrowserProvider | null; 
}

const AddChannel:React.FC<AddChannelProps> = ({alphaPING, provider}) => {

    const [showAddChannelModal, setShowAddChannelModal] = useState<boolean>(false)
    const [tokenAddress, setTokenAddress] = useState<string>("")
    const [tokenType, setTokenType] = useState<string>("ERC20")

    const addChannelModal = () => {
        setShowAddChannelModal(true)
    }

    const createChannel:MouseEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        console.log(tokenType)
        if(tokenAddress === ""){return}
        if(tokenAddress.length !== 42){return}
        
        const signer:any = await provider?.getSigner()
        let transaction = await alphaPING?.connect(signer).createChannel(tokenAddress,tokenType)
        await transaction?.wait()
    }

    return(
        <>
            <div className="add-channel">
            <button 
                className="add-channel-button"
                onClick={() => addChannelModal()}>+ Channel</button>
            </div>
            {
                showAddChannelModal === true &&
                <div className="add-channel-modal">
                    <h2 className="add-channel-title">
                        Add Channel
                    </h2>
                    <p className="add-channel-text">
                        Enter the address of any token (ERC-20) or NFT (ERC-721) to create a new channel.
                    </p>
                    <form action="" className="add-channel-form" onSubmit={(e) => createChannel(e)}>
                        <label htmlFor="address">Address</label>
                        <input 
                            type="text" 
                            name="address" 
                            placeholder="0x..." 
                            value={tokenAddress} 
                            onChange={(e) => setTokenAddress(e.target.value)} 
                        />
                        <label htmlFor="type">Address</label>
                        <select 
                            className="token-type-selector" 
                            name="type"
                            onChange={(e) => setTokenType(e.target.value)}
                            defaultValue="ERC20"
                        >
                            <option value="ERC20">ERC-20</option>
                            <option value="ERC721">ERC-721</option>
                        </select>
                        <button 
                            className="add-channel-button"
                            type="submit"
                        >
                            Create
                        </button>
                    </form>
                </div>

            }
        </>
    )
}

export default AddChannel;