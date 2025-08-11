
const timeFilterMessages = (
    messages: Message[], 
    timeRange: TimeFrame
): Message[] => {
     // if its all we just return the messages 
     if(timeRange === "all"){
        return messages
     } else {
        // otherwise do date filtering
        const filteredMessages:Message[] = messages.filter((message:Message) => {
            const date = new Date(message.timestamp)
            const referenceDate = new Date()
            let daysToSubtract = 90
            if (timeRange === "1y") {
                daysToSubtract = 365
            } else if(timeRange === "6m"){
                daysToSubtract = 180
            } else if (timeRange === "30d") {
                daysToSubtract = 30
            } else if (timeRange === "7d"){
                daysToSubtract = 7
            } else if (timeRange === "1d") {
                daysToSubtract = 1
            }
            const startDate = new Date(referenceDate)
            startDate.setDate(startDate.getDate() - daysToSubtract)
            return date >= startDate
        })
        return filteredMessages
    }
}

export default timeFilterMessages;