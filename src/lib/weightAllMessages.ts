
const weightAllMessages = (
    messages:Message[], 
    messageWeighting: Weighting,
    authorCurrentTokenBalances: Record<string, Record<string, Record<string, number>>>,
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
        // dont find sum find max
        // working here first, need to apply this max method to the other weighting calls.
        const max: number = Math.max(...messages.map((message) => parseInt(message.messageTimestampTokenAmount)))
        // if the total is zero everything is zero
        if (max === 0) {
            // fallback to zero weights to prevent NaN
            return Array(messages.length).fill(0);
        }
        const weights = messages.map((message) => {
                return (
                    // fallback to 0 in case we divide by zero or divide zero or anything weird
                    Number(
                        (Number(message.messageTimestampTokenAmount) / Number(max))
                        .toFixed(2) || 0 
                    )
                )
            }
        )
        return weights
    } else if(messageWeighting === "current") {
        // find total for avg calc if it is undefined just make it zero
        const max = Object.values(authorCurrentTokenBalances).reduce((currentMax, channelBalances) => {
            return Object.values(channelBalances).reduce((channelMax, tokenBalances) => {
                return Object.values(tokenBalances).reduce((tokenMax, balance) => {
                    const balanceBigInt = BigInt(balance);
                    return balanceBigInt > tokenMax ? balanceBigInt : tokenMax;
                }, channelMax);
            }, currentMax);
        }, BigInt(0));

        if (max === BigInt(0)) {
            // fallback to 0 weights to prevent NaN
            return Array(messages.length).fill(0);
        }
        const weights = messages.map((message) => {
            const tokenAddress = Object.keys(authorCurrentTokenBalances[message.channel])[0]
            const currentBalance = authorCurrentTokenBalances[message.channel][tokenAddress][message.account]
            return (
                // fallback to 0 in case we divide by zero or divide zero or anything weird
                Number(
                    (Number(currentBalance) / Number(max))
                    .toFixed(2) || 0 
                )
            )
        }
    )
    return weights
    } else if(messageWeighting === "delta"){
        // find total for avg calc, if its undefined just make it zero
        const max: number = Math.max(
            ...messages.map((message) => 
                Number(authorCurrentTokenBalances[message.channel][Object.keys(authorCurrentTokenBalances[message.channel])[0]][message.account]) - Number(message.messageTimestampTokenAmount)
            ) || BigInt(0)
        )
        if (max === 0) {
            // fallback to zero weights to prevent NaN
            return Array(messages.length).fill(0);
        }
        const weights = messages.map((message) => {
                return (
                    // fallback to 0 in case we divide by zero or divide zero or anything weird
                    Number(
                        (
                            (
                                Number(authorCurrentTokenBalances[message.channel][Object.keys(authorCurrentTokenBalances[message.channel])[0]][message.account]) - 
                                Number(message.messageTimestampTokenAmount)
                            ) / Number(max)
                        )
                        .toFixed(2) || 0 
                    )
                )
            }
        )
        return weights
        } else if(messageWeighting === "inverse"){
        // find total for avg calc, if its undefined just make it zero
        const max: number = Math.max(...messages.map((message) => parseInt(message.messageTimestampTokenAmount)))
        // if the total is zero everything is zero and therefore we weight them all 100%
        if (max === 0) {
            // fallback to 1 weights to prevent NaN
            return Array(messages.length).fill(1);
        }
        const weights = messages.map((message) => {
                return (
                    // inverse percent is 1 - weight eg 0.1 = 1 - 0.9
                    // fallback to 1 in case we divide by zero or divide zero or anything weird
                    Number(
                        (1 - (Number(message.messageTimestampTokenAmount) / Number(max)))
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