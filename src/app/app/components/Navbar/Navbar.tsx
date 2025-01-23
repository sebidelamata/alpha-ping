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
    <nav className='flex h-32 fixed w-screen z-3 justify-between p-4'>
      <div className='grid grid-cols-2 justify-start align-middle'>
        <div>
          <img 
            src="../Apes.svg" 
            alt="AlphaPING Logo" 
            className='grid justify-center align-middle size-16 object-contain'
            loading="lazy"
          />
        </div>
        <h1 className='text-2xl font-bold'>
          A<span className='text-sm font-light italic'>lpha</span>PING
        </h1>
      </div>
      <SearchChannels
        joinChannelLoading={joinChannelLoading}
        setJoinChannelLoading={setJoinChannelLoading}
      />
      <div className='grid justify-end align-middle'>
        <w3m-button size='sm' balance='hide'/>
      </div>
    </nav>
  );
}

export default Navbar;