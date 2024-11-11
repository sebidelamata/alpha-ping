'use client';

import React from "react";
import { useEtherProviderContext } from '../../../contexts/ProviderContext';

interface JoinAlphaPINGProps {
    setIsMember: React.Dispatch<React.SetStateAction<boolean>>;
  }

const JoinAlphaPING:React.FC<JoinAlphaPINGProps> = ({
    setIsMember
}) => {

    const { alphaPING, signer, provider} = useEtherProviderContext()

    const joinAlphaPING = async() => {
        if(provider){
            const tx = await alphaPING?.connect(signer).mint()
            await tx?.wait()
            setIsMember(true)
        }
    }

    return(
        <div className='join-alpha-ping'>
          <div className='join-container'>
            <h2 className="join-header">
                Quit Monkeying Around!
            </h2>
            <div className="join-icon">
                <img src="../Apes.svg" alt="AlphaPING Logo" className="join-logo"/>
            </div>
            <h3 className="join-body">
                Mint a Membership and Swing into the Chat!
            </h3>
            <div className="join-button-container">
                {
                    signer ? (
                        <button className="join-button" onClick={() => joinAlphaPING()}>
                            Join
                        </button>
                    ) : (
                        <w3m-button 
                            size='xxl' 
                            balance='hide'
                            label="Connect to Join"
                        />
                    )

                }
            </div>
          </div>
        </div>
    )
}

export default JoinAlphaPING;