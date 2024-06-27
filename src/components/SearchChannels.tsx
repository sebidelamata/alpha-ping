import React,
{
    useState,
    useEffect,
    useRef,
    ChangeEvent
} from "react"
import { useEtherProviderContext } from "../contexts/ProviderContext"
import { type AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING.ts'

interface SearchChannelsProps {
    setCurrentChannel: React.Dispatch<React.SetStateAction<AlphaPING.ChannelStructOutput | null>>;
}

const SearchChannels: React.FC<SearchChannelsProps> = ({ setCurrentChannel }) => {

    const { channels } = useEtherProviderContext()

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

    return(
        <div className='search'>
            <form action="" className='search-bar'>
                <label htmlFor="">Search</label>
                <input
                    type="text"
                    name='search'
                    value={searchTerm}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Search Tokens or NFTs (name or address)..."
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
                                onMouseDown={() => setCurrentChannel(channel)}
                            >
                                {channel.name} - {channel.tokenAddress}
                            </li>
                        ))
                    }
                    </ul>
            }
        </div>
    )
}

export default SearchChannels