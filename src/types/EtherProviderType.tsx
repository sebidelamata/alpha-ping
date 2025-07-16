import {
    type Signer,
    type Provider
  } from 'ethers'
import type { AlphaPING } from '../../typechain-types/contracts/AlphaPING.sol/AlphaPING'
  
  export interface EtherProviderType {
    provider: Provider | null | undefined
    chainId: string | null
    signer: Signer | null
    alphaPING: AlphaPING | null
    channels: AlphaPING.ChannelStructOutput[] | []
    setChannels: React.Dispatch<React.SetStateAction<AlphaPING.ChannelStructOutput[] | []>>
    hasJoined: boolean[]
    setHasJoined: React.Dispatch<React.SetStateAction<boolean[] | []>>
    isInitialized: boolean
  }