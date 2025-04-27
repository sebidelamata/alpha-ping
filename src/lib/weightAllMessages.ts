const weightAllMessages = (
    messages:Message[], 
    messageWeighting: Weighting,
    authorCurrentTokenBalances: Record<string, Record<string, number>>,
):number[] => {
    if(
        messageWeighting === "unweighted" || 
        messages.length === 0
    ){
        // we return full weighting * by 1 (or return empty array)
        const identityWeights = Array(messages.length).fill(1) || []
        return identityWeights
    } else if(messageWeighting === "post"){
        // find total for avg calc, if its undefined just make it zero
        const total = messages.reduce((sum, message) => sum + BigInt(message.messageTimestampTokenAmount), BigInt(0)) || BigInt(0)
        // if the total is zero everything is zero
        if (total === BigInt(0)) {
            // fallback to zero weights to prevent NaN
            return Array(messages.length).fill(0);
        }
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
    } else if(messageWeighting === "current") {
        authorCurrentTokenBalances
    }else if(messageWeighting === "inverse"){
        // find total for avg calc, if its undefined just make it zero
        const total = messages.reduce((sum, message) => sum + BigInt(message.messageTimestampTokenAmount), BigInt(0)) || BigInt(0)
        // if the total is zero everything is zero and therefore we weight them all 100%
        if (total === BigInt(0)) {
            // fallback to 1 weights to prevent NaN
            return Array(messages.length).fill(1);
        }
        const weights = messages.map((message) => {
                return (
                    // inverse percent is 1 - weight eg 0.1 = 1 - 0.9
                    // fallback to 1 in case we divide by zero or divide zero or anything weird
                    Number(
                        (1 - (Number(message.messageTimestampTokenAmount) / Number(total)))
                        .toFixed(2) || 1 
                    )
                )
            }
        )
        return weights
    }
     else {
        return []
    }
}

export default weightAllMessages;