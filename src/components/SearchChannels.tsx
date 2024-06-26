import React,
{
    useState,
    useEffect,
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
        const handleClickOutside = (e: MouseEvent) => {
            if (e.target instanceof Node && !(e.target as HTMLElement).closest(".search")) {
                setIsFocused(false);
                setFilteredOptions([]);
            }
        };

        if (isFocused) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isFocused]);

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
                    <ul className="search-channels-options">
                    {
                        filteredOptions.map((channel, index) => (
                            <li 
                                className="search-channels-option" 
                                key={index} 
                                onClick={() => setCurrentChannel(channel)}
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