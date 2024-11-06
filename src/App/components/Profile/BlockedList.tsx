import React from "react";

const BlockedList:React.FC = () => {
    return(
        <div className="blocked-list-container">
            <h4 className="blocked-list-title">
                Blocked:
            </h4>
            <ul className="blocked-list">
                <li>
                    test
                </li>
            </ul>
        </div>
    )
}

export default BlockedList;