import React, {
    useState, 
    useEffect,
    useRef,
    FormEvent
} from "react";
import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
import {ethers} from 'ethers'
import Loading from "./Loading";

interface AddChannelProps{
    alphaPING:AlphaPING | null;
    provider: ethers.BrowserProvider | null; 
    addChannelLoading: boolean;
    setAddChannelLoadingLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddChannel:React.FC<AddChannelProps> = ({alphaPING, provider, addChannelLoading, setAddChannelLoadingLoading}) => {

    const [showAddChannelModal, setShowAddChannelModal] = useState<boolean>(false)
    const [tokenAddress, setTokenAddress] = useState<string>("")
    const [tokenType, setTokenType] = useState<string>("ERC20")
    const modalRef = useRef<HTMLDivElement>(null);
    const[error, setError] = useState<string | null>(null)

    const addChannelModal = () => {
        setShowAddChannelModal(true)
    }

    const createChannel = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(tokenAddress === ""){return}
        if(tokenAddress.length !== 42){return}

        setAddChannelLoadingLoading(true)
        
        const signer:any = await provider?.getSigner()
        try{
            let transaction = await alphaPING?.connect(signer).createChannel(tokenAddress,tokenType)
            await transaction?.wait()

            setShowAddChannelModal(false)
            setTokenAddress("")
            setTokenType("ERC20")
            setError(null)
        }catch(error: any){
            if(error.reason){
                setError(error.reason)
            }
            if(error){
                console.log(error)
                // setError(error.toString())
            }
        } finally{
            setTokenAddress("")
            setTokenType("ERC20")
            setError(null)
            setAddChannelLoadingLoading(false)
        }

    }

    // handling closing the modal when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowAddChannelModal(false);
                setError(null)
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return(
        <>
            <div className="add-channel">
                <button 
                    className="add-channel-button"
                    onClick={() => addChannelModal()}>+ Channel
                </button>
            </div>
            {
                showAddChannelModal === true &&
                <div className="add-channel-greyout">
                    <div className="add-channel-modal" ref={modalRef}>
                        <h2 className="add-channel-title">
                            Add Channel
                        </h2>
                        <h4 className="add-channel-text">
                            Enter the address of any token (ERC-20) or NFT (ERC-721).
                            {
                                error !== null &&
                                <h2>{error}</h2>
                            }
                        </h4>
                        <form action="" className="add-channel-form" onSubmit={(e) => createChannel(e)}>
                            <div className="form-line-one">
                                <label htmlFor="address">Address</label>
                                <input 
                                    type="text" 
                                    name="address" 
                                    placeholder="0x..." 
                                    value={tokenAddress} 
                                    onChange={(e) => setTokenAddress(e.target.value)} 
                                />
                                <label htmlFor="type">Token Type</label>
                                <select 
                                    className="token-type-selector" 
                                    name="type"
                                    onChange={(e) => setTokenType(e.target.value)}
                                    value={tokenType}
                                >
                                    <option value="ERC20">ERC-20</option>
                                    <option value="ERC721">ERC-721</option>
                                </select>
                            </div>
                            <div className="add-channel-button-container">
                                <button 
                                    className="add-channel-button"
                                    type="submit"
                                >
                                    <h3>Create</h3>
                                </button>
                            </div>
                        </form>
                        {
                            addChannelLoading &&
                            <Loading/>
                        }
                    </div>
                </div>

            }
        </>
    )
}

export default AddChannel;