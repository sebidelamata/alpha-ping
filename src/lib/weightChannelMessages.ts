import { AlphaPING } from "../../typechain-types/contracts/AlphaPING.sol/AlphaPING";

const weightChannelMessages = (
    messages:Message[], 
    messageWeighting: Weighting, 
    currentChannel: AlphaPING.ChannelStructOutput
):number[] => {
    if(messages.length === 0){
        return []
    }
    const channelMessages = messages.filter((message) => {
        return message.channel.toString() === currentChannel.id.toString()
    })
    if(messageWeighting === "unweighted"){
        // we return full weighting * by 1 (or return empty array)
        const identityWeights = Array(messages.length).fill(1) || []
        return identityWeights
    } else if(messageWeighting === "post"){
        // find total for avg calc, if its undefined just make it zero
        const total = channelMessages.reduce((sum, message) => sum + BigInt(message.messageTimestampTokenAmount), BigInt(0)) || BigInt(0)
        const weights = channelMessages.map((message) => {
                return (
                    // fallback to 0 in case we divide by zero or divide zero or anything weird
                    Number(
                        (Number(message.messageTimestampTokenAmount) / Number(total) * 100)
                        .toFixed(2) || 0 
                    )
                )
            }
        )
        return weights
    } else {
        return []
    }
}

export default weightChannelMessages;