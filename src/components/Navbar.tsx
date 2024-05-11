import { ethers } from 'ethers'

interface NavbarProps {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

const Navbar: React.FC<NavbarProps> = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.getAddress(accounts[0])
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

      {account ? (
        <button
          type="button"
          className='nav-connect'
        >
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className='nav-connect'
          onClick={connectHandler}
        >
          Connect
        </button>
      )}
    </nav>
  );
}

export default Navbar;