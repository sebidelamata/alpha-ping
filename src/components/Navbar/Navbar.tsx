import { ethers } from 'ethers'
import SearchChannels from '../Channels/SearchChannels';

interface NavbarProps {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  joinChannelLoading: boolean;
  setJoinChannelLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ 
  account, 
  setAccount,
  joinChannelLoading, 
  setJoinChannelLoading 
}) => {

  const connectHandler = async () => {
    // 0xa4b1 arbitrum
    const arbitrumChainID = '0x7a69' // localhost

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.getAddress(accounts[0])

    // handle user on different network
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (currentChainId !== arbitrumChainID) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: arbitrumChainID }],
        });
      }

    setAccount(account)
  }

  return (
    <nav className='nav-bar'>
      <div className='nav-brand'>
        <div className='logo-container'>
          <img src="../Apes.svg" alt="AlphaPING Logo" className='logo'/>
        </div>
        <h1 className='brand-header'>
          A<span className='header-mid-word-break'>lpha</span>PING
        </h1>
      </div>
      <SearchChannels
        joinChannelLoading={joinChannelLoading}
        setJoinChannelLoading={setJoinChannelLoading}
      />
      <div className='connect-container'>
        {account ? (
          <button
            type="button"
            className='connect-button connected'
          >
            {account.slice(0, 6) + '...' + account.slice(38, 42)}
          </button>
        ) : (
          <button
            type="button"
            className='connect-button'
            onClick={connectHandler}
          >
            Connect
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;