import React from "react"

const MessageHoverOptions: React.FC = () => {
    return(
        <ul className="message-hover-options">
            <li className="emoji-reply">😊</li>
            <li className="text-reply">
                <img src="/reply.svg" alt="text reply" className="text-reply"/>
            </li>
        </ul>
    )
}

export default MessageHoverOptions