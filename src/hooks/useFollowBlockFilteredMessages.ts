import { useMemo } from "react";
import { useMessagesProviderContext } from "src/contexts/MessagesContext";
import { useUserProviderContext } from "src/contexts/UserContext";

const useFollowBlockFilteredMessages = (blocksFilter: boolean) => {

    const { messages } = useMessagesProviderContext()
    const { 
            account, 
            followingList, 
            blockedList,
            followFilter
        } = useUserProviderContext()

    // filter for follows and blocks
    const followBlockFilteredMessages = useMemo(() => {
        // make sure thyre not null
        if(messages === null){
            return null
        }
        if(followFilter === false && blocksFilter === false){
            // if both filters are off, return all messages
            return messages

        }
        if(followFilter === true && blocksFilter === false){
            // if only follows filter is on, return messages from follows
            return messages.filter((message) => {
                return(
                    // return the meeages that belong to their account
                    message.account.toString() === account.toString() ||
                    // return mesages if the author is on the following list
                    followingList.includes(message.account.toString())
                )
            })
        }
        if(followFilter === false && blocksFilter === true){
            // if only blocks filter is on, return messages that are not from blocked accounts
            return messages.filter((message) => {
                return(
                    // return the meeages that belong to their account
                    message.account.toString() === account.toString() ||
                    // return mesages if the author is not on the blocked list
                    blockedList.includes(message.account.toString()) === false
                )
            })
        }
        if(followFilter === true && blocksFilter === true){
            // if both filters are on, return messages from follows and not from blocks
            return messages.filter((message) => {
                return(
                    // return the meeages that belong to their account
                    message.account.toString() === account.toString() ||
                    // return mesages if the author is on the following list or not blocked
                    (
                        followingList.includes(message.account.toString()) &&
                        blockedList.includes(message.account.toString()) === false
                    )
                )
            })
        }
        else{
            return null
        }
    }
    , [messages, followFilter, blocksFilter, account, followingList, blockedList])

    return { followBlockFilteredMessages }
}

export default useFollowBlockFilteredMessages;