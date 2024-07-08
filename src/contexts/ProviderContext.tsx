import React, { 
    useEffect, 
    useState,
    createContext,
    useContext,
    type ReactNode 
} from 'react';
import { 
  ethers, 
  Signer 
} from 'ethers';


 // ABIs
 import AlphaPINGABI from '../../artifacts/contracts/AlphaPING.sol/AlphaPING.json'
 // Config
 import config from '../blockChainConfigs.json';

 // types
 import { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING';
 import { EtherProviderType } from '../types/EtherProviderType';


 interface BlockChainConfig {
     [key: string]: {
     AlphaPING: {
         address: string;
     };
    };
 }

// create context
const ProviderContext = createContext<EtherProviderType | undefined>(undefined)

export const useEtherProviderContext = (): EtherProviderType => {
const context = useContext(ProviderContext)
if (context === null || context === undefined) {
    throw new Error('useEtherProviderContext must be used within a ProviderProvider')
}
return context
}

const ProviderProvider: React.FC<{ children: ReactNode }> = ({children}) => {
  
  // account stuff
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  //
  const [signer, setSigner] = useState<Signer | null>(null)
  // the alpha ping contract object
  const [alphaPING, setAlphaPING] = useState<AlphaPING | null>(null)
  // list of all channels
  const [channels, setChannels] = useState<AlphaPING.ChannelStructOutput[]>([])
  
  // an array to keep track of which channels the user has joined
  const [hasJoined, setHasJoined] = useState<boolean[]>([])

  const loadBlockchainData = async () => {
    try{
      
      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)
      let network = await provider.send('eth_chainId',[]);
      network = parseInt(network, 16).toString()
      const alphaPING = new ethers.Contract(
        (config as BlockChainConfig)[network].AlphaPING.address,
        AlphaPINGABI.abi,
        provider
      ) as unknown as AlphaPING
      setAlphaPING(alphaPING)
      const totalChannels:bigint = await alphaPING.totalChannels()
      const channels = []

      for (let i = 1; i <= Number(totalChannels); i++) {
        const channel = await alphaPING.getChannel(i)
        channels.push(channel)
      }

      setChannels(channels)

      const signer:Signer = await provider?.getSigner()
      setSigner(signer)



      const hasJoinedChannel = []

      for (let i = 1; i <= Number(totalChannels); i++) {
        const hasJoined = await alphaPING.hasJoinedChannel(
          (i as ethers.BigNumberish), 
          await signer.getAddress()
        )
        hasJoinedChannel.push(hasJoined)
      }

      setHasJoined(hasJoinedChannel as boolean[])
      

      window.ethereum.on('accountsChanged', async () => {
        window.location.reload()
      })
    }catch(error){
      console.error("Error loading blockchain data:", error);
    }
  }

  useEffect(() => {
    loadBlockchainData()
    }, [])

    return (
        <ProviderContext.Provider value={{ 
            provider, 
            signer, 
            alphaPING, 
            channels, 
            setChannels, 
            hasJoined,
            setHasJoined 
        }}>
            {children}
        </ProviderContext.Provider>
  )
}

export default ProviderProvider