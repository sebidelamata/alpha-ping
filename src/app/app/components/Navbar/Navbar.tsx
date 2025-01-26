import SearchChannels from '../Channels/SearchChannels';

const Navbar: React.FC = () => {

  return (
    <nav className='fixed z-50 flex h-24 w-full justify-between bg-primary p-4'>
      <div className='grid grid-cols-2 justify-start align-middle'>
        <div>
          <img 
            src="../Apes.svg" 
            alt="AlphaPING Logo" 
            className='grid size-16 justify-center object-contain align-middle'
            loading="lazy"
          />
        </div>
        <h1 className='text-2xl font-bold'>
          A<span className='text-sm font-light italic'>lpha</span>PING
        </h1>
      </div>
      <SearchChannels/>
      <div className='grid justify-end align-middle' >
        <w3m-button 
          size='sm' 
          balance='hide'
        />
      </div>
    </nav>
  );
}

export default Navbar;