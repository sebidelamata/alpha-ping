import React from "react";

const Contracts:React.FC = () => {
    return(
        <div className="contracts-body">
            <h2>Contracts</h2>
            <ul className="contracts-list">
                <li className="contracts-list-item">
                    <p>
                        AlphaPING Contract -  
                             <a 
                                href={`https://arbiscan.io/address/${process.env.NEXT_PUBLIC_ALPHAPING_CONTRACT_ADDRESS}`}
                                target="_blank"
                            >
                               <strong>{process.env.NEXT_PUBLIC_ALPHAPING_CONTRACT_ADDRESS}</strong>
                            </a>
                    </p>
                </li>
            </ul>
        </div>
    )
}

export default Contracts