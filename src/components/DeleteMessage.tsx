import React, {
    useState,
    useEffect
} from "react";
import { AlphaPING } from "../../typechain-types/contracts/AlphaPING.sol/AlphaPING";

const DeleteMessage:React.FC = () => {

    const messageDelete = useState(false)
    const messageDeleteLoading = useState(false)
    const messageDeleteError = useState(false)

    const handleClick = () => {
        console.log('click')
    }

    return(
        <div className="delete-message">
            <button 
                className="delete-message-button"
                onClick={() => handleClick()}
            >
                Test
            </button>
        </div>
    )
}

export default DeleteMessage;
