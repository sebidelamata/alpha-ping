const weightAllMessages = (
    messages:Message[], 
    messageWeighting: Weighting
):Message[] => {
    if(
        messageWeighting === "unweighted" || 
        messages.length === 0
    ){
        return messages
    } else {
        // find total for avg calc, if its undefined just make it zero
        const total = messages.reduce((sum, message) => sum + BigInt(message.messageTimestampTokenAmount), BigInt(0)) || BigInt(0)
        const weightedMessages = messages.map((message) => {
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
        return weightedMessages
    }
}

export default weightAllMessages;