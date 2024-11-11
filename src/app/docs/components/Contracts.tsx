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
                                href="https://arbiscan.io/address/0x423D27d37993e8DA0fe5A7ab019EaBFcff15fde9"
                                target="_blank"
                            >
                                0x423D27d37993e8DA0fe5A7ab019EaBFcff15fde9
                            </a>
                    </p>
                </li>
            </ul>
        </div>
    )
}

export default Contracts