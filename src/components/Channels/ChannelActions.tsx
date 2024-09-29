import React,
{
    MouseEventHandler
} from "react";

interface ChannelActionsProps{
    channelAction: string;
    setChannelAction: React.Dispatch<React.SetStateAction<string>>;
}

const ChannelActions: React.FC<ChannelActionsProps> = ({channelAction, setChannelAction}) => {

    const channelActionHandler:MouseEventHandler<HTMLElement> = async (e) => {
        const action = (e.target as HTMLElement).id
        setChannelAction(action)
      }

    return(
        <div className="channel-actions">
          <h2>Channel Actions</h2>
          <ul className="channel-actions-list">
            <li 
              className= {
                channelAction ==  "chat" ? (
                  "channel-action-items channel-action-active"
                ) : (
                  "channel-action-items"
                )
              }
              id="chat"
              onClick={(e) => channelActionHandler(e)}
            >
              Chat
            </li>
            <li 
              className= {
                channelAction ==  "analyze" ? (
                  "channel-action-items channel-action-active"
                ) : (
                  "channel-action-items"
                )
              }
              id="analyze"
              onClick={(e) => channelActionHandler(e)}
            >
              Analyze
            </li>
            <li 
              className= {
                channelAction ==  "trade" ? (
                  "channel-action-items channel-action-active"
                ) : (
                  "channel-action-items"
                )
              }
              id="trade"
              onClick={(e) => channelActionHandler(e)}
            >
              Trade
            </li>
          </ul>
        </div>
    )
}

export default ChannelActions