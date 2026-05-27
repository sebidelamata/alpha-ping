const weightChannelMessages = (
    messages: Message[], 
    messageWeighting: Weighting,
    authorCurrentTokenBalances: Record<string, Record<string, Record<string, number>>>,
): number[] => {
    if (messages.length === 0) {
        return []
    }
    if (messageWeighting === "unweighted") {
        return Array(messages.length).fill(1) || []

    } else if (messageWeighting === "post") {
        const max: number = Math.max(...messages.map((message) => parseInt(message.messageTimestampTokenAmount)))
        if (max === 0) {
            return Array(messages.length).fill(0);
        }
        return messages.map((message) =>
            Number((Number(message.messageTimestampTokenAmount) / Number(max)).toFixed(2) || 0)
        )

    } else if (messageWeighting === "current") {
        const max: number = Object.values(authorCurrentTokenBalances).reduce((currentMax, channelBalances) => {
            return Object.values(channelBalances).reduce((channelMax, tokenBalances) => {
                return Object.values(tokenBalances).reduce((tokenMax, balance) => {
                    return balance > tokenMax ? balance : tokenMax;
                }, channelMax);
            }, currentMax);
        }, 0);

        if (max === 0) {
            return Array(messages.length).fill(0);
        }
        return messages.map((message) => {
            const channelBalances = authorCurrentTokenBalances[message.channel]
            if (!channelBalances) return 0;
            const tokenAddress = Object.keys(channelBalances)[0]
            const currentBalance = channelBalances[tokenAddress]?.[message.account] ?? 0
            return Number((currentBalance / max).toFixed(2) || 0)
        })

    } else if (messageWeighting === "delta") {
        const deltas = messages.map((message) => {
            const channelBalances = authorCurrentTokenBalances[message.channel]
            if (!channelBalances) return 0;
            const tokenAddress = Object.keys(channelBalances)[0]
            const currentBalance = channelBalances[tokenAddress]?.[message.account] ?? 0
            return currentBalance - Number(message.messageTimestampTokenAmount)
        })
        const max: number = Math.max(...deltas)
        if (max === 0) {
            return Array(messages.length).fill(0);
        }
        return messages.map((_, i) =>
            Number((deltas[i] / max).toFixed(2) || 0)
        )

    } else if (messageWeighting === "inverse") {
        const max: number = Math.max(...messages.map((message) => parseInt(message.messageTimestampTokenAmount)))
        if (max === 0) {
            return Array(messages.length).fill(1);
        }
        return messages.map((message) =>
            Number((1 - (Number(message.messageTimestampTokenAmount) / Number(max))).toFixed(2) || 1)
        )

    } else {
        return []
    }
}

export default weightChannelMessages;