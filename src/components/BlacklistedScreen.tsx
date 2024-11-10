import React from "react";

const BlacklistedScreen:React.FC= () => {

    return(
        <div className='join-alpha-ping'>
          <div className='join-container'>
            <h2 className="join-header">
                Access Denied
            </h2>
            <div className="join-icon">
                <img src="../Apes.svg" alt="AlphaPING Logo" className="join-logo"/>
            </div>
            <h3 className="join-body">
                You have been Blacklisted from AlphaPING 
            </h3>
            <div className="join-button-container">
                Contact Admin for Support
            </div>
          </div>
        </div>
    )
}

export default BlacklistedScreen;