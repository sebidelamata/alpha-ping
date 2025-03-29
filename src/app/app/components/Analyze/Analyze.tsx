'use client';

import React, {
    useEffect,
    useState
} from "react";
import vader from 'vader-sentiment'
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useMessagesProviderContext } from "src/contexts/MessagesContext";
import { mockMessages } from "mocks/mockMessages";

const Analyze:React.FC = () => {

    const { selectedChannelMetadata } = useChannelProviderContext()
    const { messages } = useMessagesProviderContext()
    
    const [channelScore, setChannelScore] = useState<null | number>(null)

    useEffect(() => {
        const getCompoundMessagesScore = () => {
            const input = mockMessages.map((message) => {
                return message.text
            })
            .join()
            console.log(input)
            const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);
            setChannelScore(intensity.compound)
            console.log(intensity);
        }
        getCompoundMessagesScore()
    }, [])

    return(
        <div>
            Analyze
            {
                channelScore !== null &&
                <p>{channelScore}</p>
            }
        </div>
    )
}

export default Analyze;