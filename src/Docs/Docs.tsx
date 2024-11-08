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
        const value = e.target.id
        setSection(value)
    }

    return(
        <div className="docs-container">
            <div className="selector-container">
                <ul className="selector">
                    <li onClick={(e) => handleClick(e)} id="overview">Overview</li>
                    <li onClick={(e) => handleClick(e)} id="litepaper">Litepaper</li>
                    <li onClick={(e) => handleClick(e)} id="roadmap">Roadmap</li>
                    <li onClick={(e) => handleClick(e)} id="governance">Governance</li>
                    <li onClick={(e) => handleClick(e)} id="tokenomics">Tokenomics</li>
                    <li onClick={(e) => handleClick(e)} id="airdrop">Airdrop</li>
                    <li onClick={(e) => handleClick(e)} id="contracts">Contracts</li>
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