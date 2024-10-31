import SearchChannels from '../Channels/SearchChannels';

interface NavbarProps {
  joinChannelLoading: boolean;
  setJoinChannelLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ 
  joinChannelLoading, 
  setJoinChannelLoading 
}) => {

  return (
    <nav className='nav-bar'>
      <div className='nav-brand'>
        <div className='logo-container'>
          <img src="../Apes.svg" alt="AlphaPING Logo" className='logo'/>
        </div>
        <h1 className='brand-header'>
          A<span className='header-mid-word-break'>lpha</span>PING {'{beta}'}
        </h1>
      </div>
      <SearchChannels
        joinChannelLoading={joinChannelLoading}
        setJoinChannelLoading={setJoinChannelLoading}
      />
      <div className='connect-container'>
        <w3m-button size='sm' balance='hide'/>
      </div>
    </nav>
  );
}

export default Navbar;