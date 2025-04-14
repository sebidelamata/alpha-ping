import { AlphaPING } from "../../typechain-types/contracts/AlphaPING.sol/AlphaPING";

const weightChannelMessages = (
    messages:Message[], 
    messageWeighting: Weighting, 
    currentChannel: AlphaPING.ChannelStructOutput
):Message[] => {
    if(messages.length <= 0){
        return messages
    }
    const channelMessages = messages.filter((message) => {
        return message.channel.toString() === currentChannel.id.toString()
    })
    if(messageWeighting === "unweighted"){
        return channelMessages
    } else {
        // find total for avg calc, if its undefined just make it zero
        const total = channelMessages.reduce((sum, message) => sum + BigInt(message.messageTimestampTokenAmount), BigInt(0)) || BigInt(0)
        const weightedChannelMessages = channelMessages.map((message) => {
                if (messageWeighting === "post") {
                    return {
                        ...message,
                        weighting: total !== undefined
                            // fallback to 0 in case we divide by zero or divide zero or anything weird
                            ? (Number(message.messageTimestampTokenAmount) / Number(total) * 100)
                                .toFixed(2)
                                .toString() || "0"
                            : null
                    }
                }
                return message
             }
        )
        return weightedChannelMessages
    }
}

export default weightChannelMessages;