import React from "react";
import { useEtherProviderContext } from '../contexts/ProviderContext';

interface JoinAlphaPINGProps {
    setIsMember: React.Dispatch<React.SetStateAction<boolean>>;
    account: string | null;
  }

const JoinAlphaPING:React.FC<JoinAlphaPINGProps> = ({
    setIsMember, 
    account
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
                    account ? (
                        <button className="join-button" onClick={() => joinAlphaPING()}>
                            Join
                        </button>
                    ) : (
                        <button className="join-button disabled" disabled>
                            Connect To Join
                        </button>
                    )

                }
            </div>
          </div>
        </div>
    )
}

export default JoinAlphaPING;