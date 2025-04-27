
const weightChannelMessages = (
    messages:Message[], 
    messageWeighting: Weighting, 
):number[] => {
    if(messages.length === 0){
        return []
    }
    if(messageWeighting === "unweighted"){
        // we return full weighting * by 1 (or return empty array)
        const identityWeights = Array(messages.length).fill(1) || []
        return identityWeights
    } else if(messageWeighting === "post"){
        // find total for avg calc, if its undefined just make it zero
        const total = messages.reduce((sum, message) => sum + BigInt(message.messageTimestampTokenAmount), BigInt(0)) || BigInt(0)
        const weights = messages.map((message) => {
                return (
                    // fallback to 0 in case we divide by zero or divide zero or anything weird
                    Number(
                        (Number(message.messageTimestampTokenAmount) / Number(total))
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