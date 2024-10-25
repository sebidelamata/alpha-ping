import React, { 
    useState, 
    useEffect 
  } from "react";

interface LeaveConnectProps{
    isHovered: boolean;
}

const LeaveChannel:React.FC<LeaveConnectProps> = ({isHovered}) => {



    return(
        <div className="leave-channel">
            {
                isHovered === true ?
                'Leave' :
                ''
            }
        </div>
    )
}

export default LeaveChannel