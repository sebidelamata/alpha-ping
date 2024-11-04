import React, 
{ 
    useState,
    MouseEvent 
}  from "react";
import Litepaper from "./components/Litepaper";
import Contracts from "./components/Contracts";

const Docs:React.FC = () => {

    const [section, setSection] = useState<string>('litepaper')

    const handleClick = (e:MouseEvent) => {
        e.preventDefault()
        const value = e.target.id
        setSection(value)
    }

    return(
        <div className="docs-container">
            <div className="selector-container">
                <ul className="selector">
                    <li onClick={(e) => handleClick(e)} id="litepaper">Litepaper</li>
                    <li onClick={(e) => handleClick(e)} id="contracts">Contracts</li>
                </ul>
            </div>
            <div className="doc-body">
                <h1>AlphaPING Docs</h1>
                {
                    section === 'litepaper' &&
                    <Litepaper/>
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