import React from "react";

const Loading:React.FC = () => {
    return(
        <div className="loading-container">
            <h2 className="loading-container-text">Waiting for transaction confirmation...</h2>
            <div className="loading-banana-container">
                <img src="/bananaPeeled.svg" alt="Banana Peeled" className="loading-banana"/>
            </div>
        </div>
    )
}

export default Loading