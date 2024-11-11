'use client';

import React, 
{ 
    useState,
    MouseEvent 
}  from "react";
import Litepaper from "./components/Litepaper";
import Contracts from "./components/Contracts";
import Overview from "./components/Overview";
import Roadmap from "./components/Roadmap";

const Docs:React.FC = () => {

    const [section, setSection] = useState<string>('overview')

    const handleClick = (e:MouseEvent) => {
        e.preventDefault()
        const value = (e.target as HTMLElement).id
        setSection(value)
    }

    const sectionNames = {
        "overview": "Overview",
        "litepaper": "Litepaper",
        "roadmap": "Roadmap",
        "governance": "Governance",
        "tokenomics": "Tokenomics",
        "airdrop": "Airdrops",
        "contracts": "Contracts"
    }

    return(
        <div className="docs-container">
            <div className="selector-container">
                <div className='logo-container-docs'>
                    <img src="../Apes.svg" alt="AlphaPING Logo" className='logo'/>
                </div>
                <ul className="selector">
                    {
                        Object.keys(sectionNames).map((sectionName) => {
                            const key = sectionName as keyof typeof sectionNames
                            return(
                                <li 
                                    key={sectionName as unknown as string}
                                    id={sectionName as unknown as string}
                                    className={`selector-li ${section === (sectionName as unknown as string) ? 'active' : ''}`}
                                    onClick={(e) => handleClick(e)}
                                >
                                    {sectionNames[key]}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="doc-body">
                <h1>AlphaPING Docs</h1>
                {
                    section === 'overview' &&
                    <Overview/>
                }
                {
                    section === 'litepaper' &&
                    <Litepaper/>
                }
                {
                    section === 'roadmap' &&
                    <Roadmap/>
                }
                {
                    section === 'governance' &&
                    <h2>Governance</h2>
                }
                {
                    section === 'tokenomics' &&
                    <h2>Tokenomics</h2>
                }
                {
                    section === 'airdrop' &&
                    <h2>Airdrop</h2>
                }
                {
                    section === 'contracts' &&
                    <Contracts/>
                }
            </div>
        </div>
    )
}

export default Docs;