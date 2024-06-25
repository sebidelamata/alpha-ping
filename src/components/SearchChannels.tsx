import React,
{
    useState,
    ChangeEvent
} from "react"
import { useEtherProviderContext } from "../contexts/ProviderContext"
import { type AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING.ts'

const SearchChannels: React.FC = () => {

    const { channels } = useEtherProviderContext()

    const [searchTerm, setSearchTerm] = useState<string>('')
    const [filteredOptions, setFilteredOptions] = useState<AlphaPING.ChannelStructOutput[]>([])
    const [isFocused, setIsFocused] = useState<boolean>(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term) {
          const filtered = channels.filter(channel =>
            channel.name.toLowerCase().includes(term.toLowerCase()) ||
            channel.tokenAddress.toLowerCase().includes(term.toLowerCase())
          );
          setFilteredOptions(filtered);
        } else {
          setFilteredOptions([]);
        }
    };

    return(
        <div className='search'>
            <form action="" className='search-bar'>
                <label htmlFor="">Search</label>
                <input
                    type="text"
                    name='search'
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder="Search Tokens or NFTs (name or address)..."
                />
            </form>
            {
                filteredOptions.length > 0 &&
                    <ul className="search-channels-options">
                    {
                        filteredOptions.map((channel, index) => (
                            <li className="search-channels-option" key={index}>
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