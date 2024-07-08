import React,
{
    useState,
    useEffect,
    useRef,
    ChangeEvent
} from "react"
import { useEtherProviderContext } from "../contexts/ProviderContext"
import { type AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING.ts'
import { ethers } from 'ethers'
import Loading from "./Loading.tsx"

interface SearchChannelsProps {
    setCurrentChannel: React.Dispatch<React.SetStateAction<AlphaPING.ChannelStructOutput | null>>;
    joinChannelLoading: boolean;
    setJoinChannelLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchChannels: React.FC<SearchChannelsProps> = ({ 
    setCurrentChannel,
    joinChannelLoading,
    setJoinChannelLoading
}) => {

    const { channels, alphaPING, signer } = useEtherProviderContext()

    const [searchTerm, setSearchTerm] = useState<string>('')
    const [filteredOptions, setFilteredOptions] = useState<AlphaPING.ChannelStructOutput[]>([])
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const modalRef = useRef<HTMLUListElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value
        setSearchTerm(term)
        if (term) {
          const filtered = channels.filter(channel =>
            channel.name.toLowerCase().includes(term.toLowerCase()) ||
            channel.tokenAddress.toLowerCase().includes(term.toLowerCase())
          );
          setFilteredOptions(filtered)
        } else {
          setFilteredOptions([])
        }
    }

    const handleFocus = () => {
        setIsFocused(true)
    }

    const handleBlur = () => {
        setIsFocused(false)
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    const handleChannelClick = async (channel: AlphaPING.ChannelStructOutput) => {
        
        const account = await signer?.getAddress()
        // Check if user has joined
        // If they haven't allow them to mint.
        const hasJoined = await alphaPING?.hasJoinedChannel(
            BigInt(channel.id), 
            account || ethers.ZeroAddress
        )

        if (hasJoined) {
            setCurrentChannel(channel)
          } else {
            setJoinChannelLoading(true)
            const transaction = await alphaPING?.connect(signer).joinChannel(BigInt(channel.id))
            await transaction?.wait()
            setCurrentChannel(channel)
            setJoinChannelLoading(false)
          }
    }

    return(
        <div className='search'>
            <form action="" className='search-bar' onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="">Search</label>
                <input
                    type="text"
                    name='search'
                    value={searchTerm}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Search Tokens or NFTs (name or address)..."
                    onSubmit={(e) => e.preventDefault()}
                />
            </form>
            {
                filteredOptions.length > 0 &&
                isFocused &&
                    <ul className="search-channels-options" ref={modalRef}>
                    {
                        filteredOptions.map((channel, index) => (
                            <li 
                                className="search-channels-option" 
                                key={index} 
                                onMouseDown={() => handleChannelClick(channel)}
                            >
                                {channel.name} - {channel.tokenAddress}
                            </li>
                        ))
                    }
                    </ul>
            }
            {
                joinChannelLoading === true &&
                <div className="join-channel-loading-container">
                    <div className="join-channel-loading">
                        <Loading/>
                    </div>
                </div>
            }
        </div>
    )
}

export default SearchChannels